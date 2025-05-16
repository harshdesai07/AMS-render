package AMS.AttendanceManagementSystem.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import AMS.AttendanceManagementSystem.Entity.Assignment;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Metadata.Semester;

public interface AssignmentRepo extends JpaRepository<Assignment, Long> {
	List<Assignment> findByFaculty_FacultyId(Long facultyId);
	
	 List<Assignment> findByCollegeCourseDepartmentAndSemester(
		        CollegeCourseDepartment collegeCourseDepartment,
		        Semester semester
		    );

}

