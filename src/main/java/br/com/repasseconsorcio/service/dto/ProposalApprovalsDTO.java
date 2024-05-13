package br.com.repasseconsorcio.service.dto;

import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.ConsortiumAdministrator;
import br.com.repasseconsorcio.domain.ConsortiumInstallments;
import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class ProposalApprovalsDTO {

    private Long id;
    private BigDecimal consortiumValue;
    private Instant created;
    private BigDecimal minimumBidValue;
    private SegmentType segmentType;
    private ConsortiumStatusType status;
    private Boolean contemplationStatus;
    private Set<Bid> bids = new HashSet<>();
    private User user;
    private ConsortiumAdministrator consortiumAdministrator;
    private Set<ConsortiumInstallments> consortiumInstallments = new HashSet<>();

    public ProposalApprovalsDTO() {}

    public ProposalApprovalsDTO(Consortium consortium) {
        this.id = consortium.getId();
        this.consortiumValue = consortium.getConsortiumValue();
        this.created = consortium.getCreated();
        this.minimumBidValue = consortium.getMinimumBidValue();
        this.segmentType = consortium.getSegmentType();
        this.status = consortium.getStatus();
        this.contemplationStatus = consortium.getContemplationStatus();
        this.bids = consortium.getBids();
        this.user = consortium.getUser();
        this.consortiumAdministrator = consortium.getConsortiumAdministrator();
        this.consortiumInstallments = consortium.getConsortiumInstallments();
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getConsortiumValue() {
        return consortiumValue;
    }

    public void setConsortiumValue(BigDecimal consortiumValue) {
        this.consortiumValue = consortiumValue;
    }

    public Instant getCreated() {
        return created;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public BigDecimal getMinimumBidValue() {
        return minimumBidValue;
    }

    public void setMinimumBidValue(BigDecimal minimumBidValue) {
        this.minimumBidValue = minimumBidValue;
    }

    public SegmentType getSegmentType() {
        return segmentType;
    }

    public void setSegmentType(SegmentType segmentType) {
        this.segmentType = segmentType;
    }

    public ConsortiumStatusType getStatus() {
        return status;
    }

    public void setStatus(ConsortiumStatusType status) {
        this.status = status;
    }

    public Boolean getContemplationStatus() {
        return contemplationStatus;
    }

    public void setContemplationStatus(Boolean contemplationStatus) {
        this.contemplationStatus = contemplationStatus;
    }

    public Set<Bid> getBids() {
        return bids;
    }

    public void setBids(Set<Bid> bids) {
        this.bids = bids;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public ConsortiumAdministrator getConsortiumAdministrator() {
        return consortiumAdministrator;
    }

    public void setConsortiumAdministrator(ConsortiumAdministrator consortiumAdministrator) {
        this.consortiumAdministrator = consortiumAdministrator;
    }

    public Set<ConsortiumInstallments> getConsortiumInstallments() {
        return consortiumInstallments;
    }

    public void setConsortiumInstallments(Set<ConsortiumInstallments> consortiumInstallments) {
        this.consortiumInstallments = consortiumInstallments;
    }
}
