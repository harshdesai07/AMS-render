package AMS.AttendanceManagementSystem.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;


import AMS.AttendanceManagementSystem.Security.JwtRequestFilter;
import AMS.AttendanceManagementSystem.Service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableAsync
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public end points
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/register").permitAll()
                .requestMatchers("/getCourses").permitAll()
                .requestMatchers("/departments/{courseId}").permitAll()
                .requestMatchers("/getSemester/{courseName}").permitAll()
                .requestMatchers("/request-forgotPassword").permitAll()
                .requestMatchers("/verify-Otp").permitAll()
                .requestMatchers("/reset-password").permitAll()
                
                // College end points
                .requestMatchers("/courses/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/addCourseDept").hasAuthority("COLLEGE")
                .requestMatchers("/getDepartments/{collegeId}/{courseName}").hasAuthority("COLLEGE")
                .requestMatchers("/getCoursesAndDepartments/{collegeId}").hasAuthority("COLLEGE")
                .requestMatchers("/getCollegeStats/{collegeId}").hasAuthority("COLLEGE")
                
                // HOD end points
                .requestMatchers("/addSubjects").hasAuthority("HOD")
                .requestMatchers("/addSubjectsExcel").hasAuthority("HOD")
                .requestMatchers("/getSubjects").hasAnyAuthority("HOD")
                .requestMatchers("/SubjectAssign").hasAuthority("HOD")
                .requestMatchers("/deletestudent/{studentId}").hasAuthority("HOD") 
                .requestMatchers("/updatestudent/{studentId}").hasAuthority("HOD")
                .requestMatchers("/uploadStudentExcel/{collegeId}").hasAuthority("HOD")
                .requestMatchers("/studentregister/{collegeId}").hasAuthority("HOD")
                .requestMatchers("/getSubjectsSemesterwise/{collegeId}").hasAuthority("HOD")
                .requestMatchers("/SechduleTask").hasAuthority("HOD")
                .requestMatchers("/getAssignBy/{facultyId}").hasAuthority("HOD")
                .requestMatchers("/deleteTask/{scheduleId}").hasAuthority("HOD")
                .requestMatchers("/feesReminder/{id}").hasAuthority("HOD")
                
                // Faculty end points
                .requestMatchers("/getAssignTo/{facultyId}").hasAuthority("FACULTY")
                .requestMatchers("/updateTaskStatus").hasAuthority("FACULTY")
                .requestMatchers("/markAttendance/{facultyId}").hasAuthority("FACULTY")
                .requestMatchers("/subjectsByFaculty").hasAuthority("FACULTY")
                
                // Student end points
                .requestMatchers("/getAttendanceCount").hasAuthority("STUDENT")
                
                // College and HOD end points
                .requestMatchers("/facultyregister/{collegeId}").hasAnyAuthority("COLLEGE", "HOD")
                .requestMatchers("/getfaculty/{id}/{source}").hasAnyAuthority("COLLEGE", "HOD")
                .requestMatchers("/updatefaculty/{facultyId}").hasAnyAuthority("COLLEGE", "HOD")
                .requestMatchers("/deletefaculty/{id}").hasAnyAuthority("COLLEGE", "HOD")
                .requestMatchers("/uploadFacultyExcel/{collegeId}").hasAnyAuthority("COLLEGE", "HOD")
                
                //Faculty and HOD end points
                .requestMatchers("/getstudent/{collegeId}/{source}").hasAnyAuthority("FACULTY", "HOD")
                .requestMatchers("/getFacultyStats/{source}").hasAnyAuthority("FACULTY","HOD")
                //Faculty and Student end points
                .requestMatchers("/uploadAssignment/{source}").hasAnyAuthority("FACULTY","STUDENT")
                .requestMatchers("/downloadAssignment/{assignmentId}/{source}").hasAnyAuthority("FACULTY", "STUDENT")
                .requestMatchers("/getAllAssignments/{source}/{id}").hasAnyAuthority("FACULTY", "STUDENT")
                
                //College, Faculty, HOD, Student end points
                .requestMatchers("/updatePassword").hasAnyAuthority("COLLEGE", "HOD", "FACULTY", "STUDENT")
               
                
                // Any other request needs authentication
                .anyRequest().authenticated())
            .cors(Customizer.withDefaults()) 
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
