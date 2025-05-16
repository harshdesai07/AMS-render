package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Service.StudentService;

@RestController
@CrossOrigin("*")
public class StudentController {
	
	@Autowired
	private StudentService srs;
	
	// function for post mapping to send email to student for fees reminder
	
		@PostMapping("/feesReminder/{id}")
		public ResponseEntity<Map<String, Object>> sendingFeesReminderEmail(@PathVariable Long id) {
		    Map<String, Object> response = new HashMap<>();
		    
		    try {
		        srs.feesNotifiyEmail(id);
		        
		        
		        response.put("message", "Fee reminder email sent successfully to student");
		        return ResponseEntity.ok(response);
		        
		    } catch (Exception e) {
		        
		        response.put("error", "Unexpected error");
		        response.put("details", e.getMessage());
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		    }
		}
}
