package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.ConsortiumAdministrator;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ConsortiumAdministrator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsortiumAdministratorRepository extends JpaRepository<ConsortiumAdministrator, Long> {}
