import { paymentMethods, type AttendanceReceipt } from "./attendance.types";

export function AttendanceConfirmation({ receipt }: { receipt: AttendanceReceipt }) {
  const amount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(receipt.amount));
  const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" }).format(new Date(receipt.performedAt));

  return (
    <section className="attendance-confirmation" aria-labelledby="attendance-confirmation-title">
      <div className="attendance-confirmation-heading"><div><p className="eyebrow">ÚLTIMO LANÇAMENTO</p><h2 id="attendance-confirmation-title" role="status">Atendimento #{receipt.id} registrado</h2></div><strong>{amount}</strong></div>
      <dl>
        <div><dt>Cliente</dt><dd>{receipt.customerName}</dd></div>
        <div><dt>Serviço</dt><dd>{receipt.serviceName}</dd></div>
        <div><dt>Profissional</dt><dd>{receipt.professionalName}</dd></div>
        <div><dt>Pagamento</dt><dd>{paymentMethods[receipt.paymentMethod]}</dd></div>
        <div><dt>Data</dt><dd>{date}</dd></div>
      </dl>
    </section>
  );
}
