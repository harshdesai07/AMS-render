package AMS.AttendanceManagementSystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Service.CourseSemesterService;

@RestController
@CrossOrigin("*")
public class CourseSemesterController {
   
	@Autowired
	CourseSemesterService css;
	
	@GetMapping("/getSemester/{courseName}")
	public ResponseEntity<?> getSemesterByCourseId(@PathVariable String courseName){
		
		List<Semester> s=css.findSemesterByCourseName(courseName);
		
		if(s.isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		
		return ResponseEntity.ok(s);
		
	}
	
}