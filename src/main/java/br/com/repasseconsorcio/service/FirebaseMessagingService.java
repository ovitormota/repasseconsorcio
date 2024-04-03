package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.NotificationToken;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class FirebaseMessagingService {

    private final FirebaseMessaging firebaseMessaging;

    private final NotificationTokenService notificationTokenService;

    public FirebaseMessagingService(FirebaseMessaging firebaseMessaging, NotificationTokenService notificationTokenService) {
        this.firebaseMessaging = firebaseMessaging;
        this.notificationTokenService = notificationTokenService;
    }

    private List<NotificationToken> findTokenByConsortium(Consortium consortium) {
        return notificationTokenService.findByUser(consortium.getUser());
    }

    private List<NotificationToken> findTokensByAdmin() {
        return notificationTokenService.findTokensByAdmin();
    }

    public void sendNotifications(Optional<Consortium> consortium) {
        try {
            List<NotificationToken> notificationTokens = findTokenByConsortium(consortium.get());

            for (NotificationToken notificationToken : notificationTokens) {
                Notification notification = Notification.builder().setTitle("Vitor, ótimas notícias!").setBody("A sua proposta com o ID #" + consortium.get().getId() + " foi aprovada!").build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public void sendNotificationsByAdmin(Optional<Consortium> consortium) {
        try {
            List<NotificationToken> notificationTokens = findTokensByAdmin();

            for (NotificationToken notificationToken : notificationTokens) {
                Notification notification = Notification
                    .builder()
                    .setTitle("Uma nova proposta foi enviada!")
                    .setBody("A proposta com o ID #" + consortium.get().getId() + " está pendente de aprovação.")
                    .build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    private void sendNotification(Message message, NotificationToken notificationToken) throws FirebaseMessagingException {
        try {
            firebaseMessaging.send(message);
        } catch (FirebaseMessagingException e) {
            if (e.getMessagingErrorCode().equals(MessagingErrorCode.UNREGISTERED)) {
                notificationTokenService.deleteNotificationToken(notificationToken.getToken());
            }
        }
    }
}
