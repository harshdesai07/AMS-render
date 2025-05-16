package AMS.AttendanceManagementSystem.Dto;

import java.util.List;

public class CollegeCourseDepartmentDto {
	private String courseName;
	
	private Long collegeId;
	
	private List<String> departments;
	
    public CollegeCourseDepartmentDto() {}
	
	
	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public List<String> getDepartments() {
		return departments;
	}

	public void setDepts(List<String> departments) {
		this.departments = departments;
	}

	public Long getCollegeId() {
		return collegeId;
	}
	
	public void setCollegeId(Long collegeId) {
		this.collegeId = collegeId;
	}
}
