package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ExtraUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ExtraUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExtraUserRepository extends JpaRepository<ExtraUser, Long> {}
