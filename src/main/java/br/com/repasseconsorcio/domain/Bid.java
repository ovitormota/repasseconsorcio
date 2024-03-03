package br.com.repasseconsorcio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Bid.
 */
@Entity
@Table(name = "bid")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Bid implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "value", precision = 21, scale = 2)
    private BigDecimal value;

    @Column(name = "created")
    private Instant created;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bids", "user" }, allowSetters = true)
    private Consortium consortium;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Bid id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getValue() {
        return this.value;
    }

    public Bid value(BigDecimal value) {
        this.setValue(value);
        return this;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Instant getCreated() {
        return this.created;
    }

    public Bid created(Instant created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bid user(User user) {
        this.setUser(user);
        return this;
    }

    public Consortium getConsortium() {
        return this.consortium;
    }

    public void setConsortium(Consortium consortium) {
        this.consortium = consortium;
    }

    public Bid consortium(Consortium consortium) {
        this.setConsortium(consortium);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bid)) {
            return false;
        }
        return id != null && id.equals(((Bid) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bid{" +
            "id=" + getId() +
            ", value=" + getValue() +
            ", created='" + getCreated() + "'" +
            "}";
    }
}
