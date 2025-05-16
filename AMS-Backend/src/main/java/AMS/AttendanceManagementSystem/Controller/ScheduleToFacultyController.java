package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.ScheduleToFacultyDto;
import AMS.AttendanceManagementSystem.Entity.ScheduleToFaculty;
import AMS.AttendanceManagementSystem.Service.ScheduleToFacultyService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@CrossOrigin("*")
public class ScheduleToFacultyController {
    
	@Autowired
	ScheduleToFacultyService sfs;
	
//	function is for post mapping of schedule task
	
	@PostMapping("/SechduleTask")
	public ResponseEntity<?> postTask(@RequestBody ScheduleToFacultyDto sfd){
		
		Map<String,String> res=new HashMap<>();
		
		if(sfs.createTask(sfd)) {
			res.put("message", "Task Assign To Faculty Scuessfully");
			return ResponseEntity.ok(res);
		}
		
		res.put("error","Task Assign Failed The Task Assigner is Not Hod Or Some Error Occurred");
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
		
	}
	
//	function is for put mapping of status from the fronted to backed 
	
	@PutMapping("/updateTaskStatus")
	public ResponseEntity<?> putTask(@RequestParam Long scheduleId, @RequestParam String status) {
		Map<String,String> res=new HashMap<>();
		try {
	        sfs.updateStatus(scheduleId, status);
	        res.put("message", "Status updated sucessfully");
	        return ResponseEntity.ok().body(res);
	    } catch (Exception e) {
	        // Log the error (you might want to use a proper logging framework)
	        System.err.println("Error updating task status: " + e.getMessage());
	        
	        // Return appropriate error response
	        res.put("error","An Error Occurred While Updating the Status");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	               .body(res);
	    }
	}
	
//	function is for get mapping to get all task assigned to particular faculty
	
	@GetMapping("/getAssignTo/{facultyId}")
	public ResponseEntity<?> getAssignToTask(@PathVariable Long facultyId){
		Map<String,String> res=new HashMap<>();
		
		try {
			List<ScheduleToFaculty> ans=sfs.getAssignToFacultyTask(facultyId);
			return ResponseEntity.ok(ans);
		}catch (Exception e) {
			res.put("error", "An unexpected error occurred");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
		}
		
	}
	
//	function is for get mapping to get all task assigned by a particular HOD
	
	@GetMapping("/getAssignBy/{facultyId}")
	public ResponseEntity<?> getAssignByTask(@PathVariable Long facultyId){
		Map<String,String> res=new HashMap<>();
		
		try {
			List<ScheduleToFaculty> ans=sfs.getAssignByHodTask(facultyId);
			return ResponseEntity.ok(ans);
		}
		catch (Exception e) {
			res.put("error", "An unexpected error occurred");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
		}
	}
	
//	function to delete a particular task by HOD
	@DeleteMapping("/deleteTask/{scheduleId}")
	public ResponseEntity<?> deleteSchedule(@PathVariable Long scheduleId) {
	    Map<String, String> response = new HashMap<>();
	    
	    try {
	        sfs.deleteTask(scheduleId);
	        response.put("message", "Task with ID " + scheduleId + " deleted successfully");
	        return ResponseEntity.ok().body(response);
	    } catch (Exception e) {
	        // Log the error (consider using a proper logger like SLF4J)
	        System.err.println("Error deleting task with ID " + scheduleId + ": " + e.getMessage());
	        
	        // Return appropriate error response
	        response.put("error", "An Error Occurred While Deleting the Task");
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	               .body(response);
	    }
	}
	
	
}