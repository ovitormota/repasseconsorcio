package br.com.repasseconsorcio.service.cloud.exceptions;

import br.com.repasseconsorcio.service.GeneralFileUploadException;

public class FileDownloadException extends GeneralFileUploadException {

    public FileDownloadException(String message) {
        super(message);
    }
}
