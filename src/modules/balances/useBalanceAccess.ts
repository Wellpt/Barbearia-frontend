import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/auth-context";
import { closeBalanceAccess, openBalanceAccess } from "./balances.api";
import type { BalanceAccess } from "./balance.types";

export function useBalanceAccess(professionalId: number) {
  const { request } = useAuth();
  const [access, setAccess] = useState<BalanceAccess | null>(null);
  const activeAccess = useRef<BalanceAccess | null>(null);
  const isMounted = useRef(false);

  const revoke = useCallback(
    (opened: BalanceAccess) => {
      void closeBalanceAccess(request, opened).catch(() => {
        console.warn(
          "Não foi possível encerrar a consulta do balanço no servidor.",
        );
      });
    },
    [request],
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      const opened = activeAccess.current;
      activeAccess.current = null;
      if (opened) revoke(opened);
    };
  }, [revoke]);

  async function unlock(password: string) {
    const opened = await openBalanceAccess(request, professionalId, password);
    // Se a pessoa sair enquanto aguarda a senha, encerre o acesso recebido.
    if (!isMounted.current) {
      revoke(opened);
      return;
    }
    activeAccess.current = opened;
    setAccess(opened);
  }

  const lock = useCallback(() => {
    const opened = activeAccess.current;
    activeAccess.current = null;
    setAccess(null);
    if (opened) revoke(opened);
  }, [revoke]);

  return { access, unlock, lock };
}
