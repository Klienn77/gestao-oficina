// backend/routes/clientesVeiculosRoutes.js
const express = require("express");
const router = express.Router();

// Importa o controller específico para esta rota
const clientesVeiculosController = require("../controllers/clientesVeiculosController");

// Define a rota GET para listar clientes com seus veículos
// A lógica complexa de JOIN e formatação foi movida para o controller
router.get("/", clientesVeiculosController.listarClientesComVeiculos);

// Exporta o router
module.exports = router;

