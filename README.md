# 🛠️ Sistema de Gestão para Oficina Mecânica

Sistema completo de gestão para oficinas mecânicas, desenvolvido com foco em organização, controle de clientes, veículos, agendamentos e orçamentos. Ideal para pequenas e médias oficinas que desejam modernizar sua operação.

Este projeto possui **duas versões integradas** no mesmo repositório:

- 🔧 **Versão Local com Backend Real** (Node.js + MySQL)
- 🌐 **Versão Simulada com JSON Local** (Frontend puro com dados fictícios)

> Para fins de portfólio online, apenas a **versão simulada** será publicada na web como **projeto piloto**. Isso permite uma navegação completa mesmo sem servidores ou banco de dados em produção.

---

## 🚀 Funcionalidades

- ✅ Cadastro de Clientes
- ✅ Cadastro de Veículos com vínculo ao cliente
- ✅ Agendamento de Serviços
- ✅ Criação e Gerenciamento de Orçamentos
- ✅ Lista de clientes com seus respectivos veículos
- ✅ Aprovação e reprovação de orçamentos via modal
- ✅ Formulários interativos e responsivos
- ✅ Interface amigável com Bootstrap 5
- ✅ Carregamento e exibição de dados simulados via arquivos JSON

---

## 🧱 Tecnologias Utilizadas

| Stack         | Descrição                                     |
|---------------|-----------------------------------------------|
| **Frontend**  | HTML, CSS, JavaScript Vanilla, Bootstrap 5    |
| **Backend Local** | Node.js, Express, MySQL (na versão real) |
| **Dados Simulados** | JSON estáticos consumidos via fetch()     |
| **Ferramentas** | VSCode, Postman, DBeaver (para MySQL local) |

---

## 📌 Estrutura do Repositório

O repositório contém **as duas abordagens integradas** em uma única estrutura de arquivos.  
Por isso, a navegação pode conter partes de frontend que se conectam ao backend real, enquanto outras simulam a experiência por meio de dados locais.

> A versão publicada online é 100% frontend, utilizando apenas arquivos HTML, CSS, JS e `.json`.

---

## 🎯 Objetivo

O projeto foi idealizado para:

- Servir como estudo completo de uma aplicação real (com backend e banco de dados)
- Disponibilizar uma versão simulada para demonstração pública sem dependências de servidor
- Demonstrar domínio tanto no frontend quanto no backend
- Permitir futura expansão para soluções comerciais completas

---

## 🧪 Como Testar

Você pode testar a versão piloto publicada diretamente no navegador. Todos os dados estão sendo carregados localmente e não há necessidade de instalar dependências ou configurar banco de dados.

Caso queira executar a **versão backend local**, é necessário:

1. Ter Node.js e MySQL instalados
2. Configurar o `.env` com as credenciais
3. Rodar os scripts de criação de tabelas e inicialização do servidor Express

---

## 📌 Futuras Implementações

- 🔐 Autenticação e login de usuários
- 📊 Dashboard com gráficos e estatísticas
- ☁️ Deploy completo do backend com banco de dados remoto
- 📱 Versão responsiva adaptada para dispositivos móveis
- 🧾 Geração de PDFs para orçamentos e ordens de serviço

---

## 👨‍💻 Desenvolvedor

**Fabiano**  
🎯 Desenvolvedor Full Stack em transição de carreira  
📧 [email](mailto:fabianompedroso@hotmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/fabiano-pedroso-a1110278/) 

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT.  
Você pode usá-lo, modificá-lo e adaptá-lo como quiser.
