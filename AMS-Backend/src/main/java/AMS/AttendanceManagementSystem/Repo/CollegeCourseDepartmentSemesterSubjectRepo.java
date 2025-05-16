package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartment;
import AMS.AttendanceManagementSystem.Entity.CollegeCourseDepartmentSemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;

@Repository
public interface CollegeCourseDepartmentSemesterSubjectRepo extends JpaRepository<CollegeCourseDepartmentSemesterSubject, Long>{
	   Optional<CollegeCourseDepartmentSemesterSubject> findByCollegeCourseDepartmentAndSemesterAndSubject(
		        CollegeCourseDepartment collegeCourseDepartment,
		        Semester semesterMetadata,
		        Subject subject
		    );   

	   @Query("SELECT c.semester.semesterNumber, c.subject.name " +  
		       "FROM CollegeCourseDepartmentSemesterSubject c " +
		       "WHERE c.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId " +
		       "AND c.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
		       "AND c.collegeCourseDepartment.department.name = :departmentName " +
		       "ORDER BY c.semester.semesterNumber")
		List<Object[]> findSemesterSubjectsByCollegeCourseAndDepartment(
		         Long collegeId,
		         String courseName,
		         String departmentName);
		
		@Query("SELECT c.subject FROM CollegeCourseDepartmentSemesterSubject c " +
		           "WHERE c.collegeCourseDepartment = :collegeCourseDepartment " +
		           "AND c.semester = :semester")
		    List<Subject> findSubjectsByCollegeCourseDepartmentAndSemester(
		            CollegeCourseDepartment collegeCourseDepartment,
		            Semester semester);
		
		@Query("SELECT COUNT(c) FROM CollegeCourseDepartmentSemesterSubject c " +
			       "WHERE c.collegeCourseDepartment.collegeCourse.college.collegeId = :collegeId " +
			       "AND c.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
			       "AND c.collegeCourseDepartment.department.name = :departmentName")
			Long countSubjectsByCollegeCourseAndDepartment(Long collegeId, String courseName, String departmentName);

}
