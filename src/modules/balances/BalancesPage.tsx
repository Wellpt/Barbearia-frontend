import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RequestError } from "../../components/RequestError";
import { useAuth } from "../auth/auth-context";
import { listProfessionals } from "../professionals/professionals.api";
import type { Professional } from "../professionals/professional.types";
import { ProfessionalBalancePanel } from "./ProfessionalBalancePanel";
import "./balances.css";

export function BalancesPage() {
  const { request } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selected, setSelected] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await listProfessionals(request, signal);
        if (!signal?.aborted) setProfessionals(result);
      } catch (failure) {
        if (!signal?.aborted)
          setError(
            failure instanceof Error
              ? failure
              : new Error("Não foi possível carregar os profissionais."),
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

  if (selected) {
    return (
      <ProfessionalBalancePanel
        key={selected.id}
        professional={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  const orderedProfessionals = [...professionals].sort(
    (a, b) => a.name.localeCompare(b.name, "pt-BR") || a.id - b.id,
  );

  return (
    <div className="balances-page">
      <div className="balances-toolbar">
        <p>
          Escolha o profissional e informe a senha dele para consultar seus
          valores.
        </p>
        <button
          className="text-button"
          type="button"
          onClick={() => void load()}
          disabled={isLoading}
        >
          Atualizar profissionais
        </button>
      </div>
      {isLoading ? (
        <p className="balance-loading" role="status">
          Carregando profissionais…
        </p>
      ) : error ? (
        <RequestError error={error} />
      ) : orderedProfessionals.length ? (
        <div className="balance-professionals-grid">
          {orderedProfessionals.map((professional) => (
            <section
              className="panel balance-professional-card"
              key={professional.id}
              aria-labelledby={`balance-professional-${professional.id}`}
            >
              <h2 id={`balance-professional-${professional.id}`}>
                {professional.name}
              </h2>
              {!professional.isActive && (
                <p className="balance-inactive-note">
                  Inativo · Histórico disponível
                </p>
              )}
              <p className="balance-hidden-value" aria-hidden="true">
                ••••
              </p>
              <p className="balance-hidden-label">Valores ocultos</p>
              <button
                className="button"
                type="button"
                onClick={() => setSelected(professional)}
                aria-label={`Ver valores de ${professional.name}`}
              >
                Ver valores
              </button>
            </section>
          ))}
        </div>
      ) : (
        <section className="panel empty-state">
          <h2>Nenhum profissional cadastrado</h2>
          <p>
            Cadastre os responsáveis pelos atendimentos para consultar o balanço
            individual.
          </p>
          <Link className="button" to="/profissionais">
            Cadastrar profissional
          </Link>
        </section>
      )}
      <p className="balance-privacy-note">
        Ao sair desta consulta, os valores são ocultados. A senha individual não
        é necessária para lançar cortes ou despesas.
      </p>
    </div>
  );
}
