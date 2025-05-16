package AMS.AttendanceManagementSystem.Dto;

public class StudentLoginDto {

	private Long studentId;
	
	private String studentPassword;

	public Long getStudentId() {
		return studentId;
	}

	public void setStudentId(Long studentId) {
		this.studentId = studentId;
	}

	public String getStudentPassword() {
		return studentPassword;
	}

	public void setStudentPassword(String studentPassword) {
		this.studentPassword = studentPassword;
	}
	
}
