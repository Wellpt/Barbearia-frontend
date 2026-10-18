import { useState, type FormEvent } from "react";
import { RequestError } from "../../components/RequestError";
import type { ExpenseInput } from "./expense.types";

interface ExpenseFormProps {
  isSaving: boolean;
  error: Error | null;
  onSave(input: ExpenseInput): Promise<void>;
  onCancel(): void;
}

export function ExpenseForm({ isSaving, error, onSave, onCancel }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return onSave({ description, amount: Number(amount), dueDate });
  }

  return (
    <section className="panel expense-form-panel" aria-labelledby="expense-form-title">
      <p className="eyebrow">CONTAS DA BARBEARIA</p>
      <h2 id="expense-form-title">Nova despesa</h2>
      <p className="expense-form-description">
        Informe o valor integral da conta e a data do vencimento.
      </p>
      <form className="expense-form" onSubmit={handleSubmit} aria-busy={isSaving}>
        <fieldset disabled={isSaving}>
          <legend className="visually-hidden">Dados da despesa</legend>
          <div className="form-field expense-description-field">
            <label htmlFor="expense-description">Descrição</label>
            <input
              id="expense-description"
              name="description"
              required
              maxLength={255}
              autoFocus
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="expense-amount">Valor (R$)</label>
            <input
              id="expense-amount"
              name="amount"
              type="number"
              inputMode="decimal"
              required
              min="0.01"
              max="9999999999.99"
              step="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="expense-due-date">Vencimento</label>
            <input
              id="expense-due-date"
              name="dueDate"
              type="date"
              required
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </fieldset>
        {error && <RequestError error={error} />}
        <div className="expense-form-actions">
          <button className="button button-secondary" type="button" onClick={onCancel} disabled={isSaving}>
            Cancelar
          </button>
          <button className="button" type="submit" disabled={isSaving}>
            {isSaving ? "Salvando…" : "Cadastrar despesa"}
          </button>
        </div>
      </form>
    </section>
  );
}