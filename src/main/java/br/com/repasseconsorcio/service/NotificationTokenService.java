package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.NotificationToken;
import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.repository.NotificationTokenRepository;
import br.com.repasseconsorcio.service.util.UserCustomUtility;
import com.google.firebase.messaging.FirebaseMessagingException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link NotificationToken}.
 */
@Service
@Transactional
public class NotificationTokenService {

    private final Logger log = LoggerFactory.getLogger(NotificationTokenService.class);

    private final NotificationTokenRepository notificationTokenRepository;

    public NotificationTokenService(NotificationTokenRepository notificationTokenRepository) {
        this.notificationTokenRepository = notificationTokenRepository;
    }

    /**
     * Save a notificationToken.
     *
     * @param notificationToken the entity to save.
     * @return the persisted entity.
     */
    public NotificationToken save(NotificationToken notificationToken) {
        log.debug("Request to save NotificationToken : {}", notificationToken);
        User loggedUser = UserCustomUtility.getUserCustom();

        NotificationToken existingToken = notificationTokenRepository.findByToken(notificationToken.getToken());
        if (existingToken != null) {
            existingToken.setUser(loggedUser);
            return notificationTokenRepository.save(existingToken);
        } else {
            notificationToken.setUser(loggedUser);
            return notificationTokenRepository.save(notificationToken);
        }
    }

    /**
     * Partially update a notificationToken.
     *
     * @param notificationToken the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<NotificationToken> partialUpdate(NotificationToken notificationToken) {
        log.debug("Request to partially update NotificationToken : {}", notificationToken);

        return notificationTokenRepository
            .findById(notificationToken.getId())
            .map(existingNotificationToken -> {
                if (notificationToken.getToken() != null) {
                    existingNotificationToken.setToken(notificationToken.getToken());
                }

                return existingNotificationToken;
            })
            .map(notificationTokenRepository::save);
    }

    /**
     * Get all the notificationTokens.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NotificationToken> findAll(Pageable pageable) {
        log.debug("Request to get all NotificationTokens");
        return notificationTokenRepository.findAll(pageable);
    }

    /**
     * Get one notificationToken by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<NotificationToken> findOne(Long id) {
        log.debug("Request to get NotificationToken : {}", id);
        return notificationTokenRepository.findById(id);
    }

    /**
     * Delete the notificationToken by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete NotificationToken : {}", id);
        notificationTokenRepository.deleteById(id);
    }

    /**
     * Delete the notification token with the specified token string.
     *
     * @param token the token string of the notification token to be deleted.
     * @throws FirebaseMessagingException if there was an error with Firebase Cloud
     *                                    Messaging.
     */
    public void deleteNotificationToken(String token) throws FirebaseMessagingException {
        // Find the existing notification token entity with the specified token string.
        NotificationToken existingNotificationToken = notificationTokenRepository.findByToken(token);
        // If a matching notification token was found, delete it using the delete()
        // function.
        if (existingNotificationToken != null) {
            delete(existingNotificationToken.getId());
        }
    }

    public List<NotificationToken> findByUser(User user) {
        return notificationTokenRepository.findTokensByUser(user);
    }

    public List<NotificationToken> findTokensByAdmin() {
        return notificationTokenRepository.findTokensByAdmin();
    }
}
