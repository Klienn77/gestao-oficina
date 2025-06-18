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

// --- Listar agendamentos da agenda ---
async function listarAgendamentos() {
  const tbody = document.querySelector("#tabelaAgendamentos tbody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Carregando...</td></tr>";

  try {
    const agendamentos = await fetchData("../data/agendamentos.json");
    tbody.innerHTML = "";

    if (!agendamentos || agendamentos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Nenhum agendamento encontrado.</td></tr>";
      return;
    }

    agendamentos.forEach((ag) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td data-label="Cliente">${ag.cliente}</td>
        <td data-label="Veículo">${ag.veiculo}</td>
        <td data-label="Data">${ag.data}</td>
        <td data-label="Hora">${ag.hora}</td>
        <td data-label="Serviço">${ag.servico}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Erro ao carregar dados.</td></tr>`;
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  listarAgendamentos();
});
