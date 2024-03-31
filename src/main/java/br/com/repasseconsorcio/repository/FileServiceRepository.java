package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.service.cloud.exceptions.FileDownloadException;
import br.com.repasseconsorcio.service.cloud.exceptions.FileUploadException;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

public interface FileServiceRepository {
    String uploadFile(MultipartFile multipartFile) throws FileUploadException, IOException;

    Object getSignedUrlForDownload(String fileName) throws FileDownloadException, IOException;

    void deleteFile(String fileName);
}
