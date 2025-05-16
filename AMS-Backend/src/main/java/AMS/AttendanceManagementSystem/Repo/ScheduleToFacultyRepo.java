package AMS.AttendanceManagementSystem.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.ScheduleToFaculty;


@Repository
public interface ScheduleToFacultyRepo extends JpaRepository<ScheduleToFaculty, Long> {
    
	List<ScheduleToFaculty> findByAssignedToFacultyId(Long facultyId);
	
    List<ScheduleToFaculty> findByAssignedByFacultyId(Long facultyId);
    
    Long countByAssignedToFacultyIdAndStatus(Long facultyId, String status);

}