package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.Bid;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bid entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    @Query("select bid from Bid bid where bid.user.login = ?#{principal.username}")
    List<Bid> findByUserIsCurrentUser();
}
