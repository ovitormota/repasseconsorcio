package br.com.repasseconsorcio.web.rest;

import br.com.repasseconsorcio.domain.ConsortiumAdministrator;
import br.com.repasseconsorcio.repository.ConsortiumAdministratorRepository;
import br.com.repasseconsorcio.service.ConsortiumAdministratorService;
import br.com.repasseconsorcio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.repasseconsorcio.domain.ConsortiumAdministrator}.
 */
@RestController
@RequestMapping("/api")
public class ConsortiumAdministratorResource {

    private final Logger log = LoggerFactory.getLogger(ConsortiumAdministratorResource.class);

    private static final String ENTITY_NAME = "consortiumAdministrator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsortiumAdministratorService consortiumAdministratorService;

    private final ConsortiumAdministratorRepository consortiumAdministratorRepository;

    public ConsortiumAdministratorResource(
        ConsortiumAdministratorService consortiumAdministratorService,
        ConsortiumAdministratorRepository consortiumAdministratorRepository
    ) {
        this.consortiumAdministratorService = consortiumAdministratorService;
        this.consortiumAdministratorRepository = consortiumAdministratorRepository;
    }

    /**
     * {@code POST  /consortium-administrators} : Create a new consortiumAdministrator.
     *
     * @param consortiumAdministrator the consortiumAdministrator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consortiumAdministrator, or with status {@code 400 (Bad Request)} if the consortiumAdministrator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consortium-administrators")
    public ResponseEntity<ConsortiumAdministrator> createConsortiumAdministrator(
        @Valid @RequestBody ConsortiumAdministrator consortiumAdministrator
    ) throws URISyntaxException {
        log.debug("REST request to save ConsortiumAdministrator : {}", consortiumAdministrator);
        if (consortiumAdministrator.getId() != null) {
            throw new BadRequestAlertException("A new consortiumAdministrator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ConsortiumAdministrator result = consortiumAdministratorService.save(consortiumAdministrator);
        return ResponseEntity
            .created(new URI("/api/consortium-administrators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consortium-administrators/:id} : Updates an existing consortiumAdministrator.
     *
     * @param id the id of the consortiumAdministrator to save.
     * @param consortiumAdministrator the consortiumAdministrator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consortiumAdministrator,
     * or with status {@code 400 (Bad Request)} if the consortiumAdministrator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consortiumAdministrator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consortium-administrators/{id}")
    public ResponseEntity<ConsortiumAdministrator> updateConsortiumAdministrator(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ConsortiumAdministrator consortiumAdministrator
    ) throws URISyntaxException {
        log.debug("REST request to update ConsortiumAdministrator : {}, {}", id, consortiumAdministrator);
        if (consortiumAdministrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consortiumAdministrator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consortiumAdministratorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ConsortiumAdministrator result = consortiumAdministratorService.save(consortiumAdministrator);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consortiumAdministrator.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /consortium-administrators/:id} : Partial updates given fields of an existing consortiumAdministrator, field will ignore if it is null
     *
     * @param id the id of the consortiumAdministrator to save.
     * @param consortiumAdministrator the consortiumAdministrator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consortiumAdministrator,
     * or with status {@code 400 (Bad Request)} if the consortiumAdministrator is not valid,
     * or with status {@code 404 (Not Found)} if the consortiumAdministrator is not found,
     * or with status {@code 500 (Internal Server Error)} if the consortiumAdministrator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consortium-administrators/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ConsortiumAdministrator> partialUpdateConsortiumAdministrator(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ConsortiumAdministrator consortiumAdministrator
    ) throws URISyntaxException {
        log.debug("REST request to partial update ConsortiumAdministrator partially : {}, {}", id, consortiumAdministrator);
        if (consortiumAdministrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consortiumAdministrator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consortiumAdministratorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ConsortiumAdministrator> result = consortiumAdministratorService.partialUpdate(consortiumAdministrator);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consortiumAdministrator.getId().toString())
        );
    }

    /**
     * {@code GET  /consortium-administrators} : get all the consortiumAdministrators.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consortiumAdministrators in body.
     */
    @GetMapping("/consortium-administrators")
    public ResponseEntity<List<ConsortiumAdministrator>> getAllConsortiumAdministrators(Pageable pageable) {
        log.debug("REST request to get a page of ConsortiumAdministrators");
        Page<ConsortiumAdministrator> page = consortiumAdministratorService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /consortium-administrators/:id} : get the "id" consortiumAdministrator.
     *
     * @param id the id of the consortiumAdministrator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consortiumAdministrator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consortium-administrators/{id}")
    public ResponseEntity<ConsortiumAdministrator> getConsortiumAdministrator(@PathVariable Long id) {
        log.debug("REST request to get ConsortiumAdministrator : {}", id);
        Optional<ConsortiumAdministrator> consortiumAdministrator = consortiumAdministratorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(consortiumAdministrator);
    }

    /**
     * {@code DELETE  /consortium-administrators/:id} : delete the "id" consortiumAdministrator.
     *
     * @param id the id of the consortiumAdministrator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consortium-administrators/{id}")
    public ResponseEntity<Void> deleteConsortiumAdministrator(@PathVariable Long id) {
        log.debug("REST request to delete ConsortiumAdministrator : {}", id);
        consortiumAdministratorService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
