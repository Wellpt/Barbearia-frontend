import { useState, type FormEvent } from "react";
import { RequestError } from "../../components/RequestError";
import type { Customer, CustomerInput } from "./customer.types";

interface CustomerFormProps {
  customer: Customer | null;
  isSaving: boolean;
  error: Error | null;
  onSave(input: CustomerInput): Promise<void>;
  onCancel(): void;
}

export function CustomerForm({
  customer,
  isSaving,
  error,
  onSave,
  onCancel,
}: CustomerFormProps) {
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [cpf, setCpf] = useState(customer?.cpf ?? "");
  const hasChanges =
    !customer ||
    name !== customer.name ||
    phone !== customer.phone ||
    cpf !== customer.cpf;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return onSave({ name, phone, cpf });
  }

  return (
    <section
      className="panel customer-form-panel"
      aria-labelledby="customer-form-title"
    >
      <div className="customer-form-heading">
        <div>
          <p className="eyebrow">DADOS DO CLIENTE</p>
          <h2 id="customer-form-title">
            {customer ? "Editar cliente" : "Novo cliente"}
          </h2>
        </div>
        <span>Todos os campos são obrigatórios</span>
      </div>
      <form
        className="customer-form"
        onSubmit={handleSubmit}
        aria-busy={isSaving}
      >
        <fieldset disabled={isSaving}>
          <legend className="visually-hidden">Dados cadastrais</legend>
          <div className="form-field customer-name-field">
            <label htmlFor="customer-name">Nome</label>
            <input
              id="customer-name"
              name="name"
              autoComplete="name"
              maxLength={150}
              required
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="customer-phone">Telefone</label>
            <input
              id="customer-phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              maxLength={20}
              required
              aria-describedby="customer-phone-help"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <small id="customer-phone-help">Informe o DDD e o número.</small>
          </div>
          <div className="form-field">
            <label htmlFor="customer-cpf">CPF</label>
            <input
              id="customer-cpf"
              name="cpf"
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              required
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
            />
          </div>
        </fieldset>
        {error && <RequestError error={error} />}
        <div className="customer-form-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            className="button"
            type="submit"
            disabled={isSaving || !hasChanges}
          >
            {isSaving
              ? "Salvando…"
              : customer
                ? "Salvar alterações"
                : "Cadastrar cliente"}
          </button>
        </div>
      </form>
    </section>
  );
}
