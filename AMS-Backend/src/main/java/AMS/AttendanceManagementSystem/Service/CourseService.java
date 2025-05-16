package AMS.AttendanceManagementSystem.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Repo.CourseRepo;

@Service
public class CourseService {
	@Autowired
	CourseRepo cr;
	
public List<Course> findAllCourses(){
		
		return cr.findAll();	
	}
	
//	public boolean addCourse(Course cu) {
//		
//		Optional<Course> oc=cr.findByName(cu.getName());
//		
//		if(!oc.isEmpty()) return false; 
//		
//		
//		Course cs=new Course();
//		cs.setName(cu.getName());
//        cr.save(cs);
//		
//		return true;
//		
//		
//	}
}
