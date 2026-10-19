import type { AuthContextValue } from "../auth/auth-context";
import type {
  BalanceAccess,
  BalanceQuery,
  ProfessionalBalance,
} from "./balance.types";

type AuthenticatedRequest = AuthContextValue["request"];

export function openBalanceAccess(
  request: AuthenticatedRequest,
  id: number,
  password: string,
) {
  return request<BalanceAccess>(`/professionals/${id}/balance-access`, {
    method: "POST",
    body: { password },
  });
}

export function closeBalanceAccess(
  request: AuthenticatedRequest,
  access: BalanceAccess,
) {
  return request<void>(
    `/professionals/${access.professionalId}/balance-access`,
    {
      method: "DELETE",
      headers: { "X-Balance-Token": access.balanceToken },
    },
  );
}

export function getBalance(
  request: AuthenticatedRequest,
  access: BalanceAccess,
  query: BalanceQuery,
  signal?: AbortSignal,
) {
  const parameters = new URLSearchParams({
    periodo: query.periodo,
    date: query.date,
  });
  return request<ProfessionalBalance>(
    `/professionals/${access.professionalId}/balances?${parameters}`,
    {
      headers: { "X-Balance-Token": access.balanceToken },
      signal,
    },
  );
}

export function setBalancePassword(
  request: AuthenticatedRequest,
  id: number,
  password: string,
) {
  return request<void>(`/professionals/${id}/balance-password`, {
    method: "POST",
    body: { password },
  });
}

export function changeBalancePassword(
  request: AuthenticatedRequest,
  id: number,
  currentPassword: string,
  newPassword: string,
) {
  return request<void>(`/professionals/${id}/balance-password`, {
    method: "PATCH",
    body: { currentPassword, newPassword },
  });
}
