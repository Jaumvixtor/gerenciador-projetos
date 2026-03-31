/**
 * Arquivo: routes.js
 * Descrição: Responsável por gerenciar todas as rotas (URLs) da aplicação.
 * Atua como o 'Controller' no padrão MVC, recebendo requisições do navegador,
 * manipulando os dados (Models) e devolvendo a visualização (View).
 */

const express = require('express');
const router = express.Router(); // Instancia o roteador do Express

// Importação dos Modelos (Classes)
// Estes arquivos definem a estrutura dos dados (Entidades)
const Usuario = require('../models/Usuario');
const Projeto = require('../models/Projeto');
const Tarefa = require('../models/Tarefa');

// ==============================================================================
// BANCO DE DADOS EM MEMÓRIA (PERSISTÊNCIA VOLÁTIL)
// ==============================================================================
// Utilizamos Arrays para armazenar os dados enquanto o servidor está rodando.
// Usamos 'let' para permitir que o array seja substituído (na exclusão).
let usuarios = [];
let projetos = [];
let tarefas = [];

// ==============================================================================
// LÓGICA DE NEGÓCIO: CÁLCULO DE DATAS
// ==============================================================================
/**
 * Função auxiliar que calcula o tempo restante até um prazo.
 * Recebe uma data ISO (YYYY-MM-DD) e retorna uma string formatada.
 * Utilizada tanto no Backend quanto enviada para o Frontend.
 */
function calcularTempoRestante(prazoISO) {
    if (!prazoISO) return "Sem prazo definido";

    // Define o prazo para o final do dia (23:59:59) da data escolhida
    const fimDoPrazo = new Date(prazoISO + 'T23:59:59');
    const agora = new Date();
    
    let diff = fimDoPrazo - agora; // Calcula a diferença em milissegundos

    if (diff < 0) return "Prazo expirado!";

    // Conversão de milissegundos para unidades de tempo legíveis
    const msPorSegundo = 1000;
    const msPorMinuto = 60 * 1000;
    const msPorHora = 60 * 60 * 1000;
    const msPorDia = 24 * 60 * 60 * 1000;
    const msPorMes = 30 * msPorDia; // Aproximação de 30 dias para simplificação

    // Cálculos matemáticos de divisão inteira e resto
    const meses = Math.floor(diff / msPorMes);
    diff = diff % msPorMes;

    const dias = Math.floor(diff / msPorDia);
    diff = diff % msPorDia;

    const horas = Math.floor(diff / msPorHora);
    diff = diff % msPorHora;

    const minutos = Math.floor(diff / msPorMinuto);
    diff = diff % msPorMinuto;

    const segundos = Math.floor(diff / msPorSegundo);

    // Formatação da string de retorno (Ex: "2 meses, 5 dias...")
    let resultado = "";
    if (meses > 0) resultado += `${meses} meses, `;
    if (dias > 0) resultado += `${dias} dias, `;
    resultado += `${horas}h ${minutos}m ${segundos}s`;

    return resultado;
}

// ==============================================================================
// ROTA PRINCIPAL (READ / LISTAR)
// ==============================================================================
// Método GET: Renderiza a página inicial com todos os dados
router.get('/', (req, res) => {
    // A função 'res.render' compila o arquivo 'dashboard.ejs' (na pasta views)
    // e injeta os objetos (usuarios, projetos, tarefas) para serem desenhados na tela.
    res.render('dashboard', { 
        usuarios: usuarios,
        projetos: projetos,
        tarefas: tarefas,
        calcularTempo: calcularTempoRestante // Passamos a função para ser usada no HTML
    });
});

// ==============================================================================
// OPERAÇÕES DE CRIAÇÃO (CREATE - MÉTODO POST)
// ==============================================================================

// Rota para cadastrar um novo Usuário
router.post('/usuarios/criar', (req, res) => {
    const { nome, email } = req.body; // Pega dados do formulário
    // Cria instância com ID baseado no Timestamp (Date.now) para garantir unicidade simples
    usuarios.push(new Usuario(Date.now().toString(), nome, email));
    res.redirect('/'); // Recarrega a página para mostrar o novo item
});

// Rota para cadastrar um novo Projeto
router.post('/projetos/criar', (req, res) => {
    const { nome, prazo, usuarioId } = req.body;
    
    // Gera a data de criação automática (Ex: 30/11/2025)
    const dataCriacao = new Date().toLocaleDateString('pt-BR'); 
    
    // Cria o projeto vinculando-o ao usuário (Foreign Key: usuarioId)
    projetos.push(new Projeto(Date.now().toString(), nome, dataCriacao, prazo, usuarioId));
    res.redirect('/');
});

// Rota para cadastrar uma nova Tarefa
router.post('/tarefas/criar', (req, res) => {
    const { descricao, projetoId } = req.body;
    // Cria a tarefa vinculando-a ao projeto (Foreign Key: projetoId)
    // Status inicial é sempre 'false' (pendente)
    tarefas.push(new Tarefa(Date.now().toString(), descricao, false, projetoId));
    res.redirect('/');
});

// ==============================================================================
// OPERAÇÕES DE ATUALIZAÇÃO (UPDATE - MÉTODO POST)
// ==============================================================================

// Edição de dados cadastrais do Usuário
router.post('/usuarios/editar', (req, res) => {
    const { id, nome, email } = req.body;
    // Busca o usuário pelo ID e atualiza os campos
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.nome = nome;
        usuario.email = email;
    }
    res.redirect('/');
});

// Edição do Projeto (Nome e Prazo)
router.post('/projetos/editar', (req, res) => {
    const { id, nome, prazo } = req.body;
    const projeto = projetos.find(p => p.id === id);
    if (projeto) {
        projeto.nome = nome;
        projeto.prazoISO = prazo; // Atualiza a data usada para o cálculo do timer
    }
    res.redirect('/');
});

// Edição do texto da Tarefa
router.post('/tarefas/editar', (req, res) => {
    const { id, descricao } = req.body;
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.descricao = descricao;
    }
    res.redirect('/');
});

// Alternar status da Tarefa (Concluído / Pendente)
router.post('/tarefas/alternar', (req, res) => {
    const { id } = req.body;
    const tarefa = tarefas.find(t => t.id === id);
    // Inverte o valor booleano atual
    if (tarefa) tarefa.concluida = !tarefa.concluida;
    res.redirect('/');
});

// ==============================================================================
// OPERAÇÕES DE EXCLUSÃO (DELETE) COM CASCATA
// ==============================================================================

// Excluir Usuário: Implementa "Cascading Delete" (Exclusão em Cascata)
// Ao apagar um usuário, devemos apagar seus projetos e as tarefas desses projetos
// para manter a integridade referencial do banco de dados.
router.post('/usuarios/deletar', (req, res) => {
    const { id } = req.body;

    // 1. Identificar quais projetos pertencem a este usuário
    const projetosDoUsuario = projetos.filter(p => p.usuarioId === id);
    const idsProjetos = projetosDoUsuario.map(p => p.id);

    // 2. Apagar todas as tarefas que pertencem a esses projetos (Nível mais baixo)
    tarefas = tarefas.filter(t => !idsProjetos.includes(t.projetoId));

    // 3. Apagar todos os projetos deste usuário (Nível intermediário)
    projetos = projetos.filter(p => p.usuarioId !== id);

    // 4. Finalmente, apagar o usuário
    usuarios = usuarios.filter(u => u.id !== id);

    res.redirect('/');
});

// Excluir Projeto: Também usa cascata (Projeto -> Tarefas)
router.post('/projetos/deletar', (req, res) => {
    const { id } = req.body;
    
    // 1. Apagar todas as tarefas vinculadas a este projeto
    tarefas = tarefas.filter(t => t.projetoId !== id);
    
    // 2. Apagar o projeto
    projetos = projetos.filter(p => p.id !== id);
    
    res.redirect('/');
});

// Excluir Tarefa Individual
router.post('/tarefas/deletar', (req, res) => {
    const { id } = req.body;
    // Apenas filtra a lista removendo o ID selecionado
    tarefas = tarefas.filter(t => t.id !== id);
    res.redirect('/');
});

module.exports = router;