/**
 * Classe Modelo: Usuario
 * Representa a entidade 'Usuário' no sistema.
 * Esta é a entidade "pai" no relacionamento 1:N (Um Usuário tem N Projetos).
 */
class Usuario {
    /**
     * Construtor da classe Usuario.
     * Inicializa uma nova instância de usuário com os dados recebidos do formulário.
     * * @param {string} id - Identificador único do usuário (Simula uma Primary Key).
     * @param {string} nome - Nome completo do usuário para exibição no Dashboard.
     * @param {string} email - Endereço de e-mail (usado como dado de contato/identificação).
     */
    constructor(id, nome, email) {
        this.id = id;       // Identificador único gerado automaticamente (Date.now()) ao criar.
        this.nome = nome;   // Propriedade que armazena o nome.
        this.email = email; // Propriedade que armazena o email.
    }
}

// Exporta a classe para que ela possa ser requerida (require) e instanciada 
// no arquivo de rotas ('routes.js') ou em outros controladores.
module.exports = Usuario;