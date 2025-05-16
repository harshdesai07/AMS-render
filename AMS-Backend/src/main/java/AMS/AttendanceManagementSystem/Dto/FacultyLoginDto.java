package AMS.AttendanceManagementSystem.Dto;

public class FacultyLoginDto {
    
	private Long  facultyId;
	
	private String facultyPassword;

	public Long getFacultyId() {
		return facultyId;
	}

	public void setFacultyId(Long facultyId) {
		this.facultyId = facultyId;
	}

	public String getFacultyPassword() {
		return facultyPassword;
	}

	public void setFacultyPassword(String facultyPassword) {
		this.facultyPassword = facultyPassword;
	}
	
}
