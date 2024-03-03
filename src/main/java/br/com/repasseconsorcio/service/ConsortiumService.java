package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
import br.com.repasseconsorcio.security.AuthoritiesConstants;
import br.com.repasseconsorcio.security.SecurityUtils;
import br.com.repasseconsorcio.service.util.UserCustomUtility;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Consortium}.
 */
@Service
@Transactional
public class ConsortiumService {

    private final Logger log = LoggerFactory.getLogger(ConsortiumService.class);

    private final ConsortiumRepository consortiumRepository;

    public ConsortiumService(ConsortiumRepository consortiumRepository) {
        this.consortiumRepository = consortiumRepository;
    }

    /**
     * Save a consortium.
     *
     * @param consortium the entity to save.
     * @return the persisted entity.
     */
    public Consortium save(Consortium consortium) {
        log.debug("Request to save Consortium : {}", consortium);
        User loggedUser = UserCustomUtility.getUserCustom();
        Instant now = Instant.now();

        consortium.setUser(loggedUser);
        consortium.setCreated(now);
        consortium.setStatus(ConsortiumStatusType.REGISTERED);

        return consortiumRepository.save(consortium);
    }

    /**
     * Partially update a consortium.
     *
     * @param consortium the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Consortium> partialUpdate(Consortium consortium) {
        log.debug("Request to partially update Consortium : {}", consortium);
        Instant now = Instant.now();

        return consortiumRepository
            .findById(consortium.getId())
            .map(existingConsortium -> {
                if (consortium.getConsortiumValue() != null) {
                    existingConsortium.setConsortiumValue(consortium.getConsortiumValue());
                }
                if (consortium.getCreated() != null) {
                    existingConsortium.setCreated(now);
                }
                if (consortium.getMinimumBidValue() != null) {
                    existingConsortium.setMinimumBidValue(consortium.getMinimumBidValue());
                }
                if (consortium.getNumberOfInstallments() != null) {
                    existingConsortium.setNumberOfInstallments(consortium.getNumberOfInstallments());
                }
                if (consortium.getInstallmentValue() != null) {
                    existingConsortium.setInstallmentValue(consortium.getInstallmentValue());
                }
                if (consortium.getSegmentType() != null) {
                    existingConsortium.setSegmentType(consortium.getSegmentType());
                }
                if (consortium.getStatus() != null) {
                    existingConsortium.setStatus(consortium.getStatus());
                }

                return existingConsortium;
            })
            .map(consortiumRepository::save);
    }

    /**
     * Get all the consortiums.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Consortium> findAllByStatusNotIn(Pageable pageable, SegmentType filterSegmentType) {
        log.debug("Request to get all Consortiums");

        List<ConsortiumStatusType> listStatusNotIn = new ArrayList<>();

        listStatusNotIn.add(ConsortiumStatusType.REGISTERED);
        listStatusNotIn.add(ConsortiumStatusType.CLOSED);
        listStatusNotIn.add(ConsortiumStatusType.WON);

        Boolean isAuthenticated = SecurityUtils.hasCurrentUserNoneOfAuthorities(AuthoritiesConstants.ANONYMOUS);

        Boolean isAdministrator = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);

        if (isAuthenticated && !isAdministrator) {
            if (filterSegmentType.equals(SegmentType.ALL)) {
                return consortiumRepository.findAllByStatusNotInAndUser(listStatusNotIn, pageable);
            }
            return consortiumRepository.findAllByStatusNotInAndSegmentTypeAndUser(listStatusNotIn, filterSegmentType, pageable);
        }
        if (filterSegmentType.equals(SegmentType.ALL)) {
            return consortiumRepository.findAllByStatusNotIn(listStatusNotIn, pageable);
        }
        return consortiumRepository.findAllByStatusNotInAndSegmentType(listStatusNotIn, filterSegmentType, pageable);
    }

    /**
     * Get one consortium by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Consortium> findOne(Long id) {
        log.debug("Request to get Consortium : {}", id);
        return consortiumRepository.findById(id);
    }

    /**
     * Delete the consortium by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Consortium : {}", id);
        consortiumRepository.deleteById(id);
    }

    public Page<Consortium> findAllByProposalApprovals(Pageable pageable, SegmentType filterSegmentType) {
        log.debug("Request to get all Consortiums by Proposal Approvals");

        User loggedUser = UserCustomUtility.getUserCustom();

        List<ConsortiumStatusType> statusTypes = new ArrayList<>();

        statusTypes.add(ConsortiumStatusType.REGISTERED);

        if (filterSegmentType.equals(SegmentType.ALL)) {
            return consortiumRepository.findAllByStatusIn(statusTypes, loggedUser, pageable);
        }

        return consortiumRepository.findAllByStatusInAndSegmentType(statusTypes, filterSegmentType, pageable);
    }

    public Page<Consortium> findAllMyProposals(Pageable pageable, SegmentType filterSegmentType) {
        log.debug("Request to get all My Proposals");

        if (filterSegmentType.equals(SegmentType.ALL)) {
            return consortiumRepository.findAllMyProposalByUserIsCurrentUser(pageable);
        }

        return consortiumRepository.findAllMyProposalByUserIsCurrentUserAndSegmentType(filterSegmentType, pageable);
    }
}
