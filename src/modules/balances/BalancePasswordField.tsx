import { useState } from "react";

interface BalancePasswordFieldProps {
  id: string;
  label: string;
  value: string;
  disabled: boolean;
  autoFocus?: boolean;
  onChange(value: string): void;
}

export function BalancePasswordField({
  id,
  label,
  value,
  disabled,
  autoFocus,
  onChange,
}: BalancePasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleLabel = `${isVisible ? "Ocultar" : "Mostrar"} ${label.toLocaleLowerCase("pt-BR")}`;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="balance-password-control">
        <input
          id={id}
          name={id}
          type={isVisible ? "text" : "password"}
          autoComplete="off"
          minLength={6}
          maxLength={8}
          required
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          className="balance-password-toggle"
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={toggleLabel}
          title={toggleLabel}
          aria-controls={id}
          aria-pressed={isVisible}
          disabled={disabled}
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
            {isVisible && <path d="m3 3 18 18" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
