package AMS.AttendanceManagementSystem.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentRepo;
import AMS.AttendanceManagementSystem.Security.CustomUserDetails;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CollegeRepo collegeRepo;

    @Autowired
    private FacultyRepo facultyRepo;

    @Autowired
    private StudentRepo studentRepo;
    
    @Autowired
    private StudentEnrollmentRepo studentEnrollmentRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Check College
        Optional<College> collegeOpt = collegeRepo.findByEmail(email);
        if (collegeOpt.isPresent()) {
            College college = collegeOpt.get();
            return new CustomUserDetails(
                college.getEmail(),
                college.getPassword(),
                "COLLEGE"
            );
        }

        // Check Faculty
        Optional<Faculty> facultyOpt = facultyRepo.findByFacultyEmail(email);
        if (facultyOpt.isPresent()) {
            Faculty faculty = facultyOpt.get();
            
            if(faculty.getFacultyDesignation().equals("HOD")) {
            	return new CustomUserDetails(
                        faculty.getFacultyEmail(),
                        faculty.getFacultyPassword(),
                        "HOD"
                    );
            }
            else {
            	return new CustomUserDetails(
                        faculty.getFacultyEmail(),
                        faculty.getFacultyPassword(),
                        "FACULTY"
                    );
            }
        }

        // Check Student
        Optional<Student> studentOpt = studentRepo.findByStudentEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            return new CustomUserDetails(
                student.getStudentEmail(),
                student.getStudentPassword(),
                "STUDENT"
            );
        }

        // Not found
        throw new UsernameNotFoundException("User not found with email: " + email);
    }

    // Add methods to fetch additional details when needed
    public College getCollegeDetails(String email) {
        return collegeRepo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("College not found with email: " + email));
    }

    public Faculty getFacultyDetails(String email) {
        return facultyRepo.findByFacultyEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Faculty not found with email: " + email));
    }

    public Student getStudentDetails(String email) {
        return studentRepo.findByStudentEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Student not found with email: " + email));
    }
    
    public StudentEnrollment getStudentEnrollmentByStudentId(Long studentId) {
        return studentEnrollmentRepo.findByStudentId(studentId)
            .orElseThrow(() -> new RuntimeException("Enrollment not found for student ID: " + studentId));
    }
}
