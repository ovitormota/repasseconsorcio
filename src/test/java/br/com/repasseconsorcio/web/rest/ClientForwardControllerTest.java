package br.com.repasseconsorcio.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Unit tests for the {@link ClientForwardController} REST controller.
 */
class ClientForwardControllerTest {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setup() {
        ClientForwardController clientForwardController = new ClientForwardController();
        this.restMockMvc = MockMvcBuilders.standaloneSetup(clientForwardController, new TestController()).build();
    }

    @Test
    void getBackendEndpoint() throws Exception {
        restMockMvc
            .perform(get("/test"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN_VALUE))
            .andExpect(content().string("test"));
    }

    @Test
    void getClientEndpoint() throws Exception {
        ResultActions perform = restMockMvc.perform(get("/non-existant-mapping"));
        perform.andExpect(status().isOk()).andExpect(forwardedUrl("/"));
    }

    @Test
    void getNestedClientEndpoint() throws Exception {
        restMockMvc.perform(get("/admin/user-management")).andExpect(status().isOk()).andExpect(forwardedUrl("/"));
    }

    @Test
    void getWebsocketInfoEndpoint() throws Exception {
        restMockMvc.perform(get("/websocket/info")).andExpect(status().isNotFound());
    }

    @Test
    void getWebsocketEndpoint() throws Exception {
        restMockMvc.perform(get("/websocket/tracker/308/sessionId/websocket")).andExpect(status().isNotFound());
    }

    @Test
    void getWebsocketFallbackEndpoint() throws Exception {
        restMockMvc.perform(get("/websocket/tracker/308/sessionId/xhr_streaming")).andExpect(status().isNotFound());
    }

    @RestController
    public static class TestController {

        @RequestMapping(value = "/test")
        public String test() {
            return "test";
        }
    }
}
