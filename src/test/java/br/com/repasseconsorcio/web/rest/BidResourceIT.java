package br.com.repasseconsorcio.web.rest;

import static br.com.repasseconsorcio.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.repasseconsorcio.IntegrationTest;
import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.repository.BidRepository;
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
 * Integration tests for the {@link BidResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BidResourceIT {

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    private static final Instant DEFAULT_CREATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/bids";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBidMockMvc;

    private Bid bid;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bid createEntity(EntityManager em) {
        Bid bid = new Bid().value(DEFAULT_VALUE).created(DEFAULT_CREATED);
        return bid;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Bid createUpdatedEntity(EntityManager em) {
        Bid bid = new Bid().value(UPDATED_VALUE).created(UPDATED_CREATED);
        return bid;
    }

    @BeforeEach
    public void initTest() {
        bid = createEntity(em);
    }

    @Test
    @Transactional
    void createBid() throws Exception {
        int databaseSizeBeforeCreate = bidRepository.findAll().size();
        // Create the Bid
        restBidMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bid)))
            .andExpect(status().isCreated());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeCreate + 1);
        Bid testBid = bidList.get(bidList.size() - 1);
        assertThat(testBid.getValue()).isEqualByComparingTo(DEFAULT_VALUE);
        assertThat(testBid.getCreated()).isEqualTo(DEFAULT_CREATED);
    }

    @Test
    @Transactional
    void createBidWithExistingId() throws Exception {
        // Create the Bid with an existing ID
        bid.setId(1L);

        int databaseSizeBeforeCreate = bidRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBidMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bid)))
            .andExpect(status().isBadRequest());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBids() throws Exception {
        // Initialize the database
        bidRepository.saveAndFlush(bid);

        // Get all the bidList
        restBidMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bid.getId().intValue())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(sameNumber(DEFAULT_VALUE))))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())));
    }

    @Test
    @Transactional
    void getBid() throws Exception {
        // Initialize the database
        bidRepository.saveAndFlush(bid);

        // Get the bid
        restBidMockMvc
            .perform(get(ENTITY_API_URL_ID, bid.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bid.getId().intValue()))
            .andExpect(jsonPath("$.value").value(sameNumber(DEFAULT_VALUE)))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBid() throws Exception {
        // Get the bid
        restBidMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBid() throws Exception {
        // Initialize the database
        bidRepository.saveAndFlush(bid);

        int databaseSizeBeforeUpdate = bidRepository.findAll().size();

        // Update the bid
        Bid updatedBid = bidRepository.findById(bid.getId()).get();
        // Disconnect from session so that the updates on updatedBid are not directly saved in db
        em.detach(updatedBid);
        updatedBid.value(UPDATED_VALUE).created(UPDATED_CREATED);

        restBidMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBid.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBid))
            )
            .andExpect(status().isOk());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
        Bid testBid = bidList.get(bidList.size() - 1);
        assertThat(testBid.getValue()).isEqualTo(UPDATED_VALUE);
        assertThat(testBid.getCreated()).isEqualTo(UPDATED_CREATED);
    }

    @Test
    @Transactional
    void putNonExistingBid() throws Exception {
        int databaseSizeBeforeUpdate = bidRepository.findAll().size();
        bid.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBidMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bid.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bid))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBid() throws Exception {
        int databaseSizeBeforeUpdate = bidRepository.findAll().size();
        bid.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBidMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(bid))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBid() throws Exception {
        int databaseSizeBeforeUpdate = bidRepository.findAll().size();
        bid.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBidMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(bid)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBidWithPatch() throws Exception {
        // Initialize the database
        bidRepository.saveAndFlush(bid);

        int databaseSizeBeforeUpdate = bidRepository.findAll().size();

        // Update the bid using partial update
        Bid partialUpdatedBid = new Bid();
        partialUpdatedBid.setId(bid.getId());

        partialUpdatedBid.value(UPDATED_VALUE);

        restBidMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBid.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBid))
            )
            .andExpect(status().isOk());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
        Bid testBid = bidList.get(bidList.size() - 1);
        assertThat(testBid.getValue()).isEqualByComparingTo(UPDATED_VALUE);
        assertThat(testBid.getCreated()).isEqualTo(DEFAULT_CREATED);
    }

    @Test
    @Transactional
    void fullUpdateBidWithPatch() throws Exception {
        // Initialize the database
        bidRepository.saveAndFlush(bid);

        int databaseSizeBeforeUpdate = bidRepository.findAll().size();

        // Update the bid using partial update
        Bid partialUpdatedBid = new Bid();
        partialUpdatedBid.setId(bid.getId());

        partialUpdatedBid.value(UPDATED_VALUE).created(UPDATED_CREATED);

        restBidMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBid.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBid))
            )
            .andExpect(status().isOk());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
        Bid testBid = bidList.get(bidList.size() - 1);
        assertThat(testBid.getValue()).isEqualByComparingTo(UPDATED_VALUE);
        assertThat(testBid.getCreated()).isEqualTo(UPDATED_CREATED);
    }

    @Test
    @Transactional
    void patchNonExistingBid() throws Exception {
        int databaseSizeBeforeUpdate = bidRepository.findAll().size();
        bid.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBidMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bid.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bid))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBid() throws Exception {
        int databaseSizeBeforeUpdate = bidRepository.findAll().size();
        bid.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBidMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(bid))
            )
            .andExpect(status().isBadRequest());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBid() throws Exception {
        int databaseSizeBeforeUpdate = bidRepository.findAll().size();
        bid.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBidMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(bid)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Bid in the database
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBid() throws Exception {
        // Initialize the database
        bidRepository.saveAndFlush(bid);

        int databaseSizeBeforeDelete = bidRepository.findAll().size();

        // Delete the bid
        restBidMockMvc.perform(delete(ENTITY_API_URL_ID, bid.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Bid> bidList = bidRepository.findAll();
        assertThat(bidList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
