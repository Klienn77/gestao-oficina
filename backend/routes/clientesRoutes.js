// backend/routes/clientesRoutes.js
const express = require('express');
const router = express.Router();



// Importa o controller de clientes
const clienteController = require('../controllers/clienteController');

// Define as rotas e associa cada uma à função correspondente no controller

// Rota POST para criar um novo cliente
// A lógica foi movida para clienteController.criarCliente
router.post('/', clienteController.criarCliente);

// Rota GET para listar todos os clientes
// A lógica foi movida para clienteController.listarClientes
router.get('/', clienteController.listarClientes);

// Rota PUT para atualizar um cliente existente pelo ID
// A lógica foi movida para clienteController.atualizarCliente
router.put('/:id', clienteController.atualizarCliente);

// Rota DELETE para deletar um cliente pelo ID
// A lógica foi movida para clienteController.deletarCliente
router.delete('/:id', clienteController.deletarCliente);

// Exporta o router para ser usado no server.js
module.exports = router;

