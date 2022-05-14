package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Zone;
import com.mycompany.myapp.repository.ZoneRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Zone}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ZoneResource {

    private final Logger log = LoggerFactory.getLogger(ZoneResource.class);

    private static final String ENTITY_NAME = "zone";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ZoneRepository zoneRepository;

    public ZoneResource(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    /**
     * {@code POST  /zones} : Create a new zone.
     *
     * @param zone the zone to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new zone, or with status {@code 400 (Bad Request)} if the zone has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/zones")
    public ResponseEntity<Zone> createZone(@RequestBody Zone zone) throws URISyntaxException {
        log.debug("REST request to save Zone : {}", zone);
        if (zone.getId() != null) {
            throw new BadRequestAlertException("A new zone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Zone result = zoneRepository.save(zone);
        return ResponseEntity
            .created(new URI("/api/zones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /zones/:id} : Updates an existing zone.
     *
     * @param id the id of the zone to save.
     * @param zone the zone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated zone,
     * or with status {@code 400 (Bad Request)} if the zone is not valid,
     * or with status {@code 500 (Internal Server Error)} if the zone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/zones/{id}")
    public ResponseEntity<Zone> updateZone(@PathVariable(value = "id", required = false) final Long id, @RequestBody Zone zone)
        throws URISyntaxException {
        log.debug("REST request to update Zone : {}, {}", id, zone);
        if (zone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!zoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Zone result = zoneRepository.save(zone);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, zone.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /zones/:id} : Partial updates given fields of an existing zone, field will ignore if it is null
     *
     * @param id the id of the zone to save.
     * @param zone the zone to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated zone,
     * or with status {@code 400 (Bad Request)} if the zone is not valid,
     * or with status {@code 404 (Not Found)} if the zone is not found,
     * or with status {@code 500 (Internal Server Error)} if the zone couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/zones/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Zone> partialUpdateZone(@PathVariable(value = "id", required = false) final Long id, @RequestBody Zone zone)
        throws URISyntaxException {
        log.debug("REST request to partial update Zone partially : {}, {}", id, zone);
        if (zone.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, zone.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!zoneRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Zone> result = zoneRepository
            .findById(zone.getId())
            .map(existingZone -> {
                if (zone.getLibelle() != null) {
                    existingZone.setLibelle(zone.getLibelle());
                }
                if (zone.getSuperficie() != null) {
                    existingZone.setSuperficie(zone.getSuperficie());
                }
                if (zone.getNbrMaxPlante() != null) {
                    existingZone.setNbrMaxPlante(zone.getNbrMaxPlante());
                }
                if (zone.getPhoto() != null) {
                    existingZone.setPhoto(zone.getPhoto());
                }

                return existingZone;
            })
            .map(zoneRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, zone.getId().toString())
        );
    }

    /**
     * {@code GET  /zones} : get all the zones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of zones in body.
     */
    @GetMapping("/zones")
    public List<Zone> getAllZones() {
        log.debug("REST request to get all Zones");
        return zoneRepository.findAll();
    }

    /**
     * {@code GET  /zones/:id} : get the "id" zone.
     *
     * @param id the id of the zone to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the zone, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/zones/{id}")
    public ResponseEntity<Zone> getZone(@PathVariable Long id) {
        log.debug("REST request to get Zone : {}", id);
        Optional<Zone> zone = zoneRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(zone);
    }

    /**
     * {@code DELETE  /zones/:id} : delete the "id" zone.
     *
     * @param id the id of the zone to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/zones/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id) {
        log.debug("REST request to delete Zone : {}", id);
        zoneRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
