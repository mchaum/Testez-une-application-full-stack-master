import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  const mockUser: User = {
    id: 123,
    email: 'testuser@example.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
    admin: false,
    createdAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getById and return user data', () => {
    const userId = '123';
    
    service.getById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); 

    httpTestingController.verify();  
  });

  it('should call delete and return success response', () => {
    const userId = '123';

    service.delete(userId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});  

    httpTestingController.verify(); 
  });
});
