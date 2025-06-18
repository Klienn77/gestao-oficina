// backend/controllers/veiculoController.js

const connection = require("../database/connection");

// Função para cadastrar um novo veículo
exports.criarVeiculo = (req, res, next) => {
  // Extrai os dados do veículo do corpo da requisição
  const { cliente_id, marca, modelo, ano, placa, cor } = req.body;
  // Query SQL parametrizada para inserir o veículo
  const query =
    "INSERT INTO veiculos (cliente_id, marca, modelo, ano, placa, cor) VALUES (?, ?, ?, ?, ?, ?)";

  connection.query(
    query,
    [cliente_id, marca, modelo, ano, placa, cor],
    (err, results) => {
      // Se erro, encaminha para o middleware de erro
      if (err) {
        // Verifica erro de chave estrangeira (cliente_id não existe)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ mensagem: 'Erro: Cliente com o ID fornecido não existe.' });
        }
        return next(err);
      }
      // Se sucesso, retorna status 201 e os dados do veículo criado
      res
        .status(201)
        .json({ id: results.insertId, cliente_id, marca, modelo, ano, placa, cor });
    }
  );
};

// Função para listar todos os veículos
exports.listarVeiculos = (req, res, next) => {
  // Query SQL para selecionar todos os veículos
  connection.query("SELECT * FROM veiculos", (err, results) => {
    // Se erro, encaminha para o middleware de erro
    if (err) {
      return next(err);
    }
    // Se sucesso, retorna a lista de veículos
    res.json(results);
  });
};

// Função para atualizar um veículo existente pelo ID
exports.atualizarVeiculo = (req, res, next) => {
  const { id } = req.params; // Pega o ID do veículo da URL
  // Extrai os novos dados do corpo da requisição
  const { cliente_id, marca, modelo, ano, placa, cor } = req.body;
  // Query SQL parametrizada para atualizar o veículo
  const query =
    "UPDATE veiculos SET cliente_id = ?, marca = ?, modelo = ?, ano = ?, placa = ?, cor = ? WHERE id = ?";

  connection.query(
    query,
    [cliente_id, marca, modelo, ano, placa, cor, id],
    (err, results) => {
        // Se erro, encaminha para o middleware de erro
        if (err) {
            // Verifica erro de chave estrangeira (cliente_id não existe)
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ mensagem: 'Erro: Cliente com o ID fornecido não existe.' });
            }
            return next(err);
        }
      // Verifica se o veículo foi encontrado e atualizado
      if (results.affectedRows === 0) {
        return res.status(404).json({ mensagem: "Veículo não encontrado" });
      }
      // Se sucesso, retorna mensagem de confirmação
      res.json({ mensagem: "Veículo atualizado com sucesso" });
    }
  );
};

// Função para deletar um veículo pelo ID
exports.deletarVeiculo = (req, res, next) => {
  const { id } = req.params; // Pega o ID do veículo da URL
  // Query SQL parametrizada para deletar o veículo
  connection.query("DELETE FROM veiculos WHERE id = ?", [id], (err, results) => {
    // Se erro, encaminha para o middleware de erro
    if (err) {
      return next(err);
    }
    // Verifica se o veículo foi encontrado e deletado
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Veículo não encontrado" });
    }
    // Se sucesso, retorna mensagem de confirmação
    res.json({ mensagem: "Veículo deletado com sucesso" });
  });
};

