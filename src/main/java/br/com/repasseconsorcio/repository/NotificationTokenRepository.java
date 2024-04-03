package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.NotificationToken;
import br.com.repasseconsorcio.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the NotificationToken entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationTokenRepository extends JpaRepository<NotificationToken, Long> {
    @Query("select notificationToken from NotificationToken notificationToken where notificationToken.user.login = ?#{principal.username}")
    List<NotificationToken> findByUserIsCurrentUser();

    @Query("select notificationToken from NotificationToken notificationToken where notificationToken.token = ?1")
    NotificationToken findByToken(String token);

    @Query("select notificationToken from NotificationToken notificationToken where notificationToken.user = ?1")
    List<NotificationToken> findTokensByUser(User user);

    @Query(
        nativeQuery = true,
        value = "SELECT DISTINCT (nt.token), nt.id, nt.user_id " +
        "FROM notification_token nt " +
        "LEFT JOIN app_user au ON nt.user_id = au.id " +
        "LEFT JOIN app_user_authority aua ON au.id = aua.user_id " +
        "WHERE aua.authority_name IN ('ROLE_ADMIN');"
    )
    List<NotificationToken> findTokensByAdmin();
}
