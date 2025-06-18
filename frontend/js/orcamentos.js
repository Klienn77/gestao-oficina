// frontend/js/orcamentos.js

// --- Configuração da URL da API ---
const API_BASE_URL = "http://localhost:3001";
const orcamentosUrl = `${API_BASE_URL}/orcamentos`;
const agendamentosUrl = `${API_BASE_URL}/agendamentos`;

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

// Função para formatar valores monetários
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Função para formatar datas (YYYY-MM-DD para DD/MM/YYYY)
function formatarData(dataString) {
  if (!dataString) return "-";
  try {
    const [ano, mes, dia] = dataString.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    console.error("Erro ao formatar data:", dataString, e);
    return dataString;
  }
}

// --- Lógica Principal ---

// Função para buscar e listar os orçamentos na tabela
async function listarOrcamentos() {
  const tbody = document.querySelector("#tabelaOrcamentos tbody");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Carregando...</span></div> Carregando...</td></tr>`;

  try {
    const orcamentos = await fetchData(orcamentosUrl);
    tbody.innerHTML = ""; // Limpa a tabela

    if (!orcamentos || orcamentos.length === 0) {
        tbody.innerHTML = "<tr><td colspan=\"7\" class=\"text-center text-muted\">Nenhum orçamento cadastrado.</td></tr>";
        return;
    }

    orcamentos.forEach((orcamento) => {
      const tr = document.createElement("tr");

      // Cria as células com data-label para responsividade
      const tdId = document.createElement("td");
      tdId.textContent = orcamento.id;
      tdId.setAttribute("data-label", "ID");

      const tdCliente = document.createElement("td");
      tdCliente.textContent = orcamento.cliente_nome || "(Cliente não encontrado)";
      tdCliente.setAttribute("data-label", "Cliente");

      const tdVeiculo = document.createElement("td");
      tdVeiculo.textContent = `${orcamento.marca || ""} ${orcamento.modelo || ""} (${orcamento.placa || "-"})`;
      tdVeiculo.setAttribute("data-label", "Veículo");

      const tdServico = document.createElement("td");
      tdServico.textContent = orcamento.servico || "-";
      tdServico.setAttribute("data-label", "Serviço");

      const tdValor = document.createElement("td");
      tdValor.textContent = formatarMoeda(orcamento.valor_total);
      tdValor.setAttribute("data-label", "Valor (R$)");

      const tdStatus = document.createElement("td");
      if (orcamento.aprovado) {
        tdStatus.innerHTML = '<span class="badge bg-success">Aprovado</span>';
      } else {
        tdStatus.innerHTML = '<span class="badge bg-warning text-dark">Pendente</span>';
      }
      tdStatus.setAttribute("data-label", "Status");

      const tdAcoes = document.createElement("td");
      tdAcoes.setAttribute("data-label", "Ações");
      // Botões de ações com estilo Bootstrap
      tdAcoes.innerHTML = `
        <button class="btn btn-info btn-sm me-1 btn-detalhes" data-id="${orcamento.id}" title="Ver Detalhes">
          <i class="bi bi-eye"></i> Ver
        </button>
        <button class="btn btn-danger btn-sm btn-excluir" data-id="${orcamento.id}" title="Excluir">
          <i class="bi bi-trash"></i> Excluir
        </button>
      `;

      // Adiciona as células à linha
      tr.appendChild(tdId);
      tr.appendChild(tdCliente);
      tr.appendChild(tdVeiculo);
      tr.appendChild(tdServico);
      tr.appendChild(tdValor);
      tr.appendChild(tdStatus);
      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });

    // Adiciona listeners aos botões DEPOIS de criar a tabela
    addEventListenersOrcamentos();

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Erro ao carregar orçamentos: ${error.message}</td></tr>`;
    mostrarMensagem(`Erro ao listar orçamentos: ${error.message}`, "erro");
  }
}

// Função para preencher o select de agendamentos no formulário
async function preencherAgendamentos() {
  const select = document.querySelector("select[name=\"agendamento_id\"]");
  if (!select) return;

  try {
    const agendamentos = await fetchData(agendamentosUrl);
    select.innerHTML = "<option value=\"\">Selecione um Agendamento</option>";

    if (agendamentos && agendamentos.length > 0) {
        agendamentos.forEach((agendamento) => {
          // Formata a data para exibição
          const dataFormatada = formatarData(agendamento.data);
          
          // Cria a opção com informações do agendamento, cliente e veículo
          const option = document.createElement("option");
          option.value = agendamento.id;
          option.textContent = `${dataFormatada} ${agendamento.hora || ""} - ${agendamento.cliente_nome || "Cliente"} - ${agendamento.servico || "Serviço"}`;
          select.appendChild(option);
        });
    } else {
        select.innerHTML = "<option value=\"\">Nenhum agendamento disponível</option>";
    }
  } catch (error) {
    mostrarMensagem(`Erro ao carregar agendamentos: ${error.message}`, "erro");
    select.innerHTML = "<option value=\"\">Erro ao carregar agendamentos</option>";
  }
}

// Função para buscar e exibir detalhes de um orçamento específico
async function carregarDetalhesOrcamento(id) {
  const modalBody = document.getElementById("detalhesOrcamentoBody");
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p>Carregando detalhes...</p>
    </div>
  `;

  try {
    const orcamento = await fetchData(`${orcamentosUrl}/${id}`);
    
    // Formata a data para exibição
    const dataFormatada = formatarData(orcamento.data_agendamento);
    
    // Cria o conteúdo HTML com os detalhes do orçamento
    modalBody.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <h5>Informações do Orçamento</h5>
          <p><strong>ID:</strong> ${orcamento.id}</p>
          <p><strong>Valor Total:</strong> ${formatarMoeda(orcamento.valor_total)}</p>
          <p><strong>Status:</strong> ${orcamento.aprovado ? '<span class="badge bg-success">Aprovado</span>' : '<span class="badge bg-warning text-dark">Pendente</span>'}</p>
          <p><strong>Observações:</strong> ${orcamento.observacoes || "Nenhuma observação"}</p>
        </div>
        <div class="col-md-6">
          <h5>Informações do Agendamento</h5>
          <p><strong>Data:</strong> ${dataFormatada}</p>
          <p><strong>Hora:</strong> ${orcamento.hora || "-"}</p>
          <p><strong>Serviço:</strong> ${orcamento.servico || "-"}</p>
          <p><strong>Cliente:</strong> ${orcamento.cliente_nome || "-"}</p>
          <p><strong>Telefone:</strong> ${orcamento.telefone || "-"}</p>
          <p><strong>Veículo:</strong> ${orcamento.marca || ""} ${orcamento.modelo || ""} (${orcamento.placa || "-"})</p>
        </div>
      </div>
    `;

    // Atualiza os botões de aprovar/reprovar com o ID do orçamento
    const btnAprovar = document.getElementById("btnAprovarOrcamento");
    const btnReprovar = document.getElementById("btnReprovarOrcamento");
    
    if (btnAprovar) btnAprovar.setAttribute("data-id", orcamento.id);
    if (btnReprovar) btnReprovar.setAttribute("data-id", orcamento.id);
    
    // Atualiza a visibilidade dos botões com base no status atual
    if (orcamento.aprovado) {
      if (btnAprovar) btnAprovar.style.display = "none";
      if (btnReprovar) btnReprovar.style.display = "inline-block";
    } else {
      if (btnAprovar) btnAprovar.style.display = "inline-block";
      if (btnReprovar) btnReprovar.style.display = "none";
    }
    
  } catch (error) {
    modalBody.innerHTML = `<div class="alert alert-danger">Erro ao carregar detalhes: ${error.message}</div>`;
  }
}

// Função para atualizar o status de aprovação de um orçamento
async function atualizarAprovacaoOrcamento(id, aprovado) {
  try {
    await fetchData(`${orcamentosUrl}/${id}/aprovacao`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aprovado }),
    });
    
    mostrarMensagem(`Orçamento ${aprovado ? 'aprovado' : 'reprovado'} com sucesso!`, "sucesso");
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('detalhesOrcamentoModal'));
    if (modal) modal.hide();
    
    // Atualiza a lista de orçamentos
    listarOrcamentos();
    
  } catch (error) {
    mostrarMensagem(`Erro ao ${aprovado ? 'aprovar' : 'reprovar'} orçamento: ${error.message}`, "erro");
  }
}

// Função para excluir um orçamento
async function deletarOrcamento(id) {
  if (!confirm(`Tem certeza que deseja excluir o orçamento ID ${id}?`)) {
    return;
  }

  try {
    await fetchData(`${orcamentosUrl}/${id}`, { method: "DELETE" });
    mostrarMensagem("Orçamento excluído com sucesso!", "sucesso");
    listarOrcamentos(); // Atualiza a lista
  } catch (error) {
    mostrarMensagem(`Erro ao excluir orçamento: ${error.message}`, "erro");
  }
}

// Adiciona listeners aos botões da tabela de orçamentos
function addEventListenersOrcamentos() {
  const tabela = document.querySelector("#tabelaOrcamentos");
  if (tabela) {
    // Remove listeners antigos para evitar duplicação
    tabela.removeEventListener("click", handleOrcamentoTableClick);
    // Adiciona o novo listener
    tabela.addEventListener("click", handleOrcamentoTableClick);
  }
  
  // Listeners para os botões do modal de detalhes
  const btnAprovar = document.getElementById("btnAprovarOrcamento");
  const btnReprovar = document.getElementById("btnReprovarOrcamento");
  
  if (btnAprovar) {
    btnAprovar.removeEventListener("click", handleAprovarClick);
    btnAprovar.addEventListener("click", handleAprovarClick);
  }
  
  if (btnReprovar) {
    btnReprovar.removeEventListener("click", handleReprovarClick);
    btnReprovar.addEventListener("click", handleReprovarClick);
  }
}

// Handler para cliques na tabela de orçamentos
function handleOrcamentoTableClick(event) {
  // Verifica se o clique foi no botão de detalhes
  const btnDetalhes = event.target.closest(".btn-detalhes");
  if (btnDetalhes) {
    const id = btnDetalhes.dataset.id;
    // Abre o modal de detalhes
    const modal = new bootstrap.Modal(document.getElementById('detalhesOrcamentoModal'));
    modal.show();
    // Carrega os detalhes do orçamento
    carregarDetalhesOrcamento(id);
    return;
  }
  
  // Verifica se o clique foi no botão de excluir
  const btnExcluir = event.target.closest(".btn-excluir");
  if (btnExcluir) {
    const id = btnExcluir.dataset.id;
    deletarOrcamento(id);
    return;
  }
}

// Handler para o botão de aprovar orçamento
function handleAprovarClick(event) {
  const id = event.target.dataset.id;
  atualizarAprovacaoOrcamento(id, true);
}

// Handler para o botão de reprovar orçamento
function handleReprovarClick(event) {
  const id = event.target.dataset.id;
  atualizarAprovacaoOrcamento(id, false);
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  // Verifica se estamos na página de orçamentos
  const formOrcamento = document.getElementById("formOrcamento");
  if (formOrcamento) {
    // Carrega os dados iniciais
    listarOrcamentos();
    preencherAgendamentos();

    // Listener para o formulário de cadastro
    formOrcamento.addEventListener("submit", async (e) => {
      e.preventDefault();

      const agendamentoId = document.querySelector("select[name=\"agendamento_id\"]").value;
      const valorTotal = document.querySelector("input[name=\"valor_total\"]").value;
      const observacoes = document.querySelector("textarea[name=\"observacoes\"]").value;
      const aprovado = document.querySelector("input[name=\"aprovado\"]").checked;

      if (!agendamentoId || !valorTotal) {
        mostrarMensagem("Por favor, preencha todos os campos obrigatórios.", "erro");
        return;
      }

      try {
        await fetchData(orcamentosUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            agendamento_id: agendamentoId, 
            valor_total: valorTotal,
            observacoes,
            aprovado
          }),
        });

        formOrcamento.reset();
        mostrarMensagem("Orçamento cadastrado com sucesso!", "sucesso");
        listarOrcamentos(); // Atualiza a lista
      } catch (error) {
        mostrarMensagem(`Erro ao cadastrar orçamento: ${error.message}`, "erro");
      }
    });
  }
});
