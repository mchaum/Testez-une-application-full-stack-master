import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let httpTestingController: HttpTestingController;
  let mockSessionService: SessionService;
  let mockTeacherService: TeacherService;

  const mockSessionServiceData = {
    sessionInformation: {
      token: 'some-token',
      type: 'admin',
      id: 1,
      username: 'adminUser',
      admin: true
    }
  };

  const mockTeachers = [
    { id: 1, firstName: 'Teacher', lastName: 'Last' },
    { id: 2, firstName: 'First', lastName: 'Teacher' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionServiceData },
        {
          provide: TeacherService,
          useValue: { all: () => of(mockTeachers) },
        },
        { provide: MatSnackBar, useValue: { open: jest.fn() } },
        SessionApiService,
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    mockSessionService = TestBed.inject(SessionService);
    mockTeacherService = TestBed.inject(TeacherService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form for session creation', () => {
    expect(component.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    });
  });

  it('should disable the submit button when the form is invalid', () => {
    component.sessionForm?.setValue({
      name: '',
      date: '2024-12-30',
      teacher_id: 1,
      description: 'Test description',
    });

    fixture.detectChanges();
    const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBe(true);
  });

  it('should populate teachers from the TeacherService', () => {
    component.teachers$.subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers);
    });
  });

  it('should redirect to /sessions if the user is not admin', () => {
    mockSessionServiceData.sessionInformation.admin = false;
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should not redirect to /sessions if the user is admin', () => {
    mockSessionServiceData.sessionInformation.admin = true;
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.ngOnInit();

    expect(navigateSpy).not.toHaveBeenCalledWith(['/sessions']);
  });


  it('should submit the form and navigate to /sessions on success', () => {
    const mockSession = {
      name: 'Test Session',
      date: '2024-12-30',
      teacher_id: 1,
      description: 'Test description for session',
    };

    component.sessionForm?.setValue(mockSession);

    component.submit();

    const req = httpTestingController.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);

    req.flush({
      message: 'Session created successfully',
      data: { id: 123, ...mockSession },
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const router = TestBed.inject(Router);
      expect(router.url).toBe('/sessions');
    });
  });

  it('should submit the form and update the session on success', () => {
    const mockSession = {
      name: 'Updated Test Session',
      date: '2024-12-30',
      teacher_id: 1,
      description: 'Updated test description for session',
    };

    component.onUpdate = true;
    component['id'] = '123';
    component.sessionForm?.setValue(mockSession);
    component.submit();

    const req = httpTestingController.expectOne('api/session/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSession);

    req.flush({
      message: 'Session updated successfully',
      data: { id: 123, ...mockSession },
    });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const router = TestBed.inject(Router);
      expect(router.url).toBe('/sessions');
    });
  });
  
  it('should initialize the form with session data when in update mode', () => {
  const mockSession = {
    name: 'Test Session',
    date: new Date('2024-12-30'), 
    teacher_id: 1,
    description: 'Test description for session',
    users: [],
  };

  const route = TestBed.inject(ActivatedRoute);
  jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('123');

  const router = TestBed.inject(Router);
  jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update');

  const sessionApiService = TestBed.inject(SessionApiService);
  jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession)); 

  component.ngOnInit();

  expect(component.onUpdate).toBe(true); 
  expect(sessionApiService.detail).toHaveBeenCalledWith('123'); 
  expect(component.sessionForm?.value).toEqual({
    name: 'Test Session',
    date: '2024-12-30', 
    teacher_id: 1,
    description: 'Test description for session',
  });
});

});
