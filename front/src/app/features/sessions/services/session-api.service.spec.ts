import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [SessionApiService],
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch session details', () => {
    const mockSession = { id: '1', name: 'Test Session' };
    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession); 
  });

  it('should delete a session', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({}); 
  });

  it('should participate in a session', () => {
    service.participate('1', '100').subscribe(() => {
      expect(true).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1/participate/100');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush({}); 
  });

  it('should unParticipate from a session', () => {
    service.unParticipate('1', '100').subscribe(() => {
      expect(true).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1/participate/100');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
  
});
