package AMS.AttendanceManagementSystem.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Metadata.Course;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseRepo;

@Service
public class CollegeCourseService {

	@Autowired
	private CollegeCourseRepo ccr;
	
	//find the list of course offered by college
	public List<Course> findCourseByCollegeId(Long collegeId){
		return ccr.findCoursesByCollegeId(collegeId);
	}
	
}
