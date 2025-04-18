package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.ConsortiumInstallments;
import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
import br.com.repasseconsorcio.security.AuthoritiesConstants;
import br.com.repasseconsorcio.security.SecurityUtils;
import br.com.repasseconsorcio.service.dto.ProposalApprovalsDTO;
import br.com.repasseconsorcio.service.util.UserCustomUtility;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    private final UserService userService;

    private final ConsortiumInstallmentsService consortiumInstallmentsService;

    public ConsortiumService(ConsortiumRepository consortiumRepository, UserService userService, ConsortiumInstallmentsService consortiumInstallmentsService) {
        this.consortiumRepository = consortiumRepository;
        this.userService = userService;
        this.consortiumInstallmentsService = consortiumInstallmentsService;
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

        Consortium result = consortiumRepository.save(consortium);

        return result;
    }

    /**
     * Partially update a consortium.
     *
     * @param consortium the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Consortium> partialUpdate(Consortium consortium) {
        log.debug("Request to partially update Consortium : {}", consortium);

        return consortiumRepository
            .findById(consortium.getId())
            .map(existingConsortium -> {
                if (consortium.getConsortiumValue() != null) {
                    existingConsortium.setConsortiumValue(consortium.getConsortiumValue());
                }
                if (consortium.getCreated() != null) {
                    existingConsortium.setCreated(consortium.getCreated());
                }
                if (consortium.getMinimumBidValue() != null) {
                    existingConsortium.setMinimumBidValue(consortium.getMinimumBidValue());
                }
                if (consortium.getSegmentType() != null) {
                    existingConsortium.setSegmentType(consortium.getSegmentType());
                }
                if (consortium.getStatus() != null) {
                    existingConsortium.setStatus(consortium.getStatus());
                }
                if (consortium.getEditedConsortiumExtract() != null) {
                    existingConsortium.setEditedConsortiumExtract(consortium.getEditedConsortiumExtract());
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
    public Page<Consortium> findAllByStatusNotIn(Pageable pageable, SegmentType filterSegmentType, ConsortiumStatusType filterStatusType, Long filterConsortiumId) {
        log.debug("Request to get all Consortiums");

        Boolean isAuthenticated = SecurityUtils.hasCurrentUserNoneOfAuthorities(AuthoritiesConstants.ANONYMOUS);

        Boolean isAdmin = SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN);

        filterSegmentType = filterSegmentType.equals(SegmentType.ALL) ? null : filterSegmentType;

        filterStatusType = filterStatusType.equals(ConsortiumStatusType.ALL) ? null : filterStatusType;

        if (isAuthenticated && !isAdmin) {
            filterStatusType = ConsortiumStatusType.OPEN;
            Page<Consortium> consortiums = consortiumRepository.findAllByStatusNotInAndSegmentTypeAndUser(filterStatusType, filterSegmentType, filterConsortiumId, pageable);

            consortiums
                .getContent()
                .forEach(consortium -> {
                    consortium.setConsortiumExtract(null);
                    consortium.setUser(null);
                    Optional<BigDecimal> minBidValue = consortium.getBids().stream().map(Bid::getValue).max(Comparator.naturalOrder());
                    minBidValue.ifPresent(consortium::setMinimumBidValue);
                    consortium.getBids().forEach(nullBid -> nullBid.setConsortium(null));
                });

            return consortiums;
        }
        if (!isAdmin) {
            filterStatusType = ConsortiumStatusType.OPEN;
        }

        Page<Consortium> consortiums = consortiumRepository.findAllByAdminAndSegmentType(filterStatusType, filterSegmentType, filterConsortiumId, pageable);

        consortiums
            .getContent()
            .forEach(consortium -> {
                consortium.setConsortiumExtract(isAdmin ? consortium.getConsortiumExtract() : null);
                consortium.setEditedConsortiumExtract(isAuthenticated ? consortium.getEditedConsortiumExtract() : null);
                consortium.setUser(null);
                Optional<BigDecimal> minBidValue = consortium.getBids().stream().map(Bid::getValue).max(Comparator.naturalOrder());
                minBidValue.ifPresent(consortium::setMinimumBidValue);
                consortium.getBids().forEach(nullBid -> nullBid.setConsortium(null));
            });

        return consortiums;
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

    @Transactional(readOnly = true)
    public Page<ProposalApprovalsDTO> findAllByProposalApprovals(Pageable pageable, SegmentType filterSegmentType) {
        log.debug("Request to get all Consortiums by Proposal Approvals");

        User loggedUser = UserCustomUtility.getUserCustom();

        List<ConsortiumStatusType> statusTypes = new ArrayList<>();

        statusTypes.add(ConsortiumStatusType.REGISTERED);

        Page<ProposalApprovalsDTO> consortiums;
        if (filterSegmentType.equals(SegmentType.ALL)) {
            consortiums = consortiumRepository.findAllByStatusIn(statusTypes, loggedUser, pageable);
        } else {
            consortiums = consortiumRepository.findAllByStatusInAndSegmentType(statusTypes, filterSegmentType, pageable);
        }

        consortiums
            .getContent()
            .forEach(consortium -> {
                User user = consortium.getUser();
                user = userService.updateUserImageWithSignedUrl(user);
                consortium.setUser(user);
            });

        return consortiums;
    }

    @Transactional(readOnly = true)
    public Page<Consortium> findAllMyProposals(Pageable pageable, SegmentType filterSegmentType, ConsortiumStatusType filterStatusType) {
        log.debug("Request to get all My Proposals");

        filterSegmentType = filterSegmentType.equals(SegmentType.ALL) ? null : filterSegmentType;
        filterStatusType = filterStatusType.equals(ConsortiumStatusType.ALL) ? null : filterStatusType;

        Page<Consortium> consortiums = consortiumRepository.findAllMyProposalByUserIsCurrentUserAndSegmentTypeAndStatus(filterStatusType, filterSegmentType, pageable);

        consortiums
            .getContent()
            .forEach(consortium -> {
                consortium.setConsortiumExtract(null);
            });

        return consortiums;
    }

    public Long countByProposalApprovals() {
        log.debug("Request to count all Consortiums by Proposal Approvals");

        List<ConsortiumStatusType> statusTypes = new ArrayList<>();

        statusTypes.add(ConsortiumStatusType.REGISTERED);

        return consortiumRepository.countByStatusIn(statusTypes);
    }
}
