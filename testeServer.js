
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Cria conexão com o banco
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: '@Fabiano77',  
  database: 'oficina' 
});

// Cria app Express
const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste simples
app.get('/teste', (req, res) => {
  res.json({ mensagem: 'Servidor de teste funcionando!' });
});

// Rota para listar orçamentos
app.get('/orcamentos', (req, res) => {
  console.log('Rota /orcamentos acessada!');
  
  const query = 'SELECT * FROM orcamentos';
  
  connection.query(query, (erro, resultados) => {
    if (erro) {
      console.error('Erro ao consultar orçamentos:', erro);
      return res.status(500).json({ erro: erro.message });
    }
    
    res.json(resultados);
  });
});

// Inicia o servidor na porta 3001 (diferente do servidor principal)
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor de teste rodando em http://localhost:${PORT}` );
});
