// backend/routes/veiculosRoutes.js
const express = require("express");
const router = express.Router();

// Importa o controller de veículos
const veiculoController = require("../controllers/veiculoController");

// Define as rotas e associa cada uma à função correspondente no controller

// Rota POST para cadastrar um novo veículo
// Lógica movida para veiculoController.criarVeiculo
router.post("/", veiculoController.criarVeiculo);

// Rota GET para listar todos os veículos
// Lógica movida para veiculoController.listarVeiculos
router.get("/", veiculoController.listarVeiculos);

// Rota PUT para atualizar um veículo existente pelo ID
// Lógica movida para veiculoController.atualizarVeiculo
router.put("/:id", veiculoController.atualizarVeiculo);

// Rota DELETE para deletar um veículo pelo ID
// Lógica movida para veiculoController.deletarVeiculo
router.delete("/:id", veiculoController.deletarVeiculo);

// Exporta o router
module.exports = router;

