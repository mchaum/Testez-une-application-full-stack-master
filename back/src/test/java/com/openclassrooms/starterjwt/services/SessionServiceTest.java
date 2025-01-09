package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate_ShouldSaveSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testDelete_ShouldDeleteSessionById() {
        Long sessionId = 1L;

        sessionService.delete(sessionId);

        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    void testFindAll_ShouldReturnAllSessions() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertEquals(2, result.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void testGetById_ShouldReturnSessionIfFound() {
        Long sessionId = 1L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(sessionId);

        assertNotNull(result);
        assertEquals(session, result);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void testGetById_ShouldReturnNullIfNotFound() {
        Long sessionId = 1L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        Session result = sessionService.getById(sessionId);

        assertNull(result);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void testUpdate_ShouldUpdateSession() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        when(sessionRepository.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(sessionId, session);

        assertNotNull(updatedSession);
        assertEquals(sessionId, updatedSession.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipate_ShouldThrowNotFoundException() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testParticipate_ShouldThrowBadRequestExceptionIfAlreadyParticipates() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setUsers(Arrays.asList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    void testNoLongerParticipate_ShouldRemoveUserFromSession() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setUsers(Arrays.asList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, userId);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testNoLongerParticipate_ShouldThrowNotFoundException() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
    }

    @Test
    void testNoLongerParticipate_ShouldThrowBadRequestExceptionIfNotParticipating() {
        Long sessionId = 1L;
        Long userId = 2L;
        Session session = new Session();
        session.setUsers(Arrays.asList());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }
}
