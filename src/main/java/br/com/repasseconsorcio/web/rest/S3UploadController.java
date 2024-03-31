package br.com.repasseconsorcio.web.rest;

import br.com.repasseconsorcio.service.UserService;
import br.com.repasseconsorcio.service.cloud.S3Service;
import br.com.repasseconsorcio.service.cloud.exceptions.FileDownloadException;
import br.com.repasseconsorcio.service.cloud.exceptions.FileEmptyException;
import br.com.repasseconsorcio.service.cloud.exceptions.FileUploadException;
import io.jsonwebtoken.io.IOException;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@Validated
public class S3UploadController {

    private final S3Service s3FileService;

    private final UserService userService;

    public S3UploadController(S3Service s3FileService, UserService userService) {
        this.s3FileService = s3FileService;
        this.userService = userService;
    }

    @PostMapping("s3/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile multipartFile, @RequestParam("userId") Long userId)
        throws FileEmptyException, FileUploadException, IOException, java.io.IOException {
        if (multipartFile.isEmpty()) {
            throw new FileEmptyException("File is empty. Cannot save an empty file");
        }

        // Agora você pode usar o ID do usuário conforme necessário, por exemplo, para salvar a imagem associada ao usuário.

        String fileName = s3FileService.uploadFile(multipartFile);

        if (fileName != "") {
            userService.updateImageUser(fileName, userId);
        }

        // Suponha que você queira associar o nome do arquivo ao usuário com o ID fornecido.
        // Aqui você pode fazer a lógica necessária para salvar a informação no banco de dados.

        return ResponseEntity.created(null).body(fileName);
    }

    @GetMapping("s3/download")
    public ResponseEntity<?> downloadFile(@RequestParam("fileName") @NotBlank @NotNull String fileName) throws FileDownloadException, IOException, java.io.IOException {
        Object response = s3FileService.getSignedUrlForDownload(fileName);
        if (response != null) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("file does not exist", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("s3/delete")
    public ResponseEntity<?> delete(@RequestParam("fileName") @NotBlank @NotNull String fileName) {
        s3FileService.deleteFile(fileName);

        return ResponseEntity.ok("File deleted successfully");
    }
}
