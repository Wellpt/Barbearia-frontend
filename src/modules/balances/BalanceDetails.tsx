import { useEffect, useState } from "react";
import { RequestError } from "../../components/RequestError";
import { ApiError } from "../../lib/api";
import { useAuth } from "../auth/auth-context";
import { BalanceFilters } from "./BalanceFilters";
import { BalanceSummary } from "./BalanceSummary";
import { getBalance } from "./balances.api";
import { balanceToday } from "./balance-format";
import type {
  BalanceAccess,
  BalanceQuery,
  ProfessionalBalance,
} from "./balance.types";

interface BalanceDetailsProps {
  access: BalanceAccess;
  onAccessDenied(error: Error): void;
}

export function BalanceDetails({
  access,
  onAccessDenied,
}: BalanceDetailsProps) {
  const { request } = useAuth();
  const [query, setQuery] = useState<BalanceQuery>(() => ({
    periodo: "diario",
    date: balanceToday(),
  }));
  const [balance, setBalance] = useState<ProfessionalBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setBalance(null);
    setError(null);
    async function load() {
      try {
        const result = await getBalance(
          request,
          access,
          query,
          controller.signal,
        );
        if (!controller.signal.aborted) setBalance(result);
      } catch (failure) {
        if (controller.signal.aborted) return;
        if (failure instanceof ApiError && failure.status === 403) {
          onAccessDenied(failure);
        } else {
          setError(
            failure instanceof Error
              ? failure
              : new Error("Não foi possível consultar o balanço."),
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [request, access, query, onAccessDenied]);

  function search(next: BalanceQuery) {
    setBalance(null);
    setQuery(next);
  }

  return (
    <div className="balance-details">
      <BalanceFilters
        initialQuery={query}
        isLoading={isLoading}
        onSearch={search}
      />
      {isLoading && (
        <p className="balance-loading" role="status">
          Consultando seu balanço…
        </p>
      )}
      {error && <RequestError error={error} />}
      {balance && !isLoading && <BalanceSummary balance={balance} />}
    </div>
  );
}
