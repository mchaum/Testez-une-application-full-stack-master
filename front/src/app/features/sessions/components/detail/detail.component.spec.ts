import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionApiService: any;
  let service: SessionService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  beforeEach(async () => {
    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of({
        id: '1',
        name: 'Yoga Session',
        date: '2024-12-20',
        description: 'A relaxing yoga session.',
        users: [1, 2, 3],
        createdAt: '2024-12-15',
        updatedAt: '2024-12-18',
        teacher_id: '1'
      })),
      participate: jest.fn(),
      unParticipate: jest.fn(),
      delete: jest.fn().mockReturnValue(of({})) 
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule,
        ReactiveFormsModule 
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        FormBuilder
      ]
    }).compileComponents();

    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    router = TestBed.inject(Router); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display "Delete" button if user is admin', () => {
    component.isAdmin = true;
    fixture.detectChanges(); 
    
    const deleteButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
    expect(deleteButton).toBeTruthy(); 
    expect(deleteButton.textContent).toContain('Delete');
  });
  
  
  it('should not display "Delete" button if user is not admin', () => {
    component.isAdmin = false;
    fixture.detectChanges();
    
    const deleteButton = fixture.nativeElement.querySelector('Delete');
    expect(deleteButton).toBeNull(); 
  });

  it('should navigate to /sessions when delete is called', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.delete();
  
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
  

  
});