import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService],
      });
  
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
    });
  
    afterEach(() => {
      httpMock.verify();
    });
  
    it('should send a POST request to register', () => {
      const registerRequest: RegisterRequest = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'securePassword',
      };
  
      service.register(registerRequest).subscribe({
        next: () => {
          expect(true).toBe(true); 
        },
        error: () => {
          fail('The request should not fail');
        },
      });
  
      // Vérification de la requête HTTP //
      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest); 
      req.flush(null);
    });
  });