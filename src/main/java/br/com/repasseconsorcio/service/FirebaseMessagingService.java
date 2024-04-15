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
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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
                Map<String, String> notificationData = new HashMap<>();
                notificationData.put("title", consortium.get().getUser().getFirstName() + ", ótimas notícias!");
                notificationData.put("body", "A sua proposta com o ID #" + consortium.get().getId() + " foi aprovada.");
                notificationData.put("redirectUrl", "/my-proposals");

                Message message = Message.builder().setToken(notificationToken.getToken()).putAllData(notificationData).build();
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
                Map<String, String> notificationData = new HashMap<>();
                notificationData.put("title", notificationToken.getUser().getFirstName() + ", ótimas notícias!");
                notificationData.put("body", "A uma nova proposta com o ID #" + consortium.get().getId() + " está pendente de aprovação.");
                notificationData.put("redirectUrl", "/proposal-approvals");

                Message message = Message.builder().setToken(notificationToken.getToken()).putAllData(notificationData).build();
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
                Map<String, String> notificationData = new HashMap<>();
                notificationData.put("title", bid.get().getUser().getFirstName() + ", ótimas notícias!");
                notificationData.put("body", "O leilão da proposta com o ID #" + bid.get().getConsortium().getId() + " no qual você participou foi vencido por você. Vamos entrar em contato.");
                notificationData.put("redirectUrl", "/bid");

                Message message = Message.builder().setToken(notificationToken.getToken()).putAllData(notificationData).build();
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
                Map<String, String> notificationData = new HashMap<>();
                notificationData.put("title", bid.get().getConsortium().getUser().getFirstName() + ", ótimas notícias!");
                notificationData.put("body", "O leilão da sua proposta com o ID #" + bid.get().getConsortium().getId() + " encerrou e foi arrematada. Vamos entrar em contato.");
                notificationData.put("redirectUrl", "/my-proposals");

                Message message = Message.builder().setToken(notificationToken.getToken()).putAllData(notificationData).build();
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

                Map<String, String> notificationData = new HashMap<>();
                notificationData.put("title", bid.getConsortium().getUser().getFirstName() + ", ótimas notícias!");
                notificationData.put("body", "Sua proposta com o ID #" + bid.getConsortium().getId() + " recebeu um novo lance no valor de " + formattedValue + ".");
                notificationData.put("redirectUrl", "/my-proposals");

                Message message = Message.builder().setToken(notificationToken.getToken()).putAllData(notificationData).build();
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
