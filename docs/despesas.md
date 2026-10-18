# Despesas na interface

Acesse **Despesas** com a conta de operação autenticada. A tela permite cadastrar contas, acompanhar vencimentos e registrar pagamentos integrais.

## Cadastrar uma despesa

1. Clique em **Nova despesa**.
2. Preencha descrição, valor integral e vencimento.
3. Clique em **Cadastrar despesa**.

Os campos são obrigatórios. O valor deve ser positivo, com até duas casas decimais. O cadastro usa `POST /expenses` e a nova conta começa sem pagamento registrado. Depois da confirmação da API, o formulário fecha e a conta entra na lista por ordem de vencimento e ID.

## Acompanhar vencimentos

A lista mostra descrição, valor, vencimento, situação e data do pagamento. A situação vem do backend:

- **Pendente:** faltam mais de cinco dias para vencer.
- **Vence em até 5 dias:** vencimento de hoje até cinco dias à frente, incluindo os dois limites.
- **Vencida:** o vencimento passou e não há pagamento registrado.
- **Paga:** pagamento confirmado, independentemente do vencimento.

Contas vencidas e próximas do vencimento recebem destaque acima da lista. As datas seguem o calendário de São Paulo. Não há conversão de fuso ao exibir as datas de vencimento e pagamento.

A tela consulta `GET /expenses` ao entrar. **Atualizar lista** consulta novamente as contas e suas situações, inclusive se a tela permanecer aberta de um dia para o outro. Durante o preenchimento de um formulário, finalize ou cancele a operação antes de atualizar a lista.

## Registrar um pagamento

1. Na conta ainda não paga, clique em **Registrar pagamento**.
2. Confira a descrição e o valor integral.
3. Informe a data em que o pagamento foi realizado; o campo começa com a data de hoje em São Paulo.
4. Clique em **Confirmar pagamento**.

A chamada é `PATCH /expenses/:id/payment`, com `{ "paidOn": "YYYY-MM-DD" }`. Pagamentos futuros não são aceitos. Datas anteriores, inclusive antes do vencimento, são permitidas.

Após a resposta da API, a linha passa a exibir **Paga** e a data registrada; a ação de pagamento deixa de aparecer. O backend desconta a despesa no balanço pelo período da data do pagamento, dividido entre os sócios conforme a regra de negócio. A tela não calcula nem exibe os saldos individuais.

## Erros e limites

Falhas exibem a mensagem da API e a referência da requisição, quando disponível. Os campos permanecem preenchidos para correção ou nova tentativa; a interface não repete cadastros ou pagamentos automaticamente.

Se outra pessoa já tiver registrado o pagamento, a API retorna conflito sem alterar a data original. Cancele o formulário e atualize a lista para conferir o registro existente.

Não há edição, exclusão, parcelamento, recorrência automática ou estorno nesta etapa. O acesso usa a sessão de operação; não exige a senha individual de consulta do balanço.