import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return requiresOtp on phone login', (done) => {
    service.login({ phone: '+221771234567' }).subscribe((result) => {
      expect(result.success).toBeTrue();
      expect(result.requiresOtp).toBeTrue();
      done();
    });
  });

  it('should validate OTP with 4 digits', (done) => {
    service.verifyOtp('+221771234567', '1234').subscribe((result) => {
      expect(result.success).toBeTrue();
      expect(result.token).toBeDefined();
      done();
    });
  });
});
