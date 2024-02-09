package br.com.repasseconsorcio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.repasseconsorcio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConsortiumTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Consortium.class);
        Consortium consortium1 = new Consortium();
        consortium1.setId(1L);
        Consortium consortium2 = new Consortium();
        consortium2.setId(consortium1.getId());
        assertThat(consortium1).isEqualTo(consortium2);
        consortium2.setId(2L);
        assertThat(consortium1).isNotEqualTo(consortium2);
        consortium1.setId(null);
        assertThat(consortium1).isNotEqualTo(consortium2);
    }
}
