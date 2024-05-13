package br.com.repasseconsorcio.web.rest;

import static br.com.repasseconsorcio.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.repasseconsorcio.IntegrationTest;
import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ConsortiumResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsortiumResourceIT {

    private static final BigDecimal DEFAULT_CONSORTIUM_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_CONSORTIUM_VALUE = new BigDecimal(2);

    private static final Instant DEFAULT_CREATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final BigDecimal DEFAULT_MINIMUM_BID_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_MINIMUM_BID_VALUE = new BigDecimal(2);

    private static final Integer DEFAULT_NUMBER_OF_INSTALLMENTS = 1;
    private static final Integer UPDATED_NUMBER_OF_INSTALLMENTS = 2;

    private static final BigDecimal DEFAULT_INSTALLMENT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_INSTALLMENT_VALUE = new BigDecimal(2);

    private static final SegmentType DEFAULT_SEGMENT_TYPE = SegmentType.AUTOMOBILE;
    private static final SegmentType UPDATED_SEGMENT_TYPE = SegmentType.OTHER;

    private static final ConsortiumStatusType DEFAULT_STATUS = ConsortiumStatusType.CLOSED;
    private static final ConsortiumStatusType UPDATED_STATUS = ConsortiumStatusType.OPEN;

    private static final String ENTITY_API_URL = "/api/consortiums";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsortiumRepository consortiumRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsortiumMockMvc;

    private Consortium consortium;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consortium createEntity(EntityManager em) {
        Consortium consortium = new Consortium()
            .consortiumValue(DEFAULT_CONSORTIUM_VALUE)
            .created(DEFAULT_CREATED)
            .minimumBidValue(DEFAULT_MINIMUM_BID_VALUE)
            .segmentType(DEFAULT_SEGMENT_TYPE)
            .status(DEFAULT_STATUS);
        return consortium;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consortium createUpdatedEntity(EntityManager em) {
        Consortium consortium = new Consortium()
            .consortiumValue(UPDATED_CONSORTIUM_VALUE)
            .created(UPDATED_CREATED)
            .minimumBidValue(UPDATED_MINIMUM_BID_VALUE)
            .segmentType(UPDATED_SEGMENT_TYPE)
            .status(UPDATED_STATUS);
        return consortium;
    }

    @BeforeEach
    public void initTest() {
        consortium = createEntity(em);
    }

    @Test
    @Transactional
    void createConsortium() throws Exception {
        int databaseSizeBeforeCreate = consortiumRepository.findAll().size();
        // Create the Consortium
        restConsortiumMockMvc.perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortium))).andExpect(status().isCreated());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeCreate + 1);
        Consortium testConsortium = consortiumList.get(consortiumList.size() - 1);
        assertThat(testConsortium.getConsortiumValue()).isEqualByComparingTo(DEFAULT_CONSORTIUM_VALUE);
        assertThat(testConsortium.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testConsortium.getMinimumBidValue()).isEqualByComparingTo(DEFAULT_MINIMUM_BID_VALUE);
        assertThat(testConsortium.getSegmentType()).isEqualTo(DEFAULT_SEGMENT_TYPE);
        assertThat(testConsortium.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createConsortiumWithExistingId() throws Exception {
        // Create the Consortium with an existing ID
        consortium.setId(1L);

        int databaseSizeBeforeCreate = consortiumRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsortiumMockMvc.perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortium))).andExpect(status().isBadRequest());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsortiums() throws Exception {
        // Initialize the database
        consortiumRepository.saveAndFlush(consortium);

        // Get all the consortiumList
        restConsortiumMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consortium.getId().intValue())))
            .andExpect(jsonPath("$.[*].consortiumValue").value(hasItem(sameNumber(DEFAULT_CONSORTIUM_VALUE))))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].minimumBidValue").value(hasItem(sameNumber(DEFAULT_MINIMUM_BID_VALUE))))
            .andExpect(jsonPath("$.[*].numberOfInstallments").value(hasItem(DEFAULT_NUMBER_OF_INSTALLMENTS)))
            .andExpect(jsonPath("$.[*].installmentValue").value(hasItem(sameNumber(DEFAULT_INSTALLMENT_VALUE))))
            .andExpect(jsonPath("$.[*].segmentType").value(hasItem(DEFAULT_SEGMENT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    void getConsortium() throws Exception {
        // Initialize the database
        consortiumRepository.saveAndFlush(consortium);

        // Get the consortium
        restConsortiumMockMvc
            .perform(get(ENTITY_API_URL_ID, consortium.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consortium.getId().intValue()))
            .andExpect(jsonPath("$.consortiumValue").value(sameNumber(DEFAULT_CONSORTIUM_VALUE)))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()))
            .andExpect(jsonPath("$.minimumBidValue").value(sameNumber(DEFAULT_MINIMUM_BID_VALUE)))
            .andExpect(jsonPath("$.numberOfInstallments").value(DEFAULT_NUMBER_OF_INSTALLMENTS))
            .andExpect(jsonPath("$.installmentValue").value(sameNumber(DEFAULT_INSTALLMENT_VALUE)))
            .andExpect(jsonPath("$.segmentType").value(DEFAULT_SEGMENT_TYPE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingConsortium() throws Exception {
        // Get the consortium
        restConsortiumMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConsortium() throws Exception {
        // Initialize the database
        consortiumRepository.saveAndFlush(consortium);

        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();

        // Update the consortium
        Consortium updatedConsortium = consortiumRepository.findById(consortium.getId()).get();
        // Disconnect from session so that the updates on updatedConsortium are not directly saved in db
        em.detach(updatedConsortium);
        updatedConsortium.consortiumValue(UPDATED_CONSORTIUM_VALUE).created(UPDATED_CREATED).minimumBidValue(UPDATED_MINIMUM_BID_VALUE).segmentType(UPDATED_SEGMENT_TYPE).status(UPDATED_STATUS);

        restConsortiumMockMvc
            .perform(put(ENTITY_API_URL_ID, updatedConsortium.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedConsortium)))
            .andExpect(status().isOk());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
        Consortium testConsortium = consortiumList.get(consortiumList.size() - 1);
        assertThat(testConsortium.getConsortiumValue()).isEqualTo(UPDATED_CONSORTIUM_VALUE);
        assertThat(testConsortium.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testConsortium.getMinimumBidValue()).isEqualTo(UPDATED_MINIMUM_BID_VALUE);
        assertThat(testConsortium.getSegmentType()).isEqualTo(UPDATED_SEGMENT_TYPE);
        assertThat(testConsortium.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingConsortium() throws Exception {
        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();
        consortium.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsortiumMockMvc
            .perform(put(ENTITY_API_URL_ID, consortium.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortium)))
            .andExpect(status().isBadRequest());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsortium() throws Exception {
        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();
        consortium.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumMockMvc
            .perform(put(ENTITY_API_URL_ID, count.incrementAndGet()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortium)))
            .andExpect(status().isBadRequest());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsortium() throws Exception {
        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();
        consortium.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumMockMvc.perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consortium))).andExpect(status().isMethodNotAllowed());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsortiumWithPatch() throws Exception {
        // Initialize the database
        consortiumRepository.saveAndFlush(consortium);

        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();

        // Update the consortium using partial update
        Consortium partialUpdatedConsortium = new Consortium();
        partialUpdatedConsortium.setId(consortium.getId());

        restConsortiumMockMvc
            .perform(patch(ENTITY_API_URL_ID, partialUpdatedConsortium.getId()).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsortium)))
            .andExpect(status().isOk());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
        Consortium testConsortium = consortiumList.get(consortiumList.size() - 1);
        assertThat(testConsortium.getConsortiumValue()).isEqualByComparingTo(DEFAULT_CONSORTIUM_VALUE);
        assertThat(testConsortium.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testConsortium.getMinimumBidValue()).isEqualByComparingTo(DEFAULT_MINIMUM_BID_VALUE);
        assertThat(testConsortium.getSegmentType()).isEqualTo(DEFAULT_SEGMENT_TYPE);
        assertThat(testConsortium.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateConsortiumWithPatch() throws Exception {
        // Initialize the database
        consortiumRepository.saveAndFlush(consortium);

        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();

        // Update the consortium using partial update
        Consortium partialUpdatedConsortium = new Consortium();
        partialUpdatedConsortium.setId(consortium.getId());

        partialUpdatedConsortium.consortiumValue(UPDATED_CONSORTIUM_VALUE).created(UPDATED_CREATED).minimumBidValue(UPDATED_MINIMUM_BID_VALUE).segmentType(UPDATED_SEGMENT_TYPE).status(UPDATED_STATUS);

        restConsortiumMockMvc
            .perform(patch(ENTITY_API_URL_ID, partialUpdatedConsortium.getId()).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsortium)))
            .andExpect(status().isOk());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
        Consortium testConsortium = consortiumList.get(consortiumList.size() - 1);
        assertThat(testConsortium.getConsortiumValue()).isEqualByComparingTo(UPDATED_CONSORTIUM_VALUE);
        assertThat(testConsortium.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testConsortium.getMinimumBidValue()).isEqualByComparingTo(UPDATED_MINIMUM_BID_VALUE);
        assertThat(testConsortium.getSegmentType()).isEqualTo(UPDATED_SEGMENT_TYPE);
        assertThat(testConsortium.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingConsortium() throws Exception {
        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();
        consortium.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsortiumMockMvc
            .perform(patch(ENTITY_API_URL_ID, consortium.getId()).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consortium)))
            .andExpect(status().isBadRequest());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsortium() throws Exception {
        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();
        consortium.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumMockMvc
            .perform(patch(ENTITY_API_URL_ID, count.incrementAndGet()).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consortium)))
            .andExpect(status().isBadRequest());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsortium() throws Exception {
        int databaseSizeBeforeUpdate = consortiumRepository.findAll().size();
        consortium.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsortiumMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consortium)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consortium in the database
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsortium() throws Exception {
        // Initialize the database
        consortiumRepository.saveAndFlush(consortium);

        int databaseSizeBeforeDelete = consortiumRepository.findAll().size();

        // Delete the consortium
        restConsortiumMockMvc.perform(delete(ENTITY_API_URL_ID, consortium.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consortium> consortiumList = consortiumRepository.findAll();
        assertThat(consortiumList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
