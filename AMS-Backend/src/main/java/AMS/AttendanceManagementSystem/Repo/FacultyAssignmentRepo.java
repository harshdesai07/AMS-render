package AMS.AttendanceManagementSystem.Repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.FacultyAssignment;
import AMS.AttendanceManagementSystem.Entity.Subject;

@Repository
public interface FacultyAssignmentRepo extends JpaRepository<FacultyAssignment, Long>{
	Optional<FacultyAssignment> findByFacultyFacultyId(Long id);
	
	 @Query("SELECT fa.collegeCourseDepartmentSemesterSubject.subject FROM FacultyAssignment fa " +
	           "WHERE fa.faculty.facultyId = :facultyId " +
	           "AND fa.collegeCourseDepartmentSemesterSubject.collegeCourseDepartment.collegeCourse.course.name = :courseName " +
	           "AND fa.collegeCourseDepartmentSemesterSubject.collegeCourseDepartment.department.name = :departmentName " +
	           "AND fa.collegeCourseDepartmentSemesterSubject.semester.semesterNumber = :semesterNumber")
	    List<Subject> findSubjectsByFacultyAndNames(
	             Long facultyId,
	             String courseName,
	             String departmentName,
	             String semesterNumber);

}
