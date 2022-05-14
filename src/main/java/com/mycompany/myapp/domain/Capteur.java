package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Capteur.
 */
@Entity
@Table(name = "capteur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Capteur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "reference")
    private String reference;

    @Column(name = "photo")
    private String photo;

    @Column(name = "frequence")
    private Double frequence;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Capteur id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public Capteur type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getReference() {
        return this.reference;
    }

    public Capteur reference(String reference) {
        this.setReference(reference);
        return this;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getPhoto() {
        return this.photo;
    }

    public Capteur photo(String photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Double getFrequence() {
        return this.frequence;
    }

    public Capteur frequence(Double frequence) {
        this.setFrequence(frequence);
        return this;
    }

    public void setFrequence(Double frequence) {
        this.frequence = frequence;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Capteur)) {
            return false;
        }
        return id != null && id.equals(((Capteur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Capteur{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", reference='" + getReference() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", frequence=" + getFrequence() +
            "}";
    }
}
