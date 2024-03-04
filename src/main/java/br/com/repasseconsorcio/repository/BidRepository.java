package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.Bid;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bid entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    @Query("select bid from Bid bid where bid.user.login = ?#{principal.username}")
    List<Bid> findByUserIsCurrentUser();

    @Query("SELECT bid from Bid bid WHERE bid.value = (SELECT max(b.value) FROM Bid b WHERE b.consortium.id = :consortiumId) AND bid.consortium.id = :consortiumId")
    Optional<Bid> findLatestBid(@Param("consortiumId") Long consortiumId);

    @Query("select bid from Bid bid where bid.user.login = ?#{principal.username}")
    Page<Bid> findAllByUserIsCurrentUser(Pageable pageable);

    @Query("select bid from Bid bid where bid.consortium.id = :consortiumId")
    Page<Bid> findAllByConsortiumId(@Param("consortiumId") Long consortiumId, Pageable pageable);
}
