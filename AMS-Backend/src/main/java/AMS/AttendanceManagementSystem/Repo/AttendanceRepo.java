package AMS.AttendanceManagementSystem.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import AMS.AttendanceManagementSystem.Entity.Attendance;

@Repository
public interface AttendanceRepo extends JpaRepository<Attendance, Long>{
	// Query 1: Total attendance count by studentId and subjectId
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.studentEnrollment.student.studentId = :studentId AND a.subject.id = :subjectId")
    Long countTotalAttendanceByStudentAndSubject(
        Long studentId,
        Long subjectId
    );

    // Query 2: Total PRESENT attendance count by studentId and subjectId
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.studentEnrollment.student.studentId = :studentId AND a.subject.id = :subjectId AND a.status = AMS.AttendanceManagementSystem.Enums.AttendanceStatus.PRESENT")
    Long countPresentAttendanceByStudentAndSubject(
        Long studentId,
        Long subjectId
    );
}
