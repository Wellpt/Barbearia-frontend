import { useCallback, useEffect, useState } from "react";
import { RequestError } from "../../components/RequestError";
import { useAuth } from "../auth/auth-context";
import { AttendanceForm } from "./AttendanceForm";
import { AttendanceConfirmation } from "./AttendanceConfirmation";
import { createAttendance, loadAttendanceOptions } from "./attendances.api";
import type { AttendanceInput, AttendanceOptions, AttendanceReceipt } from "./attendance.types";
import "./attendances.css";

export function AttendancesPage() {
  const { request } = useAuth();
  const [options, setOptions] = useState<AttendanceOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const [receipt, setReceipt] = useState<AttendanceReceipt | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await loadAttendanceOptions(request, signal);
      if (!signal?.aborted) setOptions(result);
    } catch (error) {
      if (!signal?.aborted) setLoadError(error instanceof Error ? error : new Error("Não foi possível carregar os cadastros."));
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, [request]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function save(input: AttendanceInput) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const attendance = await createAttendance(request, input);
      setReceipt({
        ...attendance,
        customerName: options!.customers.find(customer => customer.id === attendance.customerId)!.name,
        serviceName: options!.services.find(service => service.id === attendance.serviceId)!.name,
        professionalName: options!.professionals.find(professional => professional.id === attendance.professionalId)!.name,
      });
      setFormVersion(version => version + 1);
    } catch (error) {
      setSaveError(error instanceof Error ? error : new Error("Não foi possível registrar o atendimento."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="attendances-page">
      <div className="attendances-toolbar"><p>Registre o serviço realizado e o pagamento recebido.</p><button className="text-button" type="button" onClick={() => void load()} disabled={isLoading || isSaving}>Atualizar cadastros</button></div>
      {receipt && <AttendanceConfirmation receipt={receipt} />}
      {loadError && <RequestError error={loadError} />}
      {isLoading && <p className="attendance-loading" role="status">Carregando clientes, serviços e profissionais…</p>}
      {options && <AttendanceForm key={formVersion} options={options} isLoading={isLoading} isSaving={isSaving} error={saveError} onSave={save} />}
    </div>
  );
}
