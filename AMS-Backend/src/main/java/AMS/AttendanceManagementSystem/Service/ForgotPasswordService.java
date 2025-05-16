package AMS.AttendanceManagementSystem.Service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentRepo;
import jakarta.transaction.Transactional;


@Service
public class ForgotPasswordService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private CustomUserDetailsService cuds;
    
    @Autowired
    private CollegeRepo cr;
    
    @Autowired
    private StudentRepo sr;
    
    @Autowired
    private FacultyRepo fr;
    
    @Autowired
    private StudentEnrollmentRepo ser;
    
    @Autowired
    private EmailService es;
    
    public void processForgotPassword(String email, String source) {
    
    	if(source.equals("FACULTY") || source.equals("HOD")) {
    		cuds.getFacultyDetails(email);
    	}
    	else if(source.equals("STUDENT")) {
    		 cuds.getStudentDetails(email);
    	}
    	else if(source.equals("COLLEGE")) {
    		 cuds.getCollegeDetails(email);
    	}
    	else {
    		throw new RuntimeException("Invaild Source!!");
    	}
    	
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        redisTemplate.opsForValue().set("OTP:" + email, otp, 5, TimeUnit.MINUTES);
        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = redisTemplate.opsForValue().get("OTP:" + email);
        return storedOtp != null && storedOtp.equals(otp);
    }

    @Transactional
    public void resetPassword(String email, String newPassword, String source) {
    	String hashedPassword = passwordEncoder.encode(newPassword);
    	String userName = null;
    	String collegeName = null;
    	String collegeEmail = null;
    	
    	if(source.equals("FACULTY") || source.equals("HOD")) {
    		Faculty f = cuds.getFacultyDetails(email);
    		f.setFacultyPassword(hashedPassword);
    		
    		fr.save(f);
    		
    		userName = f.getFacultyName();
    		collegeName = f.getCollegeCourseDepartment().getCollegeCourse().getCollege().getCollegeName();
    		collegeEmail = f.getCollegeCourseDepartment().getCollegeCourse().getCollege().getEmail();
    	}
    	else if(source.equals("STUDENT")) {
    		 Student s = cuds.getStudentDetails(email);
    		 StudentEnrollment se = ser.findByStudentId(s.getStudentId())
    				 .orElseThrow(() -> new RuntimeException("StudentEnrollment not found for id: "+s.getStudentId()));
    		 
    		 s.setStudentPassword(hashedPassword);
    		 
    		 sr.save(s);
    		 
    		 userName = s.getStudentName();
     		 collegeName = se.getCollegeCourseDepartment().getCollegeCourse().getCollege().getCollegeName();
    	}
    	else if(source.equals("COLLEGE")) {
    		College c = cuds.getCollegeDetails(email);
    		c.setPassword(hashedPassword);
    		
    		cr.save(c);
    		
    		userName = c.getCollegeName();
    		collegeEmail = c.getEmail();
    		collegeName = c.getCollegeName();
    	}
    	else {
    		throw new RuntimeException("Invaild Source!!");
    	}
    	
        redisTemplate.delete("OTP:" + email);
        
        //send reset mail
        es.sendPasswordResetConfirmation(email, 
        		userName, 
        		source.toLowerCase(), 
        		collegeName, 
        		collegeEmail, 
        		"Password Reset Succesfully.");
    }
}
