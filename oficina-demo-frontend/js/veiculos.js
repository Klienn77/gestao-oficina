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

// --- Função para listar veículos a partir do JSON ---
async function listarVeiculos() {
  const tbody = document.querySelector("#tabelaVeiculos tbody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Carregando...</td></tr>";

  try {
    const veiculos = await fetchData("data/veiculos.json");
    tbody.innerHTML = "";

    if (!veiculos || veiculos.length === 0) {
      tbody.innerHTML = "<tr><td colspan='5' class='text-center'>Nenhum veículo encontrado.</td></tr>";
      return;
    }

    veiculos.forEach((veiculo) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td data-label="IdVeiculo">${veiculo.id}</td>
        <td data-label="IdCliente">${veiculo.id}</td>
        <td data-label="Marca">${veiculo.marca}</td>
        <td data-label="Modelo">${veiculo.modelo}</td>
        <td data-label="Ano">${veiculo.ano}</td>
        <td data-label="Placa">${veiculo.placa}</td>
        <td data-label="Cor">${veiculo.cor}</td>


        <td data-label="Ações"><button class="btn btn-sm btn-secondary" disabled>Simulação</button></td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Erro ao carregar dados.</td></tr>`;
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  listarVeiculos();
});
