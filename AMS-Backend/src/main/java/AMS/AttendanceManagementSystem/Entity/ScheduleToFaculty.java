package AMS.AttendanceManagementSystem.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ScheduleToFaculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;
    
    private String title;
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "assigned_to_faculty_id", nullable = false)
    private Faculty assignedTo; // Faculty receiving the task
    
    @ManyToOne
    @JoinColumn(name = "assigned_by_faculty_id", nullable = false)
    private Faculty assignedBy; // HOD who assigned the task
    
    private LocalDateTime dueDate;
    private LocalDateTime assignedDate;
    
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"

 // Add all getters and setters here
    
	public Long getScheduleId() {
		return scheduleId;
	}

	public void setScheduleId(Long scheduleId) {
		this.scheduleId = scheduleId;
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

	public Faculty getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(Faculty assignedTo) {
		this.assignedTo = assignedTo;
	}

	public Faculty getAssignedBy() {
		return assignedBy;
	}

	public void setAssignedBy(Faculty assignedBy) {
		this.assignedBy = assignedBy;
	}

	public LocalDateTime getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDateTime dueDate) {
		this.dueDate = dueDate;
	}

	public LocalDateTime getAssignedDate() {
		return assignedDate;
	}

	public void setAssignedDate(LocalDateTime assignedDate) {
		this.assignedDate = assignedDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    
   

    
}