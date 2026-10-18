import { useState, type FormEvent } from "react";
import { RequestError } from "../../components/RequestError";

interface ProfessionalFormProps {
  isSaving: boolean;
  error: Error | null;
  onSave(name: string): Promise<void>;
  onCancel(): void;
}

export function ProfessionalForm({
  isSaving,
  error,
  onSave,
  onCancel,
}: ProfessionalFormProps) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return onSave(name);
  }

  return (
    <section
      className="panel professional-form-panel"
      aria-labelledby="professional-form-title"
    >
      <p className="eyebrow">EQUIPE DA BARBEARIA</p>
      <h2 id="professional-form-title">Novo profissional</h2>
      <p className="professional-form-description">
        Informe o nome de quem realiza os atendimentos. O cadastro começará
        ativo.
      </p>
      <form
        className="professional-form"
        onSubmit={handleSubmit}
        aria-busy={isSaving}
      >
        <div className="form-field">
          <label htmlFor="professional-name">Nome</label>
          <input
            id="professional-name"
            name="name"
            autoComplete="name"
            maxLength={150}
            required
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSaving}
          />
        </div>
        {error && <RequestError error={error} />}
        <div className="professional-form-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button className="button" type="submit" disabled={isSaving}>
            {isSaving ? "Aguarde…" : "Cadastrar profissional"}
          </button>
        </div>
      </form>
    </section>
  );
}
