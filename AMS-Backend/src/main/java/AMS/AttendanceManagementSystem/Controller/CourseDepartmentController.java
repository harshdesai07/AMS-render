package AMS.AttendanceManagementSystem.Controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Service.CourseDepartmentService;

@RestController
@CrossOrigin("*")
public class CourseDepartmentController {
	@Autowired
	private CourseDepartmentService cds;
	
	//find the department list for corresponding course
	@GetMapping("/departments/{courseId}")
	public ResponseEntity<?> getDepartmentByCourseId(@PathVariable Long courseId) {
		List<Department> departments = cds.findDepartmentByCourseId(courseId);

	    if (departments.isEmpty()) {
	    	 Map<String, String> errorResponse = new HashMap<>();
	         errorResponse.put("error", "No Departments found. Add manually!");
	         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	    }

	    return ResponseEntity.ok(departments);
	
}
}
