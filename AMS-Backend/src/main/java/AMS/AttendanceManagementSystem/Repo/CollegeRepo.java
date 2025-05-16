package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.College;


@Repository
public interface CollegeRepo extends JpaRepository<College,Long>   {
	Optional<College> findByEmail(String email);
	Optional<College> findByCollegeName(String collegeName);
	College findByEmailAndPassword(String collegeEmail, String password);
}
