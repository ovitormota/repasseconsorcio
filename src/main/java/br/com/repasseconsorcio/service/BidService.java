package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.repository.BidRepository;
import br.com.repasseconsorcio.service.util.UserCustomUtility;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.hibernate.service.spi.ServiceException;
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

    private final MailService mailService;

    public BidService(BidRepository bidRepository, MailService mailService) {
        this.bidRepository = bidRepository;
        this.mailService = mailService;
    }

    /**
     * Save a bid.
     *
     * @param bid the entity to save.
     * @return the persisted entity.
     */
    public Bid save(Bid bid) {
        log.debug("Request to save Bid : {}", bid);
        User loggedUser = UserCustomUtility.getUserCustom();

        Instant cutoffDate = bid.getConsortium().getCreated().plus(7, ChronoUnit.DAYS);

        if (cutoffDate.isBefore(Instant.now())) {
            throw new ServiceException("Não é possível dar lance em um consórcio que já encerrou.");
        }

        if (bid.getConsortium().getUser().getId().equals(loggedUser.getId())) {
            throw new ServiceException("Não é possível dar lance para si mesmo.");
        }

        Optional<Bid> latestBid = bidRepository.findLatestBid(bid.getConsortium().getId());

        if (latestBid.isPresent() && latestBid.get().getValue().compareTo(bid.getValue()) >= 0) {
            throw new ServiceException("Existe um lance mais recente com valor igual ou superior ao informado.");
        }

        Instant now = Instant.now();

        bid.setUser(loggedUser);
        bid.setCreated(now);

        Bid result = bidRepository.save(bid);

        if (result.getId() != null) {
            mailService.sendBidReceivedNotification(bid);
        }

        return result;
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
        return bidRepository.findAllByUserIsCurrentUser(pageable);
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

    /**
     * Get the latest bid.
     *
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Bid> findLatestBid(Long consortiumId) {
        log.debug("Request to get latest Bid");
        return bidRepository.findLatestBid(consortiumId);
    }

    @Transactional(readOnly = true)
    public Page<Bid> findAllByConsortiumId(Long consortiumId, Pageable pageable) {
        log.debug("Request to get all Bids by consortium id");
        return bidRepository.findAllByConsortiumId(consortiumId, pageable);
    }
}
