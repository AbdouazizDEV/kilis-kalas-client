export interface LoginCredentials {
  phone?: string;
  email?: string;
  password?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password?: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  userId?: string;
  requiresOtp?: boolean;
  message?: string;
}

export interface OtpVerification {
  phone: string;
  code: string;
}
