// backend/controllers/orcamentoController.js



const connection = require("../database/connection");

// Função para criar um novo orçamento
exports.criarOrcamento = (req, res, next) => {
  // Extrai os dados do orçamento do corpo da requisição
  const { agendamento_id, valor_total, observacoes } = req.body;
  
  // Define o status de aprovação como false (não aprovado) por padrão
  const aprovado = req.body.aprovado || false;

  // Primeiro, verifica se o agendamento existe
  const verificaAgendamento = "SELECT * FROM agendamentos WHERE id = ?";
  
  connection.query(verificaAgendamento, [agendamento_id], (erro, resultados) => {
    if (erro) {
      console.error("Erro ao verificar agendamento:", erro);
      return next(erro);
    }
    
    // Se o agendamento não existir, retorna erro
    if (resultados.length === 0) {
      return res.status(404).json({ mensagem: "Agendamento não encontrado" });
    }
    
    // Se o agendamento existir, insere o orçamento
    const sql = `
      INSERT INTO orcamentos 
      (agendamento_id, valor_total, aprovado, observacoes) 
      VALUES (?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [agendamento_id, valor_total, aprovado, observacoes],
      (erro, resultado) => {
        if (erro) {
          console.error("Erro ao cadastrar orçamento:", erro);
          return next(erro);
        }
        
        // Se sucesso, retorna status 201 e os dados do orçamento criado
        res.status(201).json({ 
          id: resultado.insertId, 
          agendamento_id, 
          valor_total, 
          aprovado, 
          observacoes 
        });
      }
    );
  });
};

// Função para listar todos os orçamentos com informações do agendamento, veículo e cliente
exports.listarOrcamentos = (req, res, next) => {
  const query = `
    SELECT 
      o.id, o.agendamento_id, o.valor_total, o.aprovado, o.observacoes,
      a.data as data_agendamento, a.hora, a.servico,
      v.marca, v.modelo, v.placa,
      c.nome as cliente_nome, c.telefone
    FROM orcamentos o
    JOIN agendamentos a ON o.agendamento_id = a.id
    JOIN veiculos v ON a.veiculo_id = v.id
    JOIN clientes c ON v.cliente_id = c.id
    ORDER BY o.id DESC
  `;

  connection.query(query, (erro, resultados) => {
    if (erro) {
      console.error("Erro ao listar orçamentos:", erro);
      return next(erro);
    }
    
    res.json(resultados);
  });
};

// Função para buscar um orçamento específico pelo ID
exports.buscarOrcamentoPorId = (req, res, next) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      o.id, o.agendamento_id, o.valor_total, o.aprovado, o.observacoes,
      a.data as data_agendamento, a.hora, a.servico,
      v.marca, v.modelo, v.placa,
      c.nome as cliente_nome, c.telefone
    FROM orcamentos o
    JOIN agendamentos a ON o.agendamento_id = a.id
    JOIN veiculos v ON a.veiculo_id = v.id
    JOIN clientes c ON v.cliente_id = c.id
    WHERE o.id = ?
  `;

  connection.query(query, [id], (erro, resultados) => {
    if (erro) {
      console.error("Erro ao buscar orçamento:", erro);
      return next(erro);
    }
    
    if (resultados.length === 0) {
      return res.status(404).json({ mensagem: "Orçamento não encontrado" });
    }
    
    res.json(resultados[0]);
  });
};

// Função para atualizar o status de aprovação de um orçamento
exports.atualizarAprovacao = (req, res, next) => {
  const { id } = req.params;
  const { aprovado } = req.body;
  
  // Verifica se o campo aprovado foi fornecido
  if (aprovado === undefined) {
    return res.status(400).json({ mensagem: "O campo 'aprovado' é obrigatório" });
  }
  
  const query = "UPDATE orcamentos SET aprovado = ? WHERE id = ?";
  
  connection.query(query, [aprovado, id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao atualizar aprovação do orçamento:", erro);
      return next(erro);
    }
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Orçamento não encontrado" });
    }
    
    res.json({ 
      mensagem: `Orçamento ${aprovado ? 'aprovado' : 'reprovado'} com sucesso`,
      id,
      aprovado
    });
  });
};

// Função para deletar um orçamento
exports.deletarOrcamento = (req, res, next) => {
  const { id } = req.params;
  
  const query = "DELETE FROM orcamentos WHERE id = ?";
  
  connection.query(query, [id], (erro, resultado) => {
    if (erro) {
      console.error("Erro ao deletar orçamento:", erro);
      return next(erro);
    }
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Orçamento não encontrado" });
    }
    
    res.json({ mensagem: "Orçamento deletado com sucesso" });
  });
};
