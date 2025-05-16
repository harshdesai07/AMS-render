package AMS.AttendanceManagementSystem.Entity;

import java.time.LocalDate;

import AMS.AttendanceManagementSystem.Enums.AssignmentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_assignments")
public class StudentAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "submitted_date")
    private LocalDate submittedDate;
    
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Assignment getAssignment() {
		return assignment;
	}

	public void setAssignment(Assignment assignment) {
		this.assignment = assignment;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

	public LocalDate getSubmittedDate() {
		return submittedDate;
	}

	public void setSubmittedDate(LocalDate submittedDate) {
		this.submittedDate = submittedDate;
	}

	public AssignmentStatus getStatus() {
		return status;
	}

	public void setStatus(AssignmentStatus status) {
		this.status = status;
	}

	public StudentAssignment(Assignment assignment, Student student, LocalDate submittedDate,
			AssignmentStatus status) {
		super();
		this.assignment = assignment;
		this.student = student;
		this.submittedDate = submittedDate;
		this.status = status;
	}
	
	public StudentAssignment() {
		//default constructor
	}
    
}

