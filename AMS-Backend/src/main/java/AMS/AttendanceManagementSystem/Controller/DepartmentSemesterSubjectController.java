package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Service.DepartmentSemesterSubjectService;

@RestController
@CrossOrigin("*")
public class DepartmentSemesterSubjectController {
	
	@Autowired
	private DepartmentSemesterSubjectService dsss;
	
	//get the list of subject for particular semester of particular department
	@GetMapping("/getSubjects")
	public ResponseEntity<?> getSubjectsByDepartmentAndSemester(@RequestParam String departmentName, @RequestParam String semesterNumber){
		HashMap<String, String> response = new HashMap<>();
		
		List<Subject> subjects = dsss.findSubjectsByDepartmentAndSemester(departmentName, semesterNumber);
		
		if(subjects.isEmpty()) {
			response.put("error", "subject not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		
		return ResponseEntity.ok(subjects);	
		
	}
}
