import { Outlet, useLocation } from "react-router-dom";
import { navigation } from "./navigation";
import { SessionControls } from "../modules/auth/SessionControls";
import { AppSidebar } from "./AppSidebar";

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
      <AppSidebar />
      <div className="workspace">
        <header className="topbar">
          <span>PAINEL DE GESTÃO</span>
          <SessionControls />
        </header>
        <main
          id="main-content"
          className={pathname === "/" ? "home-main" : undefined}
          tabIndex={-1}
        >
          <div className="page-heading">
            <p className="eyebrow">ROTINA ORGANIZADA</p>
            <h1>{current?.label ?? "Página não encontrada"}</h1>
            {current && <p className="page-description">{current.detail}</p>}
          </div>
          <Outlet />
        </main>
        <footer>
          Barbearia Peçanha · Gestão simples, cuidado em cada detalhe.
        </footer>
      </div>
    </div>
  );
}
