package AMS.AttendanceManagementSystem.Service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import AMS.AttendanceManagementSystem.Dto.AssignmentDto;
import AMS.AttendanceManagementSystem.Entity.Assignment;
import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentAssignment;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;
import AMS.AttendanceManagementSystem.Enums.AssignmentStatus;
import AMS.AttendanceManagementSystem.Enums.FileContext;
import AMS.AttendanceManagementSystem.Enums.Role;
import AMS.AttendanceManagementSystem.Metadata.CloudFileMetadata;
import AMS.AttendanceManagementSystem.Metadata.Semester;
import AMS.AttendanceManagementSystem.Repo.AssignmentRepo;
import AMS.AttendanceManagementSystem.Repo.CloudFileMetadaRepo;
import AMS.AttendanceManagementSystem.Repo.CollegeRepo;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.SemesterRepo;
import AMS.AttendanceManagementSystem.Repo.StudentAssignmentRepo;
import AMS.AttendanceManagementSystem.Repo.StudentEnrollmentRepo;
import jakarta.transaction.Transactional;

@Service
public class AssignmentService {
    @Autowired
    private AssignmentRepo assignmentRepository;

    @Autowired
    private FacultyRepo facultyRepository;

    @Autowired
    private StudentAssignmentRepo studentAssignmentRepository;

    @Autowired
    private StudentEnrollmentRepo ser;
    
    @Autowired
    private CloudFileMetadaRepo cfmr;
    
    @Autowired
    private CollegeRepo cr;
    
    @Autowired
    private SemesterRepo semesterRepo;
    

    @Autowired
    private CloudinaryService cloudinaryService; // Inject Cloudinary service
    
    @Autowired
    private EmailService es;

    // Save assignments in db
    @Transactional
    public void createAssignment(AssignmentDto dto, MultipartFile file, String source) {

    	Long assignmentId = null;
    	
    	if(source.equals("FACULTY")) {
    		Faculty faculty  = facultyRepository.findById(dto.getId())
	            .orElseThrow(() -> new RuntimeException("Faculty not found for id: "+dto.getId()));
    		
    		Semester semester = semesterRepo.findBysemesterNumber(dto.getSemester())
    				.orElseThrow(() -> new RuntimeException("Semester not found for semesterNumber :"+dto.getSemester()));
	    	
	    	 String course = faculty.getCollegeCourseDepartment().getCollegeCourse().getCourse().getName();
	         String department = faculty.getCollegeCourseDepartment().getDepartment().getName();
	         
	         Assignment assignment = new Assignment(dto.getTitle(),
	         		LocalDate.now(),
	         		dto.getSubmissionDate(),
	         		faculty,
	         		faculty.getCollegeCourseDepartment(),
	         		semester);
	         
	         assignment = assignmentRepository.save(assignment);
	         
	         assignmentId = assignment.getId();
	         
	      // Initialize student assignments for all students in the course
	         initializeStudentAssignments(assignment, course, department, dto.getSemester(), dto.getCollegeId(), faculty.getFacultyName());
	         
    	}else {

    		assignmentId = dto.getAssignmentId();
    		
    		StudentAssignment studentAssignment = studentAssignmentRepository.findByAssignment_IdAndStudent_StudentId(dto.getAssignmentId(), dto.getId())
    				.orElseThrow(() -> new RuntimeException("StudentAssignment not found"));
    		
    		studentAssignment.setStatus(AssignmentStatus.valueOf("SUBMITTED"));
    		studentAssignment.setSubmittedDate(LocalDate.now());
    		
    		studentAssignmentRepository.save(studentAssignment);
    		
    	}

        // Define the folder for storing assignments in Cloudinary
        String folder = "ams/" + ((source.equals("FACULTY")) ? "faculty_assignments" : "student_assignments");

        // Upload the file and get Cloudinary public ID as response
        Map<String,Object> cloudinaryResponse = null;
        try {
            cloudinaryResponse = cloudinaryService.uploadFile(file, folder);
        } catch (Exception e) {
           
            throw new RuntimeException("File upload failed. Please try again later.");
        } 
        
     // Get the version safely
        Object versionObj = cloudinaryResponse.get("version");

        // Check if it's an Integer or Long and handle accordingly
        Long version = null;
        if (versionObj instanceof Integer) {
            version = ((Integer) versionObj).longValue();  // Convert Integer to Long
        } else if (versionObj instanceof Long) {
            version = (Long) versionObj;  // Directly cast if it's already Long
        }
        
        
        saveMetaData(cloudinaryResponse.get("publicId").toString(),
        		cloudinaryResponse.get("fileName").toString(),
        		version,
        		source,
        		dto.getId(),
        		assignmentId);
      
    }

    // Initialize student assignments
    private void initializeStudentAssignments(Assignment assignment, String courseName, String departmentName, String semester, Long collegeId, String facultyName) {
        College college = cr.findById(collegeId)
        		.orElseThrow(() -> new RuntimeException("college not found for college id: "+ collegeId));
    	
    	List<Student> students = ser.findStudentsByCollegeCourseDepartmentAndSemester(collegeId, courseName, departmentName, semester);

        if(students == null || students.isEmpty()) {
        	 throw new RuntimeException("Students list is null or empty");
        }
        
        students.forEach(student -> {
            StudentAssignment studentAssignment = new StudentAssignment();
            studentAssignment.setAssignment(assignment);
            studentAssignment.setStudent(student);
            studentAssignment.setStatus(AssignmentStatus.valueOf("PENDING"));
            studentAssignmentRepository.save(studentAssignment);
            
            //send email to students about assignments
            es.sendAssignmentNotification(student.getStudentEmail(), 
            		student.getStudentName(), 
            		facultyName, 
            		assignment.getTitle(), 
            		courseName, 
            		assignment.getSubmissionDate().toString(), 
            		college.getCollegeName(), 
            		college.getEmail(), 
            		"Assignment Notification");
        });
    }

    // Get all assignments by faculty ID
    public List<Assignment> getAssignmentsByFaculty(Long facultyId) {
        return assignmentRepository.findByFaculty_FacultyId(facultyId);
    }

 // Method to generate the signed URL for downloading the assignment file
    public String generateDownloadUrl(Long assignmentId, String source, Long studentId) {
    	
        // Get the metadata associated with the faculty or student assignment based on the assignment ID
        CloudFileMetadata metadata = null;
        
        if(source.equals("FACULTY")) {
        	metadata = cfmr.findByUploadedByIdAndUploadedForIdAndUploadedForType(studentId, assignmentId, FileContext.STUDENT_ASSIGNMENT);
        }
        else {
        	metadata = cfmr.findByUploadedForIdAndUploadedForType(
                    assignmentId, FileContext.FACULTY_ASSIGNMENT);
        }
        
        // If metadata is not found, throw an error or handle accordingly
        if (metadata == null) {
            throw new RuntimeException("File metadata not found for assignmentId: " + assignmentId);
        }
        
        // Generate and return the download URL for the assignment file
        return cloudinaryService.getDownloadUrl(metadata.getPublicId(), metadata.getVersion());
    }
    
    //save meta data of uploaded file
    private void saveMetaData(String publicId, String fileName, Long version, String source, Long id, Long assignmentId) {
    	Role role = source.equals("FACULTY") ?  Role.FACULTY : Role.STUDENT;
    	FileContext fc = source.equals("FACULTY") ? FileContext.FACULTY_ASSIGNMENT : FileContext.STUDENT_ASSIGNMENT;
    	
    	// Save details of file metadata
        CloudFileMetadata metaData = new CloudFileMetadata(
        	publicId,
            version,
            fileName,
            role, // uploadedByType
            fc, // uploadedForType 
            id, // uploadedById
            assignmentId // uploadedForId (the specific assignment ID this file is related to)
        );
        
        cfmr.save(metaData);
    }
    
    //find the list of all assignments based on source(Faculty or Student)
    public List<Map<String,Object>> findAllAssignments(Long id, String source){
    	List<Map<String,Object>> response = new ArrayList<>();
    	
    	if(source.equals("FACULTY")) {
    		//1. find the list of assignments uploaded by faculty by faculty id
        	List<Assignment> assignments =  assignmentRepository.findByFaculty_FacultyId(id);
        	
        	if(assignments == null || assignments.isEmpty()) {
    			throw new RuntimeException("Assignments is null or empty");
    		}
        	
        	//2. find the list of solution assignments uploaded by student by assignment id
        	for(Assignment a: assignments) {
        		List<StudentAssignment> studentAssignments = studentAssignmentRepository.findByAssignmentIdAndStatus(a.getId(), AssignmentStatus.SUBMITTED);

        		if(studentAssignments == null) {
        			throw new RuntimeException("studentAssignment is null");
        		}
        		
        		if(!studentAssignments.isEmpty()) {
        			for(StudentAssignment sa: studentAssignments) {
            			Map<String,Object> map = new HashMap<>();
            			
            			Student student = sa.getStudent();
            			
            			StudentEnrollment se = ser.findByStudentId(student.getStudentId())
            					.orElseThrow(() -> new RuntimeException("No studentEnrollment found or student id: "+student.getStudentId()));
            			
            			String date = (sa.getSubmittedDate() != null) ? sa.getSubmittedDate().toString() : "Not Submitted Yet";
            			//creating response
            			map.put("name", student.getStudentName());
            			map.put("rollNumber", se.getRollNumber());
            			map.put("assignmentName", a.getTitle());
            			map.put("assignmentId", a.getId());
            			map.put("date", date);
            			map.put("semester", se.getSemester().getSemesterNumber());
            			map.put("status", sa.getStatus().toString());
            			map.put("studentId", student.getStudentId());
            			
            			response.add(map);
            			
            		}
        		}
        	}
    	}
    	else {
    		//1. find studentEnrollment by student id
    		StudentEnrollment se = ser.findByStudentId(id)
    				.orElseThrow(() -> new RuntimeException("SteudentEnrollment not found for student id: "+id));
    		
    		//2. find semester 
    		Semester semester = se.getSemester();
    		
    		//3. find list of assignments upload by faculty for particular semester
    		List<Assignment> assignments = assignmentRepository.findByCollegeCourseDepartmentAndSemester(se.getCollegeCourseDepartment(), semester);
    		
    		if(assignments == null || assignments.isEmpty()) {
    			throw new RuntimeException("list of assignments is empty or null");
    		}
    		
    		//4. create response
    		for(Assignment a: assignments) {
    			Map<String, Object> map = new HashMap<>();
    			
    			//5. find the status, pending or submitted(student assignment)
    			StudentAssignment sa = studentAssignmentRepository.findByAssignment_IdAndStudent_StudentId(a.getId(), id)
    					.orElseThrow(() -> new RuntimeException("Student assignment not found for: "+id));
    			
    			map.put("assignmentId", a.getId());
    			map.put("assignmentName", a.getTitle());
    			map.put("date", a.getSubmissionDate().toString());
    			map.put("status", sa.getStatus().toString());
    			
    			response.add(map);
    		}
    	}

    	return response;
    }

}
