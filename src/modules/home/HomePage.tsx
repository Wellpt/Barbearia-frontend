import { Link } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import "./home.css";

const shortcuts = [
  {
    path: "/atendimentos",
    number: "01",
    title: "Atendimentos",
    description: "Do corte realizado ao valor registrado, tudo no seu lugar.",
  },
  {
    path: "/clientes",
    number: "02",
    title: "Clientes",
    description: "Um cadastro simples para conhecer quem volta à sua cadeira.",
  },
  {
    path: "/despesas",
    number: "03",
    title: "Despesas",
    description: "Contas e vencimentos organizados para planejar o mês.",
  },
];

export function HomePage() {
  return (
    <>
      <section className="welcome-panel" aria-labelledby="welcome-title">
        <div>
          <p className="eyebrow">CUIDE DO SEU NEGÓCIO</p>
          <h2 id="welcome-title">
            A rotina em ordem.
            <br />O foco no próximo corte.
          </h2>
          <p>
            Clientes, atendimentos e despesas reunidos para facilitar o dia a
            dia.
          </p>
          <Link className="button button-light" to="/atendimentos">
            Ir para atendimentos <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <BrandMark className="welcome-monogram" />
      </section>
      <div className="section-heading">
        <h2>Seu dia a dia</h2>
        <span>Escolha uma área para começar</span>
      </div>
      <div className="shortcut-grid">
        {shortcuts.map((item) => (
          <Link className="shortcut-card" key={item.path} to={item.path}>
            <span className="shortcut-top">
              <span>{item.number}</span>
              <span aria-hidden="true">↗</span>
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
      <section className="release-note" aria-label="Dica de uso">
        <span className="status-dot" aria-hidden="true" />
        <p>
          <strong>Dica para sua rotina.</strong> Cadastre o cliente e selecione
          o profissional responsável antes de lançar cada corte.
        </p>
      </section>
    </>
  );
}
