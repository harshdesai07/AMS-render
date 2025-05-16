package AMS.AttendanceManagementSystem.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Dto.GetStudentDto;
import AMS.AttendanceManagementSystem.Dto.StudentDto;
import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.CourseRepo;
import AMS.AttendanceManagementSystem.Repo.DepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentRepo;
import AMS.AttendanceManagementSystem.utils.ExcelReader;
import jakarta.transaction.Transactional;

@Service
public class StudentEnrollmentService {

	@Autowired
	private StudentEnrollmentRepo ser;

	@Autowired
	private StudentRepo sr;

	@Autowired
	private CollegeRepo cr;

	@Autowired
	private CourseRepo cor;

	@Autowired
	private CollegeCourseRepo ccr;

	@Autowired
	private DepartmentRepo dr;

	@Autowired
	private CollegeCourseDepartmentRepo ccdr;

	@Autowired
	private SemesterRepo semr;
	
	@Autowired
	@Lazy
    private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EmailService es;

	// Saves the student data --> update Student table and StudentEnrollment table
	@Transactional
	public void saveStudentDetails(StudentDto sd, Long collegeId) {
		//generate and hash the password
		String rawPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String hashedPassword = passwordEncoder.encode(rawPassword);
        
		// 1. Find college by college id
		College college = cr.findById(collegeId)
				.orElseThrow(() -> new RuntimeException("College not found with ID: " + collegeId));

		// 2. Find Course by course name
		Course course = cor.findByName(sd.getCourseName())
				.orElseThrow(() -> new RuntimeException("Course not found with name: " + sd.getCourseName()));

		// 3. Find CollegeCourse (mapping between college & course)
		CollegeCourse collegeCourse = ccr.findByCollegeAndCourse(college, course)
				.orElseThrow(() -> new RuntimeException(
						"CollegeCourse not found for college: " + collegeId + " and course: " + sd.getCourseName()));

		// 4. Find Department by department name
		Department department = dr.findByName(sd.getDeptName())
				.orElseThrow(() -> new RuntimeException("Department not found with name: " + sd.getDeptName()));

		// 5. Find CollegeCourseDepartment
		CollegeCourseDepartment collegeCourseDepartment = ccdr
				.findByCollegeCourseAndDepartment(collegeCourse, department)
				.orElseThrow(() -> new RuntimeException("CollegeCourseDepartment not found for course: "
						+ sd.getCourseName() + " and department: " + sd.getDeptName()));

		// 6. Find Semester by semester number
		Semester semester = semr.findBysemesterNumber(sd.getSemester())
				.orElseThrow(() -> new RuntimeException("Semester not found with number: " + sd.getSemester()));

		// 7. Update student table
		Student student = new Student();
		student.setStudentEmail(sd.getStudentEmail());
		student.setStudentName(sd.getStudentName());
		student.setStudentNumber(sd.getStudentNumber());
		student.setStudentParentsNumber(sd.getStudentParentsNumber());
		student.setStudentPassword(hashedPassword);

		student = sr.save(student);

		// 8. Update studentEnrollment table
		StudentEnrollment se = new StudentEnrollment();
		se.setStudent(student);
		se.setCollegeCourseDepartment(collegeCourseDepartment);
		se.setSemester(semester);
		se.setRollNumber(sd.getRollNumber());

		ser.save(se);
		
//	     this code sends the email by calling email service methods sends personal detail and credential to student email

			es.sendStudentDetailsAndCredentials(student.getStudentEmail(),
					student.getStudentName(),
					student.getStudentNumber(),
					student.getStudentParentsNumber(),
					se.getCollegeCourseDepartment().getDepartment().getName(),
					se.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName(),
					se.getSemester().getSemesterNumber(),
					rawPassword,
					college.getCollegeName(),
					college.getEmail(),
					"📋 Please Confirm Your Personal Details And 🔐 Your Login Credentials");
	}

//	this function is use to update the student 
	@Transactional
	public void editStudentDetails(Long id, StudentDto sd) {
		// 1. find the student from Student table
		Student student = sr.findById(id)
				.orElseThrow(() -> new RuntimeException("Student not found with student id: " + id));

		// 2. find the studentEnrollement object
		StudentEnrollment studentEnrollment = ser.findByStudentId(id)
				.orElseThrow(() -> new RuntimeException("Student enrollment not found for student id: " + id));

		// 3. Update the department if provided
		
			Department newDept = dr.findByName(sd.getDeptName())
					.orElseThrow(() -> new RuntimeException("Department not found with name: " + sd.getDeptName()));
			CollegeCourseDepartment collegeCourseDepartment = ccdr
					.findByCollegeCourseAndDepartment(studentEnrollment.getCollegeCourseDepartment().getCollegeCourse(),
							newDept)
					.orElseThrow(() -> new RuntimeException("CollegeCourseDepartment not found for course: "
							+ studentEnrollment.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName()));

			// Update the CollegeCourseDepartment in StudentEnrollment
			studentEnrollment.setCollegeCourseDepartment(collegeCourseDepartment);
		

		// 4. Update the semester if provided
		
			Semester semester = semr.findBysemesterNumber(sd.getSemester())
					.orElseThrow(() -> new RuntimeException("Semester not found with: " + sd.getSemester()));

			// Update the semester in StudentEnrollment
			studentEnrollment.setSemester(semester);
		

		// 5. Update student details in the DTO
			student.setStudentName(sd.getStudentName());
			student.setStudentEmail(sd.getStudentEmail());
			student.setStudentParentsNumber(sd.getStudentParentsNumber());
			student.setStudentNumber(sd.getStudentNumber());

		// Save the updated student
		sr.save(student);

		// Save the updated student enrollment
		ser.save(studentEnrollment);
		
//	     this code sends the email by calling email service methods
			es.sendUpdatedStudentInformation(student.getStudentEmail(),
					student.getStudentName(),
					student.getStudentNumber(),
					student.getStudentParentsNumber(),
					studentEnrollment.getCollegeCourseDepartment().getDepartment().getName(),
					studentEnrollment.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName(),
					studentEnrollment.getSemester().getSemesterNumber(),
					collegeCourseDepartment.getCollegeCourse().getCollege().getCollegeName(),
					collegeCourseDepartment.getCollegeCourse().getCollege().getEmail(),
					"📋 Please Confirm Your Updated Personal Details");
	}

	// delete the student details from student and student
	@Transactional
	public void deleteStudentDetail(Long studentId) {
		// Check if the student enrollment exists
		StudentEnrollment se = ser.findByStudentId(studentId)
				.orElseThrow(() -> new RuntimeException("Student enrollment not found for student id: " + studentId));

		// Delete the student from the StudentEnrollment table
		ser.deleteById(se.getId());

		// Delete the student from the Student table
		sr.deleteById(studentId);
	}

//	get all student based on college and course and department
public List<GetStudentDto> findStudents(Long collegeId, String courseName, String departmentName,String semester,String source) {

	List<StudentEnrollment> ls=new ArrayList<>();
	
//		finding by college id
	if(source.equals("HOD")) {
	 ls= ser.findEnrollmentsByCollegeCourseAndDepartment(collegeId, courseName, departmentName);
	}
	
	else {
		ls=ser.findByCollegeAndCourseAndDepartmentAndSemester(collegeId, courseName, departmentName, semester);
	}
	
	
//	storing student dto list
	List<GetStudentDto> res = new ArrayList<>();

	for (int i = 0; i < ls.size(); i++) {

//		taking out student Enrollment object from list ls
		StudentEnrollment se = ls.get(i);

//		student from student enrollment
		Student s = se.getStudent();

		GetStudentDto sdto = new GetStudentDto();
//      taking out CollegeCourseDepartment from student Enrollement
		CollegeCourseDepartment ccd = se.getCollegeCourseDepartment();
//      taking out 	CollegeCourse from	CollegeCourseDepartment	
		CollegeCourse cc = ccd.getCollegeCourse();
//		taking out course from college course
		Course c = cc.getCourse();
//		taking out department from CollegeCourseDepartment
		Department d = ccd.getDepartment();
//		taking out semester from StudentEnrollment
		Semester sem = se.getSemester();

//		now saving all detail of student in student dto and then returning 
		sdto.setCourseName(c.getName());
		sdto.setDeptName(d.getName());
		sdto.setSemester(sem.getSemesterNumber());
		sdto.setStudentEmail(s.getStudentEmail());
		sdto.setStudentName(s.getStudentName());
		sdto.setStudentNumber(s.getStudentNumber());
		sdto.setStudentParentsNumber(s.getStudentParentsNumber());
		sdto.setStudentId(s.getStudentId());
		sdto.setRollNumber(se.getRollNumber());
		

		res.add(sdto);

	}

	return res;

}
	// add student detail from excel sheet
	@Transactional
	public void saveStudentFromExcel(MultipartFile file, Long id) {
		//generate and hash the password
		String rawPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String hashedPassword = passwordEncoder.encode(rawPassword);
        
		String sheetName = ExcelReader.getExcelSheetName(file); // read sheet name

		List<Map<String, String>> excelData = ExcelReader.readExcelSheet(file, sheetName);

		// Check if College exists
		College college = cr.findById(id).orElseThrow(() -> new RuntimeException("College not found with ID: " + id));

		for (Map<String, String> row : excelData) {

			// save student personal information in student table
			Student student = new Student();

			student.setStudentName(row.get("name"));
			student.setStudentEmail(row.get("email"));
			student.setStudentNumber(row.get("phone number"));
			student.setStudentParentsNumber(row.get("parents phone number"));
			student.setStudentPassword(hashedPassword);

			student = sr.save(student);

			// save student academic details
			StudentEnrollment se = new StudentEnrollment();

			// 1. Find Course by course name
			Course course = cor.findByName(row.get("course"))
					.orElseThrow(() -> new RuntimeException("Course not found with name: " + row.get("course")));

			// 2. Find CollegeCourse (mapping between college & course)
			CollegeCourse collegeCourse = ccr.findByCollegeAndCourse(college, course)
					.orElseThrow(() -> new RuntimeException("CollegeCourse not found for college: "
							+ college.getCollegeId() + " and course: " + row.get("course")));

			// 3. Find Department by department name
			Department department = dr.findByName(row.get("department")).orElseThrow(
					() -> new RuntimeException("Department not found with name: " + row.get("department")));

			// 4. Find CollegeCourseDepartment
			CollegeCourseDepartment collegeCourseDepartment = ccdr
					.findByCollegeCourseAndDepartment(collegeCourse, department)
					.orElseThrow(() -> new RuntimeException("CollegeCourseDepartment not found for course: "
							+ row.get("course") + " and department: " + row.get("department")));

			// 5. Find Semester by semester id
			Semester semester = semr.findBysemesterNumber("semester" + " " + row.get("semester"))
					.orElseThrow(() -> new RuntimeException("Semester not found with number: " + row.get("semester")));

			// 6. save data
			se.setStudent(student);
			se.setCollegeCourseDepartment(collegeCourseDepartment);
			se.setSemester(semester);
			se.setRollNumber(row.get("roll number"));

			ser.save(se);
			
//		     this code sends the email by calling email service methods sends personal detail and credential to student email

				es.sendStudentDetailsAndCredentials(student.getStudentEmail(),
						student.getStudentName(),
						student.getStudentNumber(),
						student.getStudentParentsNumber(),
						se.getCollegeCourseDepartment().getDepartment().getName(),
						se.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName(),
						se.getSemester().getSemesterNumber(),
						rawPassword,
						college.getCollegeName(),
						college.getEmail(),
						"📋 Please Confirm Your Personal Details And 🔐 Your Login Credentials");
		}
	}

}