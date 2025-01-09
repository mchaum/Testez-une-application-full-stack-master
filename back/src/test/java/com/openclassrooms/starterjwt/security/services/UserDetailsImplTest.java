package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class UserDetailsImplTest {

    @Test
    public void testBuilder_ShouldCreateUserDetailsImpl() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .firstName("Test")
                .lastName("User")
                .admin(true)
                .password("password123")
                .build();

        assertNotNull(userDetails);
        assertEquals(1L, userDetails.getId());
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("Test", userDetails.getFirstName());
        assertEquals("User", userDetails.getLastName());
        assertTrue(userDetails.getAdmin());
        assertEquals("password123", userDetails.getPassword());
    }

    @Test
    public void testGetAuthorities_ShouldReturnEmptyCollection() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .build();

        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    public void testIsAccountNonExpired_ShouldReturnTrue() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertTrue(userDetails.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked_ShouldReturnTrue() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired_ShouldReturnTrue() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertTrue(userDetails.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled_ShouldReturnTrue() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().build();
        assertTrue(userDetails.isEnabled());
    }

    @Test
    public void testEquals_ShouldCompareUsersById() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user3 = UserDetailsImpl.builder().id(2L).build();

        assertEquals(user1, user2);
        assertNotEquals(user1, user3);
        assertNotEquals(user1, null);
        assertNotEquals(user1, new Object());
    }
}
