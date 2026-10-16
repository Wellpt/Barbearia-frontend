import { Link, Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { navigation } from "./navigation";
import { HomePage } from "../modules/home/HomePage";
import { ModulePage } from "../components/ModulePage";
import { LoginPage } from "../modules/auth/LoginPage";
import { RequireAuth } from "../modules/auth/RequireAuth";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          {navigation.slice(1).map((item) => (
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
