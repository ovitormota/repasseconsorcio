package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT DISTINCT consortium FROM Consortium consortium left join consortium.bids WHERE consortium.status NOT IN ?1")
    Page<Consortium> findAllByStatusNotIn(List<ConsortiumStatusType> status, Pageable pageable);

    @Query("SELECT consortium FROM Consortium consortium WHERE consortium.status NOT IN ?1 AND consortium.segmentType = ?2")
    Page<Consortium> findAllByStatusNotInAndSegmentType(List<ConsortiumStatusType> status, SegmentType segmentType, Pageable pageable);

    @Query("select consortium from Consortium consortium where consortium.status IN ?1")
    Page<Consortium> findAllByStatusIn(List<ConsortiumStatusType> status, Pageable pageable);

    @Query("select consortium from Consortium consortium where consortium.status in ?1 and consortium.segmentType = ?2")
    Page<Consortium> findAllByStatusInAndSegmentType(List<ConsortiumStatusType> status, SegmentType segmentType, Pageable pageable);
}
