package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Metadata.Course;

@Repository
public interface CourseRepo extends JpaRepository<Course, Long>{
	Optional<Course> findByName(String name);
}
