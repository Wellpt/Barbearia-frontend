import { balancePeriods, type ProfessionalBalance } from "./balance.types";
import { formatBalanceAmount, formatBalanceDate } from "./balance-format";

export function BalanceSummary({ balance }: { balance: ProfessionalBalance }) {
  return (
    <section
      className="balance-summary"
      aria-labelledby="balance-summary-title"
    >
      <div className="balance-summary-heading">
        <h2 id="balance-summary-title">
          Balanço {balancePeriods[balance.periodo].toLocaleLowerCase("pt-BR")}
        </h2>
        <p>
          {formatBalanceDate(balance.startDate)} a{" "}
          {formatBalanceDate(balance.endDate)} · Horário de São Paulo
        </p>
      </div>
      <dl className="balance-metrics">
        <div className="panel balance-metric">
          <dt>Atendimentos realizados</dt>
          <dd>{balance.attendanceCount}</dd>
        </div>
        <div className="panel balance-metric">
          <dt>Recebimentos</dt>
          <dd>
            {formatBalanceAmount(balance.totalReceived)}
            <small>Serviços realizados por você no período.</small>
          </dd>
        </div>
        <div className="panel balance-metric">
          <dt>Sua parte nas despesas pagas</dt>
          <dd>
            {formatBalanceAmount(balance.paidExpensesShare)}
            <small>Consideradas pela data de pagamento.</small>
          </dd>
        </div>
        <div className="panel balance-metric balance-metric-total">
          <dt>Saldo após despesas pagas</dt>
          <dd>
            <span
              className={
                Number(balance.balance) < 0 ? "balance-negative" : undefined
              }
            >
              {formatBalanceAmount(balance.balance)}
            </span>
            <small>Recebimentos menos sua parte nas despesas pagas.</small>
          </dd>
        </div>
      </dl>
      <div className="panel balance-pending">
        <div>
          <h3>Sua parte nas despesas pendentes</h3>
          <strong>{formatBalanceAmount(balance.pendingExpensesShare)}</strong>
        </div>
        <p>
          Contas ainda não pagas com vencimento no período. Esse valor não foi
          descontado do saldo.
        </p>
      </div>
      <p className="balance-sharing-note">
        As despesas são divididas em 50% para cada sócio. Quando sobra um
        centavo, ele fica para o primeiro profissional cadastrado.
      </p>
    </section>
  );
}
