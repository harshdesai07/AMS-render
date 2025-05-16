package AMS.AttendanceManagementSystem.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import jakarta.transaction.Transactional;

@Service 
public class CollegeService implements UserDetailsService {
   
	@Autowired
	private CollegeRepo crr;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private FacultyRepo fr;
	
	@Autowired
	private CollegeCourseDepartmentRepo ccdr;
	
	@Autowired
	private EmailService es;

	@Transactional
	public String create(College cr) {
		Optional<College> cn = crr.findByCollegeName(cr.getCollegeName());
		Optional<College> ce = crr.findByEmail(cr.getEmail());
		
		if(!cn.isPresent() && !ce.isPresent()) {
			//Encrypt the password
	        cr.setPassword(passwordEncoder.encode(cr.getPassword()));
			crr.save(cr);
			es.sendWelcomeEmailToCollege(cr.getEmail(), cr.getCollegeName(),"Hello! From AMS");
			return "null";
		}
		else if(cn.isPresent()) {
			return "namePresent";
		}
		
		return "emailPresent";
	}
	
	public College collegeAuthentication(String email,String password) {
//		this is use to store user object if it is null then also it will store give no null pointer exception
		return crr.findByEmailAndPassword(email, password);
		
	}
	
	@Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        College c = crr.findByEmail(email).orElseThrow();
        return new User(c.getEmail(), c.getPassword(), List.of(new SimpleGrantedAuthority("COLLEGE")));
    }
	
	//find all college stats
	public Map<String, Long> findCollegeStats(Long collegeId){
		Map<String, Long> map = new HashMap<>();
		
		//1. find total courses offered by college by collegeId
		Long courses = ccdr.countDistinctCoursesByCollegeId(collegeId);
		
		//2. find total departments offered by college by college  id
		Long departments = ccdr.countDistinctDepartmentsByCollegeId(collegeId);
		
		//2. find total hods in the college by college id
		Long hods = fr.countHodsByCollegeId(collegeId);
		
		//3. return map
		map.put("courseCount", courses); //total courses
		map.put("departmentCount", departments); //total departments
		map.put("hodCount", hods); //total hods
		
		return map;
	}
}
