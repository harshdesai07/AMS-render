package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.College;
import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Metadata.Course;

@Repository
public interface CollegeCourseRepo extends JpaRepository<CollegeCourse, Long> {
	 @Query("SELECT c FROM Course c WHERE c.id IN (SELECT cc.course.id FROM CollegeCourse cc WHERE cc.college.id = :collegeId)")
	 List<Course> findCoursesByCollegeId(Long collegeId);
	 
	 Optional<CollegeCourse> findByCollegeAndCourse(College college, Course course);
	 
	 Optional<CollegeCourse> findByCourse(Course course);
	 
}
