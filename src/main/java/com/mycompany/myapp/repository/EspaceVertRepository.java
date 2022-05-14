package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.EspaceVert;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EspaceVert entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EspaceVertRepository extends JpaRepository<EspaceVert, Long> {
    @Query("select espaceVert from EspaceVert espaceVert where espaceVert.user.login = ?#{principal.username}")
    List<EspaceVert> findByUserIsCurrentUser();
}
