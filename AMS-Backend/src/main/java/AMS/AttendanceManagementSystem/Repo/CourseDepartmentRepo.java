package AMS.AttendanceManagementSystem.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.CourseDepartment;
import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Metadata.Course;

@Repository
public interface CourseDepartmentRepo extends JpaRepository<CourseDepartment, Long>{
	@Query("SELECT d FROM Department d JOIN CourseDepartment cd ON d.id = cd.department.id WHERE cd.course.id = :courseId")
	List<Department> findDepartmentsByCourseId(Long courseId);
	
	List<CourseDepartment> findByCourseAndDepartment(Course course, Department department);
}
