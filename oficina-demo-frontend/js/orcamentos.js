// --- Função auxiliar para simular fetch local ---
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
}


// --- Função para listar orcamentos partir do JSON ---
async function listarOrcamentos() {
  const tbody = document.querySelector("#tabelaOrcamentos tbody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Carregando...</td></tr>";

  try {
    const veiculos = await fetchData("data/orcamento.json");
    tbody.innerHTML = "";

    if (!veiculos || veiculos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Nenhum Orcamento encontrado.</td></tr>";
      return;
    }

    veiculos.forEach((orcamento) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td data-label="IdOrcamento">${orcamento.id}</td>
        <td data-label="ClienteOrcamento">${orcamento.cliente}</td>
        <td data-label="VeiculoOrcamento">${orcamento.veiculo}</td>
        <td data-label="ServicoOrcamento">${orcamento.servico}</td>
        <td data-label="ValorOrcamento">${orcamento.valor_total}</td>
        <td data-label="StatusOrcamento">${orcamento.status}</td>
        <td data-label="FuncionarioOrcamento">${orcamento.funcionario}</td>
      


        
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Erro ao carregar dados.</td></tr>`;
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  listarOrcamentos();
});





















// document.getElementById("formOrcamento")?.addEventListener("submit", async function (e) {
//   e.preventDefault();
// 
//   const agendamentoId = parseInt(document.getElementById("agendamento_id").value);
//   const valorTotal = parseFloat(document.getElementById("valor_total").value);
//   const observacoes = document.getElementById("observacoes").value.trim();
//   const aprovado = document.getElementById("aprovado").checked;
// 
//   const mensagem = document.getElementById("mensagem");
// 
//   try {
//     // Simulação de busca de orçamentos existentes
//     const response = await fetch("data/orcamentos.json");
//     const orcamentosExistentes = await response.json();
// 
//     const novoOrcamento = {
//       id: orcamentosExistentes.length ? orcamentosExistentes[orcamentosExistentes.length - 1].id + 1 : 1,
//       agendamento_id: agendamentoId,
//       valor_total: valorTotal,
//       observacoes,
//       aprovado
//     };
// 
//     // Adiciona o novo orçamento ao array
//     orcamentosExistentes.push(novoOrcamento);
// 
//     // Aqui você pode salvar no localStorage, API, ou arquivo (no backend):
//     // localStorage.setItem("orcamentos", JSON.stringify(orcamentosExistentes));
// 
//     // Simulação de resposta positiva
//     mensagem.innerHTML = `<div class="alert alert-success">Orçamento cadastrado com sucesso!</div>`;
// 
//     // Reset do formulário
//     this.reset();
// 
//     // Atualiza a tabela/listagem
//     listarOrcamentos();
// 
//   } catch (err) {
//     console.error("Erro ao cadastrar orçamento:", err);
//     mensagem.innerHTML = `<div class="alert alert-danger">Erro ao cadastrar orçamento.</div>`;
//   }
// });
// 