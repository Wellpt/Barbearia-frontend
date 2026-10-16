import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ApiError, apiRequest, type ApiRequestOptions } from "../../lib/api";
import { authApi } from "./auth.api";
import { AuthContext } from "./auth-context";
import type { AuthSession, LoginInput } from "./auth.types";
import { SessionScreen } from "./SessionScreen";
import "./auth.css";

const SESSION_KEY = "barbearia.accessToken";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function clearSession(message: string | null = null) {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
    setRestoreError(null);
    setNotice(message);
  }

  const restoreSession = useCallback(async (signal?: AbortSignal) => {
    setIsRestoring(true);
    setRestoreError(null);
    const token = sessionStorage.getItem(SESSION_KEY);
    try {
      if (token) {
        const user = await authApi.me(token, signal);
        if (!signal?.aborted) setSession({ accessToken: token, user });
      }
    } catch (error) {
      if (signal?.aborted) return;
      if (error instanceof ApiError && error.status === 401) {
        sessionStorage.removeItem(SESSION_KEY);
        setSession(null);
        setNotice("Sua sessão expirou. Entre novamente.");
      } else {
        setRestoreError(
          error instanceof Error
            ? error.message
            : "Não foi possível verificar sua sessão.",
        );
      }
    } finally {
      if (!signal?.aborted) setIsRestoring(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void restoreSession(controller.signal);
    return () => controller.abort();
  }, [restoreSession]);

  async function login(input: LoginInput) {
    const result = await authApi.login(input);
    sessionStorage.setItem(SESSION_KEY, result.accessToken);
    setSession({ accessToken: result.accessToken, user: result.user });
    setNotice(null);
  }

  async function logout() {
    if (session) {
      try {
        await authApi.logout(session.accessToken);
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) throw error;
      }
    }
    clearSession();
  }

  async function request<T>(
    path: string,
    options: Omit<ApiRequestOptions, "token"> = {},
  ) {
    try {
      return await apiRequest<T>(path, {
        ...options,
        token: session?.accessToken,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearSession("Sua sessão expirou. Entre novamente.");
      }
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ session, notice, login, logout, request }}>
      {isRestoring ? (
        <SessionScreen />
      ) : restoreError ? (
        <SessionScreen
          error={restoreError}
          onRetry={() => void restoreSession()}
          onReset={() => clearSession()}
        />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
