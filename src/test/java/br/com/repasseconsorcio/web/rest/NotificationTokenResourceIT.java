package br.com.repasseconsorcio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.repasseconsorcio.IntegrationTest;
import br.com.repasseconsorcio.domain.NotificationToken;
import br.com.repasseconsorcio.repository.NotificationTokenRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link NotificationTokenResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NotificationTokenResourceIT {

    private static final String DEFAULT_TOKEN = "AAAAAAAAAA";
    private static final String UPDATED_TOKEN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/notification-tokens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NotificationTokenRepository notificationTokenRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNotificationTokenMockMvc;

    private NotificationToken notificationToken;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NotificationToken createEntity(EntityManager em) {
        NotificationToken notificationToken = new NotificationToken().token(DEFAULT_TOKEN);
        return notificationToken;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NotificationToken createUpdatedEntity(EntityManager em) {
        NotificationToken notificationToken = new NotificationToken().token(UPDATED_TOKEN);
        return notificationToken;
    }

    @BeforeEach
    public void initTest() {
        notificationToken = createEntity(em);
    }

    @Test
    @Transactional
    void createNotificationToken() throws Exception {
        int databaseSizeBeforeCreate = notificationTokenRepository.findAll().size();
        // Create the NotificationToken
        restNotificationTokenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isCreated());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeCreate + 1);
        NotificationToken testNotificationToken = notificationTokenList.get(notificationTokenList.size() - 1);
        assertThat(testNotificationToken.getToken()).isEqualTo(DEFAULT_TOKEN);
    }

    @Test
    @Transactional
    void createNotificationTokenWithExistingId() throws Exception {
        // Create the NotificationToken with an existing ID
        notificationToken.setId(1L);

        int databaseSizeBeforeCreate = notificationTokenRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNotificationTokenMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isBadRequest());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNotificationTokens() throws Exception {
        // Initialize the database
        notificationTokenRepository.saveAndFlush(notificationToken);

        // Get all the notificationTokenList
        restNotificationTokenMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(notificationToken.getId().intValue())))
            .andExpect(jsonPath("$.[*].token").value(hasItem(DEFAULT_TOKEN)));
    }

    @Test
    @Transactional
    void getNotificationToken() throws Exception {
        // Initialize the database
        notificationTokenRepository.saveAndFlush(notificationToken);

        // Get the notificationToken
        restNotificationTokenMockMvc
            .perform(get(ENTITY_API_URL_ID, notificationToken.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(notificationToken.getId().intValue()))
            .andExpect(jsonPath("$.token").value(DEFAULT_TOKEN));
    }

    @Test
    @Transactional
    void getNonExistingNotificationToken() throws Exception {
        // Get the notificationToken
        restNotificationTokenMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNotificationToken() throws Exception {
        // Initialize the database
        notificationTokenRepository.saveAndFlush(notificationToken);

        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();

        // Update the notificationToken
        NotificationToken updatedNotificationToken = notificationTokenRepository.findById(notificationToken.getId()).get();
        // Disconnect from session so that the updates on updatedNotificationToken are not directly saved in db
        em.detach(updatedNotificationToken);
        updatedNotificationToken.token(UPDATED_TOKEN);

        restNotificationTokenMockMvc
            .perform(put(ENTITY_API_URL_ID, updatedNotificationToken.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedNotificationToken)))
            .andExpect(status().isOk());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
        NotificationToken testNotificationToken = notificationTokenList.get(notificationTokenList.size() - 1);
        assertThat(testNotificationToken.getToken()).isEqualTo(UPDATED_TOKEN);
    }

    @Test
    @Transactional
    void putNonExistingNotificationToken() throws Exception {
        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();
        notificationToken.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNotificationTokenMockMvc
            .perform(put(ENTITY_API_URL_ID, notificationToken.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isBadRequest());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNotificationToken() throws Exception {
        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();
        notificationToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationTokenMockMvc
            .perform(put(ENTITY_API_URL_ID, count.incrementAndGet()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isBadRequest());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNotificationToken() throws Exception {
        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();
        notificationToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationTokenMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNotificationTokenWithPatch() throws Exception {
        // Initialize the database
        notificationTokenRepository.saveAndFlush(notificationToken);

        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();

        // Update the notificationToken using partial update
        NotificationToken partialUpdatedNotificationToken = new NotificationToken();
        partialUpdatedNotificationToken.setId(notificationToken.getId());

        restNotificationTokenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNotificationToken.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNotificationToken))
            )
            .andExpect(status().isOk());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
        NotificationToken testNotificationToken = notificationTokenList.get(notificationTokenList.size() - 1);
        assertThat(testNotificationToken.getToken()).isEqualTo(DEFAULT_TOKEN);
    }

    @Test
    @Transactional
    void fullUpdateNotificationTokenWithPatch() throws Exception {
        // Initialize the database
        notificationTokenRepository.saveAndFlush(notificationToken);

        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();

        // Update the notificationToken using partial update
        NotificationToken partialUpdatedNotificationToken = new NotificationToken();
        partialUpdatedNotificationToken.setId(notificationToken.getId());

        partialUpdatedNotificationToken.token(UPDATED_TOKEN);

        restNotificationTokenMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNotificationToken.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNotificationToken))
            )
            .andExpect(status().isOk());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
        NotificationToken testNotificationToken = notificationTokenList.get(notificationTokenList.size() - 1);
        assertThat(testNotificationToken.getToken()).isEqualTo(UPDATED_TOKEN);
    }

    @Test
    @Transactional
    void patchNonExistingNotificationToken() throws Exception {
        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();
        notificationToken.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNotificationTokenMockMvc
            .perform(patch(ENTITY_API_URL_ID, notificationToken.getId()).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isBadRequest());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNotificationToken() throws Exception {
        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();
        notificationToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationTokenMockMvc
            .perform(patch(ENTITY_API_URL_ID, count.incrementAndGet()).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isBadRequest());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNotificationToken() throws Exception {
        int databaseSizeBeforeUpdate = notificationTokenRepository.findAll().size();
        notificationToken.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificationTokenMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(notificationToken)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the NotificationToken in the database
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNotificationToken() throws Exception {
        // Initialize the database
        notificationTokenRepository.saveAndFlush(notificationToken);

        int databaseSizeBeforeDelete = notificationTokenRepository.findAll().size();

        // Delete the notificationToken
        restNotificationTokenMockMvc.perform(delete(ENTITY_API_URL_ID, notificationToken.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NotificationToken> notificationTokenList = notificationTokenRepository.findAll();
        assertThat(notificationTokenList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
