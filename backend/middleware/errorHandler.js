// backend/middleware/errorHandler.js

// Middleware de tratamento de erros centralizado
// Este middleware será chamado sempre que a função `next(err)` for invocada em qualquer rota ou controller
const errorHandler = (err, req, res, next) => {
  console.error("\n--- Erro Detectado ---");
  console.error("Timestamp:", new Date().toISOString());
  console.error("Rota:", req.method, req.originalUrl);
  // Loga o stack trace completo do erro no console do servidor para depuração
  console.error("Stack Trace:", err.stack || err);
  console.error("--- Fim do Erro ---\n");

  // Define um status code padrão para erro interno do servidor
  let statusCode = err.statusCode || 500;
  // Define uma mensagem de erro padrão
  let message = err.message || "Ocorreu um erro interno no servidor.";

  // --- Tratamento de Erros Específicos (Exemplos) ---

  // Exemplo: Erro de validação (pode ser customizado ou vir de bibliotecas)
  if (err.name === "ValidationError") {
    statusCode = 400; // Bad Request
    // Poderia extrair detalhes específicos da validação aqui
    message = "Erro de validação nos dados enviados.";
  }

  // Exemplo: Erro específico do MySQL (como entrada duplicada)
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409; // Conflict
    message = "Erro: Já existe um registro com essas informações.";
  }

  // Exemplo: Erro de conexão com o banco (pode ser capturado na inicialização ou em queries)
  if (err.code === "ECONNREFUSED" || err.code === "PROTOCOL_CONNECTION_LOST") {
    statusCode = 503; // Service Unavailable
    message = "Erro: Não foi possível conectar ao banco de dados.";
  }

  // --- Resposta ao Cliente ---

  // Em ambiente de produção, é recomendado não expor detalhes do erro
  // if (process.env.NODE_ENV === 'production') {
  //   message = "Ocorreu um erro inesperado. Tente novamente mais tarde.";
  // }

  // Envia a resposta de erro em formato JSON
  res.status(statusCode).json({
    status: "error",
    statusCode: statusCode,
    mensagem: message, // Mensagem mais segura para o cliente
    // Apenas em desenvolvimento, poderia incluir o stack: err.stack
  });

  // Nota: Não chamamos next() aqui, pois este é o final da cadeia para erros.
};

module.exports = errorHandler;

