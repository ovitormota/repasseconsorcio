package br.com.repasseconsorcio.web.rest;

import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.repository.BidRepository;
import br.com.repasseconsorcio.security.AuthoritiesConstants;
import br.com.repasseconsorcio.service.BidService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.repasseconsorcio.domain.Bid}.
 */
@RestController
@RequestMapping("/api")
public class BidResource {

    private final Logger log = LoggerFactory.getLogger(BidResource.class);

    private static final String ENTITY_NAME = "bid";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BidService bidService;

    private final BidRepository bidRepository;

    public BidResource(BidService bidService, BidRepository bidRepository) {
        this.bidService = bidService;
        this.bidRepository = bidRepository;
    }

    /**
     * {@code POST  /bids} : Create a new bid.
     *
     * @param bid the bid to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new bid, or with status {@code 400 (Bad Request)} if the bid
     *         has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.USER + "\")")
    @PostMapping("/bids")
    public ResponseEntity<Bid> createBid(@RequestBody Bid bid) throws URISyntaxException {
        log.debug("REST request to save Bid : {}", bid);
        if (bid.getId() != null) {
            throw new BadRequestAlertException("A new bid cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Bid result = bidService.save(bid);
        return ResponseEntity.created(new URI("/api/bids/" + result.getId())).headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())).body(result);
    }

    /**
     * {@code PUT  /bids/:id} : Updates an existing bid.
     *
     * @param id  the id of the bid to save.
     * @param bid the bid to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated bid,
     *         or with status {@code 400 (Bad Request)} if the bid is not valid,
     *         or with status {@code 500 (Internal Server Error)} if the bid
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bids/{id}")
    public ResponseEntity<Bid> updateBid(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bid bid) throws URISyntaxException {
        log.debug("REST request to update Bid : {}, {}", id, bid);
        if (bid.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bid.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bidRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Bid result = bidService.save(bid);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bid.getId().toString())).body(result);
    }

    /**
     * {@code PATCH  /bids/:id} : Partial updates given fields of an existing bid,
     * field will ignore if it is null
     *
     * @param id  the id of the bid to save.
     * @param bid the bid to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated bid,
     *         or with status {@code 400 (Bad Request)} if the bid is not valid,
     *         or with status {@code 404 (Not Found)} if the bid is not found,
     *         or with status {@code 500 (Internal Server Error)} if the bid
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bids/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Bid> partialUpdateBid(@PathVariable(value = "id", required = false) final Long id, @RequestBody Bid bid) throws URISyntaxException {
        log.debug("REST request to partial update Bid partially : {}, {}", id, bid);
        if (bid.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, bid.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bidRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Bid> result = bidService.partialUpdate(bid);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, bid.getId().toString()));
    }

    /**
     * {@code GET  /bids} : get all the bids.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of bids in body.
     */
    @GetMapping("/bids")
    public ResponseEntity<List<Bid>> getAllBids(Pageable pageable) {
        log.debug("REST request to get a page of Bids");
        Page<Bid> page = bidService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bids/:id} : get the "id" bid.
     *
     * @param id the id of the bid to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the bid, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bids/{id}")
    public ResponseEntity<Bid> getBid(@PathVariable Long id) {
        log.debug("REST request to get Bid : {}", id);
        Optional<Bid> bid = bidService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bid);
    }

    /**
     * {@code GET  /bids/latest} : get the latest bid.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the bid, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bids/latest/{consortiumId}")
    public ResponseEntity<Bid> getLatestBid(@PathVariable Long consortiumId) {
        log.debug("REST request to get latest Bid");
        Optional<Bid> bid = bidService.findLatestBid(consortiumId);

        return ResponseEntity.ok().body(bid.orElse(null));
    }

    /**
     * {@code DELETE  /bids/:id} : delete the "id" bid.
     *
     * @param id the id of the bid to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bids/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable Long id) {
        log.debug("REST request to delete Bid : {}", id);
        bidService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/bids/consortium/{consortiumId}")
    public ResponseEntity<List<Bid>> getBidsByConsortiumId(@PathVariable Long consortiumId, Pageable pageable) {
        log.debug("REST request to get Bids by Consortium Id : {}", consortiumId);
        Page<Bid> page = bidService.findAllByConsortiumId(consortiumId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
