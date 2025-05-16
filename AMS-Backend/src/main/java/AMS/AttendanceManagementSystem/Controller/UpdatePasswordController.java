package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.UpdatePasswordDto;
import AMS.AttendanceManagementSystem.Service.UpdatePasswordService;

@RestController
@CrossOrigin
public class UpdatePasswordController {
   
	@Autowired
	UpdatePasswordService ups;
	
	@PutMapping("/updatePassword")
	public ResponseEntity<Map<String, String>> updatePassword(@RequestBody UpdatePasswordDto upd) {
	    Map<String, String> response = new HashMap<>();
	    
	    try {
	        ups.editPassword(upd);
	        response.put("message", "Password updated successfully");
	        return ResponseEntity.ok(response);
	    }
	    catch (Exception e) {
	    	
	    	//current password does not match
	        if (e.getMessage() != null && e.getMessage().contains("Current password does not match")) {
	            response.put("error", "Current password is incorrect");
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	        }
	        
	        response.put("error", "An internal error occurred while updating the password"+e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }
	}
	
}