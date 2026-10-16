export interface Customer {
  id: number;
  name: string;
  phone: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerInput = Pick<Customer, "name" | "phone" | "cpf">;
