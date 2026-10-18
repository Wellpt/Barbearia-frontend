export const expenseStatuses = {
  pending: "Pendente",
  due_soon: "Vence em até 5 dias",
  overdue: "Vencida",
  paid: "Paga",
} as const;

export interface Expense {
  id: number;
  description: string;
  amount: string;
  dueDate: string;
  paidOn: string | null;
  status: keyof typeof expenseStatuses;
  createdBy: number;
  paymentRecordedBy: number | null;
  createdAt: string;
}

export interface ExpenseInput {
  description: string;
  amount: number;
  dueDate: string;
}