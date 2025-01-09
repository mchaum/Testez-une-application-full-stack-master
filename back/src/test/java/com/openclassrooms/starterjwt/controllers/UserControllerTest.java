package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    private String token;
    private User user;

    @BeforeEach
    public void setupDatabase() throws Exception {
    
        userRepository.deleteAll();

        user = new User();
        user.setEmail("user1@example.com");
        user.setFirstName("First1");
        user.setLastName("Last1");
        user.setPassword(passwordEncoder.encode("password"));
        userRepository.save(user);

        token = obtainAccessToken(user.getEmail(), "password");
    }

    private String obtainAccessToken(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}"))
                .andExpect(status().isOk())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        return new JSONObject(response).getString("token");
    }
    
    @Test
    public void testFindById_ShouldReturnUser() throws Exception {
    	mockMvc.perform(get("/api/user/" + user.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId())) 
                .andExpect(jsonPath("$.email").value("user1@example.com")) 
                .andExpect(jsonPath("$.firstName").value("First1")) 
                .andExpect(jsonPath("$.lastName").value("Last1")); 
    }

    @Test
    public void testFindById_ShouldReturnNotFound() throws Exception {
    	mockMvc.perform(get("/api/user/999")
                .header("Authorization", "Bearer " + token))  
                .andExpect(status().isNotFound());
    }

    @Test
    public void testDeleteUser_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete("/api/user/" + user.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        boolean userExists = userRepository.existsById(user.getId());
        Assertions.assertFalse(userExists, "L'utilisateur devrait être supprimé.");
    }

    @Test
    public void testDeleteUser_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(delete("/api/user/999")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
    
}
