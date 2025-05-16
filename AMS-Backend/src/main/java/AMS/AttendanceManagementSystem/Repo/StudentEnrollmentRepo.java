package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.Student;
import AMS.AttendanceManagementSystem.Entity.StudentEnrollment;

@Repository
public interface StudentEnrollmentRepo extends JpaRepository<StudentEnrollment, Long> {
	@Query("SELECT se FROM StudentEnrollment se WHERE se.student.studentId = :studentId")
	Optional<StudentEnrollment> findByStudentId(Long studentId);
	
	 @Query("SELECT se FROM StudentEnrollment se WHERE se.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId")
	    List<StudentEnrollment> findByCollegeId(Long collegeId);
	 
	  @Query("SELECT se FROM StudentEnrollment se " +
	           "WHERE se.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId " +
	           "AND se.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
	           "AND se.collegeCourseDepartment.department.name = :departmentName")
	    List<StudentEnrollment> findEnrollmentsByCollegeCourseAndDepartment(
	    		Long collegeId,
	            String courseName,
	            String departmentName
	    );
	  
	  @Query("SELECT se FROM StudentEnrollment se " +
	           "JOIN se.collegeCourseDepartment ccd " +
	           "JOIN ccd.collegeCourse.college c " +
	           "JOIN ccd.collegeCourse.course co " +
	           "JOIN ccd.department d " +
	           "WHERE c.id = :collegeId " +
	           "AND co.name = :courseName " +
	           "AND d.name = :departmentName " +
	           "AND se.semester.semesterNumber = :semesterNumber")
	    List<StudentEnrollment> findByCollegeAndCourseAndDepartmentAndSemester(
	            Long collegeId,
	            String courseName,
	            String departmentName,
	            String semesterNumber);
	  
	  @Query("SELECT se.student FROM StudentEnrollment se " +
		       "WHERE se.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId " +
		       "AND se.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
		       "AND se.collegeCourseDepartment.department.name = :departmentName " +
		       "AND se.semester.semesterNumber = :semesterNumber")
		List<Student> findStudentsByCollegeCourseDepartmentAndSemester(
		        Long collegeId,
		        String courseName,
		        String departmentName,
		        String semesterNumber);
	  
	  @Query("SELECT COUNT(se) FROM StudentEnrollment se " +
		       "WHERE se.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId " +
		       "AND se.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
		       "AND se.collegeCourseDepartment.department.name = :departmentName")
		Long countByCollegeAndCourseAndDepartment(Long collegeId, String courseName, String departmentName);
}