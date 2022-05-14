package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ExtraUser;
import com.mycompany.myapp.repository.ExtraUserRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ExtraUserResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExtraUserResourceIT {

    private static final String DEFAULT_ROLE = "AAAAAAAAAA";
    private static final String UPDATED_ROLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/extra-users";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExtraUserRepository extraUserRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExtraUserMockMvc;

    private ExtraUser extraUser;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExtraUser createEntity(EntityManager em) {
        ExtraUser extraUser = new ExtraUser().role(DEFAULT_ROLE);
        return extraUser;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExtraUser createUpdatedEntity(EntityManager em) {
        ExtraUser extraUser = new ExtraUser().role(UPDATED_ROLE);
        return extraUser;
    }

    @BeforeEach
    public void initTest() {
        extraUser = createEntity(em);
    }

    @Test
    @Transactional
    void createExtraUser() throws Exception {
        int databaseSizeBeforeCreate = extraUserRepository.findAll().size();
        // Create the ExtraUser
        restExtraUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(extraUser)))
            .andExpect(status().isCreated());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeCreate + 1);
        ExtraUser testExtraUser = extraUserList.get(extraUserList.size() - 1);
        assertThat(testExtraUser.getRole()).isEqualTo(DEFAULT_ROLE);
    }

    @Test
    @Transactional
    void createExtraUserWithExistingId() throws Exception {
        // Create the ExtraUser with an existing ID
        extraUser.setId(1L);

        int databaseSizeBeforeCreate = extraUserRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExtraUserMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(extraUser)))
            .andExpect(status().isBadRequest());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExtraUsers() throws Exception {
        // Initialize the database
        extraUserRepository.saveAndFlush(extraUser);

        // Get all the extraUserList
        restExtraUserMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(extraUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE)));
    }

    @Test
    @Transactional
    void getExtraUser() throws Exception {
        // Initialize the database
        extraUserRepository.saveAndFlush(extraUser);

        // Get the extraUser
        restExtraUserMockMvc
            .perform(get(ENTITY_API_URL_ID, extraUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(extraUser.getId().intValue()))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE));
    }

    @Test
    @Transactional
    void getNonExistingExtraUser() throws Exception {
        // Get the extraUser
        restExtraUserMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewExtraUser() throws Exception {
        // Initialize the database
        extraUserRepository.saveAndFlush(extraUser);

        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();

        // Update the extraUser
        ExtraUser updatedExtraUser = extraUserRepository.findById(extraUser.getId()).get();
        // Disconnect from session so that the updates on updatedExtraUser are not directly saved in db
        em.detach(updatedExtraUser);
        updatedExtraUser.role(UPDATED_ROLE);

        restExtraUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExtraUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExtraUser))
            )
            .andExpect(status().isOk());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
        ExtraUser testExtraUser = extraUserList.get(extraUserList.size() - 1);
        assertThat(testExtraUser.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    void putNonExistingExtraUser() throws Exception {
        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();
        extraUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtraUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, extraUser.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExtraUser() throws Exception {
        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();
        extraUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extraUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExtraUser() throws Exception {
        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();
        extraUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(extraUser)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExtraUserWithPatch() throws Exception {
        // Initialize the database
        extraUserRepository.saveAndFlush(extraUser);

        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();

        // Update the extraUser using partial update
        ExtraUser partialUpdatedExtraUser = new ExtraUser();
        partialUpdatedExtraUser.setId(extraUser.getId());

        partialUpdatedExtraUser.role(UPDATED_ROLE);

        restExtraUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExtraUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExtraUser))
            )
            .andExpect(status().isOk());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
        ExtraUser testExtraUser = extraUserList.get(extraUserList.size() - 1);
        assertThat(testExtraUser.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    void fullUpdateExtraUserWithPatch() throws Exception {
        // Initialize the database
        extraUserRepository.saveAndFlush(extraUser);

        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();

        // Update the extraUser using partial update
        ExtraUser partialUpdatedExtraUser = new ExtraUser();
        partialUpdatedExtraUser.setId(extraUser.getId());

        partialUpdatedExtraUser.role(UPDATED_ROLE);

        restExtraUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExtraUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExtraUser))
            )
            .andExpect(status().isOk());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
        ExtraUser testExtraUser = extraUserList.get(extraUserList.size() - 1);
        assertThat(testExtraUser.getRole()).isEqualTo(UPDATED_ROLE);
    }

    @Test
    @Transactional
    void patchNonExistingExtraUser() throws Exception {
        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();
        extraUser.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtraUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, extraUser.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extraUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExtraUser() throws Exception {
        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();
        extraUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extraUser))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExtraUser() throws Exception {
        int databaseSizeBeforeUpdate = extraUserRepository.findAll().size();
        extraUser.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtraUserMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(extraUser))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExtraUser in the database
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExtraUser() throws Exception {
        // Initialize the database
        extraUserRepository.saveAndFlush(extraUser);

        int databaseSizeBeforeDelete = extraUserRepository.findAll().size();

        // Delete the extraUser
        restExtraUserMockMvc
            .perform(delete(ENTITY_API_URL_ID, extraUser.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExtraUser> extraUserList = extraUserRepository.findAll();
        assertThat(extraUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
