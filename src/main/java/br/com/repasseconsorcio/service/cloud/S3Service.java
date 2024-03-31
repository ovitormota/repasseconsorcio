package br.com.repasseconsorcio.service.cloud;

import br.com.repasseconsorcio.config.ApplicationProperties;
import br.com.repasseconsorcio.repository.FileServiceRepository;
import br.com.repasseconsorcio.service.cloud.exceptions.FileDownloadException;
import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils;
import org.hibernate.service.spi.ServiceException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class S3Service implements FileServiceRepository {

    private final ApplicationProperties applicationProperties;

    private final AmazonS3 s3Client;

    public S3Service(AmazonS3 s3Client, ApplicationProperties applicationProperties) {
        this.s3Client = s3Client;
        this.applicationProperties = applicationProperties;
    }

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        if (!isValidFile(multipartFile)) {
            throw new ServiceException("O tipo de arquivo é inválido.");
        }

        String fileName = generateFileName(multipartFile);
        byte[] fileBytes = multipartFile.getBytes();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(multipartFile.getContentType());
        metadata.setContentLength(fileBytes.length);

        s3Client.putObject(new PutObjectRequest(applicationProperties.getBucketName(), fileName, new ByteArrayInputStream(fileBytes), metadata));

        return fileName;
    }

    @Override
    public String getSignedUrlForDownload(String fileName) throws FileDownloadException {
        try {
            // Gerar a URL assinada
            GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(applicationProperties.getBucketName(), fileName)
                .withMethod(HttpMethod.GET)
                .withExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)); // 24 horas

            URL signedUrl = s3Client.generatePresignedUrl(request);

            return signedUrl.toString();
        } catch (AmazonS3Exception e) {
            throw new FileDownloadException("Failed to generate signed URL for file: " + fileName);
        }
    }

    @Override
    public void deleteFile(String objectKey) {
        try {
            if (!s3Client.doesObjectExist(applicationProperties.getBucketName(), objectKey)) {
                throw new AmazonS3Exception("File does not exist!");
            }
            s3Client.deleteObject(new DeleteObjectRequest(applicationProperties.getBucketName(), objectKey));
        } catch (AmazonS3Exception e) {
            throw new AmazonS3Exception("Failed to delete the file: " + e.getMessage());
        }
    }

    private boolean isValidFile(MultipartFile file) {
        List<String> allowedExtensions = Arrays.asList("png", "jpg", "jpeg");
        String extension = FilenameUtils.getExtension(file.getOriginalFilename());
        return file != null && !file.isEmpty() && allowedExtensions.contains(extension);
    }

    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID().toString();
    }
}
