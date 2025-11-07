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

// Dados de exemplo dos grupos
const groupsData = [
    {
        id: 101,
        name: 'Equipe de Desenvolvimento',
        lastMessage: 'Deploy realizado com sucesso',
        time: '11:45',
        avatar: 'ED',
        members: 8
    },
    {
        id: 102,
        name: 'Marketing',
        lastMessage: 'Campanha aprovada!',
        time: '10:20',
        avatar: 'MK',
        members: 5
    },
    {
        id: 103,
        name: 'Diretoria',
        lastMessage: 'Reunião amanhã às 9h',
        time: 'Ontem',
        avatar: 'DR',
        members: 4
    },
    {
        id: 104,
        name: 'Suporte Técnico',
        lastMessage: 'Ticket #234 resolvido',
        time: 'Ontem',
        avatar: 'ST',
        members: 6
    }
];

// Dados de exemplo dos participantes/usuários
const participantsData = [
    {
        id: 201,
        name: 'João Silva',
        status: 'Online',
        avatar: 'J',
        department: 'TI'
    },
    {
        id: 202,
        name: 'Maria Santos',
        status: 'Online',
        avatar: 'M',
        department: 'RH'
    },
    {
        id: 203,
        name: 'Pedro Oliveira',
        status: 'Ausente',
        avatar: 'P',
        department: 'Vendas'
    },
    {
        id: 204,
        name: 'Ana Costa',
        status: 'Online',
        avatar: 'A',
        department: 'Marketing'
    },
    {
        id: 205,
        name: 'Carlos Souza',
        status: 'Offline',
        avatar: 'C',
        department: 'Financeiro'
    },
    {
        id: 206,
        name: 'Beatriz Lima',
        status: 'Online',
        avatar: 'B',
        department: 'TI'
    },
    {
        id: 207,
        name: 'Rafael Mendes',
        status: 'Ausente',
        avatar: 'R',
        department: 'Suporte'
    },
    {
        id: 208,
        name: 'Juliana Rocha',
        status: 'Online',
        avatar: 'JR',
        department: 'Diretoria'
    }
];

// Variável para armazenar a conversa ativa
let activeConversationId = null;
let currentView = 'chats'; // 'chats', 'groups', 'participants'

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    loadConversations();
    setupEventListeners();
    setupNavigationListeners();
    setupProfilePopup();
});

/**
 * Configura o popup de perfil
 */
function setupProfilePopup() {
    const userAvatarBtn = document.getElementById('userAvatarBtn');
    const profilePopup = document.getElementById('profilePopup');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Toggle do popup ao clicar no avatar
    userAvatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePopup.classList.toggle('active');
    });
    
    // Fecha o popup ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!profilePopup.contains(e.target) && !userAvatarBtn.contains(e.target)) {
            profilePopup.classList.remove('active');
        }
    });
    
    // Ação de logout
    logoutBtn.addEventListener('click', () => {
        // Fecha o popup
        profilePopup.classList.remove('active');
        
        // Aguarda um pouco para animação e redireciona
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 200);
    });
}

/**
 * Configura os event listeners da navegação lateral
 */
function setupNavigationListeners() {
    const navChats = document.getElementById('navChats');
    const navGroups = document.getElementById('navGroups');
    const navParticipants = document.getElementById('navParticipants');
    
    navChats.addEventListener('click', () => {
        setActiveNavIcon('navChats');
        currentView = 'chats';
        updateSidebarContent();
    });
    
    navGroups.addEventListener('click', () => {
        setActiveNavIcon('navGroups');
        currentView = 'groups';
        updateSidebarContent();
    });
    
    navParticipants.addEventListener('click', () => {
        setActiveNavIcon('navParticipants');
        currentView = 'participants';
        updateSidebarContent();
    });
}

/**
 * Atualiza o conteúdo da sidebar baseado na visualização atual
 */
function updateSidebarContent() {
    const conversationsList = document.getElementById('conversationsList');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const searchInput = document.getElementById('searchInput');
    
    // Limpa a lista atual
    conversationsList.innerHTML = '';
    
    // Fecha chat se estiver aberto
    document.getElementById('welcomeScreen').style.display = 'flex';
    document.getElementById('chatContainer').style.display = 'none';
    activeConversationId = null;
    
    switch(currentView) {
        case 'chats':
            sidebarTitle.textContent = 'Conversas';
            searchInput.placeholder = 'Pesquisar ou começar uma nova conversa';
            loadConversations();
            break;
            
        case 'groups':
            sidebarTitle.textContent = 'Grupos';
            searchInput.placeholder = 'Pesquisar grupos';
            loadGroups();
            break;
            
        case 'participants':
            sidebarTitle.textContent = 'Participantes';
            searchInput.placeholder = 'Pesquisar participantes';
            loadParticipants();
            break;
    }
}

/**
 * Carrega os grupos na sidebar
 */
function loadGroups() {
    const conversationsList = document.getElementById('conversationsList');
    conversationsList.innerHTML = '';
    
    groupsData.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.className = 'conversation-item';
        groupElement.dataset.id = group.id;
        groupElement.innerHTML = `
            <div class="avatar">${group.avatar}</div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <span class="conversation-name">${group.name}</span>
                    <span class="conversation-time">${group.time}</span>
                </div>
                <div class="conversation-preview">${group.lastMessage} • ${group.members} membros</div>
            </div>
        `;
        
        groupElement.addEventListener('click', () => openGroup(group));
        conversationsList.appendChild(groupElement);
    });
}

/**
 * Carrega os participantes na sidebar
 */
function loadParticipants() {
    const conversationsList = document.getElementById('conversationsList');
    conversationsList.innerHTML = '';
    
    participantsData.forEach(participant => {
        const participantElement = document.createElement('div');
        participantElement.className = 'conversation-item';
        participantElement.dataset.id = participant.id;
        
        // Define a cor do status
        let statusColor = '#gray';
        if (participant.status === 'Online') statusColor = '#4CAF50';
        else if (participant.status === 'Ausente') statusColor = '#FFA726';
        else statusColor = '#9E9E9E';
        
        participantElement.innerHTML = `
            <div class="avatar">${participant.avatar}</div>
            <div class="conversation-info">
                <div class="conversation-header">
                    <span class="conversation-name">${participant.name}</span>
                    <span class="conversation-time" style="color: ${statusColor}; font-weight: 500;">${participant.status}</span>
                </div>
                <div class="conversation-preview">${participant.department}</div>
            </div>
        `;
        
        participantElement.addEventListener('click', () => openParticipantChat(participant));
        conversationsList.appendChild(participantElement);
    });
}

/**
 * Abre um grupo
 * @param {Object} group - Objeto com dados do grupo
 */
function openGroup(group) {
    activeConversationId = group.id;
    
    // Remove classe active de todos os itens
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adiciona classe active no grupo selecionado
    const selectedItem = document.querySelector(`[data-id="${group.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Esconde tela de boas-vindas e mostra área de chat
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    
    // Atualiza informações do cabeçalho do chat
    document.getElementById('chatAvatar').textContent = group.avatar;
    document.getElementById('contactName').textContent = group.name;
    document.querySelector('.status').textContent = `${group.members} membros`;
    
    // Limpa mensagens anteriores
    document.getElementById('messagesArea').innerHTML = '';
    
    // Adiciona mensagem de exemplo
    addMessage('Bem-vindo ao grupo ' + group.name + '!', 'received');
    
    // Foca no input de mensagem
    document.getElementById('messageInput').focus();
}

/**
 * Abre chat com um participante
 * @param {Object} participant - Objeto com dados do participante
 */
function openParticipantChat(participant) {
    activeConversationId = participant.id;
    
    // Remove classe active de todos os itens
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adiciona classe active no participante selecionado
    const selectedItem = document.querySelector(`[data-id="${participant.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Esconde tela de boas-vindas e mostra área de chat
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    
    // Atualiza informações do cabeçalho do chat
    document.getElementById('chatAvatar').textContent = participant.avatar;
    document.getElementById('contactName').textContent = participant.name;
    document.querySelector('.status').textContent = participant.status;
    
    // Limpa mensagens anteriores
    document.getElementById('messagesArea').innerHTML = '';
    
    // Adiciona mensagem de exemplo
    addMessage('Olá! Iniciando conversa com ' + participant.name, 'received');
    
    // Foca no input de mensagem
    document.getElementById('messageInput').focus();
}

/**
 * Define o ícone ativo na navegação
 * @param {string} iconId - ID do ícone a ser ativado
 */
function setActiveNavIcon(iconId) {
    // Remove classe active de todos os ícones
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    
    // Adiciona classe active ao ícone selecionado
    const activeIcon = document.getElementById(iconId);
    if (activeIcon) {
        activeIcon.classList.add('active');
    }
}

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