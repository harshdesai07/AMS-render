package AMS.AttendanceManagementSystem.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Dto.ScheduleToFacultyDto;
import AMS.AttendanceManagementSystem.Entity.Faculty;
import AMS.AttendanceManagementSystem.Entity.ScheduleToFaculty;
import AMS.AttendanceManagementSystem.Repo.FacultyRepo;
import AMS.AttendanceManagementSystem.Repo.ScheduleToFacultyRepo;
import jakarta.transaction.Transactional;

@Service
public class ScheduleToFacultyService {
 
	
	@Autowired
	private ScheduleToFacultyRepo sfr;
	
	@Autowired
	private FacultyRepo fr;
	
	@Autowired
	private EmailService es;
	
	
//	function that put the scheduled faculty task in the database
	@Transactional
	public boolean createTask(ScheduleToFacultyDto sfd) {
	    try {
	        // Finding faculty by its id
	        Faculty faculty = fr.findById(sfd.getFacultyId())
	                .orElseThrow(() -> new RuntimeException("Faculty not found with ID: " + sfd.getFacultyId()));

	        // Finding HOD by its id
	        Faculty hod = fr.findById(sfd.getHodId())
	                .orElseThrow(() -> new RuntimeException("HOD not found with ID: " + sfd.getHodId()));

	        // Validating that the fetched faculty is actually an HOD
	        if (!"HOD".equals(hod.getFacultyDesignation())) {
	            throw new RuntimeException("Invalid designation: Faculty ID " + sfd.getHodId() + " is not an HOD. Found: " + hod.getFacultyDesignation());
	        }

	        // Setting values from DTO into entity object
	        ScheduleToFaculty sf = new ScheduleToFaculty();
	        sf.setAssignedBy(hod);
	        sf.setAssignedTo(faculty);
	        sf.setAssignedDate(LocalDateTime.now());
	        sf.setDueDate(sfd.getDueDate());
	        sf.setDescription(sfd.getDescription());
	        sf.setStatus(sfd.getStatus());
	        sf.setTitle(sfd.getTitle());

	        // Saving the task in the database
	        sfr.save(sf);
	        
	        //send email to notify faculty about new task
	        es.sendTaskAssignmentNotification(faculty.getFacultyEmail(), 
	        		faculty.getFacultyName(), 
	        		hod.getFacultyName(), 
	        		hod.getCollegeCourseDepartment().getDepartment().getName(), 
	        		hod.getCollegeCourseDepartment().getCollegeCourse().getCollege().getCollegeName(), 
	        		hod.getCollegeCourseDepartment().getCollegeCourse().getCollege().getEmail(), 
	        		"New Task Assigned – Please Review");
	        
	        return true;

	    } catch (Exception e) {
	        // Logs the actual reason for failure
	        System.err.println("Error occurred while creating task: " + e.getMessage());
	        e.printStackTrace();
	        return false;
	    }
	}

	
//	function to update status of a task
	@Transactional
	public void updateStatus(Long scheduleId,String status) {
		
//		finding the task by Id that exists or not
		ScheduleToFaculty sf=sfr.findById(scheduleId).
		 orElseThrow(() -> new RuntimeException("No Task found with ID: "+scheduleId));	
		
//		setting the updated status
		sf.setStatus(status);
		
//		saving the updated values in the database
		sfr.save(sf);
		
	}
	
	
//	function to get all task of a particular faculty
	
	public List<ScheduleToFaculty> getAssignToFacultyTask(Long facultyId) {
		
//		check faculty exist or not
		Faculty f=fr.findById(facultyId). 
				orElseThrow(() -> new RuntimeException("Faculty not found with ID: "+facultyId));
		
		List<ScheduleToFaculty> ans=new ArrayList<>();
		
//		check the faculty should not be hod
		if(f.getFacultyDesignation()=="HOD") return ans;
		
//		now finding from db list all task of a particular faculty by its id
		ans=sfr.findByAssignedToFacultyId(facultyId);
		
		return ans;
		
	}
	
	
//	function to get all task assign by the hod
	
	public List<ScheduleToFaculty> getAssignByHodTask(Long facultyId) {
		
//		check Hod exist or not
		Faculty f=fr.findById(facultyId). 
				orElseThrow(() -> new RuntimeException("Faculty not found with ID: "+facultyId));
		
		List<ScheduleToFaculty> ans=new ArrayList<>();
		
//		check the faculty should  be hod
		if(!f.getFacultyDesignation().equals("HOD")) return ans;
		
//		now finding from db list all task assign by particular Hod by its id
		ans=sfr.findByAssignedByFacultyId(facultyId);
		
		return ans;
		
	}
	
//	function to delete a particular task (Done only by the Hod)
	@Transactional
	public void deleteTask(Long scheduleId) {
//		finding the task by Id that exists or not
		sfr.findById(scheduleId).
		 orElseThrow(() -> new RuntimeException("No Task found with ID: "+scheduleId));	
         
//		now delete this task
		sfr.deleteById(scheduleId);
		
	}
	
	
	
}