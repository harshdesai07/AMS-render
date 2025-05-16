package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Dto.SubjectDto;
import AMS.AttendanceManagementSystem.Service.CollegeCourseDepartmentSemesterSubjectService;


@RestController
@CrossOrigin("*")
public class CollegeCourseDepartmentSemesterSubjectController {

    @Autowired
    private CollegeCourseDepartmentSemesterSubjectService ccdsss;

    // Add subjects through excel for the currently logged-in faculty (HOD)
    @PostMapping("/addSubjectsExcel")
    public ResponseEntity<?> addSubjects(@RequestParam MultipartFile file) {
        Map<String, String> response = new HashMap<>();

        try {
            // Get logged-in user's email from SecurityContext
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            // call service
            ccdsss.saveSubjects(file, email);

            response.put("message", "Subjects added successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Subject adding failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
 // Add subjects through form for the currently logged-in faculty (HOD)
    @PostMapping("/addSubjects")
    public ResponseEntity<?> addSubjectsThroughForm(@RequestBody List<SubjectDto> dto) {
        Map<String, String> response = new HashMap<>();

        try {
            // Get logged-in user's email from SecurityContext
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            // call service
            ccdsss.saveSubjectsThroughForm(email, dto);

            response.put("message", "Subjects added successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Subject adding failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    //get the list of subjects semester wise of a department of a particular college
    @GetMapping("/getSubjectsSemesterwise/{collegeId}")
    public ResponseEntity<?> geAllSubjectsBySemester(@PathVariable Long collegeId, @RequestParam String courseName, @RequestParam String departmentName){
    	HashMap<String, String> response = new HashMap<>();
    	
    	try {
    		List<SubjectDto> dto = ccdsss.findAllSubjectsBySemester(collegeId, courseName, departmentName);
        	
    		// Return empty list if no subjects found
            if (dto.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }
        	return ResponseEntity.ok(dto);
    	} catch(Exception e) {
    		response.put("error", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    	}
    	
    }
    
    
}
