package br.com.repasseconsorcio.domain;

import br.com.repasseconsorcio.domain.enumeration.StatusConsortiumInstallmentsType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Date;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ConsortiumInstallments.
 */
@Entity
@Table(name = "consortium_installments")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ConsortiumInstallments implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "number_of_installments")
    private Integer numberOfInstallments;

    @Column(name = "installment_value", precision = 21, scale = 2)
    private BigDecimal installmentValue;

    @Column(name = "installment_date")
    private Date installmentDate;

    @Column(name = "status")
    private StatusConsortiumInstallmentsType status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "bids", "consortiumInstallments", "user", "consortiumAdministrator" }, allowSetters = true)
    private Consortium consortium;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ConsortiumInstallments id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumberOfInstallments() {
        return this.numberOfInstallments;
    }

    public ConsortiumInstallments numberOfInstallments(Integer numberOfInstallments) {
        this.setNumberOfInstallments(numberOfInstallments);
        return this;
    }

    public void setNumberOfInstallments(Integer numberOfInstallments) {
        this.numberOfInstallments = numberOfInstallments;
    }

    public BigDecimal getInstallmentValue() {
        return this.installmentValue;
    }

    public ConsortiumInstallments installmentValue(BigDecimal installmentValue) {
        this.setInstallmentValue(installmentValue);
        return this;
    }

    public void setInstallmentValue(BigDecimal installmentValue) {
        this.installmentValue = installmentValue;
    }

    public Consortium getConsortium() {
        return this.consortium;
    }

    public void setConsortium(Consortium consortium) {
        this.consortium = consortium;
    }

    public ConsortiumInstallments consortium(Consortium consortium) {
        this.setConsortium(consortium);
        return this;
    }

    public Date getInstallmentDate() {
        return this.installmentDate;
    }

    public ConsortiumInstallments installmentDate(Date installmentDate) {
        this.setInstallmentDate(installmentDate);
        return this;
    }

    public void setInstallmentDate(Date installmentDate) {
        this.installmentDate = installmentDate;
    }

    public StatusConsortiumInstallmentsType getStatus() {
        return this.status;
    }

    public ConsortiumInstallments status(StatusConsortiumInstallmentsType status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(StatusConsortiumInstallmentsType status) {
        this.status = status;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ConsortiumInstallments)) {
            return false;
        }
        return id != null && id.equals(((ConsortiumInstallments) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ConsortiumInstallments{" +
            "id=" + getId() +
            ", numberOfInstallments=" + getNumberOfInstallments() +
            ", installmentValue=" + getInstallmentValue() +
            "}";
    }
}
