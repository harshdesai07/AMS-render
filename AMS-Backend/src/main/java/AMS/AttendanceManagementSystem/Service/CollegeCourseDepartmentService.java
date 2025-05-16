package AMS.AttendanceManagementSystem.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Dto.CollegeCourseDepartmentDto;
import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.CourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.CourseDepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.CourseRepo;
import AMS.AttendanceManagementSystem.Repo.DepartmentRepo;
import jakarta.transaction.Transactional;

@Service
public class CollegeCourseDepartmentService {

	@Autowired
	private CollegeCourseDepartmentRepo ccdr;

	@Autowired
	private CollegeRepo cr;

	@Autowired
	private CourseRepo cor;

	@Autowired
	private DepartmentRepo dr;

	@Autowired
	private CollegeCourseRepo ccr;

	@Autowired
	private CourseDepartmentRepo cdr;
	
	//save the course and department offered by college
	@Transactional
	public String saveCollegeCourseDept(Long collegeId, String courseName, List<String> depts) {
	    // 1. Check if college exists
	    Optional<College> oc = cr.findById(collegeId);
	    if (oc.isEmpty()) return "College not found.";
	    College college = oc.get();

	    // 2. Check if course exists
	    Optional<Course> oco = cor.findByName(courseName);
	    if (oco.isEmpty()) return "Course not found.";
	    Course course = oco.get();

	    // 3. Handle departments
	    List<Department> departments = new ArrayList<>();
	    if (!depts.isEmpty()) {
	        for (String name : depts) {
	            if (name == null || name.isBlank()) return "Invalid department";

	            Optional<Department> od = dr.findByName(name);
	            Department department;
	            if (od.isPresent()) {
	                department = od.get();
	            } else {
	                department = new Department();
	                department.setName(name);
	                dr.save(department);
	            }
	            departments.add(department);
	        }
	    }

	    // 4. Map course to college, avoiding duplicates
	    Optional<CollegeCourse> existingCollegeCourse = ccr.findByCollegeAndCourse(college, course);
	    CollegeCourse collegeCourse;
	    if (existingCollegeCourse.isPresent()) {
	        collegeCourse = existingCollegeCourse.get();
	    } else {
	        collegeCourse = new CollegeCourse();
	        collegeCourse.setCollege(college);
	        collegeCourse.setCourse(course);
	        ccr.save(collegeCourse);
	    }

	    // 5. Check and remove "none" mapping if departments are provided
	    if (!departments.isEmpty()) {
	        Optional<Department> noneDepartment = dr.findByName("none");
	        if (noneDepartment.isPresent()) {
	            Optional<CollegeCourseDepartment> noneMapping = ccdr.findByCollegeCourseAndDepartment(collegeCourse, noneDepartment.get());
	            noneMapping.ifPresent(ccdr::delete);
	        }

	        // 6. Map course to department, avoiding duplicates
	        for (Department department : departments) {
	            List<CourseDepartment> existingCourseDepartment = cdr.findByCourseAndDepartment(course, department);
	            if (existingCourseDepartment.isEmpty()) {
	                CourseDepartment courseDepartment = new CourseDepartment();
	                courseDepartment.setCourse(course);
	                courseDepartment.setDepartment(department);
	                cdr.save(courseDepartment);
	            }
	        }

	        // 7. Map college, course, department, avoiding duplicates
	        for (Department department : departments) {
	            Optional<CollegeCourseDepartment> existingCollegeCourseDepartment = ccdr.findByCollegeCourseAndDepartment(collegeCourse, department);
	            if (existingCollegeCourseDepartment.isEmpty()) {
	                CollegeCourseDepartment collegeCourseDepartment = new CollegeCourseDepartment();
	                collegeCourseDepartment.setCollegeCourse(collegeCourse);
	                collegeCourseDepartment.setDepartment(department);
	                ccdr.save(collegeCourseDepartment);
	            }
	        }
	    }

	    return "ok";
	}
	
//	this function is made to get All department of particular course and college
public List<Department> findDepartment(Long collegeId, String CourseName) {
	
	return ccdr.findDepartmentsByCourseNameAndCollegeId(CourseName, collegeId);
	
}

//finds the course and its department for a particular college
public List<CollegeCourseDepartmentDto> findAllCoursesAndDepartmentsForCollege(Long collegeId){
	
	//1. fetch all the courses and department offered by college
	List<Object[]> rawResults = ccdr.findCoursesAndDepartmentsByCollegeId(collegeId);
	
	if(rawResults.isEmpty()) throw new RuntimeException("No courses and departments found");
	
    // 2. Group by course name 
   //key -> course, value -> departments
	HashMap<String, List<String>> courseMap = new LinkedHashMap<>();
	
	for(Object[] row :rawResults) {
		String courseName = (String) row[0];
		String departmentName = (String) row[1];
		
		if(courseMap.containsKey(courseName)) {
			List<String> al = courseMap.get(courseName);
			al.add(departmentName);
			
			courseMap.put(courseName, al);
		}
		else {
			List<String> al = new ArrayList<>();
			al.add(departmentName);
			
			courseMap.put(courseName, al);
		}
	}
	
	//3. create List<collegeCourseDepartment>
	List<CollegeCourseDepartmentDto> result = new ArrayList<>();
	 
	for(Map.Entry<String, List<String>> entry: courseMap.entrySet()) {
		CollegeCourseDepartmentDto dto = new CollegeCourseDepartmentDto();
		dto.setCourseName(entry.getKey());
		dto.setDepts(entry.getValue());
		result.add(dto);
	}
	
	return result;
}
	
}
