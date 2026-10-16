import type { Customer } from "./customer.types";

interface CustomersTableProps {
  customers: Customer[];
  disabled: boolean;
  onEdit(customer: Customer): void;
}

export function CustomersTable({
  customers,
  disabled,
  onEdit,
}: CustomersTableProps) {
  return (
    <div className="customers-table-container">
      <table className="customers-table">
        <caption className="visually-hidden">Clientes cadastrados</caption>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Telefone</th>
            <th scope="col">CPF</th>
            <th scope="col">
              <span className="visually-hidden">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <th scope="row">{customer.name}</th>
              <td className="customer-contact">
                {customer.phone.replace(
                  /^(\d{2})(\d{4,5})(\d{4})$/,
                  "($1) $2-$3",
                )}
              </td>
              <td className="customer-contact">
                {customer.cpf.replace(
                  /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                  "$1.$2.$3-$4",
                )}
              </td>
              <td className="customer-row-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() => onEdit(customer)}
                  disabled={disabled}
                  aria-label={`Editar cadastro de ${customer.name}`}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
