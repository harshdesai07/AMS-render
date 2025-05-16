package AMS.AttendanceManagementSystem.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import AMS.AttendanceManagementSystem.Service.ForgotPasswordService;

@RestController
@CrossOrigin("*")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/request-forgotPassword")
    public ResponseEntity<?> requestOtp(@RequestParam String email, @RequestParam String source) {
        forgotPasswordService.processForgotPassword(email, source);
        return ResponseEntity.ok("OTP sent to your email");
    }

    @PostMapping("/verify-Otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean valid = forgotPasswordService.verifyOtp(email, otp);
        return valid ? ResponseEntity.ok("OTP verified") : ResponseEntity.badRequest().body("Invalid OTP");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword, @RequestParam String source) {
        forgotPasswordService.resetPassword(email, newPassword, source);
        return ResponseEntity.ok("Password updated successfully");
    }
}

