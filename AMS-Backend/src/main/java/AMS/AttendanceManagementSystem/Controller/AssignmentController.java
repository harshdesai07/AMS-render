package AMS.AttendanceManagementSystem.Controller;

import AMS.AttendanceManagementSystem.Dto.AssignmentDto;
import AMS.AttendanceManagementSystem.Service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@CrossOrigin("*")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    private static final Logger logger = Logger.getLogger(AssignmentController.class.getName());

    @PostMapping("/uploadAssignment/{source}")
    public ResponseEntity<?> uploadAssignment(@RequestPart("data") AssignmentDto assignmentDto,
                                              @RequestPart("file") MultipartFile file,
                                              @PathVariable String source) {
        
        Map<String, String> response = new HashMap<>();
        
        try {
            

            // Call service to create assignment
            assignmentService.createAssignment(assignmentDto, file, source);
            logger.info("Assignment uploaded and saved in database.");

            response.put("success", "Assignment uploaded successfully");
            return ResponseEntity.ok(response);
        }  catch (Exception e) {
            logger.severe("Exception during assignment upload: " + e.getMessage());
            response.put("error", "Failed to upload assignment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    @GetMapping("/downloadAssignment/{assignmentId}/{source}")
    public ResponseEntity<?> downloadAssignment(@PathVariable Long assignmentId, @PathVariable String source, @RequestParam(required = false) Long studentId) {
        Map<String, String> response = new HashMap<>();

        try {
            String downloadUrl = assignmentService.generateDownloadUrl(assignmentId,source,studentId);

            response.put("downloadUrl", downloadUrl);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (Exception e) {
            response.put("error", "Failed to generate download URL. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/getAllAssignments/{source}/{id}")
    public ResponseEntity<?> getAllAssigments(@PathVariable String source, @PathVariable Long id){
    	try {
    		List<Map<String, Object>> response = assignmentService.findAllAssignments(id,source);
    		
    		return ResponseEntity.ok(response);
    	} catch(Exception e) {
    		e.getMessage();
    		
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to get Assignments "+e.getMessage());
    	}
    }


}
