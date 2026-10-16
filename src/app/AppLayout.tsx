import { NavLink, Outlet, useLocation } from "react-router-dom";
import { navigation } from "./navigation";

export function AppLayout() {
  const { pathname } = useLocation();
  const current = navigation.find((item) => item.path === pathname);

  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="Barbearia, início">
          <span className="brand-mark" aria-hidden="true">
            B.
          </span>
          <span>
            Barbearia<small>Gestão do dia a dia</small>
          </span>
        </NavLink>
        <p className="nav-caption">SUA BARBEARIA</p>
        <nav aria-label="Navegação principal">
          {navigation.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
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
      <div className="workspace">
        <header className="topbar">
          <span>PAINEL DE GESTÃO</span>
          <span className="version-tag">Versão inicial</span>
        </header>
        <main id="main-content" tabIndex={-1}>
          <div className="page-heading">
            <p className="eyebrow">ROTINA ORGANIZADA</p>
            <h1>{current?.label ?? "Página não encontrada"}</h1>
            {current && <p className="page-description">{current.detail}</p>}
          </div>
          <Outlet />
        </main>
        <footer>Barbearia · Gestão simples, cuidado em cada detalhe.</footer>
      </div>
    </div>
  );
}
