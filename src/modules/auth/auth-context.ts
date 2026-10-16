import { createContext, useContext } from "react";
import type { ApiRequestOptions } from "../../lib/api";
import type { AuthSession, LoginInput } from "./auth.types";

export interface AuthContextValue {
  session: AuthSession | null;
  notice: string | null;
  login(input: LoginInput): Promise<void>;
  logout(): Promise<void>;
  request<T>(
    path: string,
    options?: Omit<ApiRequestOptions, "token">,
  ): Promise<T>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuth = () => useContext(AuthContext)!;
