package AMS.AttendanceManagementSystem.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Service.CollegeCourseService;

@RestController
@CrossOrigin("*")
public class CollegeCourseController {
	@Autowired
	private CollegeCourseService ccs;
	
	//get the list of courses offered by college
	@GetMapping("/courses/{collegeId}")
	public ResponseEntity<?> getCourseByCollegeId(@PathVariable Long collegeId) {
	    List<Course> courses = ccs.findCourseByCollegeId(collegeId);

	    if (courses.isEmpty()) {
	    	return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	    }

	    return ResponseEntity.ok(courses);
	}

}
