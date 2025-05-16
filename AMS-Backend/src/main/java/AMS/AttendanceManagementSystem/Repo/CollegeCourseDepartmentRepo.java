package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.CollegeCourse;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Department;

@Repository
public interface CollegeCourseDepartmentRepo extends JpaRepository<CollegeCourseDepartment, Long> {
	Optional<CollegeCourseDepartment> findByCollegeCourseAndDepartment(CollegeCourse collegeCourse, Department department);
	
	 @Query("SELECT DISTINCT c.department FROM CollegeCourseDepartment c " +
	           "WHERE c.collegeCourse.college.id = :collegeId " +
	           "AND c.collegeCourse.course.name = :courseName")
	    List<Department> findDepartmentsByCourseNameAndCollegeId(String courseName, Long collegeId);
	    
	 @Query("SELECT DISTINCT ccd.collegeCourse.course.name, ccd.department.name " +
	           "FROM CollegeCourseDepartment ccd " +
	           "WHERE ccd.collegeCourse.college.collegeId = :collegeId " +
	           "ORDER BY ccd.collegeCourse.course.name, ccd.department.name")
	    List<Object[]> findCoursesAndDepartmentsByCollegeId(Long collegeId);
	    
	 // Query 1: Count distinct courses by collegeId
	    @Query("SELECT COUNT(DISTINCT ccd.collegeCourse.course.id) " +
	           "FROM CollegeCourseDepartment ccd " +
	           "WHERE ccd.collegeCourse.college.collegeId = :collegeId")
	    Long countDistinctCoursesByCollegeId(Long collegeId);

	    // Query 2: Count distinct departments by collegeId
	    @Query("SELECT COUNT(DISTINCT ccd.department.id) " +
	           "FROM CollegeCourseDepartment ccd " +
	           "WHERE ccd.collegeCourse.college.collegeId = :collegeId")
	    Long countDistinctDepartmentsByCollegeId(Long collegeId);
}
