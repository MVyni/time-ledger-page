export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface AuthResponse {
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthenticateRequest {
  email: string
  password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}
