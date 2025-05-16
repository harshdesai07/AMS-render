package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import AMS.AttendanceManagementSystem.Entity.Student;

public interface StudentRepo extends JpaRepository<Student,Long> {
	Optional<Student> findByStudentEmail(String studentEmail);
}
