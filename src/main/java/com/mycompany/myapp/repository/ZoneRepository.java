package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Zone;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Zone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {}
