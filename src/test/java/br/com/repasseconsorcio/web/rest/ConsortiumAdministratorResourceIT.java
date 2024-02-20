package br.com.repasseconsorcio.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.repasseconsorcio.IntegrationTest;
import br.com.repasseconsorcio.domain.ConsortiumAdministrator;
import br.com.repasseconsorcio.repository.ConsortiumAdministratorRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ConsortiumAdministratorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsortiumAdministratorResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE = "BBBBBBBBBB";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/consortium-administrators";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsortiumAdministratorRepository consortiumAdministratorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsortiumAdministratorMockMvc;

    private ConsortiumAdministrator consortiumAdministrator;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ConsortiumAdministrator createEntity(EntityManager em) {
        ConsortiumAdministrator consortiumAdministrator = new ConsortiumAdministrator().name(DEFAULT_NAME).image(DEFAULT_IMAGE);
        return consortiumAdministrator;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ConsortiumAdministrator createUpdatedEntity(EntityManager em) {
        ConsortiumAdministrator consortiumAdministrator = new ConsortiumAdministrator().name(UPDATED_NAME).image(UPDATED_IMAGE);
        return consortiumAdministrator;
    }

    @BeforeEach
    public void initTest() {
        consortiumAdministrator = createEntity(em);
    }

    @Test
    @Transactional
    void createConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeCreate = consortiumAdministratorRepository.findAll().size();
        // Create the ConsortiumAdministrator
        restConsortiumAdministratorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator)))
            .andExpect(status().isCreated());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeCreate + 1);
        ConsortiumAdministrator testConsortiumAdministrator = consortiumAdministratorList.get(consortiumAdministratorList.size() - 1);
        assertThat(testConsortiumAdministrator.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testConsortiumAdministrator.getImage()).isEqualTo(DEFAULT_IMAGE);
    }

    @Test
    @Transactional
    void createConsortiumAdministratorWithExistingId() throws Exception {
        // Create the ConsortiumAdministrator with an existing ID
        consortiumAdministrator.setId(1L);

        int databaseSizeBeforeCreate = consortiumAdministratorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsortiumAdministratorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator)))
            .andExpect(status().isBadRequest());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = consortiumAdministratorRepository.findAll().size();
        // set the field null
        consortiumAdministrator.setName(null);

        // Create the ConsortiumAdministrator, which fails.

        restConsortiumAdministratorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator)))
            .andExpect(status().isBadRequest());

        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllConsortiumAdministrators() throws Exception {
        // Initialize the database
        consortiumAdministratorRepository.saveAndFlush(consortiumAdministrator);

        // Get all the consortiumAdministratorList
        restConsortiumAdministratorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consortiumAdministrator.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getConsortiumAdministrator() throws Exception {
        // Initialize the database
        consortiumAdministratorRepository.saveAndFlush(consortiumAdministrator);

        // Get the consortiumAdministrator
        restConsortiumAdministratorMockMvc
            .perform(get(ENTITY_API_URL_ID, consortiumAdministrator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consortiumAdministrator.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.image").value(DEFAULT_IMAGE));
    }

    @Test
    @Transactional
    void getNonExistingConsortiumAdministrator() throws Exception {
        // Get the consortiumAdministrator
        restConsortiumAdministratorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConsortiumAdministrator() throws Exception {
        // Initialize the database
        consortiumAdministratorRepository.saveAndFlush(consortiumAdministrator);

        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();

        // Update the consortiumAdministrator
        ConsortiumAdministrator updatedConsortiumAdministrator = consortiumAdministratorRepository.findById(consortiumAdministrator.getId()).get();
        // Disconnect from session so that the updates on updatedConsortiumAdministrator are not directly saved in db
        em.detach(updatedConsortiumAdministrator);
        updatedConsortiumAdministrator.name(UPDATED_NAME).image(UPDATED_IMAGE);

        restConsortiumAdministratorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsortiumAdministrator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsortiumAdministrator))
            )
            .andExpect(status().isOk());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
        ConsortiumAdministrator testConsortiumAdministrator = consortiumAdministratorList.get(consortiumAdministratorList.size() - 1);
        assertThat(testConsortiumAdministrator.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testConsortiumAdministrator.getImage()).isEqualTo(UPDATED_IMAGE);
    }

    @Test
    @Transactional
    void putNonExistingConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();
        consortiumAdministrator.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsortiumAdministratorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consortiumAdministrator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();
        consortiumAdministrator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumAdministratorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();
        consortiumAdministrator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumAdministratorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsortiumAdministratorWithPatch() throws Exception {
        // Initialize the database
        consortiumAdministratorRepository.saveAndFlush(consortiumAdministrator);

        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();

        // Update the consortiumAdministrator using partial update
        ConsortiumAdministrator partialUpdatedConsortiumAdministrator = new ConsortiumAdministrator();
        partialUpdatedConsortiumAdministrator.setId(consortiumAdministrator.getId());

        restConsortiumAdministratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsortiumAdministrator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsortiumAdministrator))
            )
            .andExpect(status().isOk());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
        ConsortiumAdministrator testConsortiumAdministrator = consortiumAdministratorList.get(consortiumAdministratorList.size() - 1);
        assertThat(testConsortiumAdministrator.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testConsortiumAdministrator.getImage()).isEqualTo(DEFAULT_IMAGE);
    }

    @Test
    @Transactional
    void fullUpdateConsortiumAdministratorWithPatch() throws Exception {
        // Initialize the database
        consortiumAdministratorRepository.saveAndFlush(consortiumAdministrator);

        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();

        // Update the consortiumAdministrator using partial update
        ConsortiumAdministrator partialUpdatedConsortiumAdministrator = new ConsortiumAdministrator();
        partialUpdatedConsortiumAdministrator.setId(consortiumAdministrator.getId());

        partialUpdatedConsortiumAdministrator.name(UPDATED_NAME).image(UPDATED_IMAGE);

        restConsortiumAdministratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsortiumAdministrator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsortiumAdministrator))
            )
            .andExpect(status().isOk());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
        ConsortiumAdministrator testConsortiumAdministrator = consortiumAdministratorList.get(consortiumAdministratorList.size() - 1);
        assertThat(testConsortiumAdministrator.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testConsortiumAdministrator.getImage()).isEqualTo(UPDATED_IMAGE);
    }

    @Test
    @Transactional
    void patchNonExistingConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();
        consortiumAdministrator.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsortiumAdministratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consortiumAdministrator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();
        consortiumAdministrator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumAdministratorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator))
            )
            .andExpect(status().isBadRequest());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsortiumAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = consortiumAdministratorRepository.findAll().size();
        consortiumAdministrator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumAdministratorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consortiumAdministrator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ConsortiumAdministrator in the database
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsortiumAdministrator() throws Exception {
        // Initialize the database
        consortiumAdministratorRepository.saveAndFlush(consortiumAdministrator);

        int databaseSizeBeforeDelete = consortiumAdministratorRepository.findAll().size();

        // Delete the consortiumAdministrator
        restConsortiumAdministratorMockMvc
            .perform(delete(ENTITY_API_URL_ID, consortiumAdministrator.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ConsortiumAdministrator> consortiumAdministratorList = consortiumAdministratorRepository.findAll();
        assertThat(consortiumAdministratorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
