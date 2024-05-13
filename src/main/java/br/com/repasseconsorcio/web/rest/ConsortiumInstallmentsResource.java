package br.com.repasseconsorcio.web.rest;

import br.com.repasseconsorcio.domain.ConsortiumInstallments;
import br.com.repasseconsorcio.repository.ConsortiumInstallmentsRepository;
import br.com.repasseconsorcio.service.ConsortiumInstallmentsService;
import br.com.repasseconsorcio.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
 * REST controller for managing {@link br.com.repasseconsorcio.domain.ConsortiumInstallments}.
 */
@RestController
@RequestMapping("/api")
public class ConsortiumInstallmentsResource {

    private final Logger log = LoggerFactory.getLogger(ConsortiumInstallmentsResource.class);

    private static final String ENTITY_NAME = "consortiumInstallments";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsortiumInstallmentsService consortiumInstallmentsService;

    private final ConsortiumInstallmentsRepository consortiumInstallmentsRepository;

    public ConsortiumInstallmentsResource(ConsortiumInstallmentsService consortiumInstallmentsService, ConsortiumInstallmentsRepository consortiumInstallmentsRepository) {
        this.consortiumInstallmentsService = consortiumInstallmentsService;
        this.consortiumInstallmentsRepository = consortiumInstallmentsRepository;
    }

    /**
     * {@code POST  /consortium-installments} : Create a new consortiumInstallments.
     *
     * @param consortiumInstallments the consortiumInstallments to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consortiumInstallments, or with status {@code 400 (Bad Request)} if the consortiumInstallments has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consortium-installments")
    public ResponseEntity<ConsortiumInstallments> createConsortiumInstallments(@RequestBody ConsortiumInstallments consortiumInstallments) throws URISyntaxException {
        log.debug("REST request to save ConsortiumInstallments : {}", consortiumInstallments);
        if (consortiumInstallments.getId() != null) {
            throw new BadRequestAlertException("A new consortiumInstallments cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ConsortiumInstallments result = consortiumInstallmentsService.save(consortiumInstallments);
        return ResponseEntity
            .created(new URI("/api/consortium-installments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consortium-installments/:id} : Updates an existing consortiumInstallments.
     *
     * @param id the id of the consortiumInstallments to save.
     * @param consortiumInstallments the consortiumInstallments to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consortiumInstallments,
     * or with status {@code 400 (Bad Request)} if the consortiumInstallments is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consortiumInstallments couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consortium-installments/{id}")
    public ResponseEntity<ConsortiumInstallments> updateConsortiumInstallments(@PathVariable(value = "id", required = false) final Long id, @RequestBody ConsortiumInstallments consortiumInstallments)
        throws URISyntaxException {
        log.debug("REST request to update ConsortiumInstallments : {}, {}", id, consortiumInstallments);
        if (consortiumInstallments.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consortiumInstallments.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consortiumInstallmentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ConsortiumInstallments result = consortiumInstallmentsService.save(consortiumInstallments);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consortiumInstallments.getId().toString())).body(result);
    }

    /**
     * {@code PATCH  /consortium-installments/:id} : Partial updates given fields of an existing consortiumInstallments, field will ignore if it is null
     *
     * @param id the id of the consortiumInstallments to save.
     * @param consortiumInstallments the consortiumInstallments to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consortiumInstallments,
     * or with status {@code 400 (Bad Request)} if the consortiumInstallments is not valid,
     * or with status {@code 404 (Not Found)} if the consortiumInstallments is not found,
     * or with status {@code 500 (Internal Server Error)} if the consortiumInstallments couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consortium-installments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ConsortiumInstallments> partialUpdateConsortiumInstallments(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ConsortiumInstallments consortiumInstallments
    ) throws URISyntaxException {
        log.debug("REST request to partial update ConsortiumInstallments partially : {}, {}", id, consortiumInstallments);
        if (consortiumInstallments.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consortiumInstallments.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consortiumInstallmentsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ConsortiumInstallments> result = consortiumInstallmentsService.partialUpdate(consortiumInstallments);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consortiumInstallments.getId().toString()));
    }

    /**
     * {@code GET  /consortium-installments} : get all the consortiumInstallments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consortiumInstallments in body.
     */
    @GetMapping("/consortium-installments")
    public ResponseEntity<List<ConsortiumInstallments>> getAllConsortiumInstallments(Pageable pageable) {
        log.debug("REST request to get a page of ConsortiumInstallments");
        Page<ConsortiumInstallments> page = consortiumInstallmentsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /consortium-installments/:id} : get the "id" consortiumInstallments.
     *
     * @param id the id of the consortiumInstallments to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consortiumInstallments, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consortium-installments/{id}")
    public ResponseEntity<ConsortiumInstallments> getConsortiumInstallments(@PathVariable Long id) {
        log.debug("REST request to get ConsortiumInstallments : {}", id);
        Optional<ConsortiumInstallments> consortiumInstallments = consortiumInstallmentsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(consortiumInstallments);
    }

    /**
     * {@code DELETE  /consortium-installments/:id} : delete the "id" consortiumInstallments.
     *
     * @param id the id of the consortiumInstallments to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consortium-installments/{id}")
    public ResponseEntity<Void> deleteConsortiumInstallments(@PathVariable Long id) {
        log.debug("REST request to delete ConsortiumInstallments : {}", id);
        consortiumInstallmentsService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
