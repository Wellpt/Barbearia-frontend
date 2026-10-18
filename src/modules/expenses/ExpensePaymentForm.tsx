import { useState, type FormEvent } from "react";
import { RequestError } from "../../components/RequestError";
import { formatExpenseAmount, formatExpenseDate, todayInSaoPaulo } from "./expense-format";
import type { Expense } from "./expense.types";

interface ExpensePaymentFormProps {
  expense: Expense;
  isSaving: boolean;
  error: Error | null;
  onSave(paidOn: string): Promise<void>;
  onCancel(): void;
}

export function ExpensePaymentForm({ expense, isSaving, error, onSave, onCancel }: ExpensePaymentFormProps) {
  const today = todayInSaoPaulo();
  const [paidOn, setPaidOn] = useState(today);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return onSave(paidOn);
  }

  return (
    <section className="panel expense-form-panel" aria-labelledby="expense-payment-title">
      <p className="eyebrow">PAGAMENTO INTEGRAL</p>
      <h2 id="expense-payment-title">Registrar pagamento</h2>
      <p className="expense-payment-description">{expense.description}</p>
      <p className="expense-form-description">
        {formatExpenseAmount(expense.amount)} · Vencimento em {formatExpenseDate(expense.dueDate)}
      </p>
      <form className="expense-form" onSubmit={handleSubmit} aria-busy={isSaving}>
        <div className="form-field expense-payment-date">
          <label htmlFor="expense-paid-on">Data do pagamento</label>
          <input
            id="expense-paid-on"
            name="paidOn"
            type="date"
            required
            max={today}
            autoFocus
            disabled={isSaving}
            value={paidOn}
            onChange={(event) => setPaidOn(event.target.value)}
          />
        </div>
        <p className="expense-payment-help">
          Confirme somente se a conta já foi paga. O valor integral será considerado no balanço pela data informada.
        </p>
        {error && <RequestError error={error} />}
        <div className="expense-form-actions">
          <button className="button button-secondary" type="button" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </button>
          <button className="button" type="submit" disabled={isSaving}>
            {isSaving ? "Registrando…" : "Confirmar pagamento"}
          </button>
        </div>
      </form>
    </section>
  );
}