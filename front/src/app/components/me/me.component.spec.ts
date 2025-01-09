import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { expect } from '@jest/globals';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);

    userService.getById = jest.fn().mockReturnValue({
      subscribe: jest.fn().mockImplementation((callback) => {
        callback({
          id: 1,
          firstName: 'Homer',
          lastName: 'Simpson',
          email: 'homer.simpson@example.com',
          admin: false,
          password: 'securePassword',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-02'),
        });
        return { unsubscribe: jest.fn() };
      })
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on initialization', (done) => {
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(userService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual({
        id: 1,
        firstName: 'Homer',
        lastName: 'Simpson',
        email: 'homer.simpson@example.com',
        admin: false,
        password: 'securePassword',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });
      done();
    });
  });
});
