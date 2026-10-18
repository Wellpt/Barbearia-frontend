import type { Professional } from "./professional.types";

interface ProfessionalsTableProps {
  professionals: Professional[];
  disabled: boolean;
  changingId: number | null;
  onChangeStatus(professional: Professional): Promise<void>;
}

export function ProfessionalsTable({
  professionals,
  disabled,
  changingId,
  onChangeStatus,
}: ProfessionalsTableProps) {
  return (
    <div className="professionals-table-container">
      <table className="professionals-table">
        <caption className="visually-hidden">
          Profissionais cadastrados, ativos e inativos
        </caption>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Situação</th>
            <th scope="col">
              <span className="visually-hidden">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {professionals.map((professional) => (
            <tr key={professional.id}>
              <th scope="row">{professional.name}</th>
              <td>
                <span
                  className={`professional-status ${professional.isActive ? "professional-status-active" : "professional-status-inactive"}`}
                >
                  {professional.isActive ? "Ativo" : "Inativo"}
                </span>
              </td>
              <td className="professional-row-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={() => void onChangeStatus(professional)}
                  disabled={disabled}
                  aria-label={`${professional.isActive ? "Desativar" : "Ativar"} ${professional.name}`}
                >
                  {changingId === professional.id
                    ? "Atualizando…"
                    : professional.isActive
                      ? "Desativar"
                      : "Ativar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
