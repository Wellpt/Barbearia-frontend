import type { AuthContextValue } from "../auth/auth-context";
import type { Customer, CustomerInput } from "./customer.types";

type AuthenticatedRequest = AuthContextValue["request"];

export function listCustomers(
  request: AuthenticatedRequest,
  signal?: AbortSignal,
) {
  return request<Customer[]>("/customers", { signal });
}

export function createCustomer(
  request: AuthenticatedRequest,
  input: CustomerInput,
) {
  return request<Customer>("/customers", { method: "POST", body: input });
}

export function updateCustomer(
  request: AuthenticatedRequest,
  id: number,
  input: Partial<CustomerInput>,
) {
  return request<Customer>(`/customers/${id}`, {
    method: "PATCH",
    body: input,
  });
}
