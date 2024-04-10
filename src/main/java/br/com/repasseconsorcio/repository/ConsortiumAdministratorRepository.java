package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.ConsortiumAdministrator;
import javax.transaction.Transactional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ConsortiumAdministrator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsortiumAdministratorRepository extends JpaRepository<ConsortiumAdministrator, Long> {
    @Modifying
    @Query("delete from ConsortiumAdministrator c where c.id = ?1")
    void deleteById(Long id);
}
