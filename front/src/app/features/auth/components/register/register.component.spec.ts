import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: { register: jest.fn(() => of(null)) } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form if email is invalid', () => {
    component.form.controls['email'].setValue('invalid-email');
    
    component.form.controls['firstName'].setValue('Homer');
    component.form.controls['lastName'].setValue('Simpson');
    component.form.controls['password'].setValue('password123');
    expect(component.form.valid).toBeFalsy();
  });
  

  it('should invalidate the form if a required field is missing', () => {
    component.form.controls['email'].setValue('homer.simpson@example.com');
    component.form.controls['firstName'].setValue('Homer');

    expect(component.form.valid).toBeFalsy();
  
  });
  

  it('should submit the form successfully when all fields are valid', () => {
    component.form.setValue({
      email: 'homer.simpson@example.com',
      firstName: 'Homer',
      lastName: 'Simpson',
      password: 'password123'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(component.form.valid).toBe(true);
  });

  it('should call register() on AuthService and navigate to /login on success', () => {
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(of(undefined));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.form.setValue({
      email: 'homer.simpson@example.com',
      firstName: 'Homer',
      lastName: 'Simpson',
      password: 'password123'
    });

    component.submit();

    expect(registerSpy).toHaveBeenCalledWith({
      email: 'homer.simpson@example.com',
      firstName: 'Homer',
      lastName: 'Simpson',
      password: 'password123'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message when register fails', () => {
    const errorResponse = { message: 'Registration failed' };
    const registerSpy = jest.spyOn(authService, 'register').mockReturnValue(throwError(() => errorResponse));

    component.submit();

    expect(component.onError).toBe(true);
  });
});