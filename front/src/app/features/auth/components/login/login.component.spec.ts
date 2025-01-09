import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { expect } from '@jest/globals';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [AuthService, SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form if email or password is missing', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('should invalidate the form if email is invalid', () => {
    component.form.controls['email'].setValue('invalid-email');
    component.form.controls['password'].setValue('password123');
    expect(component.form.valid).toBeFalsy();
  });

  it('should show error if login fails', () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');
    component.submit();

    expect(component.onError).toBeTruthy();
  });

  it('should call AuthService.login with the correct data', () => {
    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue(of({
      token: 'dummy-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    }));

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');
    component.submit();

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should navigate to /sessions on successful login', () => {
    jest.spyOn(authService, 'login').mockReturnValue(of({
      token: 'dummy-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    }));
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');
    component.submit();

    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should call SessionService.logIn with the correct session information', () => {
    const sessionSpy = jest.spyOn(sessionService, 'logIn');
    jest.spyOn(authService, 'login').mockReturnValue(of({
      token: 'dummy-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    }));

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');
    component.submit();

    expect(sessionSpy).toHaveBeenCalledWith({
      token: 'dummy-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    });
  });
});
