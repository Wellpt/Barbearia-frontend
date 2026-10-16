# Clientes na interface

A tela `/#/clientes` permite consultar, cadastrar e editar clientes com o login compartilhado. Não exige senha individual ou token do balanço.

## Usar

Entre na aplicação e selecione Clientes no menu. A lista é carregada da API e apresentada em ordem alfabética pelo nome. Telefone e CPF aparecem com pontuação para leitura; os valores cadastrados vêm do backend.

- **Novo cliente:** abre o formulário com nome, telefone e CPF obrigatórios.
- **Editar:** abre o cadastro selecionado no mesmo formulário. O CPF pode ser corrigido.
- **Cancelar:** fecha o formulário sem enviar alterações.
- **Atualizar lista:** busca novamente os cadastros da API, por exemplo, após uma alteração em outro dispositivo.

O botão de salvar fica desabilitado enquanto o envio está em andamento e, na edição, até algum campo ser alterado. Durante o envio, o formulário permanece bloqueado para impedir novos envios pelo botão.

Ao salvar com sucesso, a resposta da API atualiza a lista e uma mensagem confirma o resultado. A edição envia somente os campos alterados. A seleção de outro cadastro reinicia o formulário com os dados desse cliente.

## Regras e erros

Nome, telefone e CPF são obrigatórios. A interface limita o nome a 150 caracteres e permite digitar telefone e CPF com ou sem pontuação. O backend mantém as regras de normalização, formato e unicidade: telefone com 10 ou 11 dígitos, incluindo DDD, e CPF com 11 dígitos. Não há nova validação de dígitos verificadores nesta etapa.

Um CPF duplicado é rejeitado pela API, inclusive durante edição. A mensagem aparece dentro do formulário, preservando o que foi digitado para correção. A referência `requestId`, quando fornecida, permite localizar a falha nos logs. Senhas, tokens e dados de clientes não são registrados pelo frontend.

A listagem apresenta estados de carregamento, erro e lista vazia. Falhas de consulta podem ser repetidas pelo botão Atualizar lista. HTTP 401 segue o tratamento da autenticação: descarta a sessão local e retorna ao login.

## Integração

| Ação | Rota do backend |
|---|---|
| Listar | `GET /customers` |
| Cadastrar | `POST /customers` |
| Editar campos alterados | `PATCH /customers/:id` |

Todas as chamadas usam `useAuth().request()`, que acrescenta o Bearer Token. As respostas de cadastro e edição fornecem os dados atualizados para a tabela. Não há exclusão ou histórico de visitas nesta tela.

## Organização

- `CustomersPage.tsx`: carregamento, seleção do cadastro, gravação e confirmação.
- `CustomerForm.tsx`: campos para cadastro e edição.
- `CustomersTable.tsx`: lista, formatação para leitura e botão Editar.
- `customers.api.ts` / `customer.types.ts`: contrato HTTP e tipos.
- `customers.css`: apresentação do módulo.
- `src/components/RequestError.tsx`: mensagem de erro com referência da requisição, usada pela página e pelo formulário.

Estilos comuns de campos e botões ficam em `src/styles/global.css`, compartilhados com o login.

## Conferir no navegador

Com frontend e backend iniciados por você:

1. Entre e abra Clientes. Confira os cadastros existentes ou a mensagem de lista vazia.
2. Cadastre um cliente e confirme sua inclusão na lista.
3. Tente cadastrar novamente o mesmo CPF; confira a mensagem e a preservação dos campos.
4. Edite apenas o telefone e confirme que nome, CPF e ID permanecem os mesmos.
5. Tente trocar o CPF pelo de outro cliente; confira o erro sem perda dos dados digitados.
6. Use Cancelar e confira que nada foi gravado.
7. Recarregue a página para confirmar a consulta dos dados persistidos.

Use seus dados de teste somente na aplicação em execução. Não adicione cadastros reais, tokens ou credenciais ao repositório público.
