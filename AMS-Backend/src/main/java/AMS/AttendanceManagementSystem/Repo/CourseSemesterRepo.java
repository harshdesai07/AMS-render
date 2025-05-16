package AMS.AttendanceManagementSystem.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Metadata.CourseSemester;
import AMS.AttendanceManagementSystem.Metadata.Semester;


@Repository
public interface CourseSemesterRepo extends JpaRepository<CourseSemester,Long> {
    
	@Query("SELECT s FROM Semester s JOIN CourseSemester cs ON s.id = cs.semester.id JOIN Course c ON cs.course.id = c.id WHERE c.name = :courseName")
	List<Semester> findSemestersByCourseName(String courseName);

	
}