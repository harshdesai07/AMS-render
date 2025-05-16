package AMS.AttendanceManagementSystem.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Dto.LoginRequestDto;
import AMS.AttendanceManagementSystem.Dto.LoginResponseDto;
import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Security.CustomUserDetails;
import AMS.AttendanceManagementSystem.Service.CustomUserDetailsService;
import AMS.AttendanceManagementSystem.utils.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {
    
    @Autowired 
    private JwtUtil jwtUtil;
    
    @Autowired 
    private AuthenticationManager authManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto request) {
        try {

            // First attempt authentication
            Authentication authentication = authManager.authenticate(
            	
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // If authentication successful, get user details
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails, userDetails.getRole());
            
            // Create response DTO
            LoginResponseDto response = new LoginResponseDto();
            response.setEmail(userDetails.getUsername());
            response.setRole(userDetails.getRole());
            response.setToken(jwt);

            // Add role-specific details to the response
            String role = userDetails.getRole();
            switch (role) {
                case "COLLEGE":
                    College college = userDetailsService.getCollegeDetails(userDetails.getUsername());
                    response.setCollegeId(college.getCollegeId());
                    response.setCollegeName(college.getCollegeName());
                    break;
                case "FACULTY":
                    Faculty faculty = userDetailsService.getFacultyDetails(userDetails.getUsername());
                    response.setDesignation(faculty.getFacultyDesignation());
                    response.setId(faculty.getFacultyId());
                    response.setDepartment(faculty.getCollegeCourseDepartment().getDepartment().getName());
                    response.setCourse(faculty.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName());
                    response.setCollegeId(faculty.getCollegeCourseDepartment().getCollegeCourse().getCollege().getCollegeId());
                    response.setName(faculty.getFacultyName());
                    break;
                case "STUDENT":
                	Student student = userDetailsService.getStudentDetails(userDetails.getUsername());
                	StudentEnrollment sudentEnrollment = userDetailsService.getStudentEnrollmentByStudentId(student.getStudentId());
                    response.setId(student.getStudentId());
                    response.setName(student.getStudentName());
                    response.setSemester(sudentEnrollment.getSemester().getSemesterNumber());
                    response.setDepartment(sudentEnrollment.getCollegeCourseDepartment().getDepartment().getName());
                    response.setRollNumber(sudentEnrollment.getRollNumber());
                    break;
                case "HOD":
                	 Faculty hod = userDetailsService.getFacultyDetails(userDetails.getUsername());
                	 response.setDesignation(hod.getFacultyDesignation());
                	 response.setCourse(hod.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName());
                	 response.setDepartment(hod.getCollegeCourseDepartment().getDepartment().getName());
                	 response.setCollegeId(hod.getCollegeCourseDepartment().getCollegeCourse().getCollege().getCollegeId());
                	 response.setId(hod.getFacultyId());
                	 response.setName(hod.getFacultyName());
                	 break;     	
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Invalid role"));
            }

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Invalid username or password"));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Account is disabled"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("An error occurred during authentication: " + e.getMessage()));
        }
    }

    static class ErrorResponse {
        private String message;
        private String error;
        private int status;

        public ErrorResponse(String message) {
            this.message = message;
            this.error = "Authentication Error";
            this.status = HttpStatus.UNAUTHORIZED.value();
        }

        // Getters and Setters
        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getError() {
            return error;
        }

        public void setError(String error) {
            this.error = error;
        }

        public int getStatus() {
            return status;
        }

        public void setStatus(int status) {
            this.status = status;
        }
    }
}