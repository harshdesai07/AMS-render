package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Dto.FacultyDto;
import AMS.AttendanceManagementSystem.Entity.Faculty;

import AMS.AttendanceManagementSystem.Service.FacultyService;

@RestController
@CrossOrigin("*")
public class FacultyController {

	@Autowired
	private FacultyService frs;
	
//	faculty register api
	 @PostMapping("/facultyregister/{collegeId}")
	    public  ResponseEntity<String> addFaculty(@RequestBody FacultyDto fdt, @PathVariable Long collegeId) {
		 try {
		    	frs.saveFaculty(fdt, collegeId);
		        return new ResponseEntity<>("Faculty registration successful!", HttpStatus.CREATED);
		    } catch (Exception e) {
		        return new ResponseEntity<>("Faculty registration failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
		    }
		}
	    
	
//	 api to get faculty whole data
	 @GetMapping("/getfaculty/{id}/{source}")
	 public List<Faculty> fetchFaculty(@PathVariable Long id, @PathVariable String source, @RequestParam(required = false) String courseName, 
		        @RequestParam(required = false) String departmentName){
		 return frs.retriveFaculty(id,source,courseName,departmentName);
	 } 
	 
	// Update faculty Record from Fronted
	 @PutMapping("/updatefaculty/{facultyId}")
	 public ResponseEntity<Map<String, String>> editFaculty(@PathVariable Long facultyId, @RequestBody FacultyDto fdt) {
		 Map<String, String> response = new HashMap<>();
			
			try{
				frs.updateFaculty(facultyId, fdt);
				response.put("message", "Update Faculty successful");
				return ResponseEntity.ok(response);
			} catch (Exception e) {
				response.put("error", "Update failed. Faculty not found or invalid data.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}
	 }
	 
	
//	 api to delete faculty
	 @DeleteMapping("/deletefaculty/{id}")
	 public ResponseEntity<Map<String,String>> deleteSt(@PathVariable Long id){
		 Map<String, String> response = new HashMap<>();
		 if(frs.deleteFaculty(id)) {
			 response.put("message","faculty deleted successfully");
			 return ResponseEntity.ok(response);
		 }
		 
		  response.put("error", "faculty failed. Student not found or invalid data.");
	         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		 
	 }
	 
	 
	 @PostMapping("/uploadFacultyExcel/{collegeId}")
	 public ResponseEntity<Map<String, String>> uploadFacultyExcel(@RequestParam MultipartFile file,
	                                                               @PathVariable Long collegeId) {
	     Map<String, String> response = new HashMap<>();

	     try {
	         // Call service to process the Excel file
	         frs.saveFacultyFromExcel(file, collegeId);

	         response.put("status", "success");
	         response.put("message", "Faculty data added successfully!");
	         return ResponseEntity.ok(response);

	     } catch (IllegalArgumentException e) { // Specific error (e.g., sheet not found)
	         response.put("status", "error");
	         response.put("message", e.getMessage());
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

	     } catch (RuntimeException e) { 
	         // Handle specific Excel validation errors
	         if (e.getMessage().contains("Invalid file format")) {
	             response.put("status", "error");
	             response.put("message", "Only .xls and .xlsx files are allowed.");
	             return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
	         }
	         if (e.getMessage().contains("Uploaded file is empty")) {
	             response.put("status", "error");
	             response.put("message", "The uploaded file is empty. Please upload a valid Excel file.");
	             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	         }
	         if (e.getMessage().contains("Missing required column")) {
	             response.put("status", "error");
	             response.put("message", e.getMessage());
	             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	         }

	         // General runtime error
	         response.put("status", "error");
	         response.put("message", "Processing error: " + e.getMessage());
	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

	     } catch (Exception e) { // Catch unexpected exceptions
	         response.put("status", "error");
	         response.put("message", "Unexpected error occurred. Please try again later.");
	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	     }
	 }
	 
	
	 //get faculty stats
	 @GetMapping("/getFacultyStats/{source}")
	 public Map<String,Long> getFacultyStats(@RequestParam(required = false) Long collegeId, @RequestParam(required = false) Long facultyId, @RequestParam(required = false) String courseName, @RequestParam(required = false) String departmentName, @PathVariable String source){
		 return frs.findFacultyStats(collegeId, facultyId, courseName, departmentName, source);
	 }
}