package br.com.repasseconsorcio.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

@Service
public class FirebaseConfig {

    private static final String APP_NAME = "repasseconsorcio";

    @Bean
    public FirebaseMessaging firebaseMessaging() throws IOException {
        // Check if the Firebase app already exists with the name "Fleetsense"
        Optional<FirebaseApp> RepasseConsorcio = FirebaseApp.getApps().stream().filter(app -> app.getName().equals(APP_NAME)).findFirst();

        if (RepasseConsorcio.isPresent()) {
            return FirebaseMessaging.getInstance(RepasseConsorcio.get());
        }

        // If it doesn't exist, launch a new Firebase app named "Fleetsense"
        try (InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream()) {
            GoogleCredentials googleCredentials = GoogleCredentials.fromStream(serviceAccount);
            FirebaseOptions firebaseOptions = FirebaseOptions.builder().setCredentials(googleCredentials).build();
            FirebaseApp app = FirebaseApp.initializeApp(firebaseOptions, APP_NAME);
            return FirebaseMessaging.getInstance(app);
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Firebase app", e);
        }
    }
}
