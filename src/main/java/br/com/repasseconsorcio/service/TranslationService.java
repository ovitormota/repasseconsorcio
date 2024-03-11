package br.com.repasseconsorcio.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TranslationService {

    private final Map<String, String> statusTranslations;

    public TranslationService() {
        statusTranslations = new HashMap<>();
        statusTranslations.put("CLOSED", "Encerrado");
        statusTranslations.put("OPEN", "Aprovado");
        statusTranslations.put("REGISTERED", "Registrado");
        statusTranslations.put("WON", "Contemplado");
    }

    public String translateStatus(String status) {
        return statusTranslations.getOrDefault(status, status);
    }
}
