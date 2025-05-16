package AMS.AttendanceManagementSystem.Entity;

import AMS.AttendanceManagementSystem.Metadata.Semester;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class StudentEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "college_course_department_id", nullable = false)
    private CollegeCourseDepartment collegeCourseDepartment;

    @ManyToOne
    @JoinColumn(name = "semester_metadata_id", nullable = false)
    private Semester semester;
    
    private String rollNumber;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Student getStudent() {
		return student;
	}

	public void setStudent(Student student) {
		this.student = student;
	}

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

	public String getRollNumber() {
		return rollNumber;
	}

	public void setRollNumber(String rollNumber) {
		this.rollNumber = rollNumber;
	}
}
