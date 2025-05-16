package AMS.AttendanceManagementSystem.Entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long facultyId;
    
    private String facultyPassword;
    private String facultyDesignation;
    private String facultyEmail;
    private String facultyName;
    private String facultyNumber;
    
    @ManyToOne
	@JoinColumn(name = "college_course_department_id", nullable = false)
	private CollegeCourseDepartment collegeCourseDepartment;
    
    @OneToMany(mappedBy = "faculty", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FacultyAssignment> facultyAssignments = new ArrayList<>();
    
    
    // Constructors
    public Faculty() {
        // Default constructor
    }
    
    
    // Getters and Setters
   
    
    public String getFacultyPassword() {
        return facultyPassword;
    }
    
    public Long getFacultyId() {
		return facultyId;
	}

	public void setFacultyId(Long facultyId) {
		this.facultyId = facultyId;
	}

	public CollegeCourseDepartment getCollegeCourseDepartment() {
		return collegeCourseDepartment;
	}

	public void setCollegeCourseDepartment(CollegeCourseDepartment collegeCourseDepartment) {
		this.collegeCourseDepartment = collegeCourseDepartment;
	}

	public void setFacultyPassword(String facultyPassword) {
        this.facultyPassword = facultyPassword;
    }
    
    public String getFacultyDesignation() {
        return facultyDesignation;
    }
    
    public void setFacultyDesignation(String facultyDesignation) {
        this.facultyDesignation = facultyDesignation;
    }
    
    public String getFacultyEmail() {
        return facultyEmail;
    }
    
    public void setFacultyEmail(String facultyEmail) {
        this.facultyEmail = facultyEmail;
    }
    
    public String getFacultyName() {
        return facultyName;
    }
    
    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }
    
    public String getFacultyNumber() {
        return facultyNumber;
    }
    
    public void setFacultyNumber(String facultyNumber) {
        this.facultyNumber = facultyNumber;
    }
    
    
    
}