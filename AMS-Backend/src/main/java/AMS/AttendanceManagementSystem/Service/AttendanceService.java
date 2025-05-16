package AMS.AttendanceManagementSystem.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Dto.AttendanceDto;
import AMS.AttendanceManagementSystem.Entity.Attendance;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.AttendanceRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import AMS.AttendanceManagementSystem.Repo.SubjectRepo;
import jakarta.transaction.Transactional;

@Service
public class AttendanceService {

		@Autowired
		private AttendanceRepo ar;
		
		@Autowired
		private StudentEnrollmentRepo ser;
		
		@Autowired
		private SubjectRepo sr;
		
		@Autowired
		private FacultyRepo fr;
		
		@Autowired
		private SemesterRepo semr;
		
		@Autowired
		private CollegeCourseDepartmentSemesterSubjectRepo ccdssr;
		
		@Autowired
		private EmailService es;
		
		@Transactional
		public void saveAttendance(List<AttendanceDto> ad, Long facultyId) {
			for(AttendanceDto dto: ad) {
				//1. find student enrollment object by student id
				StudentEnrollment se = ser.findByStudentId(dto.getStudentId())
						.orElseThrow(() -> new RuntimeException("StudentEnrollment not found for student id: "+dto.getStudentId()));
				
				//2. find Subject by subjectName
				Subject subject = sr.findByName(dto.getSubject())
						.orElseThrow(() -> new RuntimeException("No subject found for subject name: "+dto.getSubject()));
				
				//3. assign values to attendance entity
				Attendance attendance = new Attendance();
				
				attendance.setAttendanceDate(LocalDate.now());
				attendance.setStudentEnrollment(se);
				attendance.setSubject(subject);
				attendance.setStatus(dto.getStatus());
				
				//4. find faculty by facultyId
				Faculty faculty = fr.findById(facultyId)
						.orElseThrow(() -> new RuntimeException("Faculty not found with id: "+facultyId));
				
				//5.send email
				es.sendStudentAttendanceStatus(se.getStudent().getStudentEmail(), 
						se.getStudent().getStudentName(), 
						subject.getName(),
						se.getCollegeCourseDepartment().getDepartment().getName(), 
						LocalDate.now().toString(), 
						dto.getStatus().toString(), 
						faculty.getFacultyName(), 
						se.getCollegeCourseDepartment().getCollegeCourse().getCollege().getCollegeName(), 
						"Attendance Status");
				
				
				//5. persist the data
				ar.save(attendance);
				
				
			}
		}
		
//		function to count the attendance of the student of particular subject
		
		public List<List<String>> countAttendance(Long studentId,String semester) {
			
			//1. find student enrollment object by student id
			StudentEnrollment se = ser.findByStudentId(studentId)
					.orElseThrow(() -> new RuntimeException("StudentEnrollment not found for student id: "+studentId));
			
//			finding CollegeCourseDepartment by StudentEnrollment object
			  CollegeCourseDepartment ccd=se.getCollegeCourseDepartment();
			  
//			  finding semester object with semester number which is in string
			  Semester sem=semr.findBysemesterNumber(semester)
					  .orElseThrow(() -> new RuntimeException("No Semester  found for Semester: "+semester));
		  
//			  getting the required subject list for counting attendance 
			  
			  List<Subject> sub=ccdssr.findSubjectsByCollegeCourseDepartmentAndSemester(ccd, sem);
			  
//			  list of list returning the result
			  
			  List<List<String>> res=new ArrayList<>();
			  
//			  counting the attendance
			  for(Subject subject:sub) {
				  
				  ArrayList<String> al=new ArrayList<>();
				  al.add(subject.getName());
				  Long total=ar.countTotalAttendanceByStudentAndSubject(studentId,subject.getId());
				  
				  Long present=ar.countPresentAttendanceByStudentAndSubject(studentId, subject.getId());
				  
				  al.add(""+total);
				  al.add(""+present);
				  
				  res.add(al);
				  
			  }
			  
			  return res;
			  
		}
}
