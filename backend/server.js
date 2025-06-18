// Primeiro, vamos atualizar o server.js para incluir as novas rotas de orçamentos

// backend/server.js (atualizado)

require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env
const express = require("express");
const connection = require("./database/connection"); // Importa e inicializa a conexão com o banco
const cors = require("cors");

// Importa o middleware de tratamento de erros
const errorHandler = require("./middleware/errorHandler");

const app = express(); // Cria a instância do aplicativo Express

// --- Middlewares Essenciais ---

// Habilita o CORS para permitir requisições de diferentes origens (ex: frontend)
app.use(cors());
// Habilita o parsing de JSON no corpo das requisições
app.use(express.json());

// --- Rotas da Aplicação ---
// Cada conjunto de rotas é importado e montado em um prefixo específico

const clientesRoutes = require("./routes/clientesRoutes");
app.use("/clientes", clientesRoutes); // Rotas para gerenciar clientes

const veiculosRoutes = require("./routes/veiculosRoutes");
app.use("/veiculos", veiculosRoutes); // Rotas para gerenciar veículos

const agendamentosRoutes = require("./routes/agendamentosRoutes");
app.use("/agendamentos", agendamentosRoutes); // Rotas para gerenciar agendamentos

const clientesVeiculosRoutes = require("./routes/clientesVeiculosRoutes");
app.use("/clientes-com-veiculos", clientesVeiculosRoutes); // Rota para listar clientes e seus veículos

// Nova rota para orçamentos
const orcamentosRoutes = require("./routes/orcamentosRoutes");
app.use("/orcamentos", orcamentosRoutes); // Rotas para gerenciar orçamentos

// --- Rota de Teste/Health Check ---
// Uma rota simples para verificar se o servidor está online
app.get("/", (req, res) => {
  res.send("Servidor da Oficina rodando com sucesso!");
});

// --- Middleware de Tratamento de Erros ---
// IMPORTANTE: Este middleware deve ser o ÚLTIMO a ser adicionado com app.use()
// Ele captura quaisquer erros que ocorram nas rotas e controllers anteriores
app.use(errorHandler);

// --- Inicialização do Servidor ---

// Define a porta a partir da variável de ambiente ou usa 3000 como padrão
//const PORT = process.env.PORT || 3001;
const PORT = 3001;
// Inicia o servidor e escuta na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  // A conexão com o banco já foi estabelecida em ./database/connection.js
});
