// frontend/js/clientes.js

// --- Configuração da URL da API ---
const API_BASE_URL = "http://localhost:3001";
const clientesApiUrl = `${API_BASE_URL}/clientes`;

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

// Função para exibir mensagens de feedback usando Alertas Bootstrap
function mostrarMensagem(texto, tipo = "sucesso") {
  // Determina a classe Bootstrap com base no tipo (sucesso ou erro)
  const alertClass = tipo === "sucesso" ? "alert-success" : "alert-danger";
  // Encontra o container de mensagens específico desta página
  const msgContainer = document.getElementById("mensagemClientes");

  if (!msgContainer) {
    console.warn("Elemento de mensagem #mensagemClientes não encontrado.");
    // Fallback para alert simples se o container não existir
    alert(`${tipo === "erro" ? "Erro:" : "Sucesso:"} ${texto}`);
    return;
  }

  // Cria o elemento do alerta Bootstrap
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${alertClass} alert-dismissible fade show`;
  alertDiv.setAttribute("role", "alert");
  alertDiv.innerHTML = `
    ${texto}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Limpa mensagens anteriores e adiciona o novo alerta
  msgContainer.innerHTML = "";
  msgContainer.appendChild(alertDiv);

  // O alerta já tem um botão de fechar, não precisa de timeout para remover
  // Se quiser que desapareça sozinho, pode adicionar um setTimeout:
  // setTimeout(() => { alertDiv.remove(); }, 5000); // Remove após 5 segundos
}

// --- Lógica Específica de Clientes ---

// Função para buscar e listar os clientes na tabela
async function listarClientes() {
  const tbody = document.querySelector("#tabelaClientes tbody");
  if (!tbody) return;
  // Adiciona classe Bootstrap para tabela responsiva
  tbody.innerHTML = "<tr><td colspan=\"4\" class=\"text-center\"><div class=\"spinner-border spinner-border-sm\" role=\"status\"><span class=\"visually-hidden\">Carregando...</span></div> Carregando...</td></tr>";

  try {
    const clientes = await fetchData(clientesApiUrl);
    tbody.innerHTML = ""; // Limpa a tabela

    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"4\" class=\"text-center text-muted\">Nenhum cliente cadastrado.</td></tr>";
        return;
    }

    clientes.forEach((cliente) => {
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = cliente.nome;
      tdNome.setAttribute("data-label", "Nome"); // Para responsividade CSS

      const tdTelefone = document.createElement("td");
      tdTelefone.textContent = cliente.telefone;
      tdTelefone.setAttribute("data-label", "Telefone"); // Para responsividade CSS

      const tdEmail = document.createElement("td");
      tdEmail.textContent = cliente.email;
      tdEmail.setAttribute("data-label", "Email"); // Para responsividade CSS

      const tdAcoes = document.createElement("td");
      tdAcoes.setAttribute("data-label", "Ações"); // Para responsividade CSS
      // Botão de excluir com estilo Bootstrap
      tdAcoes.innerHTML = `<button class="btn btn-danger btn-sm btn-excluir" data-id="${cliente.id}">Excluir</button>`;

      tr.appendChild(tdNome);
      tr.appendChild(tdTelefone);
      tr.appendChild(tdEmail);
      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });

    // Adiciona listeners aos botões DEPOIS de criar a tabela
    addDeleteEventListenersClientes();

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Erro ao carregar clientes: ${error.message}</td></tr>`;
    mostrarMensagem(`Erro ao listar clientes: ${error.message}`, "erro");
  }
}

// Função para deletar um cliente
async function deletarCliente(id) {
  if (!confirm(`Tem certeza que deseja excluir o cliente ID ${id}?`)) {
    return;
  }

  try {
    await fetchData(`${clientesApiUrl}/${id}`, { method: "DELETE" });
    mostrarMensagem("Cliente excluído com sucesso!", "sucesso");
    listarClientes(); // Atualiza a lista
  } catch (error) {
    mostrarMensagem(`Erro ao excluir cliente: ${error.message}`, "erro");
  }
}

// Adiciona listeners aos botões de excluir (delegação de eventos)
function addDeleteEventListenersClientes() {
    const tabela = document.querySelector("#tabelaClientes");
    if (tabela) {
        tabela.removeEventListener("click", handleClienteDeleteClick);
        tabela.addEventListener("click", handleClienteDeleteClick);
    }
}

// Handler separado para o evento de clique na tabela de clientes
function handleClienteDeleteClick(event) {
    // Verifica se o clique foi no botão ou em um ícone dentro dele
    const button = event.target.closest(".btn-excluir");
    if (button) {
        const id = button.dataset.id;
        deletarCliente(id);
    }
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  const formCliente = document.getElementById("formCliente");
  if (formCliente) {
    listarClientes();

    formCliente.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nomeInput = document.getElementById("nome");
      const telefoneInput = document.getElementById("telefone");
      const emailInput = document.getElementById("email");

      const nome = nomeInput.value.trim();
      const telefone = telefoneInput.value.trim();
      const email = emailInput.value.trim();

      if (!nome || !telefone || !email) {
        mostrarMensagem("Por favor, preencha todos os campos.", "erro");
        return;
      }

      try {
        await fetchData(clientesApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, telefone, email }),
        });

        formCliente.reset();
        mostrarMensagem("Cliente cadastrado com sucesso!", "sucesso");
        listarClientes();
      } catch (error) {
        mostrarMensagem(`Erro ao cadastrar cliente: ${error.message}`, "erro");
      }
    });
  }

  // O botão voltar agora é um link <a>, não precisa de listener JS
});

