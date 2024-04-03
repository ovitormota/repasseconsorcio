package br.com.repasseconsorcio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.repasseconsorcio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class NotificationTokenTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NotificationToken.class);
        NotificationToken notificationToken1 = new NotificationToken();
        notificationToken1.setId(1L);
        NotificationToken notificationToken2 = new NotificationToken();
        notificationToken2.setId(notificationToken1.getId());
        assertThat(notificationToken1).isEqualTo(notificationToken2);
        notificationToken2.setId(2L);
        assertThat(notificationToken1).isNotEqualTo(notificationToken2);
        notificationToken1.setId(null);
        assertThat(notificationToken1).isNotEqualTo(notificationToken2);
    }
}
