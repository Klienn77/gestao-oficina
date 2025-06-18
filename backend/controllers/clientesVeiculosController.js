// backend/controllers/clientesVeiculosController.js

const connection = require("../database/connection");

// Função para listar todos os clientes com seus respectivos veículos
exports.listarClientesComVeiculos = (req, res, next) => {
  // Query SQL otimizada com LEFT JOIN para buscar clientes e seus veículos
  // Garante que clientes sem veículos também sejam listados
  const sql = `
    SELECT
      c.id AS cliente_id,
      c.nome AS cliente_nome,
      c.telefone AS cliente_telefone, -- Adicionado telefone
      c.email AS cliente_email,       -- Adicionado email
      v.id AS veiculo_id,
      v.marca,
      v.modelo,
      v.ano,                          -- Adicionado ano
      v.placa,
      v.cor
    FROM clientes c
    LEFT JOIN veiculos v ON v.cliente_id = c.id
    ORDER BY c.nome, v.marca, v.modelo; -- Ordena por nome do cliente e depois por veículo
  `;

  connection.query(sql, (erro, resultados) => {
    // Se erro, encaminha para o middleware de erro
    if (erro) {
      console.error("Erro ao buscar clientes com veículos:", erro);
      return next(erro);
    }

    // Organiza os dados em um formato aninhado (cliente -> lista de veículos)
    // Isso facilita o consumo no frontend
    const clientesComVeiculos = resultados.reduce((acc, row) => {
      // Encontra ou cria a entrada para o cliente no acumulador
      let cliente = acc.find((c) => c.cliente_id === row.cliente_id);
      if (!cliente) {
        cliente = {
          cliente_id: row.cliente_id,
          nome: row.cliente_nome,
          telefone: row.cliente_telefone,
          email: row.cliente_email,
          veiculos: [],
        };
        acc.push(cliente);
      }

      // Adiciona o veículo ao cliente, se existir
      if (row.veiculo_id) {
        cliente.veiculos.push({
          id: row.veiculo_id,
          marca: row.marca,
          modelo: row.modelo,
          ano: row.ano,
          placa: row.placa,
          cor: row.cor,
        });
      }

      return acc;
    }, []);

    // Retorna os dados organizados em formato JSON
    res.json(clientesComVeiculos);
  });
};

