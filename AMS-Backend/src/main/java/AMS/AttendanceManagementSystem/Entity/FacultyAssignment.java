package AMS.AttendanceManagementSystem.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class FacultyAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @ManyToOne
    @JoinColumn(name = "college_course_department_semester_subject_id", nullable = false)
    private CollegeCourseDepartmentSemesterSubject collegeCourseDepartmentSemesterSubject;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Faculty getFaculty() {
		return faculty;
	}

	public void setFaculty(Faculty faculty) {
		this.faculty = faculty;
	}

	public CollegeCourseDepartmentSemesterSubject getCollegeCourseDepartmentSemesterSubject() {
		return collegeCourseDepartmentSemesterSubject;
	}

	public void setCollegeCourseDepartmentSemesterSubject(CollegeCourseDepartmentSemesterSubject collegeCourseDepartmentSemesterSubject) {
		this.collegeCourseDepartmentSemesterSubject = collegeCourseDepartmentSemesterSubject;
	}
    
    
}

