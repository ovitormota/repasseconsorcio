package br.com.repasseconsorcio.web.rest;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
import br.com.repasseconsorcio.service.ConsortiumService;
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
 * REST controller for managing {@link br.com.repasseconsorcio.domain.Consortium}.
 */
@RestController
@RequestMapping("/api")
public class ConsortiumResource {

    private final Logger log = LoggerFactory.getLogger(ConsortiumResource.class);

    private static final String ENTITY_NAME = "consortium";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsortiumService consortiumService;

    private final ConsortiumRepository consortiumRepository;

    public ConsortiumResource(ConsortiumService consortiumService, ConsortiumRepository consortiumRepository) {
        this.consortiumService = consortiumService;
        this.consortiumRepository = consortiumRepository;
    }

    /**
     * {@code POST  /consortiums} : Create a new consortium.
     *
     * @param consortium the consortium to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consortium, or with status {@code 400 (Bad Request)} if the consortium has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consortiums")
    public ResponseEntity<Consortium> createConsortium(@RequestBody Consortium consortium) throws URISyntaxException {
        log.debug("REST request to save Consortium : {}", consortium);
        if (consortium.getId() != null) {
            throw new BadRequestAlertException("A new consortium cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Consortium result = consortiumService.save(consortium);
        return ResponseEntity
            .created(new URI("/api/consortiums/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consortiums/:id} : Updates an existing consortium.
     *
     * @param id the id of the consortium to save.
     * @param consortium the consortium to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consortium,
     * or with status {@code 400 (Bad Request)} if the consortium is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consortium couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consortiums/{id}")
    public ResponseEntity<Consortium> updateConsortium(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consortium consortium
    ) throws URISyntaxException {
        log.debug("REST request to update Consortium : {}, {}", id, consortium);
        if (consortium.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consortium.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consortiumRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Consortium result = consortiumService.save(consortium);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consortium.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /consortiums/:id} : Partial updates given fields of an existing consortium, field will ignore if it is null
     *
     * @param id the id of the consortium to save.
     * @param consortium the consortium to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consortium,
     * or with status {@code 400 (Bad Request)} if the consortium is not valid,
     * or with status {@code 404 (Not Found)} if the consortium is not found,
     * or with status {@code 500 (Internal Server Error)} if the consortium couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consortiums/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Consortium> partialUpdateConsortium(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consortium consortium
    ) throws URISyntaxException {
        log.debug("REST request to partial update Consortium partially : {}, {}", id, consortium);
        if (consortium.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consortium.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consortiumRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Consortium> result = consortiumService.partialUpdate(consortium);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consortium.getId().toString())
        );
    }

    /**
     * {@code GET  /consortiums} : get all the consortiums.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consortiums in body.
     */
    @GetMapping("/consortiums")
    public ResponseEntity<List<Consortium>> getAllConsortiums(Pageable pageable) {
        log.debug("REST request to get a page of Consortiums");
        Page<Consortium> page = consortiumService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /consortiums/:id} : get the "id" consortium.
     *
     * @param id the id of the consortium to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consortium, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consortiums/{id}")
    public ResponseEntity<Consortium> getConsortium(@PathVariable Long id) {
        log.debug("REST request to get Consortium : {}", id);
        Optional<Consortium> consortium = consortiumService.findOne(id);
        return ResponseUtil.wrapOrNotFound(consortium);
    }

    /**
     * {@code DELETE  /consortiums/:id} : delete the "id" consortium.
     *
     * @param id the id of the consortium to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consortiums/{id}")
    public ResponseEntity<Void> deleteConsortium(@PathVariable Long id) {
        log.debug("REST request to delete Consortium : {}", id);
        consortiumService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
