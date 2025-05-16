package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import AMS.AttendanceManagementSystem.Entity.Subject;

public interface SubjectRepo extends JpaRepository<Subject, Long>{
	Optional<Subject> findByName(String name);
}
