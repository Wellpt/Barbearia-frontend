import { useCallback, useState } from "react";
import { useAuth } from "../auth/auth-context";
import type { Professional } from "../professionals/professional.types";
import { BalanceDetails } from "./BalanceDetails";
import { BalancePasswordForm } from "./BalancePasswordForm";
import { changeBalancePassword, setBalancePassword } from "./balances.api";
import { useBalanceAccess } from "./useBalanceAccess";
import type {
  BalancePasswordInput,
  BalancePasswordMode,
} from "./balance.types";

interface ProfessionalBalancePanelProps {
  professional: Professional;
  onBack(): void;
}

export function ProfessionalBalancePanel({
  professional,
  onBack,
}: ProfessionalBalancePanelProps) {
  const { request } = useAuth();
  const { access, unlock, lock } = useBalanceAccess(professional.id);
  const [mode, setMode] = useState<BalancePasswordMode>("unlock");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function changeMode(next: BalancePasswordMode) {
    setError(null);
    setNotice(null);
    setMode(next);
  }

  async function submit(input: BalancePasswordInput) {
    setIsSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "unlock") {
        await unlock(input.password);
      } else if (mode === "set") {
        await setBalancePassword(request, professional.id, input.password);
        setMode("unlock");
        setNotice("Senha definida. Informe-a para consultar os valores.");
      } else {
        await changeBalancePassword(
          request,
          professional.id,
          input.currentPassword,
          input.password,
        );
        setMode("unlock");
        setNotice(
          "Senha alterada. Use a nova senha para consultar os valores.",
        );
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure
          : new Error("Não foi possível concluir a solicitação."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const accessDenied = useCallback(
    (failure: Error) => {
      lock();
      setMode("unlock");
      setNotice(null);
      setError(failure);
    },
    [lock],
  );

  function hideValues() {
    lock();
    setError(null);
    setNotice("Valores ocultados. Para consultar novamente, informe a senha.");
  }

  return (
    <div className="professional-balance-panel">
      <div className="balance-professional-heading">
        <div>
          <p className="eyebrow">BALANÇO INDIVIDUAL</p>
          <h2>{professional.name}</h2>
          {!professional.isActive && (
            <p>Profissional inativo · Histórico disponível</p>
          )}
        </div>
        <div className="balance-professional-actions">
          {access && (
            <button
              className="button button-secondary"
              type="button"
              onClick={hideValues}
            >
              Ocultar valores
            </button>
          )}
          <button className="text-button" type="button" onClick={onBack}>
            Todos os profissionais
          </button>
        </div>
      </div>
      {notice && (
        <p className="balances-notice" role="status">
          {notice}
        </p>
      )}
      {access ? (
        <BalanceDetails access={access} onAccessDenied={accessDenied} />
      ) : (
        <BalancePasswordForm
          key={mode}
          mode={mode}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={submit}
          onChangeMode={changeMode}
        />
      )}
    </div>
  );
}
