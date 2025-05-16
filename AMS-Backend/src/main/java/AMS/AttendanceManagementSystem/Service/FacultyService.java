package AMS.AttendanceManagementSystem.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Dto.FacultyDto;
import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.FacultyAssignment;
import AMS.AttendanceManagementSystem.Enums.AssignmentStatus;
import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.CourseRepo;
import AMS.AttendanceManagementSystem.Repo.DepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyAssignmentRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.ScheduleToFacultyRepo;
import AMS.AttendanceManagementSystem.Repo.StudentAssignmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.utils.ExcelReader;
import jakarta.transaction.Transactional;

@Service
public class FacultyService implements UserDetailsService {

	@Autowired
	@Lazy
	private PasswordEncoder passwordEncoder;

	@Autowired
	private FacultyRepo fr;

	@Autowired
	private FacultyAssignmentRepo far;

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
	private StudentEnrollmentRepo ser;
	
	@Autowired
	private ScheduleToFacultyRepo sfr;
	
	@Autowired
	private StudentAssignmentRepo sar;
	
	@Autowired
	private CollegeCourseDepartmentSemesterSubjectRepo ccdssr;
	
	@Autowired
	private EmailService es;

	// saves the faculty from registration form
	@Transactional
	public void saveFaculty(FacultyDto fdt, Long collegeId) {

		// generate and hash the password
		String rawPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
		String hashedPassword = passwordEncoder.encode(rawPassword);

		// 1. Find college by college id
		College college = cr.findById(collegeId)
				.orElseThrow(() -> new RuntimeException("College not found with ID: " + collegeId));

		// 2. Find Course by course name
		Course course = cor.findByName(fdt.getCourse())
				.orElseThrow(() -> new RuntimeException("Course not found with name: " + fdt.getCourse()));

		// 3. Find CollegeCourse (mapping between college & course)
		CollegeCourse collegeCourse = ccr.findByCollegeAndCourse(college, course)
				.orElseThrow(() -> new RuntimeException(
						"CollegeCourse not found for college: " + collegeId + " and course: " + fdt.getCourse()));

		// 4. Find Department by department name
		Department department = dr.findByName(fdt.getDepartment())
				.orElseThrow(() -> new RuntimeException("Department not found with name: " + fdt.getDepartment()));

		// 5. Find CollegeCourseDepartment
		CollegeCourseDepartment collegeCourseDepartment = ccdr
				.findByCollegeCourseAndDepartment(collegeCourse, department)
				.orElseThrow(() -> new RuntimeException("CollegeCourseDepartment not found for course: "
						+ fdt.getCourse() + " and department: " + fdt.getDepartment()));

		// 6. update faculty table
		Faculty faculty = new Faculty();
		faculty.setCollegeCourseDepartment(collegeCourseDepartment);
		faculty.setFacultyDesignation(fdt.getFacultyDesignation());
		faculty.setFacultyEmail(fdt.getFacultyEmail());
		faculty.setFacultyName(fdt.getFacultyName());
		faculty.setFacultyNumber(fdt.getFacultyNumber());
		faculty.setFacultyPassword(hashedPassword);

		fr.save(faculty);
		
//		this code will send personal detail and login credential of faculty to their email
		es.sendFacultyDetailsAndCredentials(faculty.getFacultyEmail(),
				faculty.getFacultyName(),
				faculty.getFacultyNumber(),
				faculty.getFacultyDesignation(),
				collegeCourseDepartment.getCollegeCourse().getCourse().getName(),
				collegeCourseDepartment.getDepartment().getName(),
				rawPassword,
				collegeCourseDepartment.getCollegeCourse().getCollege().getCollegeName(),
				collegeCourseDepartment.getCollegeCourse().getCollege().getEmail(),
				"📋 Respected Faculty Please Confirm Your Personal Details And Check 🔐 Your Login Credentials");
	

	}

	public String facultyAuthentication(Long id, String password) {
//		this is use to store user object if it is null then also it will store give no null pointer exceptyion
		Optional<Faculty> user = fr.findById(id);

		if (user.isPresent()) {
			Faculty fr = user.get();
			if (fr.getFacultyPassword().equals(password)) {
				return fr.getFacultyDesignation();
			}

		}

		return null;

	}

//	this function is uses to find or get all faculty data from database based on source
	public List<Faculty> retriveFaculty(Long id, String source, String courseName, String departmentName) {
		
		if(source.equals("COLLEGE")) {
			return fr.findAllHodsByCollegeId(id);
		}
		return fr.findAllFacultyExceptHodsByCollegeCourseAndDepartment(id, courseName, departmentName);

	}

//	this function is use to update the faculty
	@Transactional
	public void updateFaculty(Long facultyId, FacultyDto fdt) {
		// 1. find the faculty from Faculty table
		Faculty faculty = fr.findById(facultyId)
				.orElseThrow(() -> new RuntimeException("Facuty not found with faculty id: " + facultyId));

		// 2. find course by courseName
		Course course = cor.findByName(fdt.getCourse())
				.orElseThrow(() -> new RuntimeException("Course not found with name: " + fdt.getCourse()));

		//3. find college from CollegeCourseDepartment
		College college = faculty.getCollegeCourseDepartment().getCollegeCourse().getCollege();
		 
		// 4. Find CollegeCourse (mapping between college & course)
		CollegeCourse collegeCourse = ccr.findByCollegeAndCourse(college, course)
						.orElseThrow(() -> new RuntimeException(
								"CollegeCourse not found for college: " + college.getCollegeId() + " and course: " + fdt.getCourse()));
		
		// 5. find department by department name
		Department newDept = dr.findByName(fdt.getDepartment())
				.orElseThrow(() -> new RuntimeException("Department not found with name: " + fdt.getDepartment()));
		
		// 6. find collegeCourseDepartment with collegeCourse and newDept
		CollegeCourseDepartment collegeCourseDepartment = ccdr.findByCollegeCourseAndDepartment(collegeCourse, newDept)
				.orElseThrow(
						() -> new RuntimeException("CollegeCourseDepartment not found for course: " + collegeCourse));
		
		// 7. save all details
		faculty.setCollegeCourseDepartment(collegeCourseDepartment);
		faculty.setFacultyDesignation(fdt.getFacultyDesignation());
		faculty.setFacultyEmail(fdt.getFacultyEmail());
		faculty.setFacultyName(fdt.getFacultyName());
		faculty.setFacultyNumber(fdt.getFacultyNumber());

		fr.save(faculty);
		
//		this code will send updated personal detail of faculty to their email
		es.sendUpdatedFacultyInformation(faculty.getFacultyEmail(),
				faculty.getFacultyName(),
				faculty.getFacultyNumber(),
				faculty.getFacultyDesignation(),
				collegeCourseDepartment.getCollegeCourse().getCourse().getName(),
				collegeCourseDepartment.getDepartment().getName(),
				collegeCourseDepartment.getCollegeCourse().getCollege().getCollegeName(),
				collegeCourseDepartment.getCollegeCourse().getCollege().getEmail(),
				"📋 Respected Faculty Please Confirm Updated Your Personal Details");
	}

//	to delete faculty
	public boolean deleteFaculty(Long facultyId) {
		if (facultyId == null)
			return false;

		// check if the faculty has record in faculty assignment
		Optional<FacultyAssignment> facultyAssignment = far.findByFacultyFacultyId(facultyId);

		if (!facultyAssignment.isEmpty()) {
			// delete from faculty assignment
			far.deleteById(facultyAssignment.get().getId());
		}

		// delete from faculty table
		fr.deleteById(facultyId);

		return true;
	}

	// save the faculty data from excel
	@Transactional
	public void saveFacultyFromExcel(MultipartFile file, Long collegeId) {

		// generate and hash the password
		String rawPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
		String hashedPassword = passwordEncoder.encode(rawPassword);

		String sheetName = ExcelReader.getExcelSheetName(file); // read sheet name

		List<Map<String, String>> excelData = ExcelReader.readExcelSheet(file, sheetName);

		// Check if College exists
		College college = cr.findById(collegeId)
				.orElseThrow(() -> new RuntimeException("College not found with ID: " + collegeId));

		for (Map<String, String> row : excelData) {
			// 1. Find Course by course name
			Course course = cor.findByName(row.get("course"))
					.orElseThrow(() -> new RuntimeException("Course not found with name: " + row.get("course")));

			// 2. Find CollegeCourse (mapping between college & course)
			CollegeCourse collegeCourse = ccr.findByCollegeAndCourse(college, course)
					.orElseThrow(() -> new RuntimeException(
							"CollegeCourse not found for college: " + collegeId + " and course: " + row.get("course")));

			// 3. Find Department by department name
			Department department = dr.findByName(row.get("department")).orElseThrow(
					() -> new RuntimeException("Department not found with name: " + row.get("department")));

			// 5. Find CollegeCourseDepartment
			CollegeCourseDepartment collegeCourseDepartment = ccdr
					.findByCollegeCourseAndDepartment(collegeCourse, department)
					.orElseThrow(() -> new RuntimeException("CollegeCourseDepartment not found for course: "
							+ row.get("course") + " and department: " + row.get("department")));

			// 6. add faculty
			Faculty faculty = new Faculty();
			faculty.setFacultyName(row.get("name"));
			faculty.setFacultyEmail(row.get("email"));
			faculty.setFacultyDesignation(row.get("designation"));
			faculty.setFacultyNumber(row.get("number"));
			faculty.setCollegeCourseDepartment(collegeCourseDepartment);
			faculty.setFacultyPassword(hashedPassword);

			fr.save(faculty);
			
//			this code will send personal detail and login credential of faculty to their email
			es.sendFacultyDetailsAndCredentials(faculty.getFacultyEmail(),
					faculty.getFacultyName(),
					faculty.getFacultyNumber(),
					faculty.getFacultyDesignation(),
					collegeCourseDepartment.getCollegeCourse().getCourse().getName(),
					collegeCourseDepartment.getDepartment().getName(),
					rawPassword,
					collegeCourseDepartment.getCollegeCourse().getCollege().getCollegeName(),
					collegeCourseDepartment.getCollegeCourse().getCollege().getEmail(),
					"📋 Respected Faculty Please Confirm Your Personal Details And Check 🔐 Your Login Credentials");
		}
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Faculty f = fr.findByFacultyEmail(email).orElseThrow();
		return new User(f.getFacultyEmail(), f.getFacultyPassword(), List.of(new SimpleGrantedAuthority("FACULTY")));
	}
	
	//find all faculty and hod stats based on source
	public Map<String, Long> findFacultyStats(Long collegeId, Long facultyId, String courseName, String departmentName, String source){
		Map<String, Long> map = new HashMap<>();
		
		//1. count total students by college course and department
		Long students = ser.countByCollegeAndCourseAndDepartment(collegeId, courseName, departmentName);
		map.put("studentCount", students);
		
		if(source.equals("FACULTY")) {
			
			//2. count total pending task by status and facultyId
			Long tasks = sfr.countByAssignedToFacultyIdAndStatus(facultyId, "PENDING");
			
			//3. count total assignments by facultyId
			Long assignments = 	sar.countSubmissionsByFaculty(facultyId, AssignmentStatus.SUBMITTED);
			
			map.put("taskCount", tasks);
			map.put("assignmentCount", assignments);
		}
		else {
			
			//2. count total subjects 
			Long subjects = ccdssr.countSubjectsByCollegeCourseAndDepartment(collegeId, courseName, departmentName);
			
			//3. count total faculty
			Long faculties = fr.countNonHodFacultyByCollegeCourseAndDepartment(collegeId, courseName, departmentName);
			
			map.put("subjectCount", subjects);
			map.put("facultyCount", faculties);
			
		}
		
		return map;
	}

}
