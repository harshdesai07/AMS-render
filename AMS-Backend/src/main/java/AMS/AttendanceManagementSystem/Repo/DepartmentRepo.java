package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import AMS.AttendanceManagementSystem.Entity.Department;

public interface DepartmentRepo extends JpaRepository<Department, Long> {
	Optional<Department> findByName(String name);
}
