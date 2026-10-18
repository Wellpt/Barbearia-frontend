import { formatExpenseAmount, formatExpenseDate } from "./expense-format";
import { expenseStatuses, type Expense } from "./expense.types";

interface ExpensesTableProps {
  expenses: Expense[];
  disabled: boolean;
  onPay(expense: Expense): void;
}

export function ExpensesTable({ expenses, disabled, onPay }: ExpensesTableProps) {
  return (
    <div className="expenses-table-container">
      <table className="expenses-table">
        <caption className="visually-hidden">Despesas e pagamentos da barbearia</caption>
        <thead>
          <tr>
            <th scope="col">Descrição</th>
            <th scope="col">Valor</th>
            <th scope="col">Vencimento</th>
            <th scope="col">Situação</th>
            <th scope="col">Pagamento</th>
            <th scope="col"><span className="visually-hidden">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <th scope="row">{expense.description}</th>
              <td className="expense-amount">{formatExpenseAmount(expense.amount)}</td>
              <td className="expense-date">{formatExpenseDate(expense.dueDate)}</td>
              <td><span className={`expense-status expense-status-${expense.status}`}>{expenseStatuses[expense.status]}</span></td>
              <td className="expense-date">{expense.paidOn ? formatExpenseDate(expense.paidOn) : "—"}</td>
              <td className="expense-row-actions">
                {expense.paidOn === null && (
                  <button
                    className="text-button"
                    type="button"
                    disabled={disabled}
                    onClick={() => onPay(expense)}
                    aria-label={`Registrar pagamento: ${expense.description}`}
                  >
                    Registrar pagamento
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}