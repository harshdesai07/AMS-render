package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Metadata.Semester;

@Repository
public interface SemesterRepo extends JpaRepository<Semester, Long>{
	Optional<Semester> findBysemesterNumber(String semesterNumber);
}
