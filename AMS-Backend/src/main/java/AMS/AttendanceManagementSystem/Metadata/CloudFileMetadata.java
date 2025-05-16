package AMS.AttendanceManagementSystem.Metadata;


import jakarta.persistence.*;
import AMS.AttendanceManagementSystem.Enums.FileContext;
import AMS.AttendanceManagementSystem.Enums.Role;

@Entity
@Table(name = "cloud_file_metadata")
public class CloudFileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "clodinary_public_id", nullable = false)
    private String publicId;

    @Column(name = "cloudinary_sdk_version", nullable = false)
    private Long version;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role uploadedByType; // FACULTY / STUDENT
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileContext uploadedForType; // FACULTY_ASSIGNMENT or STUDENT_ASSIGNMENT etc.

    @Column(nullable = false)
    private Long uploadedById;
    
    @Column(nullable = false)
    private Long uploadedForId; // assignmentId

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPublicId() {
		return publicId;
	}

	public void setPublicId(String publicId) {
		this.publicId = publicId;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Role getUploadedByType() {
		return uploadedByType;
	}

	public void setUploadedByType(Role uploadedByType) {
		this.uploadedByType = uploadedByType;
	}

	public Long getUploadedById() {
		return uploadedById;
	}

	public void setUploadedById(Long uploadedById) {
		this.uploadedById = uploadedById;
	}

    public FileContext getUploadedForType() {
		return uploadedForType;
	}

	public void setUploadedForType(FileContext uploadedForType) {
		this.uploadedForType = uploadedForType;
	}

	public Long getUploadedForId() {
		return uploadedForId;
	}

	public void setUploadedForId(Long uploadedForId) {
		this.uploadedForId = uploadedForId;
	}

	public CloudFileMetadata() {
    	//default constructor 
    }

	public CloudFileMetadata(String publicId, Long version, String fileName, Role uploadedByType,
			FileContext uploadedForType, Long uploadedById, Long uploadedForId) {
		super();
		this.publicId = publicId;
		this.version = version;
		this.fileName = fileName;
		this.uploadedByType = uploadedByType;
		this.uploadedForType = uploadedForType;
		this.uploadedById = uploadedById;
		this.uploadedForId = uploadedForId;
	}
	
}
