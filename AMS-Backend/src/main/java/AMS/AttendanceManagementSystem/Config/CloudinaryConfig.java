package AMS.AttendanceManagementSystem.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(CloudinaryConfigProperties.class)

public class CloudinaryConfig {

    private final CloudinaryConfigProperties properties;

    public CloudinaryConfig(CloudinaryConfigProperties properties) {
        this.properties = properties;
    }

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", properties.getCloudName(),
            "api_key", properties.getApiKey(),
            "api_secret", properties.getApiSecret()
        ));
    }
}
