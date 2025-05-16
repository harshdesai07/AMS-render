package AMS.AttendanceManagementSystem.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.CourseSemesterRepo;

@Service
public class CourseSemesterService {

	@Autowired
	CourseSemesterRepo csr;
	
	public List<Semester> findSemesterByCourseName(String courseName){
		
		  return csr.findSemestersByCourseName(courseName);
		  
		
	}
	
}