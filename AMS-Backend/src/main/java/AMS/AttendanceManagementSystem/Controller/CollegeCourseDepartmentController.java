package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.CollegeCourseDepartmentDto;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Service.CollegeCourseDepartmentService;

@RestController
@CrossOrigin("*")
public class CollegeCourseDepartmentController {
	@Autowired
	CollegeCourseDepartmentService ccds;

	//add the course and department 
	@PostMapping("/addCourseDept")
	public ResponseEntity<?> addCollegeCourseDept(@RequestBody List<CollegeCourseDepartmentDto> ccddList) {
	    HashMap<String, String> response = new HashMap<>();

	   
	        for (CollegeCourseDepartmentDto ccdd : ccddList) {
	            String saved = ccds.saveCollegeCourseDept(ccdd.getCollegeId(), ccdd.getCourseName(), ccdd.getDepartments());
	            
	            if (saved.equals("Invaild department")) {
	                response.put("error", "please check the department values");
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	            }
	            else if(saved.equals("course not found")) {
	            	response.put("error", "course not found");
	            	
	            	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	            }
	        }

	        response.put("message", "Courses and Departments added Successfully!");
	        return ResponseEntity.ok(response);
	}
	
//	get all department by college id and course name for particular college and course	
	@GetMapping("/getDepartments/{collegeId}/{courseName}")
	public ResponseEntity<?> getDepartmentByCollegeidAndCourseName(@PathVariable Long collegeId,@PathVariable String courseName){

		List<Department> ans=ccds.findDepartment(collegeId, courseName);
		
		if(ans.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		
		return ResponseEntity.ok(ans);
		
	}
	
	//get all the courses and departments offered by college
	@GetMapping("/getCoursesAndDepartments/{collegeId}")
	public ResponseEntity<?> getCoursesDepartmentsByCollege(@PathVariable Long collegeId){
		HashMap<String, String> response = new HashMap<>();
		
		try {
			List<CollegeCourseDepartmentDto> dto = ccds.findAllCoursesAndDepartmentsForCollege(collegeId);
			
			if(dto.isEmpty()) {
				response.put("error", "No courses and department found");
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
			}
			
			return ResponseEntity.ok(dto);
		} catch(Exception e) {
			response.put("error", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}
	
}
