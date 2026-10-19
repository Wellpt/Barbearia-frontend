import { useState, type FormEvent } from "react";
import { balancePeriods, type BalanceQuery } from "./balance.types";

interface BalanceFiltersProps {
  initialQuery: BalanceQuery;
  isLoading: boolean;
  onSearch(query: BalanceQuery): void;
}

export function BalanceFilters({
  initialQuery,
  isLoading,
  onSearch,
}: BalanceFiltersProps) {
  const [periodo, setPeriodo] = useState(initialQuery.periodo);
  const [date, setDate] = useState(initialQuery.date);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ periodo, date });
  }

  return (
    <form
      className="panel balance-filters"
      onSubmit={handleSubmit}
      aria-busy={isLoading}
    >
      <fieldset disabled={isLoading}>
        <legend className="visually-hidden">
          Período de consulta do balanço
        </legend>
        <div className="form-field">
          <label htmlFor="balance-period">Período</label>
          <select
            id="balance-period"
            value={periodo}
            onChange={(event) =>
              setPeriodo(event.target.value as BalanceQuery["periodo"])
            }
          >
            {Object.entries(balancePeriods).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="balance-date">Data de referência</label>
          <input
            id="balance-date"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <button className="button" type="submit">
          {isLoading ? "Consultando…" : "Consultar período"}
        </button>
      </fieldset>
      <p>
        A semana vai de segunda a domingo. O mês corresponde ao mês da data
        escolhida.
      </p>
    </form>
  );
}
