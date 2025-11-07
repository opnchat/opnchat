// js/script.js

// Dados de exemplo das conversas
const conversationsData = [
    { 
        id: 1, 
        name: 'João Silva', 
        lastMessage: 'Oi, tudo bem?', 
        time: '10:30', 
        avatar: 'J' 
    },
    { 
        id: 2, 
        name: 'Maria Santos', 
        lastMessage: 'Você viu o relatório?', 
        time: '09:15', 
        avatar: 'M' 
    },
    { 
        id: 3, 
        name: 'Pedro Oliveira', 
        lastMessage: 'Obrigado pela ajuda!', 
        time: 'Ontem', 
        avatar: 'P' 
    },
    { 
        id: 4, 
        name: 'Ana Costa', 
        lastMessage: 'Reunião às 14h', 
        time: 'Ontem', 
        avatar: 'A' 
    },
    { 
        id: 5, 
        name: 'Carlos Souza', 
        lastMessage: 'Pode me ligar?', 
        time: '13/11', 
        avatar: 'C' 
    }
];

// Variável para armazenar a conversa ativa
let activeConversationId = null;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    loadConversations();
    setupEventListeners();
});

/**
 * Carrega as conversas na sidebar
 */
function loadConversations() {
    const conversationsList = document.getElementById('conversationsList');
    conversationsList.innerHTML = '';
    
    conversationsData.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.className = 'conversation-item';
        convElement.dataset.id = conv.id;
        convElement.innerHTML = `
            <div class="avatar">${conv.avatar}</div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <span class="conversation-name">${conv.name}</span>
                    <span class="conversation-time">${conv.time}</span>
                </div>
                <div class="conversation-preview">${conv.lastMessage}</div>
            </div>
        `;
        
        // Adiciona evento de clique na conversa
        convElement.addEventListener('click', () => openConversation(conv));
        conversationsList.appendChild(convElement);
    });
}

/**
 * Abre uma conversa específica
 * @param {Object} conversation - Objeto com dados da conversa
 */
function openConversation(conversation) {
    activeConversationId = conversation.id;
    
    // Remove classe active de todas as conversas
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adiciona classe active na conversa selecionada
    const selectedConv = document.querySelector(`[data-id="${conversation.id}"]`);
    if (selectedConv) {
        selectedConv.classList.add('active');
    }
    
    // Esconde tela de boas-vindas e mostra área de chat
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    
    // Atualiza informações do cabeçalho do chat
    document.getElementById('chatAvatar').textContent = conversation.avatar;
    document.getElementById('contactName').textContent = conversation.name;
    
    // Limpa mensagens anteriores
    document.getElementById('messagesArea').innerHTML = '';
    
    // Adiciona mensagem de exemplo
    addMessage('Olá! Como posso ajudar?', 'received');
    
    // Foca no input de mensagem
    document.getElementById('messageInput').focus();
}

/**
 * Configura todos os event listeners
 */
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    
    // Event listener para botão de enviar
    sendBtn.addEventListener('click', sendMessage);
    
    // Event listener para tecla Enter no input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Event listener para botão de anexar
    attachBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Event listener para quando um arquivo é selecionado
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            const fileSize = (e.target.files[0].size / 1024).toFixed(2); // Tamanho em KB
            addMessage(`📎 Arquivo: ${fileName} (${fileSize} KB)`, 'sent');
            
            // Limpa o input de arquivo
            e.target.value = '';
            
            // Simula resposta automática
            setTimeout(() => {
                addMessage('Arquivo recebido com sucesso!', 'received');
            }, 1000);
        }
    });
    
    // Event listener para busca (preparado para futura implementação)
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterConversations(searchTerm);
    });
}

/**
 * Filtra conversas baseado no termo de busca
 * @param {string} searchTerm - Termo a ser buscado
 */
function filterConversations(searchTerm) {
    const conversationItems = document.querySelectorAll('.conversation-item');
    
    conversationItems.forEach(item => {
        const name = item.querySelector('.conversation-name').textContent.toLowerCase();
        const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || preview.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Envia uma mensagem
 */
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    // Verifica se há texto e se há uma conversa ativa
    if (messageText && activeConversationId) {
        // Adiciona mensagem enviada
        addMessage(messageText, 'sent');
        
        // Limpa o input
        messageInput.value = '';
        
        // Simula resposta automática após 1-2 segundos
        setTimeout(() => {
            const responses = [
                'Entendi!',
                'Certo, vou verificar isso.',
                'Obrigado pela informação.',
                'Perfeito!',
                'Ok, pode deixar.'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'received');
        }, 1000 + Math.random() * 1000);
    }
}

/**
 * Adiciona uma mensagem à área de chat
 * @param {string} text - Texto da mensagem
 * @param {string} type - Tipo da mensagem ('sent' ou 'received')
 */
function addMessage(text, type) {
    const messagesArea = document.getElementById('messagesArea');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    // Formata o horário atual
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    
    // Cria o HTML da mensagem
    messageElement.innerHTML = `
        <div class="message-bubble">
            <div>${escapeHtml(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    // Adiciona a mensagem à área de mensagens
    messagesArea.appendChild(messageElement);
    
    // Scroll automático para a última mensagem
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

/**
 * Escapa caracteres HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Função auxiliar para obter conversa por ID
 * @param {number} id - ID da conversa
 * @returns {Object|null} - Objeto da conversa ou null
 */
function getConversationById(id) {
    return conversationsData.find(conv => conv.id === id) || null;
}

/**
 * Atualiza o preview da última mensagem na sidebar
 * @param {number} conversationId - ID da conversa
 * @param {string} message - Texto da mensagem
 */
function updateConversationPreview(conversationId, message) {
    const convElement = document.querySelector(`[data-id="${conversationId}"]`);
    if (convElement) {
        const previewElement = convElement.querySelector('.conversation-preview');
        const timeElement = convElement.querySelector('.conversation-time');
        
        if (previewElement) {
            previewElement.textContent = message.substring(0, 30) + (message.length > 30 ? '...' : '');
        }
        
        if (timeElement) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
        }
    }
}