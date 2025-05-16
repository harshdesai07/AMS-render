package AMS.AttendanceManagementSystem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Dto.UpdatePasswordDto;
import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentRepo;
import jakarta.transaction.Transactional;

@Service
public class UpdatePasswordService {

	@Autowired
	CollegeRepo cr;

	@Autowired
	StudentRepo sr;

	@Autowired
	FacultyRepo fr;

	@Autowired
	@Lazy
	private PasswordEncoder passwordEncoder;

	@Autowired
	StudentEnrollmentRepo ser;

	@Autowired
	EmailService es;

	@Transactional
	public void editPassword(UpdatePasswordDto upd) {
		// First verify current password matches
		if (!verifyCurrentPassword(upd)) {
			throw new RuntimeException("Current password does not match");
		}

		String hashedPassword = passwordEncoder.encode(upd.getNewPassword());

//		if the role is college then updating college password

		if (upd.getRole().equals("COLLEGE")) {
			College college = cr.findById(upd.getId())
					.orElseThrow(() -> new RuntimeException("College not found with ID: " + upd.getId()));
			college.setPassword(hashedPassword);
//              send email of password confirm
			es.sendPasswordChangeConfirmation(college.getEmail(), college.getCollegeName(), "college",
					college.getCollegeName(), college.getEmail(), "Password Changed Successfully");
			cr.save(college);
		}

//      if the role is student then updating student password

		else if (upd.getRole().equals("STUDENT")) {
			Student s = sr.findById(upd.getId())
					.orElseThrow(() -> new RuntimeException("Student not found for student id: " + upd.getId()));

			// 2. find the studentEnrollement object
			StudentEnrollment studentEnrollment = ser.findByStudentId(upd.getId()).orElseThrow(
					() -> new RuntimeException("Student enrollment not found for student id: " + upd.getId()));

//	3.finding college course department

			CollegeCourseDepartment ccd = studentEnrollment.getCollegeCourseDepartment();
			CollegeCourse cc = ccd.getCollegeCourse();
			College c = cc.getCollege();

			s.setStudentPassword(hashedPassword);
//				sending password update email
			es.sendPasswordChangeConfirmation(s.getStudentEmail(), s.getStudentName(), "student", c.getCollegeName(),
					c.getEmail(), "Password Changed Successfully");

			sr.save(s);
		}

//			if the role is faculty then updating faculty password 

		else if (upd.getRole().equals("FACULTY") || upd.getRole().equals("HOD")) {
			Faculty f = fr.findById(upd.getId())
					.orElseThrow(() -> new RuntimeException("Faculty not found for faculty id: " + upd.getId()));

			CollegeCourseDepartment ccd = f.getCollegeCourseDepartment();
			CollegeCourse cc = ccd.getCollegeCourse();
			College c = cc.getCollege();

			f.setFacultyPassword(hashedPassword);
			if (upd.getRole().equals("FACULTY")) {
//				sending password update email
				es.sendPasswordChangeConfirmation(f.getFacultyEmail(), f.getFacultyName(), "faculty",
						c.getCollegeName(), c.getEmail(), "Password Changed Successfully");
			} else {
//					sending password update email
				es.sendPasswordChangeConfirmation(f.getFacultyEmail(), f.getFacultyName(), "hod", c.getCollegeName(),
						c.getEmail(), "Password Changed Successfully");

			}
			fr.save(f);
		} else {
			throw new RuntimeException("Failed to update password");
		}
	}

	private boolean verifyCurrentPassword(UpdatePasswordDto upd) {
		String currentPassword = upd.getCurrentPassword();

		if (upd.getRole().equals("COLLEGE")) {
			College college = cr.findById(upd.getId())
					.orElseThrow(() -> new RuntimeException("College not found with ID: " + upd.getId()));
			return passwordEncoder.matches(currentPassword, college.getPassword());
		} else if (upd.getRole().equals("STUDENT")) {
			Student student = sr.findById(upd.getId())
					.orElseThrow(() -> new RuntimeException("Student not found with ID: " + upd.getId()));
			return passwordEncoder.matches(currentPassword, student.getStudentPassword());
		} else if (upd.getRole().equals("FACULTY") || upd.getRole().equals("HOD")) {
			Faculty faculty = fr.findById(upd.getId())
					.orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + upd.getId()));
			return passwordEncoder.matches(currentPassword, faculty.getFacultyPassword());
		}

		return false;
	}
}