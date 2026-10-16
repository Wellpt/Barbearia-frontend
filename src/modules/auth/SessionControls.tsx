import { useState } from "react";
import { useAuth } from "./auth-context";

export function SessionControls() {
  const { session, logout } = useAuth();
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLeaving(true);
    setError(null);
    try {
      await logout();
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível sair. Tente novamente.",
      );
      setIsLeaving(false);
    }
  }

  return (
    <div className="session-controls">
      <span className="session-user">{session?.user.name}</span>
      <button
        className="text-button logout-button"
        type="button"
        onClick={handleLogout}
        disabled={isLeaving}
      >
        {isLeaving ? "Saindo…" : "Sair"}
      </button>
      {error && (
        <span className="logout-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
