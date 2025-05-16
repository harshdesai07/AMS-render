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

import AMS.AttendanceManagementSystem.Dto.GetStudentDto;
import AMS.AttendanceManagementSystem.Dto.StudentDto;
import AMS.AttendanceManagementSystem.Service.StudentEnrollmentService;

@RestController
@CrossOrigin("*")
public class StudentEnrollmentController {
	@Autowired
	StudentEnrollmentService ses;
	
	//add student details --> student table and studentEnrollement
	@PostMapping("/studentregister/{collegeId}")
	public ResponseEntity<String> addStudentDetails(@RequestBody StudentDto sd,@PathVariable Long collegeId) {
	    try {
	    	ses.saveStudentDetails(sd,collegeId);
	        return new ResponseEntity<>("Student registration successful!", HttpStatus.CREATED);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Student registration failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
	    }
	}
	
	//update student details
	@PutMapping("/updatestudent/{studentId}")
	public ResponseEntity<?> updateStudentDetails(@PathVariable Long studentId, @RequestBody StudentDto sd){
		Map<String, String> response = new HashMap<>();
		
		try{
			ses.editStudentDetails(studentId, sd);
			response.put("message", "Update student successful");
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("error", "Update failed. Student not found or invalid data.");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}
	
	//delete student details
		@DeleteMapping("/deletestudent/{studentId}")
		public ResponseEntity<?> deleteStudent(@PathVariable Long studentId){
			Map<String, String> response = new HashMap<>();
			
			try {
				ses.deleteStudentDetail(studentId);
				response.put("message", "Delete student successful");
				return ResponseEntity.ok(response);
			} catch (Exception e) {
				response.put("error", "Delete failed. Student not found or invalid data.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}
		}
		
//		get student data
		@GetMapping("/getstudent/{collegeId}/{source}")
		public ResponseEntity<?> getStudents(@PathVariable Long collegeId, @PathVariable String source, @RequestParam String courseName, @RequestParam String departmentName, @RequestParam(required = false) String semester){
			
			List<GetStudentDto> al=ses.findStudents(collegeId, courseName, departmentName,semester,source);
			Map<String,String> res=new HashMap<>();
			res.put("error","No student found");
			
			if(al.isEmpty()) return ResponseEntity.status(404).body(res);
		
			return ResponseEntity.ok(al);
			
		}
		
		//save student data from excel
		@PostMapping("/uploadStudentExcel/{collegeId}")
		public ResponseEntity<Map<String, String>> uploadStudentExcel(@RequestParam MultipartFile file,
				@PathVariable Long collegeId) {
			Map<String, String> response = new HashMap<>();

			try {
				// Call service to process the Excel file
				ses.saveStudentFromExcel(file, collegeId);

				response.put("status", "success");
				response.put("message", "Student data added successfully!");
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
		
		
	
}