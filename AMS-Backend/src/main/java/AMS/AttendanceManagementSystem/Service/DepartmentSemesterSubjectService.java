package AMS.AttendanceManagementSystem.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Repo.DepartmentSemesterSubjectRepo;

@Service
public class DepartmentSemesterSubjectService {
	
	@Autowired 
	private DepartmentSemesterSubjectRepo dssr;
	
	//find the list of subject for particular semester of particular department
	public List<Subject> findSubjectsByDepartmentAndSemester(String departmentName, String semesterNumber){
		List<Subject> subjects = dssr.findSubjectsByDepartmentNameAndSemester(departmentName, semesterNumber);
		
		if(subjects.isEmpty()) { 
			throw new RuntimeException(String.format("No Subjects found for %s and %s", departmentName, semesterNumber));
		}
		
		return subjects;
	}
}
