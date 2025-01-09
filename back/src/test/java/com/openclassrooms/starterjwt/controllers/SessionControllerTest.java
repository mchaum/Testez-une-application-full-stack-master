package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;

import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;

import java.util.Arrays;
import java.util.Date;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private String token;
    private Long userId1;


    @BeforeEach
    public void setupDatabase() throws Exception {

        sessionRepository.deleteAll();
        userRepository.deleteAll();

        User user1 = new User();
        user1.setEmail("user1@example.com");
        user1.setFirstName("First1");
        user1.setLastName("Last1");
        user1.setPassword(passwordEncoder.encode("password"));
        userRepository.save(user1);
        userId1 = user1.getId();
        

        User user2 = new User();
        user2.setEmail("user2@example.com");
        user2.setFirstName("First2");
        user2.setLastName("Last2");
        user2.setPassword(passwordEncoder.encode("password"));
        userRepository.save(user2);

        Teacher teacher = new Teacher();
        teacher.setFirstName("Teacher");
        teacher.setLastName("Last");
        teacherRepository.save(teacher);

        Session session = new Session();
        session.setName("Session 1")
                .setDate(new Date())
                .setDescription("Test session")
                .setTeacher(teacher)  
                .setUsers(Arrays.asList(user1, user2));
        sessionRepository.save(session);

        token = obtainAccessToken(user1.getEmail(), "password");
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
    public void testCreateSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Session 2");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Another test session");
        Teacher teacher = teacherRepository.findAll().get(0); 
        sessionDto.setTeacher_id(teacher.getId()); 

        mockMvc.perform(post("/api/session")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(sessionDto)))  
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session 2"))
                .andExpect(jsonPath("$.description").value("Another test session"))
                .andExpect(jsonPath("$.teacher_id").value(teacher.getId())); 
    }

    @Test
    public void testFindAllSessions() throws Exception {
        mockMvc.perform(get("/api/session")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Session 1"))
                .andExpect(jsonPath("$[0].description").value("Test session"));
    }

    @Test
    public void testFindSessionById() throws Exception {
        Session session = sessionRepository.findAll().get(0); 

        mockMvc.perform(get("/api/session/{id}", session.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session 1"))
                .andExpect(jsonPath("$.description").value("Test session"));
    }

    @Test
    public void testUpdateSession() throws Exception {
        Session session = sessionRepository.findAll().get(0);
        
        mockMvc.perform(put("/api/session/{id}", session.getId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\": \"Updated Session\", \"date\": \"2024-12-31\", \"description\": \"Updated description\", \"teacher_id\": " + session.getTeacher().getId() + "}"))  // Ajoute teacher_id ici
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"))
                .andExpect(jsonPath("$.description").value("Updated description"));

    }

    @Test
    public void testDeleteSession() throws Exception {
        Session session = sessionRepository.findAll().get(0);

        mockMvc.perform(delete("/api/session/{id}", session.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    public void testNoLongerParticipateInSession() throws Exception {
        Session session = sessionRepository.findAll().get(0); 
        User user = userRepository.findById(userId1)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        mockMvc.perform(delete("/api/session/{id}/participate/{userId}", session.getId(), user.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

}

