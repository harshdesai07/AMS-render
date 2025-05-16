package AMS.AttendanceManagementSystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Service.CourseService;

@RestController
@CrossOrigin("*")
public class CourseController {
	@Autowired
	CourseService cs;
	
	 @GetMapping("/getCourses")
	    public ResponseEntity<?> getAllCourses() {
	        
	        List<Course> res = cs.findAllCourses();
	        
	        if (res.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	        
	        return ResponseEntity.ok(res);
	    }
}
