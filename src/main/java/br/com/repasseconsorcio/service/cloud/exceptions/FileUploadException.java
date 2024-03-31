package br.com.repasseconsorcio.service.cloud.exceptions;

import br.com.repasseconsorcio.service.GeneralFileUploadException;

public class FileUploadException extends GeneralFileUploadException {

    public FileUploadException(String message) {
        super(message);
    }
}
