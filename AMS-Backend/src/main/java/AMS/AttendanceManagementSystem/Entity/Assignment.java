package AMS.AttendanceManagementSystem.Entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import AMS.AttendanceManagementSystem.Metadata.Semester;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "assignments")
public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(name = "assign_date", nullable = false)
    private LocalDate assignDate;
    
    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;
    
    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;
    
    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentAssignment> studentAssignments = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "college_course_department_id", nullable = false)
    private CollegeCourseDepartment collegeCourseDepartment;

    @ManyToOne
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;
    
	public CollegeCourseDepartment getCollegeCourseDepartment() {
		return collegeCourseDepartment;
	}

	public void setCollegeCourseDepartment(CollegeCourseDepartment collegeCourseDepartment) {
		this.collegeCourseDepartment = collegeCourseDepartment;
	}

	public Semester getSemester() {
		return semester;
	}

	public void setSemester(Semester semester) {
		this.semester = semester;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public LocalDate getAssignDate() {
		return assignDate;
	}

	public void setAssignDate(LocalDate assignDate) {
		this.assignDate = assignDate;
	}

	public LocalDate getSubmissionDate() {
		return submissionDate;
	}

	public void setSubmissionDate(LocalDate submissionDate) {
		this.submissionDate = submissionDate;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public List<StudentAssignment> getStudentAssignments() {
		return studentAssignments;
	}

	public void setStudentAssignments(List<StudentAssignment> studentAssignments) {
		this.studentAssignments = studentAssignments;
	}

	public Assignment(String title, LocalDate assignDate, LocalDate submissionDate, Faculty faculty,
			 CollegeCourseDepartment collegeCourseDepartment,
			Semester semester) {
		super();
		this.title = title;
		this.assignDate = assignDate;
		this.submissionDate = submissionDate;
		this.faculty = faculty;
		this.collegeCourseDepartment = collegeCourseDepartment;
		this.semester = semester;
	}

	public Assignment() {
	    // default constructor
	}

}
