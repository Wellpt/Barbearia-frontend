import { Link } from "react-router-dom";

export function ModulePage({ title }: { title: string }) {
  return (
    <section className="panel empty-state" aria-labelledby="module-title">
      <span className="empty-mark" aria-hidden="true">
        ↗
      </span>
      <p className="eyebrow">EM PREPARAÇÃO</p>
      <h2 id="module-title">{title}</h2>
      <p>
        A estrutura desta área está preparada. As funcionalidades serão
        adicionadas nas próximas etapas.
      </p>
      <Link className="button" to="/">
        Voltar à visão geral
      </Link>
    </section>
  );
}
