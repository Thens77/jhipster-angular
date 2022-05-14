package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Installation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Installation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstallationRepository extends JpaRepository<Installation, Long> {}
