package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.FacultyAssignmentDto;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Service.FacultyAssignmentService;

@RestController
@CrossOrigin("*")
public class FacultyAssignmentController {
   
	@Autowired
	FacultyAssignmentService fas;
	
	
	@PostMapping("/SubjectAssign")
	public ResponseEntity<?> saveToFacultyAssignment(@RequestBody FacultyAssignmentDto fad){
		
		Map<String,String> res=new HashMap<>();
		
		try {
			fas.assignSubToFaculty(fad);
			res.put("message","Suject Assign to Faculty Successfull.");
			return ResponseEntity.ok(res);
			
		}catch (Exception e) {
			res.put("error", "Subject Assign To Faculty Failed.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
		}
	}
	
	@GetMapping("/subjectsByFaculty")
	public ResponseEntity<?> getAllSubjectsTaughtByFaculty(@RequestParam Long facultyId, @RequestParam String courseName, @RequestParam String departmentName, @RequestParam String semester){
		List<Subject> subjects = fas.subjectsTaughtByAFaculty(facultyId, courseName, departmentName, semester);
		
		return ResponseEntity.ok(subjects);
	}
	
}