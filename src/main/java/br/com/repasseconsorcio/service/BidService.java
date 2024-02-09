package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.repository.BidRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Bid}.
 */
@Service
@Transactional
public class BidService {

    private final Logger log = LoggerFactory.getLogger(BidService.class);

    private final BidRepository bidRepository;

    public BidService(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }

    /**
     * Save a bid.
     *
     * @param bid the entity to save.
     * @return the persisted entity.
     */
    public Bid save(Bid bid) {
        log.debug("Request to save Bid : {}", bid);
        return bidRepository.save(bid);
    }

    /**
     * Partially update a bid.
     *
     * @param bid the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Bid> partialUpdate(Bid bid) {
        log.debug("Request to partially update Bid : {}", bid);

        return bidRepository
            .findById(bid.getId())
            .map(existingBid -> {
                if (bid.getValue() != null) {
                    existingBid.setValue(bid.getValue());
                }
                if (bid.getCreated() != null) {
                    existingBid.setCreated(bid.getCreated());
                }

                return existingBid;
            })
            .map(bidRepository::save);
    }

    /**
     * Get all the bids.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Bid> findAll(Pageable pageable) {
        log.debug("Request to get all Bids");
        return bidRepository.findAll(pageable);
    }

    /**
     * Get one bid by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Bid> findOne(Long id) {
        log.debug("Request to get Bid : {}", id);
        return bidRepository.findById(id);
    }

    /**
     * Delete the bid by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Bid : {}", id);
        bidRepository.deleteById(id);
    }
}
