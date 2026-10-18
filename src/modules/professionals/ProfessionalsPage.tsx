import { useCallback, useEffect, useState } from "react";
import { RequestError } from "../../components/RequestError";
import { useAuth } from "../auth/auth-context";
import {
  createProfessional,
  listProfessionals,
  updateProfessionalStatus,
} from "./professionals.api";
import { ProfessionalForm } from "./ProfessionalForm";
import { ProfessionalsTable } from "./ProfessionalsTable";
import type { Professional } from "./professional.types";
import "./professionals.css";

export function ProfessionalsPage() {
  const { request } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [changingId, setChangingId] = useState<number | null>(null);
  const [statusError, setStatusError] = useState<Error | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const isBusy = isSaving || changingId !== null;

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const result = await listProfessionals(request, signal);
        if (!signal?.aborted) setProfessionals(result);
      } catch (error) {
        if (!signal?.aborted)
          setLoadError(
            error instanceof Error
              ? error
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

  function openForm() {
    setSaveError(null);
    setStatusError(null);
    setNotice(null);
    setIsFormOpen(true);
  }

  async function save(name: string) {
    setIsSaving(true);
    setSaveError(null);
    setNotice(null);
    try {
      const professional = await createProfessional(request, name);
      setProfessionals((previous) => [...previous, professional]);
      setNotice("Profissional cadastrado.");
      setIsFormOpen(false);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error
          : new Error("Não foi possível cadastrar o profissional."),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function changeStatus(professional: Professional) {
    setChangingId(professional.id);
    setStatusError(null);
    setNotice(null);
    try {
      const updated = await updateProfessionalStatus(
        request,
        professional.id,
        !professional.isActive,
      );
      setProfessionals((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      );
      setNotice(
        updated.isActive ? "Profissional ativado." : "Profissional desativado.",
      );
    } catch (error) {
      setStatusError(
        error instanceof Error
          ? error
          : new Error("Não foi possível alterar a situação do profissional."),
      );
    } finally {
      setChangingId(null);
    }
  }

  const orderedProfessionals = [...professionals].sort(
    (a, b) => a.name.localeCompare(b.name, "pt-BR") || a.id - b.id,
  );

  return (
    <div className="professionals-page">
      <div className="professionals-toolbar">
        <p>Organize quem está disponível para realizar os atendimentos.</p>
        <button
          className="button"
          type="button"
          onClick={openForm}
          disabled={isLoading || isBusy}
        >
          Novo profissional <span aria-hidden="true">+</span>
        </button>
      </div>
      {notice && (
        <p className="professionals-notice" role="status">
          {notice}
        </p>
      )}
      {isFormOpen && (
        <ProfessionalForm
          isSaving={isBusy}
          error={saveError}
          onSave={save}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      {statusError && <RequestError error={statusError} />}
      <section
        className="panel professionals-list"
        aria-labelledby="professionals-list-title"
        aria-busy={isLoading || changingId !== null}
      >
        <div className="professionals-list-heading">
          <div>
            <h2 id="professionals-list-title">Profissionais cadastrados</h2>
            {!isLoading && !loadError && (
              <p>
                {professionals.length}{" "}
                {professionals.length === 1 ? "profissional" : "profissionais"}
              </p>
            )}
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => void load()}
            disabled={isLoading || isBusy}
          >
            Atualizar lista
          </button>
        </div>
        {isLoading ? (
          <p className="professionals-empty" role="status">
            Carregando profissionais…
          </p>
        ) : loadError ? (
          <div className="professionals-load-error">
            <RequestError error={loadError} />
          </div>
        ) : orderedProfessionals.length ? (
          <ProfessionalsTable
            professionals={orderedProfessionals}
            disabled={isBusy}
            changingId={changingId}
            onChangeStatus={changeStatus}
          />
        ) : (
          <div className="professionals-empty">
            <h3>Quem atende na sua barbearia?</h3>
            <p>
              Use Novo profissional para cadastrar os responsáveis pelos
              serviços.
            </p>
          </div>
        )}
        <p className="professionals-history-note">
          Profissionais inativos não recebem novos atendimentos. O histórico
          permanece preservado.
        </p>
      </section>
    </div>
  );
}
