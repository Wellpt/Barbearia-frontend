import { useState, type FormEvent } from "react";
import { RequestError } from "../../components/RequestError";
import { BalancePasswordField } from "./BalancePasswordField";
import type {
  BalancePasswordInput,
  BalancePasswordMode,
} from "./balance.types";

interface BalancePasswordFormProps {
  mode: BalancePasswordMode;
  isSubmitting: boolean;
  error: Error | null;
  onSubmit(input: BalancePasswordInput): Promise<void>;
  onChangeMode(mode: BalancePasswordMode): void;
}

const titles = {
  unlock: "Seus valores estão ocultos",
  set: "Defina sua primeira senha",
  change: "Altere sua senha individual",
};

export function BalancePasswordForm({
  mode,
  isSubmitting,
  error,
  onSubmit,
  onChangeMode,
}: BalancePasswordFormProps) {
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [confirmationError, setConfirmationError] = useState<Error | null>(
    null,
  );

  const displayedError = confirmationError ?? error;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmationError(null);
    if (mode !== "unlock" && password !== confirmation) {
      setConfirmationError(
        new Error("A confirmação deve ser igual à nova senha."),
      );
      return;
    }
    return onSubmit({ password, currentPassword });
  }

  return (
    <section
      className="panel balance-password-panel"
      aria-labelledby="balance-password-title"
    >
      <p className="eyebrow">ACESSO INDIVIDUAL</p>
      <h2 id="balance-password-title">{titles[mode]}</h2>
      <p className="balance-password-description">
        {mode === "unlock"
          ? "Informe a senha deste profissional para consultar o balanço."
          : mode === "set"
            ? "A primeira senha deve ser escolhida pelo próprio profissional. Depois de definida, a troca exige a senha atual."
            : "Informe a senha atual e escolha uma nova senha diferente."}
      </p>
      <form
        className="balance-password-form"
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
      >
        {mode === "change" && (
          <BalancePasswordField
            id="balance-current-password"
            label="Senha atual"
            value={currentPassword}
            disabled={isSubmitting}
            autoFocus
            onChange={setCurrentPassword}
          />
        )}
        <BalancePasswordField
          id="balance-password"
          label={mode === "change" ? "Nova senha" : "Senha do balanço"}
          value={password}
          disabled={isSubmitting}
          autoFocus={mode !== "change"}
          onChange={(value) => {
            setPassword(value);
            setConfirmationError(null);
          }}
        />
        {mode !== "unlock" && (
          <BalancePasswordField
            id="balance-password-confirmation"
            label="Confirme a senha"
            value={confirmation}
            disabled={isSubmitting}
            onChange={(value) => {
              setConfirmation(value);
              setConfirmationError(null);
            }}
          />
        )}
        <p className="balance-password-help">
          De 6 a 8 caracteres, sem exigência de complexidade.
        </p>
        {displayedError && <RequestError error={displayedError} />}
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Aguarde…"
            : mode === "unlock"
              ? "Consultar valores"
              : mode === "set"
                ? "Definir senha"
                : "Alterar senha"}
        </button>
      </form>
      <div className="balance-password-actions">
        {mode === "unlock" ? (
          <>
            <button
              className="text-button"
              type="button"
              disabled={isSubmitting}
              onClick={() => onChangeMode("set")}
            >
              Definir primeira senha
            </button>
            <button
              className="text-button"
              type="button"
              disabled={isSubmitting}
              onClick={() => onChangeMode("change")}
            >
              Alterar senha
            </button>
          </>
        ) : (
          <button
            className="text-button"
            type="button"
            disabled={isSubmitting}
            onClick={() => onChangeMode("unlock")}
          >
            Voltar à consulta
          </button>
        )}
      </div>
    </section>
  );
}
