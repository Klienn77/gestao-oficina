// frontend/js/clientesVeiculos.js

// --- Configuração da URL da API ---
const API_BASE_URL = "http://localhost:3001";
const clientesVeiculosApiUrl = `${API_BASE_URL}/clientes-com-veiculos`;

// --- Funções Auxiliares ---

// Função auxiliar para requisições fetch com tratamento de erro
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorMsg = `Erro HTTP ${response.status} - ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.mensagem || JSON.stringify(errorData);
      } catch (jsonError) {}
      throw new Error(errorMsg);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
    }
    return;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
}

// Função para exibir mensagens de feedback usando Alertas Bootstrap (embora não haja formulário aqui, pode ser útil para erros)
function mostrarMensagem(texto, tipo = "sucesso", containerId = "clientesComVeiculos") {
  const alertClass = tipo === "sucesso" ? "alert-success" : "alert-danger";
  const msgContainer = document.getElementById(containerId);

  if (!msgContainer) {
    console.warn(`Elemento de mensagem #${containerId} não encontrado.`);
    alert(`${tipo === "erro" ? "Erro:" : "Sucesso:"} ${texto}`);
    return;
  }

  // Cria o alerta Bootstrap
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${alertClass} alert-dismissible fade show mt-3`; // Adiciona margem
  alertDiv.setAttribute("role", "alert");
  alertDiv.innerHTML = `
    ${texto}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Adiciona o alerta no início do container
  msgContainer.prepend(alertDiv);
}

// --- Lógica Principal ---

// Função para buscar e exibir clientes com seus veículos usando cards Bootstrap
async function carregarClientesComVeiculos() {
  const container = document.getElementById("clientesComVeiculos");
  if (!container) return;

  // Limpa o container e mostra spinner de carregamento
  container.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p>Carregando dados dos clientes e veículos...</p>
    </div>`;

  try {
    const dados = await fetchData(clientesVeiculosApiUrl);
    container.innerHTML = ""; // Limpa o spinner

    if (!dados || dados.length === 0) {
      container.innerHTML = "<p class=\"text-center text-muted\">Nenhum cliente cadastrado.</p>";
      return;
    }

    // Cria um grid responsivo para os cards
    const rowDiv = document.createElement("div");
    rowDiv.className = "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"; // 1 coluna em small, 2 em medium, 3 em large

    dados.forEach((cliente) => {
      const colDiv = document.createElement("div");
      colDiv.className = "col";

      const cardDiv = document.createElement("div");
      cardDiv.className = "card h-100 shadow-sm"; // h-100 para cards da mesma altura na linha

      let veiculosHtml = "<li class=\"list-group-item\"><small class=\"text-muted\">Nenhum veículo cadastrado.</small></li>";
      if (cliente.veiculos && cliente.veiculos.length > 0) {
        veiculosHtml = cliente.veiculos
          .map((v) => {
            const marca = v.marca ? v.marca.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "-";
            const modelo = v.modelo ? v.modelo.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "-";
            const placa = v.placa ? v.placa.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "-";
            return `<li class="list-group-item">${marca} ${modelo} - Placa: ${placa} <span class="badge bg-secondary rounded-pill">ID: ${v.id}</span></li>`;
          })
          .join("");
      }

      const nomeCliente = cliente.nome ? cliente.nome.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "Nome não disponível";

      cardDiv.innerHTML = `
        <div class="card-header"><strong>${nomeCliente}</strong> <span class="badge bg-primary rounded-pill">ID: ${cliente.cliente_id}</span></div>
        <div class="card-body">
          <p class="card-text mb-1"><small><strong>Telefone:</strong> ${cliente.telefone || "-"}</small></p>
          <p class="card-text"><small><strong>Email:</strong> ${cliente.email || "-"}</small></p>
          <h6 class="card-subtitle mt-3 mb-2 text-muted">Veículos:</h6>
          <ul class="list-group list-group-flush">
            ${veiculosHtml}
          </ul>
        </div>
      `;
      colDiv.appendChild(cardDiv);
      rowDiv.appendChild(colDiv);
    });

    container.appendChild(rowDiv);

  } catch (error) {
    container.innerHTML = ""; // Limpa o spinner
    mostrarMensagem(`Erro ao carregar dados: ${error.message}`, "erro", "clientesComVeiculos");
  }
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("clientesComVeiculos")) {
        carregarClientesComVeiculos();
    }
    // O botão voltar agora é um link <a>
});

