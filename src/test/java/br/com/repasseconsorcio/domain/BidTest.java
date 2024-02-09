package br.com.repasseconsorcio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.repasseconsorcio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BidTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Bid.class);
        Bid bid1 = new Bid();
        bid1.setId(1L);
        Bid bid2 = new Bid();
        bid2.setId(bid1.getId());
        assertThat(bid1).isEqualTo(bid2);
        bid2.setId(2L);
        assertThat(bid1).isNotEqualTo(bid2);
        bid1.setId(null);
        assertThat(bid1).isNotEqualTo(bid2);
    }
}
