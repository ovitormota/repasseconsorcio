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
import javax.persistence.Column;

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
    private String note;
    private String group;
    private String quota;
    private Integer totalPlanMonths;
    private BigDecimal adminFee;
    private BigDecimal amountsPaid;
    private BigDecimal outstandingBalance;
    private byte[] consortiumExtract;

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
        this.note = consortium.getNote();
        this.group = consortium.getGroup();
        this.quota = consortium.getQuota();
        this.totalPlanMonths = consortium.getTotalPlanMonths();
        this.adminFee = consortium.getAdminFee();
        this.amountsPaid = consortium.getAmountsPaid();
        this.outstandingBalance = consortium.getOutstandingBalance();
        this.consortiumExtract = consortium.getConsortiumExtract();
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getQuota() {
        return quota;
    }

    public void setQuota(String quota) {
        this.quota = quota;
    }

    public Integer getTotalPlanMonths() {
        return totalPlanMonths;
    }

    public void setTotalPlanMonths(Integer totalPlanMonths) {
        this.totalPlanMonths = totalPlanMonths;
    }

    public BigDecimal getAdminFee() {
        return adminFee;
    }

    public void setAdminFee(BigDecimal adminFee) {
        this.adminFee = adminFee;
    }

    public BigDecimal getAmountsPaid() {
        return amountsPaid;
    }

    public void setAmountsPaid(BigDecimal amountsPaid) {
        this.amountsPaid = amountsPaid;
    }

    public BigDecimal getOutstandingBalance() {
        return outstandingBalance;
    }

    public void setOutstandingBalance(BigDecimal outstandingBalance) {
        this.outstandingBalance = outstandingBalance;
    }

    public byte[] getConsortiumExtract() {
        return consortiumExtract;
    }

    public void setConsortiumExtract(byte[] consortiumExtract) {
        this.consortiumExtract = consortiumExtract;
    }
}
