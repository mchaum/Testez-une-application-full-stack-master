package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;


@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    private String token;
    private Teacher teacher;

    @BeforeEach
    public void setupDatabase() throws Exception {
    	
        teacherRepository.deleteAll();
        userRepository.deleteAll();

        User user1 = new User();
        user1.setEmail("user1@example.com");
        user1.setFirstName("First1");
        user1.setLastName("Last1");
        user1.setPassword(passwordEncoder.encode("password"));
        userRepository.save(user1);

        teacher = new Teacher();
        teacher.setFirstName("Teacher");
        teacher.setLastName("Last");
        teacherRepository.save(teacher); 

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
    public void testFindById_ShouldReturnTeacher() throws Exception {
        mockMvc.perform(get("/api/teacher/" + teacher.getId())
                .header("Authorization", "Bearer " + token))  
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacher.getId()))
                .andExpect(jsonPath("$.firstName").value("Teacher"))
                .andExpect(jsonPath("$.lastName").value("Last"));
    }

    @Test
    public void testFindById_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/999")
                .header("Authorization", "Bearer " + token))  
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFindAll_ShouldReturnTeachers() throws Exception {
        Teacher teacher1 = new Teacher();
        teacher1.setFirstName("John");
        teacher1.setLastName("Smith");
        teacherRepository.save(teacher1);

        Teacher teacher2 = new Teacher();
        teacher2.setFirstName("Homer");
        teacher2.setLastName("Simpson");
        teacherRepository.save(teacher2);

        mockMvc.perform(get("/api/teacher")
                .header("Authorization", "Bearer " + token)) 
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(teacher.getId()))
                .andExpect(jsonPath("$[0].firstName").value("Teacher"))
                .andExpect(jsonPath("$[0].lastName").value("Last"))
                .andExpect(jsonPath("$[1].firstName").value("John"))
                .andExpect(jsonPath("$[1].lastName").value("Smith"))
                .andExpect(jsonPath("$[2].firstName").value("Homer"))
                .andExpect(jsonPath("$[2].lastName").value("Simpson"));
    }
}



