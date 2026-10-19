import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";
import { BrandMark } from "../../components/BrandMark";

export function LoginPage() {
  const { session, notice, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const destination = (location.state as { from?: string } | null)?.from ?? "/";

  if (session) return <Navigate to={destination} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-layout">
      <aside className="login-intro">
        <div className="brand">
          <BrandMark />
          <span>
            Barbearia Peçanha<small>Gestão do dia a dia</small>
          </span>
        </div>
        <div className="login-intro-copy">
          <p className="eyebrow">SUA ROTINA, EM ORDEM</p>
          <h2>
            O cuidado começa
            <br />
            pela sua barbearia.
          </h2>
          <p>
            Mais organização no negócio.
            <br />
            Mais atenção a cada cliente.
          </p>
        </div>
        <p className="login-signature">
          Gestão simples, cuidado em cada detalhe.
        </p>
      </aside>
      <main className="login-content">
        <section className="login-form-container" aria-labelledby="login-title">
          <p className="eyebrow">BEM-VINDO DE VOLTA</p>
          <h1 id="login-title">Entre na Barbearia Peçanha</h1>
          <p className="login-description">
            Use o e-mail e a senha da conta de operação.
          </p>
          {notice && !error && (
            <p className="auth-notice" role="status">
              {notice}
            </p>
          )}
          <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Senha</label>
              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  maxLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-controls="password"
                  aria-pressed={showPassword}
                  disabled={isSubmitting}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPassword && <path d="m3 3 18 18" />}
                  </svg>
                </button>
              </div>
            </div>
            {error && (
              <div className="auth-error" role="alert">
                <p>{error}</p>
              </div>
            )}
            <button
              className="button login-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando…" : "Entrar"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
