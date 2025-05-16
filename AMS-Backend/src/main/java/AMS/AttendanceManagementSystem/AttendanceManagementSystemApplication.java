package AMS.AttendanceManagementSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import AMS.AttendanceManagementSystem.Config.CloudinaryConfigProperties;

@EnableConfigurationProperties(CloudinaryConfigProperties.class)
@SpringBootApplication
public class AttendanceManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(AttendanceManagementSystemApplication.class, args);
	}

}
