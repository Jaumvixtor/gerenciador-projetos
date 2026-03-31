/**
 * Classe Modelo: Projeto
 * Representa a entidade 'Projeto' no sistema.
 * Esta classe define a estrutura de dados de um projeto e seus relacionamentos.
 */
class Projeto {
    /**
     * Construtor da classe Projeto.
     * Inicializa uma nova instância com os dados fornecidos.
     * * @param {string} id - Identificador único do projeto.
     * @param {string} nome - Nome descritivo do projeto.
     * @param {string} dataCriacao - Data formatada (pt-BR) de quando o projeto foi criado (apenas para exibição).
     * @param {string} prazoISO - Data limite no formato ISO (YYYY-MM-DD). Essencial para cálculos de tempo e para o input type="date" do HTML.
     * @param {string} usuarioId - Chave Estrangeira (Foreign Key). O ID do usuário dono deste projeto.
     */
    constructor(id, nome, dataCriacao, prazoISO, usuarioId) {
        this.id = id;               // ID único gerado pelo sistema (Date.now())
        this.nome = nome;           // Título ou nome do projeto
        this.dataCriacao = dataCriacao; // Ex: "30/11/2025"
        
        // Armazena o prazo no formato padrão internacional (Ex: "2025-12-31").
        // Este formato é necessário para que o JavaScript consiga realizar cálculos matemáticos
        // (contagem regressiva) e para preencher automaticamente os campos de edição no Front-end.
        this.prazoISO = prazoISO; 
        
        // RELACIONAMENTO (N:1): 
        // Define a qual Usuário este Projeto pertence.
        // Um Projeto pertence a um único Usuário, mas um Usuário pode ter vários Projetos.
        this.usuarioId = usuarioId; 
    }
}

// Exporta a classe para que ela possa ser importada e utilizada no arquivo de rotas e controladores.
module.exports = Projeto;