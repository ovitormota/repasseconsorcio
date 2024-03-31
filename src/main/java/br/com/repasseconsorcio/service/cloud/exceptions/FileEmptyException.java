package br.com.repasseconsorcio.service.cloud.exceptions;

import br.com.repasseconsorcio.service.GeneralFileUploadException;

public class FileEmptyException extends GeneralFileUploadException {

    public FileEmptyException(String message) {
        super(message);
    }
}
