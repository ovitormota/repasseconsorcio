package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.Consortium;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Consortium entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsortiumRepository extends JpaRepository<Consortium, Long> {
    @Query("select consortium from Consortium consortium where consortium.user.login = ?#{principal.username}")
    List<Consortium> findByUserIsCurrentUser();
}
