package AMS.AttendanceManagementSystem.Metadata;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Semester {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String semesterNumber;
    
 // Getters and Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSemesterNumber() {
		return semesterNumber;
	}

	public void setSemesterNumber(String semesterNumber) {
		this.semesterNumber = semesterNumber;
	}
}
