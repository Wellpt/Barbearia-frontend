import { useCallback, useEffect, useState } from "react";
import { RequestError } from "../../components/RequestError";
import { useAuth } from "../auth/auth-context";
import { createCustomer, listCustomers, updateCustomer } from "./customers.api";
import { CustomerForm } from "./CustomerForm";
import { CustomersTable } from "./CustomersTable";
import type { Customer, CustomerInput } from "./customer.types";
import "./customers.css";

export function CustomersPage() {
  const { request } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const result = await listCustomers(request, signal);
        if (!signal?.aborted) setCustomers(result);
      } catch (error) {
        if (!signal?.aborted)
          setLoadError(
            error instanceof Error
              ? error
              : new Error("Não foi possível carregar os clientes."),
          );
      } finally {
        if (!signal?.aborted) setIsLoading(false);
      }
    },
    [request],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  function openForm(customer: Customer | null) {
    setEditing(customer);
    setSaveError(null);
    setNotice(null);
    setIsFormOpen(true);
  }

  async function save(input: CustomerInput) {
    setIsSaving(true);
    setSaveError(null);
    setNotice(null);
    try {
      let result: Customer;
      if (editing) {
        const changes: Partial<CustomerInput> = {};
        if (input.name !== editing.name) changes.name = input.name;
        if (input.phone !== editing.phone) changes.phone = input.phone;
        if (input.cpf !== editing.cpf) changes.cpf = input.cpf;
        result = await updateCustomer(request, editing.id, changes);
      } else {
        result = await createCustomer(request, input);
      }
      setCustomers((previous) =>
        editing
          ? previous.map((customer) =>
              customer.id === result.id ? result : customer,
            )
          : [...previous, result],
      );
      setNotice(editing ? "Cadastro atualizado." : "Cliente cadastrado.");
      setIsFormOpen(false);
      setEditing(null);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error
          : new Error("Não foi possível salvar o cliente."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const orderedCustomers = [...customers].sort(
    (a, b) => a.name.localeCompare(b.name, "pt-BR") || a.id - b.id,
  );

  return (
    <div className="customers-page">
      <div className="customers-toolbar">
        <p>Nome, telefone e CPF: um cadastro simples para cada cliente.</p>
        <button
          className="button"
          type="button"
          onClick={() => openForm(null)}
          disabled={isSaving || isLoading}
        >
          Novo cliente <span aria-hidden="true">+</span>
        </button>
      </div>
      {notice && (
        <p className="customers-notice" role="status">
          {notice}
        </p>
      )}
      {isFormOpen && (
        <CustomerForm
          key={editing?.id ?? "new"}
          customer={editing}
          isSaving={isSaving}
          error={saveError}
          onSave={save}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      <section
        className="panel customers-list"
        aria-labelledby="customers-list-title"
        aria-busy={isLoading}
      >
        <div className="customers-list-heading">
          <div>
            <h2 id="customers-list-title">Clientes cadastrados</h2>
            {!isLoading && !loadError && (
              <p>
                {customers.length}{" "}
                {customers.length === 1 ? "cliente" : "clientes"}
              </p>
            )}
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => void load()}
            disabled={isLoading || isSaving}
          >
            Atualizar lista
          </button>
        </div>
        {isLoading ? (
          <p className="customers-empty" role="status">
            Carregando clientes…
          </p>
        ) : loadError ? (
          <div className="customers-load-error">
            <RequestError error={loadError} />
          </div>
        ) : orderedCustomers.length ? (
          <CustomersTable
            customers={orderedCustomers}
            disabled={isSaving}
            onEdit={openForm}
          />
        ) : (
          <div className="customers-empty">
            <h3>Seu primeiro cliente começa aqui</h3>
            <p>Use Novo cliente para adicionar nome, telefone e CPF.</p>
          </div>
        )}
      </section>
    </div>
  );
}
