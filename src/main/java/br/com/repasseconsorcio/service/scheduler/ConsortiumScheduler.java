package br.com.repasseconsorcio.service.scheduler;

import br.com.repasseconsorcio.domain.Bid;
import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
import br.com.repasseconsorcio.service.BidService;
import br.com.repasseconsorcio.service.ConsortiumService;
import br.com.repasseconsorcio.service.MailService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ConsortiumScheduler {

    private final ConsortiumService consortiumService;
    private final ConsortiumRepository consortiumRepository;
    private final MailService mailService;
    private final BidService bidService;

    public ConsortiumScheduler(ConsortiumService consortiumService, ConsortiumRepository consortiumRepository, MailService mailService, BidService bidService) {
        this.consortiumService = consortiumService;
        this.consortiumRepository = consortiumRepository;
        this.mailService = mailService;
        this.bidService = bidService;
    }

    @Transactional
    public void execute() {
        Instant cutoffDate = Instant.now().minus(7, ChronoUnit.DAYS);
        List<Consortium> consortiums = consortiumRepository.findAllByStatusAndCreatedDate(ConsortiumStatusType.OPEN, cutoffDate);

        consortiums.forEach(consortium -> {
            if (consortium.getBids().isEmpty()) {
                consortium.setCreated(consortium.getCreated().plus(7, ChronoUnit.DAYS));
                consortiumService.partialUpdate(consortium);
                return;
            }

            consortium.setStatus(ConsortiumStatusType.WON);
            Optional<Consortium> result = consortiumService.partialUpdate(consortium);

            if (result.isPresent()) {
                Optional<Bid> bid = bidService.findLatestBid(result.get().getId());

                if (bid.isPresent()) {
                    mailService.sendAuctionResultWinnerNotification(bid.get().getUser(), result.get());
                    mailService.sendAuctionResultOwnerNotification(result.get());
                }
            }
        });
    }
}
