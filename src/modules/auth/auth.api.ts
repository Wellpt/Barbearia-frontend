import { apiRequest } from "../../lib/api";
import type { AuthUser, LoginInput, LoginResponse } from "./auth.types";

export const authApi = {
  login: (input: LoginInput) =>
    apiRequest<LoginResponse>("/auth/login", { method: "POST", body: input }),
  me: (token: string, signal?: AbortSignal) =>
    apiRequest<AuthUser>("/auth/me", { token, signal }),
  logout: (token: string) =>
    apiRequest<void>("/auth/logout", { method: "POST", token }),
};
