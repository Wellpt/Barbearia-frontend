# Lançamento de atendimentos na interface

A tela `/#/atendimentos` registra um serviço já realizado e integralmente recebido. Usa somente a sessão compartilhada. A senha e o token individual de balanço não são solicitados para lançar um corte.

## Usar

1. Selecione o cliente cadastrado. As opções mostram nome e CPF para distinguir pessoas com nomes iguais.
2. Selecione um serviço do catálogo fornecido pela API.
3. Selecione o profissional que realizou o corte; somente ativos aparecem.
4. Informe o valor recebido em reais, maior que zero e com até duas casas decimais.
5. Selecione Dinheiro, Pix, Cartão de débito ou Cartão de crédito.
6. Clique em Registrar atendimento.

Não há preço fixo por serviço nem seleção automática de responsável ou pagamento. A data do lançamento e a conta de operação são definidas pelo backend. Não existem abertura, conclusão ou orçamento nessa tela.

Durante o envio, os campos e o botão ficam bloqueados. Após confirmação da API, o formulário é limpo para o próximo corte. Um resumo do último lançamento mostra ID, cliente, serviço, profissional, valor, pagamento e data em São Paulo. Ele usa os dados da resposta e as identificações selecionadas, não representa um novo cálculo de balanço.

Se ocorrer um erro, a mensagem da API e a referência `requestId`, quando disponível, aparecem sem apagar os campos. Não há repetição automática da gravação: cada envio válido à API cria outro atendimento.

## Cadastros disponíveis

A tela consulta clientes, serviços e profissionais ao abrir. Atualizar cadastros repete essas consultas e preserva os valores digitados. Caso o profissional selecionado tenha sido desativado, a seleção dele é limpa para exigir outro responsável. O backend também verifica a situação ativa no momento do registro.

Se faltarem clientes ou profissionais ativos, a tela oferece links para as respectivas áreas. Se não houver serviços, informa a ausência do catálogo. O lançamento fica desabilitado enquanto faltar algum desses cadastros ou enquanto as opções estiverem sendo carregadas.

Os estados de carregamento e falha de consulta são apresentados na própria página. Em caso de erro, use Atualizar cadastros para tentar novamente. HTTP 401 segue o tratamento compartilhado e direciona ao login.

## Integração

| Ação | Rota do backend |
|---|---|
| Buscar clientes | `GET /customers` |
| Buscar serviços | `GET /services` |
| Buscar profissionais | `GET /professionals`, filtrando ativos na interface |
| Registrar atendimento | `POST /attendances` |

O envio contém `customerId`, `serviceId`, `professionalId`, `amount` numérico e `paymentMethod` com `cash`, `pix`, `debit_card` ou `credit_card`. As chamadas usam `useAuth().request()`.

A tela não implementa listagem de histórico, edição, cancelamento ou consulta de valores acumulados. O resumo fica apenas em memória enquanto a página está aberta. Sair dessa tela ou recarregá-la limpa o resumo, mas preserva o atendimento no banco.

## Organização

O módulo `src/modules/attendances/` concentra página, formulário, confirmação, contratos da API, tipos e estilos. Reutiliza as consultas de clientes e profissionais e os componentes e estilos compartilhados de formulário e erro. Nenhuma mudança de backend ou migration é necessária.

## Conferir no navegador

Com seus serviços em execução:

1. Entre e abra Atendimentos. Confira os clientes, serviços e profissionais ativos.
2. Selecione os cadastros, informe um valor e pagamento e registre.
3. Confira valor e responsável no resumo, e o formulário limpo após o sucesso.
4. Lance outro corte para o outro profissional e confira a identificação correta.
5. Confira as quatro formas de pagamento e um valor com centavos.
6. Desative um profissional em sua tela, retorne e atualize os cadastros: ele não deve aparecer nas opções.
7. Para conferir a persistência, consulte o balanço individual pela API, com a autorização correspondente.

Use seus dados de teste somente na aplicação em execução. Não inclua clientes reais ou tokens no repositório público.
