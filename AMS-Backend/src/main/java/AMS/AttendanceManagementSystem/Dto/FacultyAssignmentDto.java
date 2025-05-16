package AMS.AttendanceManagementSystem.Dto;

public class FacultyAssignmentDto {
    
	private Long facultyId;
	
	private String semester;
	
	private String subject;

	public Long getFacultyId() {
		return facultyId;
	}

	public void setFacultyId(Long facultyId) {
		this.facultyId = facultyId;
	}

	public String getSemester() {
		return semester;
	}

	public void setSemester(String semester) {
		this.semester = semester;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}
	
}