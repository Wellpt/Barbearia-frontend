import type { AuthContextValue } from "../auth/auth-context";
import type { Professional } from "./professional.types";

type AuthenticatedRequest = AuthContextValue["request"];

export function listProfessionals(
  request: AuthenticatedRequest,
  signal?: AbortSignal,
) {
  return request<Professional[]>("/professionals", { signal });
}

export function createProfessional(
  request: AuthenticatedRequest,
  name: string,
) {
  return request<Professional>("/professionals", {
    method: "POST",
    body: { name },
  });
}

export function updateProfessionalStatus(
  request: AuthenticatedRequest,
  id: number,
  isActive: boolean,
) {
  return request<Professional>(`/professionals/${id}/status`, {
    method: "PATCH",
    body: { isActive },
  });
}
