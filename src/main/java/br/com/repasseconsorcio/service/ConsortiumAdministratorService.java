package br.com.repasseconsorcio.service;

import br.com.repasseconsorcio.domain.ConsortiumAdministrator;
import br.com.repasseconsorcio.repository.ConsortiumAdministratorRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ConsortiumAdministrator}.
 */
@Service
@Transactional
public class ConsortiumAdministratorService {

    private final Logger log = LoggerFactory.getLogger(ConsortiumAdministratorService.class);

    private final ConsortiumAdministratorRepository consortiumAdministratorRepository;

    public ConsortiumAdministratorService(ConsortiumAdministratorRepository consortiumAdministratorRepository) {
        this.consortiumAdministratorRepository = consortiumAdministratorRepository;
    }

    /**
     * Save a consortiumAdministrator.
     *
     * @param consortiumAdministrator the entity to save.
     * @return the persisted entity.
     */
    public ConsortiumAdministrator save(ConsortiumAdministrator consortiumAdministrator) {
        log.debug("Request to save ConsortiumAdministrator : {}", consortiumAdministrator);
        return consortiumAdministratorRepository.save(consortiumAdministrator);
    }

    /**
     * Partially update a consortiumAdministrator.
     *
     * @param consortiumAdministrator the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ConsortiumAdministrator> partialUpdate(ConsortiumAdministrator consortiumAdministrator) {
        log.debug("Request to partially update ConsortiumAdministrator : {}", consortiumAdministrator);

        return consortiumAdministratorRepository
            .findById(consortiumAdministrator.getId())
            .map(existingConsortiumAdministrator -> {
                if (consortiumAdministrator.getName() != null) {
                    existingConsortiumAdministrator.setName(consortiumAdministrator.getName());
                }
                if (consortiumAdministrator.getImage() != null) {
                    existingConsortiumAdministrator.setImage(consortiumAdministrator.getImage());
                }

                return existingConsortiumAdministrator;
            })
            .map(consortiumAdministratorRepository::save);
    }

    /**
     * Get all the consortiumAdministrators.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ConsortiumAdministrator> findAll(Pageable pageable) {
        log.debug("Request to get all ConsortiumAdministrators");
        return consortiumAdministratorRepository.findAll(pageable);
    }

    /**
     * Get one consortiumAdministrator by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ConsortiumAdministrator> findOne(Long id) {
        log.debug("Request to get ConsortiumAdministrator : {}", id);
        return consortiumAdministratorRepository.findById(id);
    }

    /**
     * Delete the consortiumAdministrator by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ConsortiumAdministrator : {}", id);
        consortiumAdministratorRepository.deleteById(id);
    }
}
