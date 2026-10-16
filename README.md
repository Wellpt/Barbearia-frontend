# Barbearia — Frontend

Interface React com TypeScript para gestão de barbearias. Este repositório é público e será hospedado no GitHub Pages. A API NestJS permanece em repositório privado, com hospedagem no Render e PostgreSQL no Neon.

## Estado atual

Estrutura inicial com Vite, navegação e layout responsivo. A visão geral apresenta atalhos; profissionais, atendimentos, despesas e balanço têm páginas de preparação. A tela de clientes já permite listar, cadastrar e editar nome, telefone e CPF. Login, validação da sessão e logout já estão integrados à API; as áreas internas exigem autenticação. Os demais módulos de negócio serão implementados nas próximas etapas. Veja [Clientes na interface](docs/clientes.md). Não há dados de clientes ou valores financeiros de demonstração nesta interface.

## Executar no WSL

Na pasta `Barbearia-frontend`, usando Node.js 24:

```bash
nvm use
npm ci
cp -n .env.example .env
npm run dev
```

Abra `http://localhost:5173`. O Vite atualiza a interface ao salvar os arquivos. Para encerrar, use `Ctrl+C`. O comando `cp -n` preserva um `.env` existente.

## Organização

```text
src/
├── app/             # Rotas, navegação e layout da aplicação
├── components/      # Componentes compartilhados
├── config/          # Configuração pública, como a URL da API
├── lib/             # Cliente HTTP compartilhado
├── modules/
│   ├── auth/        # Login, sessão e proteção de rotas
│   ├── customers/   # Listagem, cadastro e edição de clientes
│   └── home/        # Visão geral
├── styles/          # Estilos globais e responsividade
└── main.tsx         # Inicialização do React
```

Os próximos módulos serão criados conforme suas telas forem implementadas. As páginas de preparação usam um componente compartilhado; não contêm formulários simulados.

## Configuração pública

A única variável prevista é:

```dotenv
VITE_API_URL=http://localhost:3100
```

Ela é lida em `src/config/environment.ts`. No deploy, será substituída pela URL HTTPS pública da API no Render. As chamadas de autenticação já estão integradas. O backend permite a origem configurada por `FRONTEND_URL`, com padrão `http://localhost:5173`. Veja [Login e sessão](docs/autenticacao.md) para executar e conferir o fluxo.

**Todo código, arquivo estático e variável `VITE_*` usado no build pode ser lido pelo visitante.** O `.env` não é um local seguro para segredos de frontend, mesmo ignorado pelo Git. Nunca adicione credenciais do banco, senhas, tokens reais ou arquivos `.env` ao repositório. Segredos ficam no backend; tokens de sessão serão obtidos durante o login, não incluídos no build.

## Build e GitHub Pages

```bash
npm run build
npm run preview
```

O build verifica o TypeScript e gera os arquivos estáticos em `dist/`. A prévia fica em `http://localhost:4173/Barbearia-frontend/`.

`vite.config.ts` define `/Barbearia-frontend/` como base do build, de acordo com o nome do repositório. Caso o repositório seja renomeado ou passe a usar domínio próprio, ajuste esse caminho.

A navegação usa `HashRouter`: endereços como `/Barbearia-frontend/#/clientes` funcionam em hospedagem estática e ao recarregar a página, sem regras de redirecionamento no servidor.

A configuração e publicação no GitHub Pages serão feitas na etapa de deploy. Este bloco não publica o site nem contém automação de publicação.

## Referências

- [Vite: instalação e configuração](https://vite.dev/guide/)
- [Vite: GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [React Router: HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter)
