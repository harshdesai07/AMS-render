package AMS.AttendanceManagementSystem.Dto;

import java.time.LocalDateTime;

public class ScheduleToFacultyDto {
	
	private String title;
	
    private String description;
    
    private String status;
    
    private Long hodId;
    
    private Long facultyId;
    
    private LocalDateTime dueDate;
    
    public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getHodId() {
		return hodId;
	}

	public void setHodId(Long hodId) {
		this.hodId = hodId;
	}

	public Long getFacultyId() {
		return facultyId;
	}

	public void setFacultyId(Long facultyId) {
		this.facultyId = facultyId;
	}
}