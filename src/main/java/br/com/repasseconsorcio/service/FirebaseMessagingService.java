package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.RepasseconsorcioApp;
import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.NotificationToken;
import br.com.repasseconsorcio.domain.User;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class FirebaseMessagingService {

    private final FirebaseMessaging firebaseMessaging;

    private final NotificationTokenService notificationTokenService;

    private final RepasseconsorcioApp repasseconsorcioApp;

    public FirebaseMessagingService(FirebaseMessaging firebaseMessaging, NotificationTokenService notificationTokenService, RepasseconsorcioApp repasseconsorcioApp) {
        this.firebaseMessaging = firebaseMessaging;
        this.notificationTokenService = notificationTokenService;
        this.repasseconsorcioApp = repasseconsorcioApp;
    }

    private List<NotificationToken> findTokenByConsortium(User user) {
        return notificationTokenService.findByUser(user);
    }

    private List<NotificationToken> findTokensByAdmin() {
        return notificationTokenService.findTokensByAdmin();
    }

    public void sendNotificationProposalStatusChanged(Optional<Consortium> consortium) {
        try {
            List<NotificationToken> notificationTokens = findTokenByConsortium(consortium.get().getUser());

            for (NotificationToken notificationToken : notificationTokens) {
                Notification notification = Notification
                    .builder()
                    .setTitle(consortium.get().getUser().getFirstName() + ", ótimas notícias!")
                    .setBody("A sua proposta com o ID #" + consortium.get().getId() + " foi aprovada.")
                    .build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public void sendNotificationsCreateConsortium(Optional<Consortium> consortium) {
        try {
            List<NotificationToken> notificationTokens = findTokensByAdmin();

            for (NotificationToken notificationToken : notificationTokens) {
                Notification notification = Notification
                    .builder()
                    .setTitle(notificationToken.getUser().getFirstName() + ", ótimas notícias!")
                    .setBody("A uma nova proposta com o ID #" + consortium.get().getId() + " está pendente de aprovação.")
                    .build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public void sendNotificationAuctionResultWinnerNotification(Optional<Bid> bid) {
        try {
            List<NotificationToken> notificationTokens = findTokenByConsortium(bid.get().getUser());

            for (NotificationToken notificationToken : notificationTokens) {
                Notification notification = Notification
                    .builder()
                    .setTitle(bid.get().getUser().getFirstName() + ", ótimas notícias!")
                    .setBody("O leilão da proposta com o ID #" + bid.get().getConsortium().getId() + " no qual você participou foi vencido por você. Vamos entrar em contato.")
                    .build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public void sendNotificationAuctionResultOwnerNotification(Optional<Bid> bid) {
        try {
            List<NotificationToken> notificationTokens = findTokenByConsortium(bid.get().getUser());

            for (NotificationToken notificationToken : notificationTokens) {
                Notification notification = Notification
                    .builder()
                    .setTitle(bid.get().getConsortium().getUser() + ", ótimas notícias!")
                    .setBody("O leilão da sua proposta com o ID #" + bid.get().getConsortium().getId() + " encerrou e foi arrematada. Vamos entrar em contato.")
                    .build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    public void sendNotificationBidConsortium(Bid bid) {
        try {
            List<NotificationToken> notificationTokens = findTokenByConsortium(bid.getConsortium().getUser());

            for (NotificationToken notificationToken : notificationTokens) {
                NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));
                String formattedValue = currencyFormat.format(bid.getValue());

                Notification notification = Notification
                    .builder()
                    .setTitle(bid.getConsortium().getUser().getFirstName() + ", ótimas notícias!")
                    .setBody("Sua proposta com o ID #" + bid.getConsortium().getId() + " recebeu um novo lance no valor de " + formattedValue + ".")
                    .build();

                Message message = Message.builder().setToken(notificationToken.getToken()).setNotification(notification).build();
                sendNotification(message, notificationToken);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    private void sendNotification(Message message, NotificationToken notificationToken) throws FirebaseMessagingException {
        if (repasseconsorcioApp.isDevMode()) {
            return;
        }

        try {
            firebaseMessaging.send(message);
        } catch (FirebaseMessagingException e) {
            if (e.getMessagingErrorCode().equals(MessagingErrorCode.UNREGISTERED)) {
                notificationTokenService.deleteNotificationToken(notificationToken.getToken());
            }
        }
    }
}
