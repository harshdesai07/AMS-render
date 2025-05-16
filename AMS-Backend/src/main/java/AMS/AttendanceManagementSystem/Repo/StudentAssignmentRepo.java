package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import AMS.AttendanceManagementSystem.Entity.StudentAssignment;
import AMS.AttendanceManagementSystem.Enums.AssignmentStatus;

public interface StudentAssignmentRepo extends JpaRepository<StudentAssignment, Long> {
	Optional<StudentAssignment> findByAssignment_IdAndStudent_StudentId(Long assignmentId, Long studentId);
	
	List<StudentAssignment> findByStudent_StudentId(Long studentId);
    
	List<StudentAssignment> findByAssignmentId(Long assignmentId);
	
	List<StudentAssignment> findByAssignmentIdAndStatus(Long assignmentId, AssignmentStatus status);
	
	@Query("SELECT COUNT(sa) FROM StudentAssignment sa " +
		       "WHERE sa.assignment.faculty.id = :facultyId AND sa.status = :status")
		Long countSubmissionsByFaculty(Long facultyId, AssignmentStatus status);

	
	
}