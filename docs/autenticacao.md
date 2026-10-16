# Login e sessão de operação

A tela `/#/login` autentica na API com o e-mail e a senha da conta compartilhada já existente. Não há cadastro público, seleção de perfil ou recuperação de senha nesta etapa.

## Executar

No backend, inicie os containers:

```bash
docker compose up -d --wait backend
```

No frontend, usando o WSL e Node.js 24:

```bash
nvm use
npm ci
npm run dev
```

Abra **http://localhost:5173**. Mantenha instalação e execução no mesmo ambiente WSL para usar as dependências nativas corretas.

O frontend usa `VITE_API_URL=http://localhost:3100` por padrão. No backend, `FRONTEND_URL` define a origem permitida pelo CORS, com padrão `http://localhost:5173`. O Compose lê essa variável do ambiente ou `.env`, usando o mesmo padrão. A porta do Vite fica fixa em 5173; se estiver ocupada, ele informa o conflito em vez de mudar de porta e quebrar o CORS.

Para uma prévia na porta 4173, configure o backend com `FRONTEND_URL=http://localhost:4173` e recrie seu container. No deploy, configure `VITE_API_URL` com a URL HTTPS da API no Render e `FRONTEND_URL=https://wellpt.github.io` no backend, sem o caminho `/Barbearia-frontend/`.

## Fluxo

- Ao abrir uma área interna sem sessão, a aplicação direciona ao login.
- O formulário envia e-mail e senha em `POST /auth/login`. A senha aceita os mesmos 6 a 8 caracteres do backend, sem complexidade e sem remover espaços.
- A senha existe somente no formulário e no envio da requisição; não é armazenada em navegador, código ou logs da aplicação.
- O token retornado é salvo em `sessionStorage`, na chave `barbearia.accessToken`, e os dados da conta ficam em memória. O token não é incluído no build nem enviado na URL.
- Recarregar a aba consulta `GET /auth/me` para validar o token antes de mostrar o conteúdo interno. Fechar a aba encerra o armazenamento da aba; use Sair para revogar também a sessão no servidor.
- HTTP 401 na restauração ou nas chamadas protegidas descarta a sessão local e direciona ao login. Não há renovação automática; o backend mantém o prazo de 12 horas.
- Falha de rede durante a restauração oferece tentar novamente ou ir para o login. Ela não apaga automaticamente o token.
- O botão Sair chama `POST /auth/logout`, remove o token local após sucesso e retorna ao login. Uma sessão já inválida também pode ser descartada. Se a conexão falhar, a tela informa o erro e permite tentar a saída novamente.
- Erros HTTP apresentam a mensagem da API. O formulário mostra a referência `requestId` quando disponível, para localizar a requisição nos logs.

Uma resposta 403 de autorização individual de balanço não encerra o login compartilhado. O token individual de balanço não é gerado nem armazenado pelo login; sua integração continua na etapa da tela de balanço e deverá permanecer apenas em memória.

## Organização

- `src/lib/api.ts`: envio JSON, Bearer Token, mensagens de erro e `requestId`.
- `src/modules/auth/auth.api.ts`: chamadas de login, conta autenticada e logout.
- `src/modules/auth/AuthProvider.tsx`: sessão, restauração e tratamento de 401 nas chamadas protegidas.
- `src/modules/auth/RequireAuth.tsx`: proteção das rotas internas.
- `src/modules/auth/LoginPage.tsx`: formulário de entrada.
- `src/modules/auth/SessionControls.tsx`: identificação da conta e botão Sair.

Os futuros módulos devem usar `useAuth().request()` para chamar rotas protegidas. Esse método acrescenta o token e descarta a sessão quando a API retorna 401. As verificações de autorização do backend continuam obrigatórias.

## Conferência manual

1. Sem sessão, abra `/#/clientes`: o login deve aparecer.
2. Envie uma senha incorreta: confira a mensagem de erro.
3. Entre com sua conta real: a aplicação deve abrir a área solicitada e mostrar o nome da conta.
4. Recarregue a página: a sessão deve ser validada e mantida.
5. Clique em Sair: deve retornar ao login; voltar pelo navegador não deve mostrar as áreas internas.

A conta deve ser informada por você no navegador. Nenhuma credencial real é fornecida pelo código ou pelos exemplos deste documento.

Referências: [CORS no NestJS](https://docs.nestjs.com/security/cors) e [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).
