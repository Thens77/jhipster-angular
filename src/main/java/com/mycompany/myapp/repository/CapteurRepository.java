package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Capteur;
import com.mycompany.myapp.domain.Connecte;
import com.mysql.cj.x.protobuf.MysqlxCrud.Collection;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Capteur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CapteurRepository extends JpaRepository<Capteur, Long> {
	@Query("SELECT c FROM Capteur c WHERE c.id not in (SELECT v.capteur.id from Connecte v WHERE v.capteur.id is not Null) ")
	List<Capteur> getCapNotUsed();
}
