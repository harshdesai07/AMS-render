package AMS.AttendanceManagementSystem.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    // Method to upload file to Cloudinary
    public Map<String, Object> uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        File convFile = convert(file);
        String originalFilename = file.getOriginalFilename();

        // Remove path if present, get just the filename
        String baseFilename = new File(originalFilename).getName();

        // For public_id, remove extension if you want Cloudinary to determine resource type
        String filenameWithoutExt = baseFilename.contains(".")
                ? baseFilename.substring(0, baseFilename.lastIndexOf('.'))
                : baseFilename;

        String ext = baseFilename.contains(".")
                ? baseFilename.substring(baseFilename.lastIndexOf('.'))
                : "";

        // Set public_id as folder/filename_with_ext to preserve name (Cloudinary raw resource allows this)
        String publicId =  filenameWithoutExt + ext;

        // Upload to Cloudinary
        Map<String, Object> uploadResult = cloudinary.uploader().upload(convFile, ObjectUtils.asMap(
                "resource_type", "raw",
                "type", "authenticated",
                "folder", folder,
                "public_id", publicId
        ));
        
        System.out.println("response"+uploadResult);

        if (convFile.exists()) {
            convFile.delete();
        }
        
        Map<String, Object> response = new HashMap<>();
        
        response.put("publicId", uploadResult.get("public_id"));
        response.put("version", uploadResult.get("version"));
        response.put("fileName", uploadResult.get("original_filename"));
       
        return response;
    }

    // Utility method to convert MultipartFile to File
    private File convert(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }
    
    public String getDownloadUrl(String publicId, Long version) {
        return cloudinary.url()
                .resourceType("raw")
                .type("authenticated")
                .version(version)
                .secure(true)
                .signed(true)
                .generate(publicId);
    }

}