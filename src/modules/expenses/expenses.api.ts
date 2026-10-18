import type { AuthContextValue } from "../auth/auth-context";
import type { Expense, ExpenseInput } from "./expense.types";

type AuthenticatedRequest = AuthContextValue["request"];

export function listExpenses(request: AuthenticatedRequest, signal?: AbortSignal) {
  return request<Expense[]>("/expenses", { signal });
}

export function createExpense(request: AuthenticatedRequest, input: ExpenseInput) {
  return request<Expense>("/expenses", { method: "POST", body: input });
}

export function payExpense(
  request: AuthenticatedRequest,
  id: number,
  paidOn: string,
) {
  return request<Expense>(`/expenses/${id}/payment`, {
    method: "PATCH",
    body: { paidOn },
  });
}