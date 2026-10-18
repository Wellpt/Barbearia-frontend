import { Link, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { navigation } from "./navigation";
import { HomePage } from "../modules/home/HomePage";
import { ModulePage } from "../components/ModulePage";
import { LoginPage } from "../modules/auth/LoginPage";
import { RequireAuth } from "../modules/auth/RequireAuth";
import { CustomersPage } from "../modules/customers/CustomersPage";
import { ProfessionalsPage } from "../modules/professionals/ProfessionalsPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/clientes" element={<CustomersPage />} />
          <Route path="/profissionais" element={<ProfessionalsPage />} />
          {navigation
            .slice(1)
            .filter(
              (item) => !["/clientes", "/profissionais"].includes(item.path),
            )
            .map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={<ModulePage title={item.label} />}
              />
            ))}
          <Route
            path="*"
            element={
              <section className="panel empty-state">
                <h2>Página não encontrada</h2>
                <Link className="button" to="/">
                  Voltar ao início
                </Link>
              </section>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
