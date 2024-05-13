package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.ConsortiumInstallments;
import br.com.repasseconsorcio.repository.ConsortiumInstallmentsRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ConsortiumInstallments}.
 */
@Service
@Transactional
public class ConsortiumInstallmentsService {

    private final Logger log = LoggerFactory.getLogger(ConsortiumInstallmentsService.class);

    private final ConsortiumInstallmentsRepository consortiumInstallmentsRepository;

    public ConsortiumInstallmentsService(ConsortiumInstallmentsRepository consortiumInstallmentsRepository) {
        this.consortiumInstallmentsRepository = consortiumInstallmentsRepository;
    }

    /**
     * Save a consortiumInstallments.
     *
     * @param consortiumInstallments the entity to save.
     * @return the persisted entity.
     */
    public ConsortiumInstallments save(ConsortiumInstallments consortiumInstallments) {
        log.debug("Request to save ConsortiumInstallments : {}", consortiumInstallments);
        return consortiumInstallmentsRepository.save(consortiumInstallments);
    }

    /**
     * Partially update a consortiumInstallments.
     *
     * @param consortiumInstallments the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ConsortiumInstallments> partialUpdate(ConsortiumInstallments consortiumInstallments) {
        log.debug("Request to partially update ConsortiumInstallments : {}", consortiumInstallments);

        return consortiumInstallmentsRepository
            .findById(consortiumInstallments.getId())
            .map(existingConsortiumInstallments -> {
                if (consortiumInstallments.getNumberOfInstallments() != null) {
                    existingConsortiumInstallments.setNumberOfInstallments(consortiumInstallments.getNumberOfInstallments());
                }
                if (consortiumInstallments.getInstallmentValue() != null) {
                    existingConsortiumInstallments.setInstallmentValue(consortiumInstallments.getInstallmentValue());
                }

                return existingConsortiumInstallments;
            })
            .map(consortiumInstallmentsRepository::save);
    }

    /**
     * Get all the consortiumInstallments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ConsortiumInstallments> findAll(Pageable pageable) {
        log.debug("Request to get all ConsortiumInstallments");
        return consortiumInstallmentsRepository.findAll(pageable);
    }

    /**
     * Get one consortiumInstallments by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ConsortiumInstallments> findOne(Long id) {
        log.debug("Request to get ConsortiumInstallments : {}", id);
        return consortiumInstallmentsRepository.findById(id);
    }

    /**
     * Delete the consortiumInstallments by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ConsortiumInstallments : {}", id);
        consortiumInstallmentsRepository.deleteById(id);
    }
}
