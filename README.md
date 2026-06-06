# SenacPass - Backend

## API para contabilização automatizada de presença acadêmica com IoT

---

## Sumário

1. [Capa](#capa)
2. [Visão Geral do Projeto](#visão-geral-do-projeto)
3. [Problema de Negócio](#problema-de-negócio)
4. [Objetivos](#objetivos)
5. [Proposta de Valor](#proposta-de-valor)
6. [Persona Principal](#persona-principal)
7. [Jornada do Usuário](#jornada-do-usuário)
8. [Requisitos Funcionais](#requisitos-funcionais)
9. [Requisitos Não Funcionais](#requisitos-não-funcionais)
10. [Arquitetura da Solução](#arquitetura-da-solução)
11. [Tecnologias Utilizadas](#tecnologias-utilizadas)
12. [Estrutura de Pastas](#estrutura-de-pastas)
13. [Instalação e Configuração](#instalação-e-configuração)
14. [Configuração de Ambiente](#configuração-de-ambiente)
15. [Referência da API](#referência-da-api)
16. [Segurança da Informação](#segurança-da-informação)
17. [Cloud Computing](#cloud-computing)
18. [Internet das Coisas](#internet-das-coisas)
19. [Qualidade de Software](#qualidade-de-software)
20. [Análise e Projeto de Sistemas](#análise-e-projeto-de-sistemas)
21. [Tech English 4 - Project Summary](#tech-english-4---project-summary)
22. [Mapeamento das Unidades Curriculares](#mapeamento-das-unidades-curriculares)
23. [Dossiê de Evidências](#dossiê-de-evidências)
24. [Demonstração](#demonstração)
25. [Equipe](#equipe)
26. [Marcas Formativas Senac](#marcas-formativas-senac)
27. [Licença](#licença)
28. [Agradecimentos](#agradecimentos)
29. [Referências](#referências)

---

<a id="capa"></a>

## CAPA

<div align="center">

# **SenacPass**

## Backend - API de integração acadêmica e IoT

**Projeto Integrador**  
Faculdade Senac PE - Pernambuco

**Semestre:** 2026/1 (4º período)

**Curso:** Análise e Desenvolvimento de Sistemas

### Equipe Desenvolvedora

| Nome | Função |
|---|---|
| João Victor Rodrigues Basante | A definir |
| João Vitor Malveira da Silva | A definir |
| Maria Clara de Melo | A definir |
| Renato Trancoso Branco Delgado | A definir |
| Thayana Anália dos Santos Lira | A definir |
| Vinicius Henrique Silva Nascimento | A definir |

</div>

---

<a id="visão-geral-do-projeto"></a>

## Visão Geral do Projeto

### Contextualização

O **SenacPass** é uma solução de Internet das Coisas (IoT) desenvolvida para automatizar o controle de frequência em ambientes acadêmicos. O sistema conecta dispositivos com leitura RFID a uma aplicação web, permitindo registrar entradas e saídas e transformar esses eventos em dados acadêmicos rastreáveis.

A solução é dividida em três camadas:

- **IoT:** captura o cartão RFID e envia o evento pela rede;
- **Backend:** valida, processa e persiste os dados de presença;
- **Frontend:** apresenta turmas, aulas, alunos, dispositivos e registros ao professor.

Este repositório contém a **camada Backend**, implementada como uma API REST em Node.js, Express e TypeScript, com persistência em PostgreSQL por meio do TypeORM.

### Escopo do Backend

O backend é responsável por:

- autenticar professores e emitir tokens JWT;
- manter alunos, professores, unidades curriculares, turmas e aulas;
- vincular alunos a turmas;
- cadastrar e monitorar os dispositivos IoT;
- receber leituras RFID;
- decidir se a leitura representa check-in, check-out ou evento ignorado;
- calcular atraso, saída antecipada e tempo de permanência;
- armazenar registros de presença e logs de acesso;
- disponibilizar os dados ao frontend por endpoints REST.

### Estado Atual

O repositório possui os módulos de domínio e as migrations do banco implementados. A autenticação JWT protege parte dos endpoints. Testes automatizados, documentação OpenAPI/Swagger, rate limiting e controle de acesso por papéis ainda são pontos de evolução.

---

## Problema de Negócio

### Dor Identificada

Instituições de ensino enfrentam dificuldades recorrentes no controle de frequência:

1. professores gastam tempo de aula realizando chamadas manuais;
2. registros manuais estão sujeitos a erros e inconsistências;
3. a coordenação tem pouca visibilidade sobre entradas e saídas;
4. a consolidação de frequência exige trabalho administrativo;
5. os eventos de presença possuem baixa rastreabilidade;
6. cartões não reconhecidos ou leituras fora de contexto são difíceis de auditar.

### Impacto

- redução do tempo disponível para atividades pedagógicas;
- divergências no histórico acadêmico;
- dificuldade para identificar atrasos e saídas antecipadas;
- ausência de uma fonte centralizada de dados;
- maior custo operacional para professores e coordenação.

---

## Objetivos

### Objetivo Geral

Fornecer uma API segura e organizada que integre dispositivos RFID, regras acadêmicas e aplicações cliente, automatizando o registro e a consulta da frequência dos alunos.

### Objetivos Específicos

#### 1. Automatizar a presença

- receber o identificador RFID enviado pelo dispositivo;
- localizar o aluno associado ao cartão;
- vincular a leitura a uma aula em andamento;
- alternar automaticamente entre check-in e check-out.

#### 2. Aplicar regras acadêmicas

- impedir check-in antes do início da aula;
- marcar atraso após a tolerância configurada no código;
- calcular o tempo de permanência;
- identificar saída antecipada;
- evitar um novo processamento após o ciclo ser finalizado.

#### 3. Centralizar dados

- armazenar alunos, professores, turmas, aulas e unidades curriculares;
- manter inscrições dos alunos nas turmas;
- registrar dispositivos, logs RFID e presenças.

#### 4. Integrar os componentes da solução

- expor endpoints REST para o frontend;
- receber requisições HTTP dos dispositivos IoT;
- utilizar JSON como formato de troca de dados.

#### 5. Proteger o acesso

- armazenar senhas de professores com hash bcrypt;
- emitir e validar tokens JWT;
- utilizar headers de segurança com Helmet;
- preparar a aplicação para execução por HTTPS em infraestrutura cloud.

#### 6. Permitir implantação reproduzível

- fornecer imagem Docker da API;
- disponibilizar PostgreSQL local com Docker Compose;
- controlar o esquema do banco por migrations;
- separar configurações por variáveis de ambiente.

---

## Proposta de Valor

### Valor para Professores

| Benefício | Impacto |
|---|---|
| Chamada automatizada | Reduz o tempo gasto em tarefas administrativas |
| Dados centralizados | Facilita a consulta por turma e aula |
| Registro de horários | Permite acompanhar check-in e check-out |
| Autenticação | Restringe o acesso a operações acadêmicas protegidas |

### Valor para a Coordenação

| Benefício | Impacto |
|---|---|
| Rastreabilidade | Logs registram leituras RFID e dispositivos |
| Padronização | A API concentra regras de presença |
| Integridade relacional | PostgreSQL mantém os vínculos acadêmicos |
| Evolução | Arquitetura modular favorece novos relatórios e perfis |

### Valor para Alunos

| Benefício | Impacto |
|---|---|
| Agilidade | O cartão substitui a chamada nominal |
| Precisão | Datas e horários são registrados pelo servidor |
| Transparência | O histórico pode ser consultado por aula |
| Menos equívocos | Regras são aplicadas de forma consistente |

### Diferenciais

1. integração direta entre RFID, API e banco de dados;
2. processamento de check-in e check-out no domínio;
3. registro de eventos mesmo quando não existe aula em andamento;
4. cálculo de atraso e saída antecipada;
5. separação modular entre controllers, services, repositories e entities;
6. ambiente local reproduzível com Docker.

---

## Persona Principal

### Professor Universitário - "Professor Carlos Souza"

| Aspecto | Descrição |
|---|---|
| Idade | 46 anos |
| Experiência | 15 anos como docente |
| Atuação | Múltiplas turmas e unidades curriculares |
| Necessidade | Controlar frequência sem interromper a aula |
| Familiaridade tecnológica | Intermediária a avançada |

### Dores

- perda de tempo com chamada manual;
- dificuldade de controlar turmas grandes;
- necessidade de comprovar horários de entrada e saída;
- retrabalho para organizar a frequência.

### Necessidades

- autenticação simples;
- consulta rápida das aulas em andamento;
- registro confiável dos cartões;
- histórico de presença por aula;
- resposta clara quando uma leitura não puder ser processada.

---

## Jornada do Usuário

### Professor realizando a chamada

#### Pré-condições

- professor cadastrado;
- aluno cadastrado com `rfid_uid`;
- aluno vinculado à turma;
- aula criada e com status `EM_ANDAMENTO`;
- dispositivo cadastrado e conectado à API;
- banco atualizado com as migrations.

#### Fluxo Principal

| Etapa | Ação |
|---|---|
| 1 | Professor autentica-se pela rota de login |
| 2 | Frontend consulta turmas e aulas do professor |
| 3 | Professor coloca a aula em andamento |
| 4 | Aluno aproxima o cartão do leitor |
| 5 | Dispositivo envia `rfid_uid` e `id_dispositivo` |
| 6 | API identifica aluno e aula ativa |
| 7 | Primeira leitura cria o check-in |
| 8 | Segunda leitura cria o check-out e calcula a permanência |
| 9 | Frontend consulta as presenças da aula |

#### Fluxos Alternativos

- cartão desconhecido: a API retorna erro de validação;
- nenhuma aula em andamento: a API grava `RFID_IGNORADO_SEM_AULA`;
- leitura antes do início: o check-in é bloqueado;
- leitura após check-in e check-out: o evento retorna como `IGNORADO`;
- entrada após 30 minutos: a presença recebe status `ATRASADO`;
- saída com 30 minutos ou mais de antecedência: o status passa para `AUSENTE`.

---

## Requisitos Funcionais

### RF01 - Autenticação de Professores

O sistema deve validar e-mail e senha, comparar o hash bcrypt e emitir um token JWT com duração atual de 8 horas.

### RF02 - Gestão Acadêmica

O sistema deve permitir operações de cadastro, consulta, atualização e exclusão para:

- alunos;
- professores;
- unidades curriculares;
- turmas;
- aulas;
- dispositivos.

### RF03 - Inscrição em Turmas

O sistema deve vincular alunos a turmas, impedir inscrições duplicadas e controlar os estados `ATIVO`, `TRANCADO` e `CANCELADO`.

### RF04 - Gestão de Aulas

O sistema deve associar uma aula a uma turma e, opcionalmente, a um dispositivo, controlando os estados `AGENDADA`, `EM_ANDAMENTO`, `FINALIZADA` e `CANCELADA`.

### RF05 - Registro por RFID

O sistema deve receber uma leitura RFID, identificar o aluno e processar check-in ou check-out em uma aula ativa.

### RF06 - Regras de Presença

O sistema deve:

- usar a primeira leitura como check-in;
- usar a segunda leitura como check-out;
- marcar atraso após 30 minutos do início previsto;
- marcar ausência em saída realizada com pelo menos 30 minutos de antecedência;
- calcular o tempo de permanência em minutos.

### RF07 - Logs de Acesso

O sistema deve persistir leituras RFID com data, tipo de evento e dispositivo associado quando disponível.

### RF08 - Consultas Específicas

O sistema deve consultar:

- turmas por professor;
- aulas por turma;
- aula atualmente em andamento;
- aulas ativas de um professor;
- inscrições por aluno ou turma;
- presenças por aula.

---

## Requisitos Não Funcionais

### RNF01 - Segurança

- senhas armazenadas com bcrypt;
- autenticação Bearer JWT;
- headers HTTP protegidos por Helmet;
- segredos fornecidos por variáveis de ambiente;
- uso recomendado de HTTPS em produção.

### RNF02 - Manutenibilidade

- TypeScript em modo `strict`;
- módulos organizados por domínio;
- responsabilidades separadas em camadas;
- ESLint e Prettier disponíveis como dependências de desenvolvimento.

### RNF03 - Persistência

- PostgreSQL como banco relacional;
- UUID como chave primária;
- migrations para versionamento do esquema;
- `synchronize: false` para evitar alteração automática em produção.

### RNF04 - Portabilidade

- execução com Node.js 20 no Dockerfile;
- banco local executável via Docker Compose;
- configuração externa por `.env`;
- build compilado para JavaScript.

### RNF05 - Observabilidade

- logs HTTP gerados pelo `pino-http`;
- mensagens de inicialização do servidor e banco;
- logs de domínio para eventos RFID.

### RNF06 - Qualidade

O projeto deve evoluir com testes unitários, testes de integração, validação centralizada dos payloads e pipeline de integração contínua. Esses itens ainda não estão configurados neste repositório.

---

## Arquitetura da Solução

### Visão Macro

```text
┌──────────────────┐       HTTP/JSON       ┌──────────────────┐
│ ESP32 + RFID     │ ────────────────────> │                  │
└──────────────────┘                       │  SenacPass API   │
                                           │ Express + TS     │
┌──────────────────┐       HTTP/JSON       │                  │
│ Frontend Web     │ <──────────────────── │                  │
└──────────────────┘                       └────────┬─────────┘
                                                  │ TypeORM
                                                  ▼
                                         ┌──────────────────┐
                                         │ PostgreSQL       │
                                         └──────────────────┘
```

### Arquitetura Interna

```text
Route
  └── Middleware
        └── Controller
              └── Service
                    └── Repository
                          └── Entity / PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| Routes | Define método, caminho e middleware |
| Middleware | Valida o token de autenticação |
| Controllers | Traduz HTTP para chamadas de aplicação |
| Services | Aplica regras de negócio |
| Repositories | Encapsula consultas e persistência |
| Entities | Representa tabelas e relacionamentos |
| Migrations | Versiona o esquema do PostgreSQL |

### Modelo de Dados

```text
Professor ──< Turma >── UnidadeCurricular
                 │
                 ├──< Aula >── Dispositivo
                 │      │
Aluno ──< InscricaoTurma│
  │                     │
  └──< RegistroPresenca > 

Dispositivo ──< LogAcesso
```

### Entidades

| Entidade | Finalidade |
|---|---|
| `Aluno` | Matrícula, RFID, nome e e-mail |
| `Professor` | Credenciais e identificação docente |
| `UnidadeCurricular` | Nome e carga horária |
| `Turma` | Vínculo entre professor e unidade curricular |
| `Aula` | Data, horários, status, turma e dispositivo |
| `InscricaoTurma` | Vínculo e situação do aluno na turma |
| `RegistroPresenca` | Check-in, check-out, permanência e status |
| `Dispositivo` | Identificação e estado do hardware |
| `LogAcesso` | Auditoria das leituras RFID |

---

## Tecnologias Utilizadas

| Categoria | Tecnologia | Versão declarada |
|---|---|---|
| Runtime | Node.js | 20 no Dockerfile |
| Linguagem | TypeScript | `^6.0.3` |
| Framework HTTP | Express | `^5.2.1` |
| ORM | TypeORM | `^1.0.0` |
| Banco de dados | PostgreSQL | 16 no Compose |
| Autenticação | JSON Web Token | `^9.0.3` |
| Hash de senha | bcrypt | `^6.0.0` |
| Segurança HTTP | Helmet | `^8.2.0` |
| CORS | cors | `^2.8.6` |
| Logging | Pino / pino-http | `^10.3.1` / `^11.0.0` |
| Variáveis de ambiente | dotenv | `^17.4.2` |
| Desenvolvimento | tsx | `^4.22.4` |
| Qualidade | ESLint / Prettier | `^10.4.1` / `^3.8.3` |
| Contêineres | Docker / Compose | Ambiente de execução |

> O pacote Zod está instalado, porém ainda não é utilizado pelos módulos atuais.

---

## Estrutura de Pastas

```text
senacpass-backend/
├── src/
│   ├── modules/
│   │   ├── alunos/
│   │   ├── aulas/
│   │   ├── dispositivos/
│   │   ├── inscricoesturmas/
│   │   ├── logacessos/
│   │   ├── professores/
│   │   ├── registrospresencas/
│   │   ├── turmas/
│   │   └── unidadescurriculares/
│   ├── shared/
│   │   ├── infra/
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   └── data-source.ts
│   │   │   └── http/routes.ts
│   │   └── middlewares/authMiddleware.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

Cada módulo pode conter `controllers`, `entities`, `repositories`, `routes` e `services`.

---

## Instalação e Configuração

### Pré-requisitos

- Node.js 20 ou superior;
- npm;
- PostgreSQL, local ou remoto;
- Docker e Docker Compose, opcionais.

### Instalação Local

```bash
git clone <URL_DO_REPOSITORIO>
cd senacpass-backend
npm install
```

Crie ou ajuste o arquivo `.env` conforme a seção seguinte.

### Banco com Docker Compose

```bash
docker compose up -d postgres
```

O Compose disponibiliza o PostgreSQL na porta local `5433`, com:

```text
Banco: api_db
Usuário: admin
Senha: admin
```

Para esse ambiente, use `DB_HOST=localhost` e `DB_PORT=5433`.

### Migrations

```bash
npm run migration:run
```

Para gerar uma nova migration após alterar entidades:

```bash
npm run migration:generate
```

### Desenvolvimento

```bash
npm run dev
```

A API usa a porta definida em `PORT`, ou `3333` por padrão.

### Build e Produção

```bash
npm run build
npm start
```

### Imagem Docker da API

```bash
docker build -t senacpass-backend .
docker run --env-file .env -p 3333:3333 senacpass-backend
```

> O `docker-compose.yml` atual sobe apenas o PostgreSQL. A API deve ser executada separadamente.

### Verificação

```bash
curl http://localhost:3333/
```

Resposta esperada:

```json
{
  "message": "API funcionando 🚀"
}
```

---

## Configuração de Ambiente

Exemplo mínimo de `.env`:

```dotenv
NODE_ENV=development
PORT=3333

DB_HOST=localhost
DB_PORT=5433
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=api_db

JWT_SECRET=troque-por-uma-chave-longa-e-aleatoria
```

### Variáveis Consumidas Atualmente

| Variável | Obrigatória | Uso |
|---|---|---|
| `PORT` | Não | Porta HTTP, padrão `3333` |
| `DB_HOST` | Sim | Host do PostgreSQL |
| `DB_PORT` | Sim | Porta do PostgreSQL |
| `DB_USER` | Sim | Usuário do banco |
| `DB_PASSWORD` | Sim | Senha do banco |
| `DB_NAME` | Sim | Nome do banco |
| `JWT_SECRET` | Recomendada | Assinatura e validação do JWT |

`NODE_ENV`, `JWT_EXPIRES_IN`, `SENTRY_DSN`, `BASE_URL`, `ML_BASE_URL` e variáveis do Cloudinary aparecem no ambiente local, mas não são consumidas pelo código atual.

> Nunca publique o arquivo `.env` nem credenciais reais. Em produção, configure os segredos no serviço de hospedagem.

---

## Referência da API

### URL Base

```text
http://localhost:3333/api
```

Rotas protegidas exigem:

```http
Authorization: Bearer <token>
```

### Autenticação

```http
POST /api/professores/login
Content-Type: application/json

{
  "email": "professor@senac.br",
  "senha": "senha-segura"
}
```

Resposta:

```json
{
  "token": "<jwt>"
}
```

### Evento RFID

```http
POST /api/presencas
Content-Type: application/json

{
  "rfid_uid": "A1B2C3D4",
  "id_dispositivo": "uuid-do-dispositivo"
}
```

Possíveis resultados em `tipo`:

- `CHECKIN`;
- `CHECKOUT`;
- `IGNORADO`.

### Endpoints Públicos Atuais

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/` | Verificação simples da API |
| `POST` | `/api/professores/login` | Login do professor |
| `GET/POST/PUT/DELETE` | `/api/professores` | Gestão de professores |
| `GET/POST` | `/api/log-acessos` | Consulta e criação de logs RFID |
| `GET/POST` | `/api/presencas` | Consulta e processamento de presença |
| `GET` | `/api/presencas/:id` | Busca uma presença |
| `GET` | `/api/presencas/aula/:id_aula` | Lista presenças de uma aula |

### Endpoints Protegidos

| Recurso | Métodos e caminhos principais |
|---|---|
| Alunos | `GET/POST /api/alunos`, `GET/PUT/DELETE /api/alunos/:id` |
| Turmas | `GET/POST /api/turmas`, `GET/PUT/DELETE /api/turmas/:id`, `GET /api/turmas/professor/:id_professor` |
| Aulas | `GET/POST /api/aulas`, `GET/PUT/DELETE /api/aulas/:id`, `GET /api/aulas/turma/:id_turma`, `PATCH /api/aulas/:id/status` |
| Unidades curriculares | `GET/POST /api/unidades-curriculares`, `GET/PUT/DELETE /api/unidades-curriculares/:id` |
| Inscrições | `GET/POST /api/inscricoes-turmas`, consultas por aluno/turma, alteração de status e exclusão |
| Dispositivos | `GET/POST /api/dispositivos`, `GET/PUT/DELETE /api/dispositivos/:id` |

### Códigos HTTP Utilizados

| Código | Significado |
|---|---|
| `200` | Consulta ou atualização realizada |
| `201` | Recurso criado |
| `204` | Exclusão realizada |
| `400` | Payload ou regra de negócio inválida |
| `401` | Credenciais ou token inválidos |
| `404` | Recurso não encontrado |
| `500` | Erro interno |

> Atenção: a ordem atual de algumas rotas parametrizadas pode fazer com que caminhos específicos sejam interpretados como `/:id`. Isso deve ser coberto por testes de integração e ajustado durante a evolução da API.

---

## Segurança da Informação

### Controles Implementados

- hash de senha com bcrypt e custo 10;
- JWT assinado no login;
- middleware para tokens Bearer;
- Helmet para headers de segurança;
- CORS habilitado;
- dados de conexão externos ao código;
- omissão do hash de senha na maioria das respostas de professor;
- relacionamentos e unicidade aplicados no banco.

### Situação Atual e Melhorias Necessárias

| Controle | Estado |
|---|---|
| Autenticação de professor | Implementado |
| Proteção de alunos, turmas, aulas, inscrições e dispositivos | Implementado |
| Proteção de professores, logs e presenças | Pendente |
| Autorização por perfil ou propriedade do recurso | Pendente |
| Rate limiting e bloqueio de tentativas | Pendente |
| Validação uniforme com Zod | Pendente |
| Restrição de origens CORS | Pendente |
| Segredo JWT obrigatório, sem fallback | Pendente |
| Documentação e testes de segurança | Pendente |

### LGPD

O backend trata dados pessoais como nome, e-mail, matrícula, identificador RFID e histórico de presença. A implantação deve observar:

- finalidade e base legal para o tratamento;
- minimização dos dados coletados;
- controle de acesso e trilha de auditoria;
- política de retenção e descarte;
- atendimento aos direitos do titular;
- criptografia em trânsito e proteção dos backups.

---

## Cloud Computing

### Estratégia de Implantação

A API está preparada para ser compilada e executada em contêiner. Uma arquitetura de referência pode utilizar:

- serviço de aplicação ou contêiner para o backend;
- PostgreSQL gerenciado;
- cofre de segredos para variáveis sensíveis;
- HTTPS no gateway ou balanceador;
- logs centralizados e monitoramento;
- backups automáticos do banco.

### Fluxo de Deploy

```text
Código fonte
    ↓
npm install
    ↓
npm run build
    ↓
Imagem Docker
    ↓
Serviço de aplicação
    ↓
PostgreSQL gerenciado
```

### Cuidados de Produção

- definir `JWT_SECRET` forte;
- restringir CORS ao domínio do frontend;
- executar migrations antes da nova versão;
- habilitar health check dedicado;
- configurar limites de CPU, memória e conexão;
- usar TLS no banco e na API;
- revisar o `ssl.rejectUnauthorized` conforme o provedor.

---

## Internet das Coisas

### Papel da API

O dispositivo IoT atua como cliente HTTP. Ao ler um cartão, envia o UID à API. O backend concentra a decisão acadêmica, evitando que regras sensíveis fiquem distribuídas no firmware.

### Fluxo RFID

```text
Cartão RFID
    ↓
Leitor + ESP32
    ↓ POST /api/presencas
SenacPass API
    ├── identifica o aluno
    ├── encontra a aula em andamento
    ├── grava o log
    └── cria check-in ou check-out
            ↓
        PostgreSQL
```

### Contrato do Dispositivo

```json
{
  "rfid_uid": "A1B2C3D4",
  "id_dispositivo": "uuid-opcional"
}
```

O campo `rfid_uid` é obrigatório. O horário é produzido pelo servidor, reduzindo dependência do relógio interno do dispositivo.

### Regras Atuais

- somente uma aula com status `EM_ANDAMENTO` é considerada ativa;
- o primeiro evento registra entrada;
- o segundo evento registra saída;
- eventos sem aula ativa são registrados em log;
- uma presença finalizada não é aberta novamente;
- os limites de atraso e saída antecipada estão fixados em 30 minutos no service.

---

## Qualidade de Software

### Práticas Presentes

- TypeScript com verificação estrita;
- ESLint e Prettier;
- organização modular por domínio;
- Repository Pattern;
- Service Layer;
- migrations versionadas;
- build com aliases resolvidos por `tsc-alias`;
- logs HTTP estruturados com Pino.

### Comandos

```bash
npm run dev
npm run build
npm start
npm run migration:run
npm run migration:generate
```

O `package.json` ainda não define scripts de `lint`, `format` ou `test`.

### Estratégia de Testes Recomendada

- testes unitários para services;
- testes de integração para autenticação e rotas;
- banco isolado para testes;
- casos de check-in, atraso, check-out e saída antecipada;
- testes de autorização;
- validação da ordem das rotas específicas e parametrizadas.

---

## Análise e Projeto de Sistemas

### Padrões Aplicados

- arquitetura em camadas;
- Repository Pattern para persistência;
- Service Layer para regras de negócio;
- DTOs implícitos por objetos parciais das entidades;
- injeção de repositórios em parte dos services;
- entidades relacionais com TypeORM.

### Relacionamentos Principais

| Origem | Relação | Destino |
|---|---|---|
| Turma | muitos para um | Professor |
| Turma | muitos para um | Unidade curricular |
| Aula | muitos para um | Turma |
| Aula | muitos para um, opcional | Dispositivo |
| Inscrição | muitos para um | Aluno e turma |
| Presença | muitos para um | Aluno e aula |
| Log | muitos para um, opcional | Dispositivo |

### Integridade

- exclusão de aula remove presenças relacionadas;
- exclusão de aluno ou turma remove inscrições relacionadas;
- exclusão de dispositivo preserva aula e log, atribuindo `NULL`;
- matrícula, RFID e e-mail de aluno são únicos;
- e-mail de professor, código de turma e ID de hardware são únicos.

---

## Tech English 4 - Project Summary

### Project Overview

**SenacPass Backend** is a REST API that connects RFID-enabled IoT devices to an academic attendance management system. It receives card readings, applies attendance rules, stores the resulting records, and exposes academic data to a web frontend.

### Main Responsibilities

1. authenticate teachers with bcrypt and JWT;
2. manage students, teachers, courses, classes and lessons;
3. register IoT devices and RFID access logs;
4. process attendance check-in and check-out;
5. calculate late arrivals, early departures and permanence time;
6. persist relational data in PostgreSQL.

### Technical Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Web framework | Express |
| ORM | TypeORM |
| Database | PostgreSQL |
| Authentication | JWT and bcrypt |
| Logging | Pino |
| Deployment | Docker |

### Current Limitations

Automated tests, OpenAPI documentation, role-based authorization, rate limiting and complete input validation are not implemented yet. These items are part of the recommended technical roadmap.

---

## Mapeamento das Unidades Curriculares

| UC | Conceito Aplicado | Evidência no Backend |
|---|---|---|
| Cloud Computing | Portabilidade e configuração externa | Dockerfile, `.env` e PostgreSQL desacoplado |
| Comportamento do Consumidor | Redução da tarefa manual | Automação do check-in e check-out |
| Segurança de Sistemas da Informação | Autenticação e proteção de credenciais | JWT, bcrypt, Helmet e variáveis de ambiente |
| Qualidade de Software | Padronização e manutenibilidade | TypeScript strict, ESLint, camadas e migrations |
| IoT: Internet das Coisas | Integração hardware-software | Endpoint RFID, dispositivos e logs |
| Análise e Projeto de Sistemas | Modelagem e arquitetura | Entidades relacionais e módulos de domínio |
| Tech English 4 | Comunicação técnica | Project summary em inglês |

---

## Dossiê de Evidências

### API Backend

> Inserir capturas das requisições e respostas realizadas no Postman, Insomnia ou ferramenta equivalente.

Evidências sugeridas:

- criação e login de professor;
- acesso autorizado e não autorizado;
- cadastros acadêmicos;
- alteração do status de uma aula;
- check-in, check-out e leitura ignorada;
- consulta de presenças por aula.

### Banco de Dados

> Inserir imagem do PostgreSQL com as tabelas criadas pelas migrations.

Tabelas principais:

- `aluno`;
- `professor`;
- `unidade_curricular`;
- `turma`;
- `aula`;
- `inscricao_turma`;
- `dispositivo`;
- `log_acesso`;
- `registro_presenca`.

### Dispositivo IoT

> Inserir fotos do ESP32, leitor RFID, montagem e monitor serial.

### Logs e Integração

> Inserir evidências do `pino-http`, logs RFID e comunicação entre hardware, API e frontend.

### Cloud

> Inserir capturas do serviço de aplicação, banco gerenciado, variáveis de ambiente e logs de implantação.

---

## Demonstração

| Item | Link | Status |
|---|---|---|
| Aplicação Web | [Acessar aplicação](https://black-flower-0aa5e4810.7.azurestaticapps.net/) | Online |
| API Backend | [Acessar API](https://senacpass-api-amc2eubab9emcxfu.centralus-01.azurewebsites.net/api/) | Informado pelo projeto |
| Repositório GitHub | A preencher | A preencher |
| Documentação da API | A preencher | Pendente |
| Slides | A preencher | A preencher |
| Vídeo demonstrativo | A preencher | A preencher |

---

## Equipe

### João Victor Rodrigues Basante

**Função:** A preencher  
**Contribuições:** A preencher  
**GitHub:** A preencher  
**LinkedIn:** A preencher

### João Vitor Malveira da Silva

**Função:** A preencher  
**Contribuições:** A preencher  
**GitHub:** A preencher  
**LinkedIn:** A preencher

### Maria Clara de Melo

**Função:** A preencher  
**Contribuições:** A preencher  
**GitHub:** A preencher  
**LinkedIn:** A preencher

### Renato Trancoso Branco Delgado

**Função:** A preencher  
**Contribuições:** A preencher  
**GitHub:** A preencher  
**LinkedIn:** A preencher

### Thayana Anália dos Santos Lira

**Função:** A preencher  
**Contribuições:** A preencher  
**GitHub:** A preencher  
**LinkedIn:** A preencher

### Vinicius Henrique Silva Nascimento

**Função:** A preencher  
**Contribuições:** A preencher  
**GitHub:** A preencher  
**LinkedIn:** A preencher

---

## Marcas Formativas Senac

### 1. Domínio Técnico-Científico

- desenvolvimento de API REST com Express e TypeScript;
- modelagem relacional com TypeORM e PostgreSQL;
- autenticação JWT e hash bcrypt;
- integração entre IoT, backend e frontend;
- implantação reproduzível com Docker.

### 2. Resolução de Problemas com Autonomia Digital

- transformação de leituras RFID em presença acadêmica;
- tratamento de cartões desconhecidos e aulas inativas;
- cálculo automático de atraso e permanência;
- organização do código para evolução independente dos módulos.

### 3. Visão Crítica, Ética e Segurança

- proteção de senhas;
- identificação dos dados pessoais tratados;
- registro de limitações atuais de autorização;
- consideração de controles necessários para LGPD e produção.

### 4. Comunicação e Colaboração

- estrutura modular que permite trabalho paralelo;
- contratos HTTP baseados em JSON;
- documentação técnica em português e inglês;
- versionamento de banco por migrations.

### 5. Atitude Empreendedora e Inovadora

- aplicação de IoT a um problema acadêmico real;
- automação de uma atividade repetitiva;
- base técnica preparada para relatórios, novos perfis e expansão institucional;
- integração de hardware e software em um produto único.

---

## Licença

O `package.json` declara atualmente a licença **ISC**.

Antes da publicação definitiva, a equipe deve confirmar se essa será a licença oficial do projeto e adicionar um arquivo `LICENSE` correspondente.

---

## Agradecimentos

### Orientadores

- Prof. Arnott Caiado - orientação no Projeto Integrador;
- Prof. Alison - auxílio no deploy em nuvem.

### Professores das Unidades Curriculares

| UC | Professor |
|---|---|
| Cloud Computing | Alisom |
| Comportamento do Consumidor | Paulo Guimarães |
| Segurança de Sistemas da Informação | Paulo Pimentel |
| Qualidade de Software | Paulo Pimentel |
| IoT: Internet das Coisas | Arnott |
| Análise e Projeto de Sistemas | Marcus |
| Tech English 4 | Leonardo |

### Instituição e Comunidade

- Faculdade Senac PE;
- comunidade Node.js;
- mantenedores do Express, TypeORM, PostgreSQL e demais projetos open source utilizados.

---

## Referências

### Documentação Oficial

- [Node.js](https://nodejs.org/docs/latest/api/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Express](https://expressjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Docker](https://docs.docker.com/)
- [JSON Web Tokens](https://jwt.io/introduction)
- [Pino](https://getpino.io/)

### Segurança e Regulamentação

- [Lei Geral de Proteção de Dados - LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## Histórico de Alterações

| Versão | Data | Alterações | Autor |
|---|---|---|---|
| 1.0 | 2026-06-06 | README adaptado à implementação do backend | Equipe SenacPass |

---

## Contato e Suporte

- **E-mail:** renato.delgado@edu.pe.senac.br

---

<div align="center">

**Desenvolvido pela Equipe SenacPass**

Faculdade Senac PE | Pernambuco | Brasil | 2026

</div>
