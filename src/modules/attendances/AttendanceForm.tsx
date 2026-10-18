import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { RequestError } from "../../components/RequestError";
import { paymentMethods, type AttendanceInput, type AttendanceOptions, type PaymentMethod } from "./attendance.types";

interface AttendanceFormProps {
  options: AttendanceOptions;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  onSave(input: AttendanceInput): Promise<void>;
}

export function AttendanceForm({ options, isLoading, isSaving, error, onSave }: AttendanceFormProps) {
  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const missingOptions = !options.customers.length || !options.services.length || !options.professionals.length;

  useEffect(() => {
    setProfessionalId(current => options.professionals.some(professional => String(professional.id) === current) ? current : "");
  }, [options.professionals]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return onSave({ customerId: Number(customerId), serviceId: Number(serviceId), professionalId: Number(professionalId), amount: Number(amount), paymentMethod: paymentMethod as PaymentMethod });
  }

  return (
    <section className="panel attendance-form-panel" aria-labelledby="attendance-form-title">
      <p className="eyebrow">SERVIÇO REALIZADO</p>
      <h2 id="attendance-form-title">Lançar atendimento</h2>
      <p className="attendance-form-description">Selecione quem foi atendido, o serviço e quem realizou o corte.</p>
      {missingOptions && <div className="attendance-prerequisites"><p>Para lançar um atendimento:</p><ul>
        {!options.customers.length && <li><Link to="/clientes">Cadastre um cliente.</Link></li>}
        {!options.professionals.length && <li><Link to="/profissionais">Cadastre ou ative um profissional.</Link></li>}
        {!options.services.length && <li>É necessário ter serviços disponíveis no catálogo.</li>}
      </ul></div>}
      <form className="attendance-form" onSubmit={handleSubmit} aria-busy={isSaving || isLoading}>
        <fieldset disabled={isSaving || isLoading || missingOptions}>
          <legend className="visually-hidden">Dados do atendimento</legend>
          <div className="form-field attendance-customer-field">
            <label htmlFor="attendance-customer">Cliente</label>
            <select id="attendance-customer" name="customerId" required autoFocus value={customerId} onChange={event => setCustomerId(event.target.value)}>
              <option value="">Selecione o cliente</option>
              {options.customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name} — CPF {customer.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="attendance-service">Serviço</label>
            <select id="attendance-service" name="serviceId" required value={serviceId} onChange={event => setServiceId(event.target.value)}>
              <option value="">Selecione o serviço</option>
              {options.services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="attendance-professional">Profissional responsável</label>
            <select id="attendance-professional" name="professionalId" required value={professionalId} onChange={event => setProfessionalId(event.target.value)}>
              <option value="">Selecione o profissional</option>
              {options.professionals.map(professional => <option key={professional.id} value={professional.id}>{professional.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="attendance-amount">Valor recebido (R$)</label>
            <input id="attendance-amount" name="amount" type="number" inputMode="decimal" min="0.01" max="9999999999.99" step="0.01" required placeholder="0,00" value={amount} onChange={event => setAmount(event.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="attendance-payment">Forma de pagamento</label>
            <select id="attendance-payment" name="paymentMethod" required value={paymentMethod} onChange={event => setPaymentMethod(event.target.value as PaymentMethod | "")}>
              <option value="">Selecione o pagamento</option>
              {Object.entries(paymentMethods).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </fieldset>
        {error && <RequestError error={error} />}
        <div className="attendance-form-actions"><p>A data será registrada automaticamente.</p><button className="button" type="submit" disabled={isSaving || isLoading || missingOptions}>{isSaving ? "Registrando…" : "Registrar atendimento"}</button></div>
      </form>
    </section>
  );
}
