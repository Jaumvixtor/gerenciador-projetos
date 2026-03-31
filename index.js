/**
 * Arquivo: index.js
 * Descrição: Ponto de entrada (Entry Point) da aplicação.
 * Responsável por iniciar o servidor web, configurar o motor de visualização (EJS)
 * e carregar os middlewares necessários para processar as requisições.
 */

const express = require('express'); // Importa o framework Express
const app = express();              // Inicializa a aplicação Express
const port = 3000;                  // Define a porta onde o servidor irá rodar

// ==============================================================================
// CONFIGURAÇÃO DA VIEW ENGINE (VISUALIZAÇÃO)
// ==============================================================================
// Define o EJS como o motor de renderização de HTML.
// O Express buscará automaticamente os arquivos .ejs na pasta '/views'.
app.set('view engine', 'ejs');

// ==============================================================================
// MIDDLEWARES (CONFIGURAÇÕES DE LEITURA DE DADOS)
// ==============================================================================

// Permite que o servidor entenda requisições com corpo em JSON (útil para APIs)
app.use(express.json());

// Permite que o servidor entenda dados enviados via Formulário HTML (POST).
// Sem essa linha, o 'req.body' nas rotas ficaria vazio ao submeter formulários.
app.use(express.urlencoded({ extended: true })); 

// ==============================================================================
// IMPORTAÇÃO E USO DAS ROTAS
// ==============================================================================
// Importa o arquivo onde definimos toda a lógica de Usuários, Projetos e Tarefas
const minhasRotas = require('./src/routes/routes');

// Diz ao Express para usar essas rotas na raiz ('/') do site
app.use('/', minhasRotas);

// ==============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ==============================================================================
app.listen(port, () => {
  console.log(`Servidor iniciado com sucesso!`);
  console.log(`Acesse o projeto em: http://localhost:${port}`);
});