package AMS.AttendanceManagementSystem.Metadata;

import jakarta.persistence.Entity;


import jakarta.persistence.*;

@Entity
@Table(name = "course_semester")
public class CourseSemester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;  

    @ManyToOne
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester; 

    public CourseSemester() {
    }

    public CourseSemester(Course course, Semester semester) {
        this.course = course;
        this.semester = semester;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Semester getSemester() {
        return semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }
}

