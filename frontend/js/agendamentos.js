// frontend/js/agendamentos.js

// --- Configuração das URLs da API ---
const API_BASE_URL = "http://localhost:3001";
const agendamentosUrl = `${API_BASE_URL}/agendamentos`;
const clientesUrl = `${API_BASE_URL}/clientes`;
const veiculosUrl = `${API_BASE_URL}/veiculos`;

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
  const alertClass = tipo === "sucesso" ? "alert-success" : "alert-danger";
  // Container de mensagens específico desta página (id="mensagem")
  const msgContainer = document.getElementById("mensagem");

  if (!msgContainer) {
    console.warn("Elemento de mensagem #mensagem não encontrado.");
    alert(`${tipo === "erro" ? "Erro:" : "Sucesso:"} ${texto}`);
    return;
  }

  // Cria o alerta Bootstrap
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
}

// --- Lógica Principal ---

// Função para buscar e listar os agendamentos na tabela
async function listarAgendamentos() {
  const tbody = document.querySelector("#tabelaAgendamentos tbody");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Carregando...</span></div> Carregando...</td></tr>`;

  try {
    const agendamentos = await fetchData(agendamentosUrl);
    tbody.innerHTML = ""; // Limpa a tabela

    if (!agendamentos || agendamentos.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"7\" class=\"text-center text-muted\">Nenhum agendamento encontrado.</td></tr>";
        return;
    }

    // Formata a data para exibição (dd/mm/yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const [year, month, day] = dateString.split("T")[0].split("-");
            return `${day}/${month}/${year}`;
        } catch (e) {
            console.error("Erro ao formatar data:", dateString, e);
            return dateString; // Retorna a string original em caso de erro
        }
    };

    agendamentos.forEach((agendamento) => {
      const tr = document.createElement("tr");

      // Cria as células com data-label para responsividade
      const tdId = document.createElement("td");
      tdId.textContent = agendamento.id;
      tdId.setAttribute("data-label", "ID");

      const tdCliente = document.createElement("td");
      tdCliente.textContent = agendamento.cliente_nome || "(Cliente não encontrado)";
      tdCliente.setAttribute("data-label", "Cliente");

      const tdVeiculo = document.createElement("td");
      tdVeiculo.textContent = `${agendamento.veiculo_modelo || "(Veículo)"} (${agendamento.veiculo_placa || "-"})`;
      tdVeiculo.setAttribute("data-label", "Veículo (Placa)");

      const tdData = document.createElement("td");
      tdData.textContent = formatDate(agendamento.data);
      tdData.setAttribute("data-label", "Data");

      const tdHora = document.createElement("td");
      tdHora.textContent = agendamento.hora || "-";
      tdHora.setAttribute("data-label", "Hora");

      const tdServico = document.createElement("td");
      tdServico.textContent = agendamento.servico || "-";
      tdServico.setAttribute("data-label", "Serviço");

      const tdAcoes = document.createElement("td");
      tdAcoes.setAttribute("data-label", "Ações");
      // Botão de excluir com estilo Bootstrap
      tdAcoes.innerHTML = `<button class="btn btn-danger btn-sm btn-excluir" data-id="${agendamento.id}">Excluir</button>`;

      // Adiciona as células à linha
      tr.appendChild(tdId);
      tr.appendChild(tdCliente);
      tr.appendChild(tdVeiculo);
      tr.appendChild(tdData);
      tr.appendChild(tdHora);
      tr.appendChild(tdServico);
      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });

    // Adiciona listeners aos botões DEPOIS de criar a tabela
    addDeleteEventListenersAgendamentos();

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Erro ao carregar agendamentos: ${error.message}</td></tr>`;
    mostrarMensagem(`Erro ao listar agendamentos: ${error.message}`, "erro");
  }
}

// Função para excluir um agendamento
async function deletarAgendamento(id) {
  if (!confirm(`Tem certeza que deseja excluir o agendamento ID ${id}?`)) {
    return;
  }

  try {
    await fetchData(`${agendamentosUrl}/${id}`, { method: "DELETE" });
    mostrarMensagem("Agendamento excluído com sucesso!", "sucesso");
    listarAgendamentos(); // Atualiza a tabela
  } catch (error) {
    mostrarMensagem(`Erro ao excluir agendamento: ${error.message}`, "erro");
  }
}

// Adiciona listeners aos botões de excluir (delegação de eventos)
function addDeleteEventListenersAgendamentos() {
    const tabela = document.querySelector("#tabelaAgendamentos");
    if (tabela) {
        tabela.removeEventListener("click", handleAgendamentoDeleteClick);
        tabela.addEventListener("click", handleAgendamentoDeleteClick);
    }
}

// Handler separado para o evento de clique na tabela de agendamentos
function handleAgendamentoDeleteClick(event) {
    const button = event.target.closest(".btn-excluir");
    if (button) {
        const id = button.dataset.id;
        deletarAgendamento(id);
    }
}

// Preenche o select de clientes no formulário de agendamento
async function preencherClientes() {
  const select = document.querySelector("select[name=\"cliente_id_ag\"]");
  if (!select) return;

  try {
    const clientes = await fetchData(clientesUrl);
    select.innerHTML = ",<option value=\"\">Selecione um Cliente</option>";

    if (clientes && clientes.length > 0) {
        clientes.forEach((cliente) => {
          const option = document.createElement("option");
          option.value = cliente.id;
          option.textContent = `${cliente.nome} (ID: ${cliente.id})`;
          select.appendChild(option);
        });
    } else {
        select.innerHTML = ",<option value=\"\">Nenhum cliente cadastrado</option>";
    }
  } catch (error) {
    mostrarMensagem(`Erro ao carregar clientes: ${error.message}`, "erro");
    select.innerHTML = ",<option value=\"\">Erro ao carregar clientes</option>";
  }
}

// Preenche o select de veículos no formulário de agendamento
async function preencherVeiculos() {
  const select = document.querySelector("select[name=\"veiculo_id\"]");
  if (!select) return;

  try {
    const veiculos = await fetchData(veiculosUrl);
    select.innerHTML = ",<option value=\"\">Selecione um Veículo</option>";

    if (veiculos && veiculos.length > 0) {
        veiculos.forEach((veiculo) => {
          const option = document.createElement("option");
          option.value = veiculo.id;
          option.textContent = `${veiculo.marca || "Marca"} ${veiculo.modelo || "Modelo"} (${veiculo.placa || "Placa"}) - ID: ${veiculo.id}`;
          select.appendChild(option);
        });
    } else {
        select.innerHTML = ",<option value=\"\">Nenhum veículo cadastrado</option>";
    }
  } catch (error) {
    mostrarMensagem(`Erro ao carregar veículos: ${error.message}`, "erro");
    select.innerHTML = ",<option value=\"\">Erro ao carregar veículos</option>";
  }
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  const formAgendamento = document.getElementById("formAgendamento");
  if (formAgendamento) {
    listarAgendamentos();
    preencherClientes();
    preencherVeiculos();

    formAgendamento.addEventListener("submit", async (e) => {
        e.preventDefault();

        const veiculo_id = document.querySelector("select[name=\"veiculo_id\"]").value;
        const data = document.querySelector("input[name=\"data\"]").value;
        const hora = document.querySelector("input[name=\"hora\"]").value;
        const servico = document.querySelector("input[name=\"servico\"]").value;

        if (!veiculo_id || !data || !hora || !servico) {
            mostrarMensagem("Por favor, preencha todos os campos obrigatórios.", "erro");
            return;
        }

        try {
          await fetchData(agendamentosUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ veiculo_id, data, hora, servico }),
          });

          formAgendamento.reset();
          mostrarMensagem("Agendamento cadastrado com sucesso!", "sucesso");
          listarAgendamentos();
        } catch (error) {
          mostrarMensagem(`Erro ao cadastrar agendamento: ${error.message}`, "erro");
        }
      });
  }

  // O botão voltar agora é um link <a>
});

