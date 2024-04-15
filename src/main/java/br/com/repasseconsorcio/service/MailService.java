package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.RepasseconsorcioApp;
import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.User;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;
import tech.jhipster.config.JHipsterProperties;

/**
 * Service for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    private static final String USER = "user";

    private static final String STATUS = "status";

    private static final String CONSORTIUM = "consortium";

    private static final String BID = "bid";

    private static final String BASE_URL = "baseUrl";

    private final JHipsterProperties jHipsterProperties;

    private final JavaMailSender javaMailSender;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;

    private final TranslationService translationService;

    private final RepasseconsorcioApp repasseconsorcioApp;

    public MailService(
        JHipsterProperties jHipsterProperties,
        JavaMailSender javaMailSender,
        MessageSource messageSource,
        SpringTemplateEngine templateEngine,
        TranslationService translationService,
        RepasseconsorcioApp repasseconsorcioApp
    ) {
        this.jHipsterProperties = jHipsterProperties;
        this.javaMailSender = javaMailSender;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
        this.translationService = translationService;
        this.repasseconsorcioApp = repasseconsorcioApp;
    }

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        log.debug("Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}", isMultipart, isHtml, to, subject, content);

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setFrom(jHipsterProperties.getMail().getFrom());
            message.setSubject(subject);
            message.setText(content, isHtml);
            javaMailSender.send(mimeMessage);
            log.debug("Sent email to User '{}'", to);
        } catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", to, e);
        }
    }

    @Async
    public void sendEmailFromTemplate(User user, String status, String consortiumId, Bid bid, String templateName, String titleKey) {
        if (repasseconsorcioApp.isDevMode()) {
            return;
        }

        if (user.getEmail() == null) {
            log.debug("Email doesn't exist for user '{}'", user.getLogin());
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(STATUS, status);
        context.setVariable(CONSORTIUM, consortiumId);
        context.setVariable(BID, bid);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        String content = templateEngine.process(templateName, context);
        String subject = messageSource.getMessage(titleKey, null, locale);
        sendEmail(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendActivationEmail(User user) {
        log.debug("Sending activation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, null, null, null, "mail/activationEmail", "email.activation.title");
    }

    @Async
    public void sendCreationEmail(User user) {
        log.debug("Sending creation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, null, null, null, "mail/creationEmail", "email.activation.title");
    }

    @Async
    public void sendPasswordResetMail(User user) {
        log.debug("Sending password reset email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, null, null, null, "mail/passwordResetEmail", "email.reset.title");
    }

    @Async
    public void sendProposalStatusChanged(Consortium consortium) {
        log.debug("Sending proposal status changed email to '{}'", consortium.getUser().getEmail());
        String status = translationService.translateStatus(consortium.getStatus().name());
        String consortiumId = String.valueOf(consortium.getId()).replace(".", "");

        sendEmailFromTemplate(consortium.getUser(), status, consortiumId, null, "mail/proposalStatusChangedEmail", "email.statusUpdate.title");
    }

    @Async
    public void sendBidReceivedNotification(Bid bid) {
        User user = bid.getConsortium().getUser();
        String consortiumId = String.valueOf(bid.getConsortium().getId()).replace(".", "");

        log.debug("Sending bid received notification email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, null, consortiumId, bid, "mail/bidReceivedEmail", "email.bidReceived.title");
    }

    @Async
    public void sendAuctionResultOwnerNotification(Consortium consortium) {
        log.debug("Sending auction result owner notification email to '{}'", consortium.getUser().getEmail());
        String consortiumId = String.valueOf(consortium.getId()).replace(".", "");
        sendEmailFromTemplate(consortium.getUser(), null, consortiumId, null, "mail/auctionResultOwnerEmail", "email.auctionResultOwner.title");
    }

    @Async
    public void sendAuctionResultWinnerNotification(User user, Consortium consortium) {
        log.debug("Sending auction result user notification email to '{}'", user.getEmail());
        String consortiumId = String.valueOf(consortium.getId()).replace(".", "");
        sendEmailFromTemplate(user, null, consortiumId, null, "mail/auctionResultWinnerEmail", "email.auctionResultWinner.title");
    }
}
