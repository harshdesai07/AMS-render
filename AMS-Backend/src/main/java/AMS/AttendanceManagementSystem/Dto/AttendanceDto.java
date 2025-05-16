package AMS.AttendanceManagementSystem.Dto;


import AMS.AttendanceManagementSystem.Enums.AttendanceStatus;

public class AttendanceDto {
	private Long studentId;
	
	private Long facultyId;
	
	private String subject;
	
	private AttendanceStatus status;
	
	public Long getFacultyId() {
		return facultyId;
	}
	
	public void setFacultyId(Long facultyId) {
		this.facultyId = facultyId;
	}
	
	public Long getStudentId() {
		return studentId;
	}
	
	public void setStudentId(Long studentId) {
		this.studentId = studentId;
	}
	
	public String getSubject() {
		return subject;
	}
	
	public void setSubject(String subject) {
		this.subject = subject;
	}
	
	public AttendanceStatus getStatus() {
		return status;
	}
	
	public void setStatus(AttendanceStatus status) {
		this.status = status;
	}
	
}
