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

// --- Função para listar clientes a partir do JSON ---
async function listarClientes() {
  const tbody = document.querySelector("#tabelaClientes tbody");
  if (!tbody) return;

  tbody.innerHTML = "<tr><td colspan='4' class='text-center'>Carregando...</td></tr>";

  try {
    const clientes = await fetchData("data/clientes.json");
    tbody.innerHTML = "";

    if (!clientes || clientes.length === 0) {
      tbody.innerHTML = "<tr><td colspan='4' class='text-center'>Nenhum cliente encontrado.</td></tr>";
      return;
    }

    clientes.forEach((cliente) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
       <td data-label="Nome">${cliente.nome}</td>
        <td data-label="Telefone">${cliente.telefone}</td>
        <td data-label="Email">${cliente.email}</td>
        
        <td data-label="Ações"><button class="btn btn-sm btn-secondary" disabled>Simulação</button></td>
      `;

      tbody.appendChild(tr);
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Erro ao carregar dados.</td></tr>`;
  }
}

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
  listarClientes();
});
