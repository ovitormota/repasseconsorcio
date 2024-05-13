package br.com.repasseconsorcio.repository;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.User;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.domain.enumeration.SegmentType;
import br.com.repasseconsorcio.service.dto.ProposalApprovalsDTO;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Consortium entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConsortiumRepository extends JpaRepository<Consortium, Long> {
    @Query("SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids where consortium.user.login = ?#{principal.username}")
    List<Consortium> findByUserIsCurrentUser();

    @Query(
        "SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids WHERE (:filterConsortiumId IS NULL or consortium.id = :filterConsortiumId) AND (:filterStatusType IS NULL OR consortium.status = :filterStatusType) AND (:segmentType IS NULL OR consortium.segmentType = :segmentType) AND consortium.user.login != ?#{principal.username}"
    )
    Page<Consortium> findAllByStatusNotInAndSegmentTypeAndUser(
        @Param("filterStatusType") ConsortiumStatusType filterStatusType,
        @Param("segmentType") SegmentType segmentType,
        @Param("filterConsortiumId") Long filterConsortiumId,
        Pageable pageable
    );

    @Query(
        "SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids WHERE (:filterConsortiumId IS NULL or consortium.id = :filterConsortiumId) AND consortium.status != 'REGISTERED' AND (:filterStatusType IS NULL OR consortium.status = :filterStatusType) AND (:segmentType IS NULL OR consortium.segmentType = :segmentType)"
    )
    Page<Consortium> findAllByAdminAndSegmentType(
        @Param("filterStatusType") ConsortiumStatusType filterStatusType,
        @Param("segmentType") SegmentType segmentType,
        @Param("filterConsortiumId") Long filterConsortiumId,
        Pageable pageable
    );

    @Query("SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids where consortium.status IN ?1 and consortium.user != ?2")
    Page<ProposalApprovalsDTO> findAllByStatusIn(List<ConsortiumStatusType> status, User loggedUser, Pageable pageable);

    @Query("SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids where consortium.status in ?1 and consortium.segmentType = ?2")
    Page<ProposalApprovalsDTO> findAllByStatusInAndSegmentType(List<ConsortiumStatusType> status, SegmentType segmentType, Pageable pageable);

    @Query("SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids WHERE consortium.status = :status AND consortium.created <= :cutoffDate")
    List<Consortium> findAllByStatusAndCreatedDate(@Param("status") ConsortiumStatusType status, @Param("cutoffDate") Instant cutoffDate);

    @Query(
        "SELECT DISTINCT consortium FROM Consortium consortium LEFT JOIN consortium.bids bids WHERE (:filterStatusType IS NULL OR consortium.status = :filterStatusType) AND (:segmentType IS NULL OR consortium.segmentType = :segmentType) AND consortium.user.login = ?#{principal.username}"
    )
    Page<Consortium> findAllMyProposalByUserIsCurrentUserAndSegmentTypeAndStatus(
        @Param("filterStatusType") ConsortiumStatusType filterStatusType,
        @Param("segmentType") SegmentType segmentType,
        Pageable pageable
    );

    @Query("SELECT count(consortium) FROM Consortium consortium WHERE consortium.status = ?1")
    Long countByStatusIn(List<ConsortiumStatusType> status);
}
