// backend/routes/orcamentosRoutes.js

const express = require("express");
const router = express.Router();
const orcamentoController = require("../controllers/orcamentoController");


// Rota para criar um novo orçamento (POST /orcamentos)
router.post("/", orcamentoController.criarOrcamento);

// Rota para listar todos os orçamentos (GET /orcamentos)
router.get("/", orcamentoController.listarOrcamentos);

// Rota para buscar um orçamento específico pelo ID (GET /orcamentos/:id)
router.get("/:id", orcamentoController.buscarOrcamentoPorId);

// Rota para atualizar o status de aprovação de um orçamento (PATCH /orcamentos/:id/aprovacao)
router.patch("/:id/aprovacao", orcamentoController.atualizarAprovacao);

// Rota para deletar um orçamento (DELETE /orcamentos/:id)
router.delete("/:id", orcamentoController.deletarOrcamento);

module.exports = router;
