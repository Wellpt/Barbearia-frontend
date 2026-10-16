interface SessionScreenProps {
  error?: string | null;
  onRetry?: () => void;
  onReset?: () => void;
}

export function SessionScreen({ error, onRetry, onReset }: SessionScreenProps) {
  return (
    <div className="session-screen">
      <section className="panel session-panel" aria-busy={!error}>
        <span className="brand-mark" aria-hidden="true">
          B.
        </span>
        <h1>
          {error
            ? "Não foi possível verificar sua sessão"
            : "Verificando sua sessão…"}
        </h1>
        {error && (
          <>
            <p role="alert">{error}</p>
            <div className="session-actions">
              <button className="button" type="button" onClick={onRetry}>
                Tentar novamente
              </button>
              <button className="text-button" type="button" onClick={onReset}>
                Ir para o login
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
