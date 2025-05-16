package AMS.AttendanceManagementSystem.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentRepo;


@Service
public class StudentService implements UserDetailsService{
	@Autowired
	private StudentRepo srr;
	
	@Autowired
	private EmailService es;
	
	@Autowired
	private StudentEnrollmentRepo ser;

//	checking credential for student login or authentication
	public boolean studentAuthentication(Long id, String password) {
//		this is use to store user object if it is null then also it will store give no nullpointer exceptyion
		Optional<Student> user = srr.findById(id);

		if (user.isPresent()) {
			Student sr = user.get();
			return sr.getStudentPassword().equals(password);
		}

		return false;

	}
	
	@Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Student s = srr.findByStudentEmail(email).orElseThrow();
        return new User(s.getStudentEmail(), s.getStudentPassword(), List.of(new SimpleGrantedAuthority("STUDENT")));
    }
	
public void feesNotifiyEmail(Long id) {
		
		// 1. find the student from Student table
				Student student = srr.findById(id)
						.orElseThrow(() -> new RuntimeException("Student not found with student id: " + id));

				// 2. find the studentEnrollement object
				StudentEnrollment studentEnrollment = ser.findByStudentId(id)
						.orElseThrow(() -> new RuntimeException("Student enrollment not found for student id: " + id));

//	3.finding college course department
				
				CollegeCourseDepartment ccd=studentEnrollment.getCollegeCourseDepartment();
				CollegeCourse cc=ccd.getCollegeCourse();
				College c=cc.getCollege();
	
				
//				sending email to student by calling email service method 
				es.sendSemesterFeeReminder(student.getStudentEmail(),
						student.getStudentName(),
						studentEnrollment.getSemester().getSemesterNumber(),
						c.getCollegeName(),
						"Semester Fees Reminder");
		
	}
}
