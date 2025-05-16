package AMS.AttendanceManagementSystem.Repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.SemesterSubject;
import AMS.AttendanceManagementSystem.Entity.Subject;
import AMS.AttendanceManagementSystem.Metadata.Semester;

@Repository
public interface SemesterSubjectRepo extends JpaRepository<SemesterSubject, Long> {
	Optional<SemesterSubject> findBySemesterAndSubject(Semester semester, Subject subject);
}
