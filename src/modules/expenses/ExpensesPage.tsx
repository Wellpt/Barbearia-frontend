import { useCallback, useEffect, useState } from "react";
import { RequestError } from "../../components/RequestError";
import { useAuth } from "../auth/auth-context";
import { ExpenseForm } from "./ExpenseForm";
import { ExpensePaymentForm } from "./ExpensePaymentForm";
import { ExpensesTable } from "./ExpensesTable";
import { createExpense, listExpenses, payExpense } from "./expenses.api";
import type { Expense, ExpenseInput } from "./expense.types";
import "./expenses.css";

type OpenForm = { kind: "create" } | { kind: "payment"; expense: Expense };

export function ExpensesPage() {
  const { request } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [form, setForm] = useState<OpenForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await listExpenses(request, signal);
      if (!signal?.aborted) setExpenses(result);
    } catch (error) {
      if (!signal?.aborted) {
        setLoadError(error instanceof Error ? error : new Error("Não foi possível carregar as despesas."));
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  function openForm(next: OpenForm) {
    setSaveError(null);
    setNotice(null);
    setForm(next);
  }

  async function save(input: ExpenseInput) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const expense = await createExpense(request, input);
      setExpenses((previous) => [...previous, expense]);
      setNotice("Despesa cadastrada.");
      setForm(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error : new Error("Não foi possível cadastrar a despesa."));
    } finally {
      setIsSaving(false);
    }
  }

  async function recordPayment(expense: Expense, paidOn: string) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await payExpense(request, expense.id, paidOn);
      setExpenses((previous) => previous.map((item) => item.id === updated.id ? updated : item));
      setNotice(`Pagamento registrado: ${updated.description}.`);
      setForm(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error : new Error("Não foi possível registrar o pagamento."));
    } finally {
      setIsSaving(false);
    }
  }

  const orderedExpenses = [...expenses].sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.id - b.id);
  const overdueCount = expenses.filter((expense) => expense.status === "overdue").length;
  const dueSoonCount = expenses.filter((expense) => expense.status === "due_soon").length;
  const actionsDisabled = isLoading || isSaving || form !== null;

  return (
    <div className="expenses-page">
      <div className="expenses-toolbar">
        <p>Cadastre as contas e registre o pagamento quando ele for realizado.</p>
        <button className="button" type="button" onClick={() => openForm({ kind: "create" })} disabled={actionsDisabled || loadError !== null}>
          Nova despesa <span aria-hidden="true">+</span>
        </button>
      </div>
      {notice && <p className="expenses-notice" role="status">{notice}</p>}
      {form?.kind === "create" && (
        <ExpenseForm isSaving={isSaving} error={saveError} onSave={save} onCancel={() => setForm(null)} />
      )}
      {form?.kind === "payment" && (
        <ExpensePaymentForm expense={form.expense} isSaving={isSaving} error={saveError} onSave={(paidOn) => recordPayment(form.expense, paidOn)} onCancel={() => setForm(null)} />
      )}
      {!isLoading && !loadError && (overdueCount > 0 || dueSoonCount > 0) && (
        <aside className="expenses-alerts" aria-label="Atenção aos vencimentos" role="status">
          {overdueCount > 0 && <p className="expenses-alert-overdue"><strong>{overdueCount === 1 ? "1 despesa vencida" : `${overdueCount} despesas vencidas`}</strong>. Confira o pagamento das contas em atraso.</p>}
          {dueSoonCount > 0 && <p className="expenses-alert-due-soon"><strong>{dueSoonCount === 1 ? "1 despesa vence" : `${dueSoonCount} despesas vencem`} em até 5 dias</strong>, incluindo hoje.</p>}
        </aside>
      )}
      <section className="panel expenses-list" aria-labelledby="expenses-list-title" aria-busy={isLoading}>
        <div className="expenses-list-heading">
          <div>
            <h2 id="expenses-list-title">Despesas cadastradas</h2>
            {!isLoading && !loadError && <p>{expenses.length} {expenses.length === 1 ? "despesa" : "despesas"}</p>}
          </div>
          <button className="text-button" type="button" onClick={() => void load()} disabled={actionsDisabled}>Atualizar lista</button>
        </div>
        {isLoading ? (
          <p className="expenses-empty" role="status">Carregando despesas…</p>
        ) : loadError ? (
          <div className="expenses-load-error"><RequestError error={loadError} /></div>
        ) : orderedExpenses.length ? (
          <ExpensesTable expenses={orderedExpenses} disabled={actionsDisabled} onPay={(expense) => openForm({ kind: "payment", expense })} />
        ) : (
          <div className="expenses-empty">
            <h3>Suas contas em dia</h3>
            <p>Use Nova despesa para cadastrar a primeira conta da barbearia.</p>
          </div>
        )}
        <p className="expenses-history-note">O pagamento é integral. As despesas pagas são descontadas do balanço pela data do pagamento.</p>
      </section>
    </div>
  );
}