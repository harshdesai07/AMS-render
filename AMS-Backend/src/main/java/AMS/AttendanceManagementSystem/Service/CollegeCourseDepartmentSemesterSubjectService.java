package AMS.AttendanceManagementSystem.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Dto.SubjectDto;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Entity.DepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.SemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.CollegeCourseDepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.DepartmentSemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterSubjectRepo;
import AMS.AttendanceManagementSystem.Repo.SubjectRepo;
import AMS.AttendanceManagementSystem.utils.ExcelReader;
import jakarta.transaction.Transactional;

@Service
public class CollegeCourseDepartmentSemesterSubjectService {

	@Autowired
	private CollegeCourseDepartmentSemesterSubjectRepo ccdssr;

	@Autowired
	private FacultyRepo fr;

	@Autowired
	private SubjectRepo sr;

	@Autowired
	private SemesterRepo semr;

	@Autowired
	private SemesterSubjectRepo ssr;

	@Autowired
	private DepartmentSemesterSubjectRepo dssr;

	// save subjects offered by college via excel
	@Transactional
	public void saveSubjects(MultipartFile file, String email) {
		String sheetName = ExcelReader.getExcelSheetName(file); // read sheet name

		List<Map<String, String>> excelData = ExcelReader.readExcelSheet(file, sheetName);
		System.out.println("Excel Data: " + excelData);


		// 1. find faculty by email
		Faculty faculty = fr.findByFacultyEmail(email)
				.orElseThrow(() -> new RuntimeException("faculty not found for email: " + email));

		// 2. find collegeCourseDepartment from faculty
		CollegeCourseDepartment collegeCourseDepartment = faculty.getCollegeCourseDepartment();

		// 3. find department
		Department department = collegeCourseDepartment.getDepartment();

		for (Map<String, String> row : excelData) {
			// 4. find semester
			Semester semester = semr.findBysemesterNumber("semester " + row.get("semester")).orElseThrow(
					() -> new RuntimeException("semester not found with number: " + (row.get("semester"))));

			// 5.set subject
			String sub = row.get("subject name");

			// create the list of subjects
			List<String> subjects = new ArrayList<>();
			if (sub != null && !sub.isBlank()) {
				subjects = Arrays.stream(sub.split(",")).map(String::trim) // this removes all the unwanted spaces
						.filter(s -> !s.isEmpty()) // just in case of extra commas
						.collect(Collectors.toList());
			}

			List<Subject> finalListOfSubjects = new ArrayList<>();

			if (!subjects.isEmpty()) {
				for (String s : subjects) {
					Optional<Subject> os = sr.findByName(s);
					Subject subject;

					if (!os.isPresent()) {
						subject = new Subject();
						subject.setName(s);
						// save in subject table
						subject = sr.save(subject);
					} else {
						subject = os.get();
					}

					finalListOfSubjects.add(subject);

				}
			}

			// 6. save in SemesterSubject
			for (Subject subj : finalListOfSubjects) {
				Optional<SemesterSubject> oss = ssr.findBySemesterAndSubject(semester, subj);
				SemesterSubject semesterSubject;

				if (oss.isPresent()) {
					semesterSubject = oss.get();
				} else {
					semesterSubject = new SemesterSubject();
					semesterSubject.setSemesterMetadata(semester);
					semesterSubject.setSubject(subj);

					// save in SemesterSubject table
					semesterSubject = ssr.save(semesterSubject);
				}
			}

			// 7. save in DepartmentSemesterSubject
			for (Subject subj : finalListOfSubjects) {
				Optional<DepartmentSemesterSubject> odss = dssr.findByDepartmentAndSemesterAndSubject(department,
						semester, subj);
				DepartmentSemesterSubject departmentSemesterSubject;

				if (odss.isPresent()) {
					departmentSemesterSubject = odss.get();
				} else {
					departmentSemesterSubject = new DepartmentSemesterSubject();
					departmentSemesterSubject.setDepartment(department);
					departmentSemesterSubject.setSemesterMetadata(semester);
					departmentSemesterSubject.setSubject(subj);

					departmentSemesterSubject = dssr.save(departmentSemesterSubject);
				}
			}

			// 8. save in CollegeCourseDepartmentSemesterSubject
			for (Subject subj : finalListOfSubjects) {
				Optional<CollegeCourseDepartmentSemesterSubject> occdss = ccdssr
						.findByCollegeCourseDepartmentAndSemesterAndSubject(collegeCourseDepartment, semester, subj);

				if (!occdss.isPresent()) {
					CollegeCourseDepartmentSemesterSubject collegeCourseDepartmentSemesterSubject = new CollegeCourseDepartmentSemesterSubject();
					collegeCourseDepartmentSemesterSubject.setCollegeCourseDepartment(collegeCourseDepartment);
					collegeCourseDepartmentSemesterSubject.setSemesterMetadata(semester);
					collegeCourseDepartmentSemesterSubject.setSubject(subj);

					ccdssr.save(collegeCourseDepartmentSemesterSubject);

				}

			}

		}

	}

	// save subjects via form
	public void saveSubjectsThroughForm(String email, List<SubjectDto> dto) {
		// 1. find faculty by email
		Faculty faculty = fr.findByFacultyEmail(email)
				.orElseThrow(() -> new RuntimeException("faculty not found for email: " + email));

		// 2. find collegeCourseDepartment from faculty
		CollegeCourseDepartment collegeCourseDepartment = faculty.getCollegeCourseDepartment();

		// 3. find department
		Department department = collegeCourseDepartment.getDepartment();

		for (SubjectDto sd : dto) {
			// 4. find semester
			Semester semester = semr.findBysemesterNumber(sd.getSemester())
					.orElseThrow(() -> new RuntimeException("semester not found with number: " + sd.getSemester()));

			// create the list of subjects
			List<Subject> subjects = new ArrayList<>();

			// 5. set subjects for corresponding semester
			for (String s : sd.getSubjects()) {
				Optional<Subject> os = sr.findByName(s);
				Subject subject;

				if (!os.isPresent()) {
					subject = new Subject();
					subject.setName(s);
					// save in subject table
					subject = sr.save(subject);
				} else {
					subject = os.get();
				}

				subjects.add(subject);
			}

			// 6. save in SemesterSubject
			for (Subject subj : subjects) {
				Optional<SemesterSubject> oss = ssr.findBySemesterAndSubject(semester, subj);
				SemesterSubject semesterSubject;

				if (oss.isPresent()) {
					semesterSubject = oss.get();
				} else {
					semesterSubject = new SemesterSubject();
					semesterSubject.setSemesterMetadata(semester);
					semesterSubject.setSubject(subj);

					// save in SemesterSubject table
					semesterSubject = ssr.save(semesterSubject);
				}
			}

			// 7. save in DepartmentSemesterSubject
			for (Subject subj : subjects) {
				Optional<DepartmentSemesterSubject> odss = dssr.findByDepartmentAndSemesterAndSubject(department,
						semester, subj);
				DepartmentSemesterSubject departmentSemesterSubject;

				if (odss.isPresent()) {
					departmentSemesterSubject = odss.get();
				} else {
					departmentSemesterSubject = new DepartmentSemesterSubject();
					departmentSemesterSubject.setDepartment(department);
					departmentSemesterSubject.setSemesterMetadata(semester);
					departmentSemesterSubject.setSubject(subj);

					departmentSemesterSubject = dssr.save(departmentSemesterSubject);
				}
			}

			// 8. save in CollegeCourseDepartmentSemesterSubject
			for (Subject subj : subjects) {
				Optional<CollegeCourseDepartmentSemesterSubject> occdss = ccdssr
						.findByCollegeCourseDepartmentAndSemesterAndSubject(collegeCourseDepartment, semester, subj);

				if (!occdss.isPresent()) {
					CollegeCourseDepartmentSemesterSubject collegeCourseDepartmentSemesterSubject = new CollegeCourseDepartmentSemesterSubject();
					collegeCourseDepartmentSemesterSubject.setCollegeCourseDepartment(collegeCourseDepartment);
					collegeCourseDepartmentSemesterSubject.setSemesterMetadata(semester);
					collegeCourseDepartmentSemesterSubject.setSubject(subj);

					ccdssr.save(collegeCourseDepartmentSemesterSubject);

				}

			}
		}
	}
	
	// find all subjects semester wise for a particular college and department
	public List<SubjectDto> findAllSubjectsBySemester(Long collegeId, String courseName,
			String departmentName) {
			
		// 1. Execute the query to get raw data
	    List<Object[]> rawResults = ccdssr.findSemesterSubjectsByCollegeCourseAndDepartment(
	            collegeId, courseName, departmentName);
	    
	    if(rawResults.isEmpty()) return Collections.emptyList();;
	    
	    // 2. Group by semester name 
	    //key -> semester, value -> subjects
	    Map<String, List<String>> semesterMap = new LinkedHashMap<>();
	    
	    for(Object[] row: rawResults) {
	    	String semesterNumber = (String) row[0]; 
	    	String subjectName = (String) row[1];
	    	
	    	if(semesterMap.containsKey(semesterNumber)) {
	    		List<String> al = semesterMap.get(semesterNumber);
	    		al.add(subjectName);
	    		
	    		semesterMap.put(semesterNumber, al);
	    	}
	    	else {
	    		List<String> al = new ArrayList<>();
	    		al.add(subjectName);
	    		
	    		semesterMap.put(semesterNumber, al);
	    	}
	    	
	    }
	    
	 // 3. Convert to SubjectDto list
	 List<SubjectDto> result = new ArrayList<>();
	 
	   for (Map.Entry<String, List<String>> entry : semesterMap.entrySet()) {
	        SubjectDto dto = new SubjectDto();
	        dto.setSemester(entry.getKey());
	        dto.setSubjects(entry.getValue());
	        result.add(dto);
	    }
	   
	   return result;
	    
	}
	
}
