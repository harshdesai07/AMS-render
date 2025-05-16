package AMS.AttendanceManagementSystem.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Dto.FacultyAssignmentDto;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.FacultyAssignment;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyAssignmentRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterRepo;
import AMS.AttendanceManagementSystem.Repo.SubjectRepo;
import jakarta.transaction.Transactional;

@Service
public class FacultyAssignmentService {
    
	@Autowired
	FacultyAssignmentRepo far;
	
	@Autowired
	FacultyRepo fr;
	
	@Autowired
	CollegeCourseDepartmentSemesterSubjectRepo ccdssr;
	
	@Autowired
	SubjectRepo sr;
	
	@Autowired
	SemesterRepo semr;
	
	@Transactional
	public void assignSubToFaculty(FacultyAssignmentDto fad) {
		
		Faculty f=fr.findById(fad.getFacultyId()).
				orElseThrow(()->new RuntimeException("No faculty Found"));
		
		Subject s=sr.findByName(fad.getSubject()).
				orElseThrow(()->new RuntimeException("No subject Found"));
		
		Semester sem=semr.findBysemesterNumber(fad.getSemester()).
				orElseThrow(()->new RuntimeException("No semester Found"));
		
		CollegeCourseDepartmentSemesterSubject ccdss=ccdssr.findByCollegeCourseDepartmentAndSemesterAndSubject(f.getCollegeCourseDepartment(), sem, s).
				orElseThrow(()->new RuntimeException("No semester or no subject found"));
		
		
		FacultyAssignment fa = new FacultyAssignment();
		
		fa.setFaculty(f);
		
		fa.setCollegeCourseDepartmentSemesterSubject(ccdss);
		
		far.save(fa);
		
	}
	
	public List<Subject> subjectsTaughtByAFaculty(Long facultyId, String courseName, String departmentName, String semester){
		return far.findSubjectsByFacultyAndNames(facultyId, courseName, departmentName, semester);
	}
	
}