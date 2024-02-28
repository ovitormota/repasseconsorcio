package br.com.repasseconsorcio.service.scheduler;

import br.com.repasseconsorcio.domain.Consortium;
import br.com.repasseconsorcio.domain.enumeration.ConsortiumStatusType;
import br.com.repasseconsorcio.repository.ConsortiumRepository;
import br.com.repasseconsorcio.service.ConsortiumService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ConsortiumScheduler {

    private final ConsortiumService consortiumService;
    private final ConsortiumRepository consortiumRepository;

    public ConsortiumScheduler(ConsortiumService consortiumService, ConsortiumRepository consortiumRepository) {
        this.consortiumService = consortiumService;
        this.consortiumRepository = consortiumRepository;
    }

    @Transactional
    public void execute() {
        Instant cutoffDate = Instant.now().minus(7, ChronoUnit.DAYS);
        List<Consortium> consortiums = consortiumRepository.findAllByStatusAndCreatedDate(ConsortiumStatusType.OPEN, cutoffDate);

        consortiums.forEach(consortium -> {
            consortium.setStatus(ConsortiumStatusType.CLOSED);
            consortiumService.partialUpdate(consortium);
        });
    }
}
