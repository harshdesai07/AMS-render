package AMS.AttendanceManagementSystem.Entity;


import java.time.LocalDate;
import java.time.LocalDateTime;

import AMS.AttendanceManagementSystem.Enums.AttendanceStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
	    name = "attendance",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"studentEnrollment_id", "subject_id", "attendanceDate"})
	    }
	)
public class Attendance {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "studentEnrollment_id", nullable = false)
	private StudentEnrollment studentEnrollment;
	
	@ManyToOne
	@JoinColumn(name = "subject_id", nullable = false)
	private Subject subject;
	
	 @Column(name = "attendanceDate", nullable = false)
	 private LocalDate attendanceDate;
	 
	 @Column(nullable = false, updatable = false)
	 private LocalDateTime createdAt;
	 
	 @Column(nullable = false)
	 @Enumerated(EnumType.STRING)
	 private AttendanceStatus status;
	 
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public StudentEnrollment getStudentEnrollment() {
		return studentEnrollment;
	}


	public void setStudentEnrollment(StudentEnrollment studentEnrollment) {
		this.studentEnrollment = studentEnrollment;
	}


	public Subject getSubject() {
		return subject;
	}


	public void setSubject(Subject subject) {
		this.subject = subject;
	}


	public LocalDate getAttendanceDate() {
		return attendanceDate;
	}


	public void setAttendanceDate(LocalDate attendanceDate) {
		this.attendanceDate = attendanceDate;
	}


	public LocalDateTime getCreatedAt() {
		return createdAt;
	}


	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}


	public AttendanceStatus getStatus() {
		return status;
	}


	public void setStatus(AttendanceStatus status) {
		this.status = status;
	}
    
    
}
