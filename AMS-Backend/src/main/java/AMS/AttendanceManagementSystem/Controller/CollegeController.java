package AMS.AttendanceManagementSystem.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Service.CollegeService;

@RestController
@CrossOrigin("*")
public class CollegeController {
	@Autowired
	private CollegeService crs;

//	college register api
	@PostMapping("/register")
	public ResponseEntity<Map<String, String>> registerUser(@RequestBody College cr) {
		String s = crs.create(cr);
		Map<String, String> response = new HashMap<>();

		if (s.equals("emailPresent")) {
			response.put("message", "Email already exists");
			return ResponseEntity.status(409).body(response);
		} else if (s.equals("namePresent")) {
			response.put("message", "College already exists");
			return ResponseEntity.status(409).body(response);
		} else{

			response.put("message", "Reistration Successfull");

			return ResponseEntity.ok(response);
		}
	}

	@GetMapping("/getCollegeStats/{collegeId}")
	public Map<String, Long> getCollegeStats(@PathVariable Long collegeId){
		 return crs.findCollegeStats(collegeId);
	}
}