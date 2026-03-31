/**
 * Classe Modelo: Tarefa
 * Representa a entidade 'Tarefa' (ou atividade) no sistema.
 * Esta é a entidade "filha" no relacionamento 1:N com Projeto (Um Projeto possui várias Tarefas).
 */
class Tarefa {
    /**
     * Construtor da classe Tarefa.
     * Inicializa uma nova tarefa vinculada a um projeto específico.
     * * @param {string} id - Identificador único da tarefa.
     * @param {string} descricao - Texto descritivo do que precisa ser realizado.
     * @param {boolean} concluida - Status da tarefa (true = finalizada, false = pendente).
     * @param {string} projetoId - Chave Estrangeira (Foreign Key). O ID do projeto ao qual esta tarefa pertence.
     */
    constructor(id, descricao, concluida, projetoId) {
        this.id = id;               // Identificador único (Primary Key simulada)
        this.descricao = descricao; // O que precisa ser feito (ex: "Comprar Tinta")
        
        // Define o status de conclusão. 
        // No front-end, se for 'true', o texto aparece riscado e o ícone verde.
        this.concluida = concluida; 
        
        // RELACIONAMENTO (N:1):
        // Armazena o ID do projeto "pai" desta tarefa.
        // É este campo que conecta a Tarefa ao Projeto, permitindo filtrar
        // e exibir apenas as tarefas corretas dentro de cada cartão de projeto.
        this.projetoId = projetoId;
    }
}

// Exporta a classe para ser instanciada no arquivo de rotas (routes.js)
module.exports = Tarefa;