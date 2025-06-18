document.getElementById("formOrcamento")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const agendamentoId = parseInt(document.getElementById("agendamento_id").value);
  const valorTotal = parseFloat(document.getElementById("valor_total").value);
  const observacoes = document.getElementById("observacoes").value.trim();
  const aprovado = document.getElementById("aprovado").checked;

  const mensagem = document.getElementById("mensagem");

  try {
    // Simulação de busca de orçamentos existentes
    const response = await fetch("../data/orcamentos.json");
    const orcamentosExistentes = await response.json();

    const novoOrcamento = {
      id: orcamentosExistentes.length ? orcamentosExistentes[orcamentosExistentes.length - 1].id + 1 : 1,
      agendamento_id: agendamentoId,
      valor_total: valorTotal,
      observacoes,
      aprovado
    };

    // Adiciona o novo orçamento ao array
    orcamentosExistentes.push(novoOrcamento);

    // Aqui você pode salvar no localStorage, API, ou arquivo (no backend):
    // localStorage.setItem("orcamentos", JSON.stringify(orcamentosExistentes));

    // Simulação de resposta positiva
    mensagem.innerHTML = `<div class="alert alert-success">Orçamento cadastrado com sucesso!</div>`;

    // Reset do formulário
    this.reset();

    // Atualiza a tabela/listagem
    listarOrcamentos();

  } catch (err) {
    console.error("Erro ao cadastrar orçamento:", err);
    mensagem.innerHTML = `<div class="alert alert-danger">Erro ao cadastrar orçamento.</div>`;
  }
});
