# Profissionais na interface

A tela `/#/profissionais` permite cadastrar, listar, ativar e desativar quem realiza os atendimentos. Usa apenas a sessão compartilhada de operação; não exige senha ou token individual de balanço.

## Usar

- **Novo profissional:** abre o formulário com o nome obrigatório, de até 150 caracteres. O backend remove espaços das extremidades e cria o profissional ativo.
- **Desativar:** muda a situação para inativo. O histórico de atendimentos é preservado; novos lançamentos para esse profissional são rejeitados pelo backend.
- **Ativar:** disponibiliza novamente o profissional para novos atendimentos.
- **Atualizar lista:** consulta os cadastros novamente, por exemplo, após alterações em outro dispositivo.

A lista mostra ativos e inativos em ordem alfabética, com sua situação identificada por texto. O botão de cada linha apresenta a operação correspondente: Ativar ou Desativar. Enquanto a solicitação está em andamento, a linha mostra Atualizando e os botões de gravação ficam bloqueados. A confirmação usa a resposta da API para atualizar a lista.

O cadastro possui somente o nome; profissionais não recebem contas de login individuais. Definição e troca da senha de balanço serão integradas na etapa da interface de balanço.

## Regras e erros

O backend rejeita nomes repetidos, ignorando maiúsculas/minúsculas e espaços das extremidades, inclusive entre profissionais inativos. Acentos permanecem significativos. Essa regra continua sob responsabilidade da API.

Erros de cadastro aparecem no formulário sem apagar o nome digitado. Falhas na mudança de situação aparecem acima da lista, preservando a situação exibida antes do envio. Quando disponível, `requestId` aparece como referência para consulta aos logs. O frontend não registra nomes nem tokens em logs.

A tela apresenta estados de carregamento, erro de consulta e lista vazia. HTTP 401 segue o fluxo compartilhado de autenticação e retorna ao login. Não há edição de nome ou exclusão nesta etapa.

## Integração

| Ação | Rota do backend |
|---|---|
| Listar | `GET /professionals` |
| Cadastrar | `POST /professionals`, com `{ "name": "..." }` |
| Ativar/desativar | `PATCH /professionals/:id/status`, com `{ "isActive": true }` ou `false` |

Todas as chamadas usam `useAuth().request()` e o token da conta de operação. A lista é atualizada com o registro devolvido após cadastro ou mudança de situação. Nenhuma alteração de backend ou migration é necessária.

## Organização

O módulo `src/modules/professionals/` concentra página, formulário, tabela, funções da API, tipos e estilos. Reutiliza as mensagens de erro, os campos e os botões compartilhados com o restante da aplicação.

## Conferir no navegador

Com os serviços iniciados por você:

1. Entre e abra Profissionais. Confira os cadastros existentes e suas situações.
2. Cadastre um nome e confirme que aparece ativo na lista.
3. Repita o nome com outras maiúsculas ou espaços nas extremidades; confira o erro sem perder o que digitou.
4. Desative um profissional e confirme a situação Inativo e o botão Ativar.
5. Reative e confira o retorno para Ativo.
6. Recarregue a página para verificar as situações salvas.

Use cadastros de teste na aplicação em execução. Não adicione pessoas reais ou credenciais ao repositório público.
