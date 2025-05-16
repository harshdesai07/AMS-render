package AMS.AttendanceManagementSystem.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AMS.AttendanceManagementSystem.Entity.Department;
import AMS.AttendanceManagementSystem.Repo.CourseDepartmentRepo;

@Service
public class CourseDepartmentService {
	@Autowired
	private CourseDepartmentRepo cdr;

	//gives the list of department for corresponding course
	public List<Department> findDepartmentByCourseId(Long courseId) {
		return cdr.findDepartmentsByCourseId(courseId);
	}

}
