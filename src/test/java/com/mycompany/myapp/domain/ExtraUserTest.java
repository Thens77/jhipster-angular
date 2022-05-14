package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExtraUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExtraUser.class);
        ExtraUser extraUser1 = new ExtraUser();
        extraUser1.setId(1L);
        ExtraUser extraUser2 = new ExtraUser();
        extraUser2.setId(extraUser1.getId());
        assertThat(extraUser1).isEqualTo(extraUser2);
        extraUser2.setId(2L);
        assertThat(extraUser1).isNotEqualTo(extraUser2);
        extraUser1.setId(null);
        assertThat(extraUser1).isNotEqualTo(extraUser2);
    }
}
