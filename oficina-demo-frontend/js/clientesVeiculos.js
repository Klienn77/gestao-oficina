// --- Função auxiliar para buscar JSON local ---
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

// --- Listar clientes com veículos ---
async function listarClientesVeiculos() {
  const container = document.getElementById("clientesComVeiculos");
  if (!container) return;

  container.innerHTML = "<p class='text-center'>Carregando dados...</p>";

  try {
    const clientes = await fetchData("data/clientes.json");
    const veiculos = await fetchData("data/veiculos.json");

    if (!clientes.length) {
      container.innerHTML = "<p class='text-muted text-center'>Nenhum cliente cadastrado.</p>";
      return;
    }

    container.innerHTML = "";
    

    clientes.forEach((cliente) => {
      const veiculosDoCliente = veiculos.filter(v => v.clienteId === cliente.id);

      const divCliente = document.createElement("div");
      divCliente.className = "card mb-3";

      const listaVeiculos = veiculosDoCliente.map(v => `<li>${v.modelo} (${v.placa})</li>`).join("") || "<li>Nenhum veículo cadastrado</li>";

      divCliente.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${cliente.nome}</h5>
          <p class="card-text"><strong>Telefone:</strong> ${cliente.telefone}</p>
          <p class="card-text"><strong>Email:</strong> ${cliente.email}</p>
          <p class="card-text mb-1"><strong>Veículos:</strong></p>
          <ul>${listaVeiculos}</ul>
        </div>
      `;

      container.appendChild(divCliente);
    });
  } catch (error) {
    container.innerHTML = `<p class='text-danger text-center'>Erro ao carregar dados.</p>`;
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", listarClientesVeiculos);
