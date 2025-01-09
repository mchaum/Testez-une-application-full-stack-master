package com.openclassrooms.starterjwt.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import javax.servlet.FilterChain;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AuthTokenFilterTest {

    @InjectMocks
    private AuthTokenFilter authTokenFilter; 

    @Mock
    private JwtUtils jwtUtils; 

    @Mock
    private UserDetailsServiceImpl userDetailsService; 

    @Mock
    private HttpServletRequest request; 

    @Mock
    private HttpServletResponse response; 

    @Mock
    private FilterChain filterChain; 

    private String token = "valid-jwt-token";
    private String username = "testuser";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDoFilterInternal_ShouldAuthenticateUser() throws Exception {
        
        when(jwtUtils.validateJwtToken(token)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn(username);

        UserDetails userDetails = User.builder().username(username).password("password").roles("USER").build();
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(username, SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Test
    void testDoFilterInternal_ShouldNotAuthenticateWhenInvalidToken() throws Exception {
  
        when(jwtUtils.validateJwtToken(token)).thenReturn(false);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}
