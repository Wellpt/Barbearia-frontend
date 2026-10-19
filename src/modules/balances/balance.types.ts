export const balancePeriods = {
  diario: "Diário",
  semanal: "Semanal",
  mensal: "Mensal",
} as const;

export interface BalanceQuery {
  periodo: keyof typeof balancePeriods;
  date: string;
}

export interface BalanceAccess {
  professionalId: number;
  balanceToken: string;
}

export interface ProfessionalBalance {
  professionalId: number;
  professionalName: string;
  startDate: string;
  endDate: string;
  attendanceCount: number;
  totalReceived: string;
  paidExpensesShare: string;
  pendingExpensesShare: string;
  balance: string;
  periodo: BalanceQuery["periodo"];
  timeZone: string;
}

export type BalancePasswordMode = "unlock" | "set" | "change";

export interface BalancePasswordInput {
  password: string;
  currentPassword: string;
}
