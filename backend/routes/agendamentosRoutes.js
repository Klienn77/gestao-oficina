// backend/routes/agendamentosRoutes.js
const express = require("express");
const router = express.Router();

// Importa o controller de agendamentos
const agendamentoController = require("../controllers/agendamentoController");

// Define as rotas e associa cada uma à função correspondente no controller

// Rota POST para cadastrar um novo agendamento
// Lógica movida para agendamentoController.criarAgendamento
router.post("/", agendamentoController.criarAgendamento);

// Rota GET para listar todos os agendamentos (com dados de cliente/veículo)
// Lógica movida para agendamentoController.listarAgendamentos
router.get("/", agendamentoController.listarAgendamentos);

// Rota DELETE para deletar um agendamento pelo ID
// Lógica movida para agendamentoController.deletarAgendamento
router.delete("/:id", agendamentoController.deletarAgendamento);

// Exporta o router
module.exports = router;

