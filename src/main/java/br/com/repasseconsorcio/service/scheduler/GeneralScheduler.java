package br.com.repasseconsorcio.service.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class GeneralScheduler {

    private final ConsortiumScheduler consortiumScheduler;

    public GeneralScheduler(ConsortiumScheduler consortiumScheduler) {
        this.consortiumScheduler = consortiumScheduler;
    }

    @Scheduled(cron = "0 */10 * * * *")
    public void executeConsortiumScheduler() {
        consortiumScheduler.execute();
    }
}
