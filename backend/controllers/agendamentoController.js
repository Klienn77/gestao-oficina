// backend/controllers/agendamentoController.js

const connection = require("../database/connection");

// Função para criar um novo agendamento
exports.criarAgendamento = (req, res, next) => {
  // Extrai os dados do agendamento do corpo da requisição
  const { veiculo_id, data, hora, servico } = req.body;
  // Define o status inicial como 'pendente' por padrão, conforme ENUM do banco
  // Se o frontend enviar um status válido, ele será usado, caso contrário, 'pendente'.
  const statusEnviado = req.body.status;
  // Garante que o status seja um dos valores permitidos pelo ENUM
  const statusValido = ['pendente', 'concluido', 'cancelado'].includes(statusEnviado) ? statusEnviado : 'pendente';

  // Query SQL parametrizada para inserir o agendamento
  const sql =
    "INSERT INTO agendamentos (veiculo_id, data, hora, servico, status) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    sql,
    // Usa o statusValido garantindo que é um dos valores do ENUM
    [veiculo_id, data, hora, servico, statusValido],
    (erro, resultado) => {
      // Se erro, encaminha para o middleware de erro
      if (erro) {
        // Verifica erro de chave estrangeira (veiculo_id não existe)
        if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ mensagem: 'Erro: Veículo com o ID fornecido não existe.' });
        }
        console.error("Erro ao cadastrar agendamento:", erro);
        return next(erro); // Encaminha o erro genérico
      }
      // Se sucesso, retorna status 201 e os dados do agendamento criado
      res.status(201).json({ id: resultado.insertId, veiculo_id, data, hora, servico, status: statusValido });
    }
  );
};

// Função para listar todos os agendamentos (com informações do cliente e veículo)
exports.listarAgendamentos = (req, res, next) => {
    // Query SQL com JOINs para buscar informações relacionadas
    const query = `
        SELECT
            a.id, a.data, a.hora, a.servico, a.status,
            v.id AS veiculo_id, v.modelo AS veiculo_modelo, v.placa AS veiculo_placa,
            c.id AS cliente_id, c.nome AS cliente_nome
        FROM agendamentos a
        JOIN veiculos v ON a.veiculo_id = v.id
        JOIN clientes c ON v.cliente_id = c.id
        ORDER BY a.data, a.hora;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao listar agendamentos:", err);
            return next(err);
        }
        res.json(results);
    });
};

// Função para deletar um agendamento pelo ID
exports.deletarAgendamento = (req, res, next) => {
    const { id } = req.params;
    const query = 'DELETE FROM agendamentos WHERE id = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Erro ao deletar agendamento:", err);
            return next(err);
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Agendamento não encontrado' });
        }
        res.json({ mensagem: 'Agendamento deletado com sucesso' });
    });
};

