package br.com.repasseconsorcio.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ConsortiumAdministrator.
 */
@Entity
@Table(name = "consortium_administrator")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ConsortiumAdministrator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @OneToMany(mappedBy = "consortiumAdministrator")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "bids", "user", "consortiumAdministrator" }, allowSetters = true)
    private Set<Consortium> consortiums = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ConsortiumAdministrator id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ConsortiumAdministrator name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return this.image;
    }

    public ConsortiumAdministrator image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public ConsortiumAdministrator imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<Consortium> getConsortiums() {
        return this.consortiums;
    }

    public void setConsortiums(Set<Consortium> consortiums) {
        if (this.consortiums != null) {
            this.consortiums.forEach(i -> i.setConsortiumAdministrator(null));
        }
        if (consortiums != null) {
            consortiums.forEach(i -> i.setConsortiumAdministrator(this));
        }
        this.consortiums = consortiums;
    }

    public ConsortiumAdministrator consortiums(Set<Consortium> consortiums) {
        this.setConsortiums(consortiums);
        return this;
    }

    public ConsortiumAdministrator addConsortium(Consortium consortium) {
        this.consortiums.add(consortium);
        consortium.setConsortiumAdministrator(this);
        return this;
    }

    public ConsortiumAdministrator removeConsortium(Consortium consortium) {
        this.consortiums.remove(consortium);
        consortium.setConsortiumAdministrator(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ConsortiumAdministrator)) {
            return false;
        }
        return id != null && id.equals(((ConsortiumAdministrator) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ConsortiumAdministrator{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
