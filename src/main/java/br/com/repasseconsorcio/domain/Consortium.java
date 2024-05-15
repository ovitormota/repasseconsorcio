package br.com.repasseconsorcio.domain;

import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Consortium.
 */
@Entity
@Table(name = "consortium")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consortium implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "consortium_value", precision = 21, scale = 2)
    private BigDecimal consortiumValue;

    @Column(name = "created")
    private Instant created;

    @Column(name = "minimum_bid_value", precision = 21, scale = 2)
    private BigDecimal minimumBidValue;

    @Column(name = "contemplation_status")
    private Boolean contemplationStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "segment_type")
    private SegmentType segmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ConsortiumStatusType status;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "note")
    private String note;

    @OneToMany(mappedBy = "consortium", fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "consortium" }, allowSetters = true)
    private Set<Bid> bids = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "login", "email", "resetDate", "phoneNumber", "langKey", "imageUrl", "image", "activated" }, allowSetters = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "consortiums" }, allowSetters = true)
    private ConsortiumAdministrator consortiumAdministrator;

    @OneToMany(mappedBy = "consortium", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consortium" }, allowSetters = true)
    private Set<ConsortiumInstallments> consortiumInstallments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Consortium id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getConsortiumValue() {
        return this.consortiumValue;
    }

    public Consortium consortiumValue(BigDecimal consortiumValue) {
        this.setConsortiumValue(consortiumValue);
        return this;
    }

    public void setConsortiumValue(BigDecimal consortiumValue) {
        this.consortiumValue = consortiumValue;
    }

    public Instant getCreated() {
        return this.created;
    }

    public Consortium created(Instant created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public BigDecimal getMinimumBidValue() {
        return this.minimumBidValue;
    }

    public Consortium minimumBidValue(BigDecimal minimumBidValue) {
        this.setMinimumBidValue(minimumBidValue);
        return this;
    }

    public void setMinimumBidValue(BigDecimal minimumBidValue) {
        this.minimumBidValue = minimumBidValue;
    }

    public SegmentType getSegmentType() {
        return this.segmentType;
    }

    public Consortium segmentType(SegmentType segmentType) {
        this.setSegmentType(segmentType);
        return this;
    }

    public void setSegmentType(SegmentType segmentType) {
        this.segmentType = segmentType;
    }

    public ConsortiumStatusType getStatus() {
        return this.status;
    }

    public Consortium status(ConsortiumStatusType status) {
        this.setStatus(status);
        return this;
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
        return this.bids;
    }

    public void setBids(Set<Bid> bids) {
        if (this.bids != null) {
            this.bids.forEach(i -> i.setConsortium(null));
        }
        if (bids != null) {
            bids.forEach(i -> i.setConsortium(this));
        }
        this.bids = bids;
    }

    public Consortium bids(Set<Bid> bids) {
        this.setBids(bids);
        return this;
    }

    public Consortium addBid(Bid bid) {
        this.bids.add(bid);
        bid.setConsortium(this);
        return this;
    }

    public Consortium removeBid(Bid bid) {
        this.bids.remove(bid);
        bid.setConsortium(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Consortium user(User user) {
        this.setUser(user);
        return this;
    }

    public ConsortiumAdministrator getConsortiumAdministrator() {
        return this.consortiumAdministrator;
    }

    public void setConsortiumAdministrator(ConsortiumAdministrator consortiumAdministrator) {
        this.consortiumAdministrator = consortiumAdministrator;
    }

    public Consortium consortiumAdministrator(ConsortiumAdministrator consortiumAdministrator) {
        this.setConsortiumAdministrator(consortiumAdministrator);
        return this;
    }

    public String getNote() {
        return this.note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Set<ConsortiumInstallments> getConsortiumInstallments() {
        return this.consortiumInstallments;
    }

    public void setConsortiumInstallments(Set<ConsortiumInstallments> consortiumInstallments) {
        if (this.consortiumInstallments != null) {
            this.consortiumInstallments.forEach(i -> i.setConsortium(null));
        }
        if (consortiumInstallments != null) {
            consortiumInstallments.forEach(i -> i.setConsortium(this));
        }
        this.consortiumInstallments = consortiumInstallments;
    }

    public Consortium consortiumInstallments(Set<ConsortiumInstallments> consortiumInstallments) {
        this.setConsortiumInstallments(consortiumInstallments);
        return this;
    }

    public Consortium addConsortiumInstallments(ConsortiumInstallments consortiumInstallments) {
        this.consortiumInstallments.add(consortiumInstallments);
        consortiumInstallments.setConsortium(this);
        return this;
    }

    public Consortium removeConsortiumInstallments(ConsortiumInstallments consortiumInstallments) {
        this.consortiumInstallments.remove(consortiumInstallments);
        consortiumInstallments.setConsortium(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consortium)) {
            return false;
        }
        return id != null && id.equals(((Consortium) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consortium{" +
            "id=" + getId() +
            ", consortiumValue=" + getConsortiumValue() +
            ", created='" + getCreated() + "'" +
            ", minimumBidValue=" + getMinimumBidValue() +
            ", segmentType='" + getSegmentType() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
