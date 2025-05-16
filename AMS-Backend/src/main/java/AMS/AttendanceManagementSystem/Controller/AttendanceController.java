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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.AttendanceDto;
import AMS.AttendanceManagementSystem.Service.AttendanceService;

@RestController
@CrossOrigin("*")
public class AttendanceController {
	@Autowired
	private AttendanceService as;
	
	@PostMapping("/markAttendance/{facultyId}")
	public ResponseEntity<?> markAttendance(@RequestBody List<AttendanceDto> ad, @PathVariable Long facultyId){
		Map<String,String> response = new HashMap<>();
		
		try {
			as.saveAttendance(ad, facultyId);
			response.put("success", "Attendance marked successfully");
			return ResponseEntity.ok(response);
		} catch(Exception e) {
			response.put("error", e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}
	
//  function to get count of attendance of student
    
  @GetMapping("/getAttendanceCount")
  public ResponseEntity<?> countStudentAttendance(@RequestParam Long studentId,@RequestParam String semester){
  	
	  Map<String,String> response = new HashMap<>();
  
     List<List<String>> res= as.countAttendance(studentId,semester);
     
     if(res.isEmpty()) { 
    	 response.put("error","Error occured while fetching or couting the attendance");
    	 return ResponseEntity.badRequest().body(response);
     }
     return ResponseEntity.ok(res);
  	
  }
}
