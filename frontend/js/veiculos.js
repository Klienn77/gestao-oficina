// frontend/js/veiculos.js

// --- Configuração da URL da API ---
const API_BASE_URL = "http://localhost:3001";
const veiculosApiUrl = `${API_BASE_URL}/veiculos`;

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
  // Container de mensagens específico desta página
  const msgContainer = document.getElementById("mensagemVeiculos");

  if (!msgContainer) {
    console.warn("Elemento de mensagem #mensagemVeiculos não encontrado.");
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

// --- Lógica Específica de Veículos ---

// Função para buscar e listar os veículos na tabela
async function listarVeiculos() {
  const tbody = document.querySelector("#tabelaVeiculos tbody");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="8" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Carregando...</span></div> Carregando...</td></tr>`;

  try {
    const veiculos = await fetchData(veiculosApiUrl);
    tbody.innerHTML = ""; // Limpa a tabela

    if (!veiculos || veiculos.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"8\" class=\"text-center text-muted\">Nenhum veículo cadastrado.</td></tr>";
        return;
    }

    veiculos.forEach((veiculo) => {
      const tr = document.createElement("tr");

      // Cria as células da tabela com data-label para responsividade
      const tdId = document.createElement("td");
      tdId.textContent = veiculo.id || "-";
      tdId.setAttribute("data-label", "ID Veículo");

      const tdClienteId = document.createElement("td");
      tdClienteId.textContent = veiculo.cliente_id || "-";
      tdClienteId.setAttribute("data-label", "ID Cliente");

      const tdMarca = document.createElement("td");
      tdMarca.textContent = veiculo.marca || "-";
      tdMarca.setAttribute("data-label", "Marca");

      const tdModelo = document.createElement("td");
      tdModelo.textContent = veiculo.modelo || "-";
      tdModelo.setAttribute("data-label", "Modelo");

      const tdAno = document.createElement("td");
      tdAno.textContent = veiculo.ano || "-";
      tdAno.setAttribute("data-label", "Ano");

      const tdPlaca = document.createElement("td");
      tdPlaca.textContent = veiculo.placa || "-";
      tdPlaca.setAttribute("data-label", "Placa");

      const tdCor = document.createElement("td");
      tdCor.textContent = veiculo.cor || "-";
      tdCor.setAttribute("data-label", "Cor");

      const tdAcoes = document.createElement("td");
      tdAcoes.setAttribute("data-label", "Ações");
      // Botão de excluir com estilo Bootstrap
      tdAcoes.innerHTML = `<button class="btn btn-danger btn-sm btn-excluir" data-id="${veiculo.id}">Excluir</button>`;

      // Adiciona as células à linha
      tr.appendChild(tdId);
      tr.appendChild(tdClienteId);
      tr.appendChild(tdMarca);
      tr.appendChild(tdModelo);
      tr.appendChild(tdAno);
      tr.appendChild(tdPlaca);
      tr.appendChild(tdCor);
      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });

    // Adiciona listeners aos botões DEPOIS de criar a tabela
    addDeleteEventListenersVeiculos();

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Erro ao carregar veículos: ${error.message}</td></tr>`;
    mostrarMensagem(`Erro ao listar veículos: ${error.message}`, "erro");
  }
}

// Função para deletar um veículo
async function deletarVeiculo(id) {
  if (!confirm(`Tem certeza que deseja excluir o veículo ID ${id}?`)) {
    return;
  }

  try {
    await fetchData(`${veiculosApiUrl}/${id}`, { method: "DELETE" });
    mostrarMensagem("Veículo excluído com sucesso!", "sucesso");
    listarVeiculos(); // Atualiza a lista
  } catch (error) {
    mostrarMensagem(`Erro ao excluir veículo: ${error.message}`, "erro");
  }
}

// Adiciona listeners aos botões de excluir (delegação de eventos)
function addDeleteEventListenersVeiculos() {
    const tabela = document.querySelector("#tabelaVeiculos");
    if (tabela) {
        tabela.removeEventListener("click", handleVeiculoDeleteClick);
        tabela.addEventListener("click", handleVeiculoDeleteClick);
    }
}

// Handler separado para o evento de clique na tabela de veículos
function handleVeiculoDeleteClick(event) {
    const button = event.target.closest(".btn-excluir");
    if (button) {
        const id = button.dataset.id;
        deletarVeiculo(id);
    }
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  const formVeiculo = document.getElementById("formVeiculo");
  if (formVeiculo) {
    listarVeiculos();

    formVeiculo.addEventListener("submit", async (e) => {
      e.preventDefault();

      const clienteIdInput = document.getElementById("clienteId");
      const marcaInput = document.getElementById("marca");
      const modeloInput = document.getElementById("modelo");
      const anoInput = document.getElementById("ano");
      const placaInput = document.getElementById("placa");
      const corInput = document.getElementById("cor");

      const cliente_id = clienteIdInput.value.trim();
      const marca = marcaInput.value.trim();
      const modelo = modeloInput.value.trim();
      const ano = anoInput.value.trim();
      const placa = placaInput.value.trim();
      const cor = corInput.value.trim();

      if (!cliente_id || !marca || !modelo || !ano || !placa || !cor) {
        mostrarMensagem("Por favor, preencha todos os campos do veículo.", "erro");
        return;
      }
      if (isNaN(parseInt(ano))) {
          mostrarMensagem("O ano deve ser um número.", "erro");
          return;
      }

      try {
        await fetchData(veiculosApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente_id, marca, modelo, ano, placa, cor }),
        });

        formVeiculo.reset();
        mostrarMensagem("Veículo cadastrado com sucesso!", "sucesso");
        listarVeiculos();
      } catch (error) {
        if (error.message.includes("Cliente com o ID fornecido não existe")) {
            mostrarMensagem("Erro: O ID do Cliente informado não foi encontrado.", "erro");
        } else {
            mostrarMensagem(`Erro ao cadastrar veículo: ${error.message}`, "erro");
        }
      }
    });
  }

  // O botão voltar agora é um link <a>
});

