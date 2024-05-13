package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.ConsortiumInstallments;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ConsortiumInstallments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsortiumInstallmentsRepository extends JpaRepository<ConsortiumInstallments, Long> {}
