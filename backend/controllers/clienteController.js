// backend/controllers/clienteController.js

const connection = require('../database/connection');

// Função para criar um novo cliente
// Recebe os dados do cliente (nome, telefone, email) do corpo da requisição
exports.criarCliente = (req, res, next) => {
  const { nome, telefone, email } = req.body;
  // Query SQL parametrizada para evitar SQL Injection
  const query = 'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)';

  connection.query(query, [nome, telefone, email], (err, results) => {
    // Se ocorrer um erro na query, passa o erro para o próximo middleware (de erro)
    if (err) {
      return next(err); // Encaminha o erro
    }
    // Se sucesso, retorna status 201 (Created) e os dados do cliente criado
    res.status(201).json({ id: results.insertId, nome, telefone, email });
  });
};

// Função para listar todos os clientes
exports.listarClientes = (req, res, next) => {
  // Query SQL simples para selecionar todos os clientes
  connection.query('SELECT * FROM clientes', (err, results) => {
    // Se ocorrer um erro, passa para o middleware de erro
    if (err) {
      return next(err);
    }
    // Se sucesso, retorna a lista de clientes em formato JSON
    res.json(results);
  });
};

// Função para atualizar um cliente existente pelo ID
exports.atualizarCliente = (req, res, next) => {
  const { id } = req.params; // Pega o ID do cliente da URL
  const { nome, telefone, email } = req.body; // Pega os novos dados do corpo da requisição
  // Query SQL parametrizada para atualizar o cliente
  const query = 'UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?';

  connection.query(query, [nome, telefone, email, id], (err, results) => {
    // Se ocorrer um erro, passa para o middleware de erro
    if (err) {
      return next(err);
    }
    // Verifica se alguma linha foi afetada (se o cliente existia)
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    // Se sucesso, retorna uma mensagem de confirmação
    res.json({ mensagem: 'Cliente atualizado com sucesso' });
  });
};

// Função para deletar um cliente pelo ID
exports.deletarCliente = (req, res, next) => {
  const { id } = req.params; // Pega o ID do cliente da URL
  // Query SQL parametrizada para deletar o cliente
  connection.query('DELETE FROM clientes WHERE id = ?', [id], (err, results) => {
    // Se ocorrer um erro, passa para o middleware de erro
    if (err) {
      return next(err);
    }
    // Verifica se alguma linha foi afetada (se o cliente existia)
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
    // Se sucesso, retorna uma mensagem de confirmação
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  });
};

