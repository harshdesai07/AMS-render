package AMS.AttendanceManagementSystem.Dto;

public class GetStudentDto {
	
	private Long studentId;
  
	 private String studentEmail;
	 
	   
	    private String studentName;
	    
	    private String studentNumber;
	    
		private String studentParentsNumber;
		
		private String deptName;
		
		private String courseName;
		
		private String semester;
		
		private String rollNumber;

		public String getRollNumber() {
			return rollNumber;
		}

		public void setRollNumber(String rollNumber) {
			this.rollNumber = rollNumber;
		}

		public String getStudentEmail() {
			return studentEmail;
		}

		public void setStudentEmail(String studentEmail) {
			this.studentEmail = studentEmail;
		}

		public String getStudentName() {
			return studentName;
		}

		public void setStudentName(String studentName) {
			this.studentName = studentName;
		}

		public String getStudentNumber() {
			return studentNumber;
		}

		public void setStudentNumber(String studentNumber) {
			this.studentNumber = studentNumber;
		}

		public String getStudentParentsNumber() {
			return studentParentsNumber;
		}

		public void setStudentParentsNumber(String studentParentsNumber) {
			this.studentParentsNumber = studentParentsNumber;
		}


		public String getDeptName() {
			return deptName;
		}

		public void setDeptName(String deptName) {
			this.deptName = deptName;
		}

		public String getCourseName() {
			return courseName;
		}

		public void setCourseName(String courseName) {
			this.courseName = courseName;
		}

		public String getSemester() {
			return semester;
		}

		public void setSemester(String semester) {
			this.semester = semester;
		}

		public Long getStudentId() {
			return studentId;
		}

		public void setStudentId(Long studentId) {
			this.studentId = studentId;
		}
		

	
}