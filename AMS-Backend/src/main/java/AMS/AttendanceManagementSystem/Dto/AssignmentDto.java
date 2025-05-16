package AMS.AttendanceManagementSystem.Dto;

import java.time.LocalDate;

public class AssignmentDto {
	 private String title;
	 private LocalDate submissionDate;
	 private Long id; //facultyId or studentId
	 private Long collegeId;
	 private String semester;
	 private Long assignmentId;

	 public Long getAssignmentId() {
		return assignmentId;
	}
	public void setAssignmentId(Long assignmentId) {
		this.assignmentId = assignmentId;
	}

	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public LocalDate getSubmissionDate() {
		return submissionDate;
	}
	public void setSubmissionDate(LocalDate submissionDate) {
		this.submissionDate = submissionDate;
	}

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCollegeId() {
		return collegeId;
	}
	public void setCollegeId(Long collegeId) {
		this.collegeId = collegeId;
	}

	public String getSemester() {
		return semester;
	}
	public void setSemester(String semester) {
		this.semester = semester;
	}
	 
	 
	 
	 
}
