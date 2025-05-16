package AMS.AttendanceManagementSystem.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import AMS.AttendanceManagementSystem.Enums.FileContext;
import AMS.AttendanceManagementSystem.Metadata.CloudFileMetadata;

public interface CloudFileMetadaRepo extends JpaRepository<CloudFileMetadata, Long>{
	// Custom query method to find metadata based on the uploadedForId and uploadedForType
    CloudFileMetadata findByUploadedForIdAndUploadedForType(Long uploadedForId, FileContext uploadedForType);
    
    CloudFileMetadata findByUploadedByIdAndUploadedForIdAndUploadedForType(Long uploadedById, Long uploadedForId, FileContext uploadedForType);

}
