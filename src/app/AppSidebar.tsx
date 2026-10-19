import { useRef, useState, type KeyboardEvent } from "react";
import { NavLink } from "react-router-dom";
import { navigation } from "./navigation";
import { BrandMark } from "../components/BrandMark";

export function AppSidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu();
      toggleRef.current?.focus();
    }
  }

  return (
    <aside className="sidebar" onKeyDown={handleKeyDown}>
      <div className="sidebar-heading">
        <NavLink
          className="brand"
          to="/"
          aria-label="Barbearia Peçanha, início"
          onClick={closeMenu}
        >
          <BrandMark />
          <span>
            Barbearia Peçanha<small>Gestão do dia a dia</small>
          </span>
        </NavLink>
        <button
          ref={toggleRef}
          className="mobile-menu-toggle"
          type="button"
          aria-label={
            isMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
          }
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path d="m6 6 12 12M6 18 18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      <p className="nav-caption">SUA BARBEARIA</p>
      <nav
        id="primary-navigation"
        aria-label="Navegação principal"
        className={isMenuOpen ? "mobile-menu-open" : undefined}
      >
        {navigation.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={closeMenu}
          >
            <span className="nav-number" aria-hidden="true">
              0{index + 1}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-note">
        Mais tempo para fazer
        <br />o que você faz bem.
      </div>
    </aside>
  );
}
