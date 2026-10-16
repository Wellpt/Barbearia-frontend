export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface LoginResponse extends AuthSession {
  tokenType: "Bearer";
  expiresAt: string;
}
