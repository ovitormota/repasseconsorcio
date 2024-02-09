package br.com.repasseconsorcio.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.repasseconsorcio.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConsortiumAdministratorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ConsortiumAdministrator.class);
        ConsortiumAdministrator consortiumAdministrator1 = new ConsortiumAdministrator();
        consortiumAdministrator1.setId(1L);
        ConsortiumAdministrator consortiumAdministrator2 = new ConsortiumAdministrator();
        consortiumAdministrator2.setId(consortiumAdministrator1.getId());
        assertThat(consortiumAdministrator1).isEqualTo(consortiumAdministrator2);
        consortiumAdministrator2.setId(2L);
        assertThat(consortiumAdministrator1).isNotEqualTo(consortiumAdministrator2);
        consortiumAdministrator1.setId(null);
        assertThat(consortiumAdministrator1).isNotEqualTo(consortiumAdministrator2);
    }
}
