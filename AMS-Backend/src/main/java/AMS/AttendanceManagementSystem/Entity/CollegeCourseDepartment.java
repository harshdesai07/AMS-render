package AMS.AttendanceManagementSystem.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
	    name = "college_course_department",
	    uniqueConstraints = {@UniqueConstraint(columnNames = {"college_course_id", "department_id"})}
	)
public class CollegeCourseDepartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_course_id", nullable = false)
    private CollegeCourse collegeCourse;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CollegeCourse getCollegeCourse() {
		return collegeCourse;
	}

	public void setCollegeCourse(CollegeCourse collegeCourse) {
		this.collegeCourse = collegeCourse;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}
    
    
}