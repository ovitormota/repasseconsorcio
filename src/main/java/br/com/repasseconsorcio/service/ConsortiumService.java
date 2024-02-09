package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
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
    public Page<Consortium> findAll(Pageable pageable) {
        log.debug("Request to get all Consortiums");
        return consortiumRepository.findAll(pageable);
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
}
