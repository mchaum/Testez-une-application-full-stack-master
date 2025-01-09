import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from './services/session.service';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { SessionInformation } from './interfaces/sessionInformation.interface';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges(); 
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect logged-in state through $isLogged()', (done) => {
    const sessionInfo: SessionInformation = {
      token: 'dummy-token',     
      type: 'user',             
      id: 1,                   
      username: 'testUser',  
      firstName: 'Homer',      
      lastName: 'Simpson', 
      admin: false,             
    };

    sessionService.logIn(sessionInfo);

    component.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      done();
    });

    fixture.detectChanges();
  });
  

  it('should call logOut() and update the logged-in state', (done) => {
    const sessionInfo: SessionInformation = {
      token: 'dummy-token',     
      type: 'user',             
      id: 1,                   
      username: 'testUser',  
      firstName: 'Homer',      
      lastName: 'Simpson', 
      admin: false,             
    };

    sessionService.logIn(sessionInfo);

    component.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
    });

    component.logout();

    component.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
      done();
    });

    fixture.detectChanges();
  });
});