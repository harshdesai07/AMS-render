package AMS.AttendanceManagementSystem.Entity;

import AMS.AttendanceManagementSystem.Metadata.Course;
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
	    name = "college_course",
	    uniqueConstraints = {@UniqueConstraint(columnNames = {"college_id", "course_id"})}
	)
public class CollegeCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public College getCollege() {
		return college;
	}

	public void setCollege(College college) {
		this.college = college;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}
    
}
