package AMS.AttendanceManagementSystem.Entity;

import AMS.AttendanceManagementSystem.Metadata.Semester;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class SemesterSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "semester_metadata_id", nullable = false)
    private Semester semester;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Semester getSemesterMetadata() {
		return semester;
	}

	public void setSemesterMetadata(Semester semester) {
		this.semester = semester;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}
    
}
