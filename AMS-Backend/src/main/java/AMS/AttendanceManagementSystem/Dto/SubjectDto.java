package AMS.AttendanceManagementSystem.Dto;

import java.util.List;

public class SubjectDto {
	private String semester;
	private List<String> subjects;
	
	public String getSemester() {
		return semester;
	}
	public void setSemester(String semester) {
		this.semester = semester;
	}
	public List<String> getSubjects() {
		return subjects;
	}
	public void setSubjects(List<String> subjects) {
		this.subjects = subjects;
	}
	
}
