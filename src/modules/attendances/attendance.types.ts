import type { Customer } from "../customers/customer.types";
import type { Professional } from "../professionals/professional.types";

export const paymentMethods = {
  cash: "Dinheiro",
  pix: "Pix",
  debit_card: "Cartão de débito",
  credit_card: "Cartão de crédito",
} as const;

export type PaymentMethod = keyof typeof paymentMethods;

export interface ServiceOption {
  id: number;
  name: string;
}

export interface AttendanceOptions {
  customers: Customer[];
  services: ServiceOption[];
  professionals: Professional[];
}

export interface AttendanceInput {
  customerId: number;
  serviceId: number;
  professionalId: number;
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface Attendance extends Omit<AttendanceInput, "amount"> {
  id: number;
  amount: string;
  performedAt: string;
  createdBy: number;
}

export interface AttendanceReceipt extends Attendance {
  customerName: string;
  serviceName: string;
  professionalName: string;
}
