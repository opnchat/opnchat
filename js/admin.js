// Dados fictícios iniciais e comportamentos básicos (frontend only)
(() => {
    const users = [
        { id: 1, name: 'Ana Silva', visibleName: 'Ana', matricula: 'A001', email: 'ana@ex.com', department: 'Vendas', visibleToAll: true, photo: '', groups: ['Equipe A'], active: true },
        { id: 2, name: 'Carlos Pereira', visibleName: 'Carlos', matricula: 'C002', email: 'carlos@ex.com', department: 'TI', visibleToAll: false, photo: '', groups: ['Equipe B','Comum'], active: true },
        { id: 3, name: 'Beatriz Costa', visibleName: 'Beatriz', matricula: 'B003', email: 'beatriz@ex.com', department: 'RH', visibleToAll: true, photo: '', groups: [], active: false }
    ];

    const groups = [
        { id: 'g1', name: 'Equipe A', members: 12, visibility: 'Privado' },
        { id: 'g2', name: 'Equipe B', members: 8, visibility: 'Público' },
        { id: 'g3', name: 'Comum', members: 24, visibility: 'Público' }
    ];

    // departamentos iniciais fictícios
    const departments = [
        { id: 'd1', name: 'Vendas' },
        { id: 'd2', name: 'TI' },
        { id: 'd3', name: 'RH' },
        { id: 'd4', name: 'Financeiro' },
        { id: 'd5', name: 'Suporte' },
        { id: 'd6', name: 'Comercial' }
    ];
    
    // estatísticas fictícias
    const stats = {
        users: users.length,
        groups: groups.length,
        departments: departments.length,
        messages: 728
    };
    
    // elements
    const el = id => document.getElementById(id);
    const usersTbody = document.querySelector('#usersTable tbody');
    const groupsTbody = document.querySelector('#groupsTable tbody');
    const statUsers = el('statUsers'), statGroups = el('statGroups'), statDepartments = el('statDepartments'), statMessages = el('statMessages');
    const departmentFields = document.getElementById('departmentFields');

    function renderStats(){
        statUsers.textContent = stats.users;
        statGroups.textContent = stats.groups;
        statDepartments.textContent = stats.departments;
        statMessages.textContent = stats.messages;
    }

    function renderUsers(list = users){
        usersTbody.innerHTML = '';
        list.forEach(u => {
            const displayName = u.visibleName || u.name;
            const photoHTML = u.photo ? `<img src="${u.photo}" alt="" style="width:28px;height:28px;border-radius:6px;object-fit:cover;margin-right:8px;vertical-align:middle">` : `<div style="width:28px;height:28px;border-radius:6px;background:#efefef;display:inline-block;margin-right:8px;vertical-align:middle;text-align:center;line-height:28px;color:#666;font-size:12px">${(displayName||'')[0]||'?'}</div>`;
            const tr = document.createElement('tr');
            if(u.active === false) tr.classList.add('user-inactive');
            const toggleLabel = u.active ? 'Desativar' : 'Ativar';
            tr.innerHTML = `<td>${photoHTML}${displayName}</td>
                <td>${u.email || '-'}</td>
                <td>${(u.groups||[]).join(', ') || '-'}</td>
                <td>
                    <button class="action-btn" data-id="${u.id}" data-type="edit-user">Editar</button>
                    <button class="action-btn" data-id="${u.id}" data-type="toggle-user">${toggleLabel}</button>
                    <button class="action-btn" data-id="${u.id}" data-type="del-user">Remover</button>
                </td>`;
            usersTbody.appendChild(tr);
        });
    }

    function renderGroups(list = groups){
        groupsTbody.innerHTML = '';
        list.forEach(g => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${g.name}</td><td>${g.members}</td><td>${g.visibility}</td>
                <td>
                    <button class="action-btn" data-id="${g.id}" data-type="edit-group">Editar</button>
                    <button class="action-btn" data-id="${g.id}" data-type="del-group">Remover</button>
                </td>`;
            groupsTbody.appendChild(tr);
        });
    }

    // ações básicas
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if(!btn) return;

        const type = btn.dataset.type;
        if(type === 'edit-user'){
            const id = Number(btn.dataset.id);
            openModal('Editar usuário', Object.assign({}, users.find(u => u.id === id), { type: 'user', id }));
        } else if(type === 'toggle-user'){
            const id = Number(btn.dataset.id);
            const u = users.find(x => x.id === id);
            if(u){
                u.active = !u.active;
                renderAll();
            }
         } else if(type === 'del-user'){
            const id = Number(btn.dataset.id);
            if(confirm('Remover usuário? (somente frontend)')){
                const idx = users.findIndex(u=>u.id===id);
                if(idx>=0){ users.splice(idx,1); stats.users = users.length; renderAll(); }
            }
        } else if(type === 'edit-group'){
            const id = btn.dataset.id;
            const g = groups.find(g=>g.id===id);
            if(g) openModal('Editar grupo', Object.assign({}, g, { type: 'group', id: g.id }));
        } else if(type === 'del-group'){
            const id = btn.dataset.id;
            if(confirm('Remover grupo? (somente frontend)')){
                const idx = groups.findIndex(g=>g.id===id);
                if(idx>=0){ groups.splice(idx,1); stats.groups = groups.length; renderAll(); }
            }
        }
    });

    // modal
    const modal = el('modal'), modalTitle = el('modalTitle'), modalForm = el('modalForm'), modalClose = el('modalClose'), modalCancel = el('modalCancel');
    const userFields = document.getElementById('userFields'), groupFields = document.getElementById('groupFields');
    let modalMode = null; // {type:'user'|'group'|'department', id:...}

    function openModal(title, data){
        modalTitle.textContent = title;
        modal.setAttribute('aria-hidden','false');
        modalMode = data || {};
        // mostra/oculta campos conforme tipo
        if(modalMode.type === 'group'){
            userFields.style.display = 'none';
            groupFields.style.display = 'block';
            departmentFields.style.display = 'none';
            // preencher se edição
            el('mGroupName').value = modalMode.name || '';
            el('mGroupPublic').checked = modalMode.visibility ? (modalMode.visibility.toLowerCase().includes('públic') || modalMode.visibility.toLowerCase().includes('pub')) : !!modalMode.public;
        } else if(modalMode.type === 'department'){
            userFields.style.display = 'none';
            groupFields.style.display = 'none';
            departmentFields.style.display = 'block';
            el('mDepartmentName').value = modalMode.name || '';
        } else {
            groupFields.style.display = 'none';
            departmentFields.style.display = 'none';
            userFields.style.display = 'block';
            // preencher campos usuário se houver data
            el('mFullName').value = modalMode.name || '';
            el('mVisibleName').value = modalMode.visibleName || '';
            el('mMatricula').value = modalMode.matricula || '';
            el('mEmail').value = modalMode.email || '';
            el('mDepartment').value = modalMode.department || '';
            el('mVisibleAll').checked = typeof modalMode.visibleToAll !== 'undefined' ? modalMode.visibleToAll : true;
            if(modalMode.photo){ el('mPhotoPreview').src = modalMode.photo; el('mPhotoPreview').style.display = 'inline-block'; } else { el('mPhotoPreview').style.display = 'none'; }
            el('mPhoto').value = '';
        }
    }
    function closeModal(){ 
        modal.setAttribute('aria-hidden','true'); 
        modalMode = null; 
        modalForm.reset(); 
        el('mPhotoPreview') && (el('mPhotoPreview').style.display = 'none'); 
        userFields.style.display = 'block'; 
        groupFields.style.display = 'none'; 
        departmentFields.style.display = 'none';
    }

    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);

    // NOTE: os botões de "+ Novo ..." no header foram removidos;
    // se desejar reativar via sidebar, adicionar listeners referenciando os novos IDs.

    // preview de foto
    const mPhotoInput = document.getElementById('mPhoto');
    if(mPhotoInput){
        mPhotoInput.addEventListener('change', (ev) => {
            const f = ev.target.files[0];
            if(!f) return;
            const reader = new FileReader();
            reader.onload = () => {
                el('mPhotoPreview').src = reader.result;
                el('mPhotoPreview').style.display = 'inline-block';
            };
            reader.readAsDataURL(f);
        });
    }

    modalForm.addEventListener('submit', (ev) => {
        ev.preventDefault();

        if(modalMode && modalMode.type === 'department'){
            const name = el('mDepartmentName').value.trim();
            if(!name){ alert('Preencha o nome do departamento'); return; }

            if(modalMode && modalMode.id){
                const d = departments.find(x => x.id === modalMode.id);
                if(d) d.name = name;
            } else {
                const newId = 'd' + (departments.length ? (Math.max(...departments.map(d=>parseInt(d.id.replace(/\D/g,''))||0)) + 1) : 1);
                departments.push({ id: newId, name });
                stats.departments = departments.length;
            }

            renderAll();
            closeModal();
            return;
        }

        if(modalMode && modalMode.type === 'group'){
            const name = el('mGroupName').value.trim();
            const isPublic = el('mGroupPublic').checked;
            if(!name){ alert('Preencha o nome do grupo'); return; }

            if(modalMode && modalMode.id){
                // edição de grupo
                const g = groups.find(x => x.id === modalMode.id);
                if(g){ g.name = name; g.visibility = isPublic ? 'Público' : 'Privado'; }
            } else {
                // cria grupo fictício
                const newId = 'g' + (groups.length ? (Math.max(...groups.map(g=>parseInt(g.id.replace(/\D/g,'')||0))) + 1) : 1);
                groups.push({ id: newId, name, members: 0, visibility: isPublic ? 'Público' : 'Privado' });
                stats.groups = groups.length;
            }

            renderAll();
            closeModal();
            return;
        }

        // fallback: trata como usuário (já existente no código anterior)
        if(modalMode && modalMode.type === 'user'){
            const name = el('mFullName').value.trim();
            const visibleName = el('mVisibleName').value.trim() || name;
            const matricula = el('mMatricula').value.trim();
            const email = el('mEmail').value.trim();
            const department = el('mDepartment').value.trim();
            const visibleToAll = el('mVisibleAll').checked;
            const photo = el('mPhotoPreview').src || '';

            if(!name){ alert('Preencha o nome completo'); return; }

            if(modalMode && modalMode.id){
                // edição
                const u = users.find(x => x.id === modalMode.id);
                if(u){
                    u.name = name;
                    u.visibleName = visibleName;
                    u.matricula = matricula;
                    u.email = email;
                    u.department = department;
                    u.visibleToAll = visibleToAll;
                    if(photo) u.photo = photo;
                }
            } else {
                // cria usuário fictício
                const newId = users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1;
                users.push({ id: newId, name, visibleName, matricula, email, department, visibleToAll, photo, groups: [] });
                stats.users = users.length;
            }

            renderAll();
            closeModal();
            return;
        }

        // caso não haja tipo definido — não deverá ocorrer
        alert('Tipo de formulário desconhecido');
    });

    function renderAll(){
        renderStats();
        renderUsers();
        renderGroups();
    }

    // inicialização
    renderAll();
})();

// --- Navegação entre views via ícones da sidebar (admin) ---
(function(){
    // helper
    const el = id => document.getElementById(id);
    const navIds = ['navDash','navCreateUser','navCreateGroup','navCreateDepartment'];

    function clearActiveIcons(){
        document.querySelectorAll('.nav-icon').forEach(i=>i.classList.remove('active'));
    }

    function showOnly(viewId, title){
        // todas as views que criamos
        const views = ['viewDashboard','viewCreateUser','viewCreateGroup','viewCreateDepartment'];
        views.forEach(v => {
            const elv = document.getElementById(v);
            if(!elv) return;
            elv.style.display = (v === viewId) ? '' : 'none';
        });

        // atualiza título no header (mantendo posição)
        const pageTitle = document.getElementById('pageTitle');
        if(pageTitle) pageTitle.textContent = title || 'Admin Dashboard';

        // quando dashboard for mostrado, re-renderiza estatísticas/listas
        if(viewId === 'viewDashboard'){
            // renderAll está no escopo superior
            try{ renderAll(); } catch(e){}
        }
    }

    // Attaches listeners to nav icons
    function setupNavIcons(){
        const navDash = el('navDash');
        const navCreateUser = el('navCreateUser');
        const navCreateGroup = el('navCreateGroup');
        const navCreateDepartment = el('navCreateDepartment');

        if(navDash){ navDash.addEventListener('click', ()=>{
            clearActiveIcons(); navDash.classList.add('active'); showOnly('viewDashboard','Admin Dashboard');
        }); }

        if(navCreateUser){ navCreateUser.addEventListener('click', ()=>{
            clearActiveIcons(); navCreateUser.classList.add('active'); showOnly('viewCreateUser','Cadastrar Usuário');
        }); }

        if(navCreateGroup){ navCreateGroup.addEventListener('click', ()=>{
            clearActiveIcons(); navCreateGroup.classList.add('active'); showOnly('viewCreateGroup','Cadastrar Grupo');
        }); }

        if(navCreateDepartment){ navCreateDepartment.addEventListener('click', ()=>{
            clearActiveIcons(); navCreateDepartment.classList.add('active'); showOnly('viewCreateDepartment','Cadastrar Departamento');
        }); }
    }

    // Form handlers for the create views
    function setupCreateForms(){
        const createUserForm = el('createUserForm');
        if(createUserForm){
            createUserForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                const name = el('cFullName').value.trim();
                const visibleName = el('cVisibleName').value.trim() || name;
                const email = el('cEmail').value.trim();
                const department = el('cDepartment').value.trim();
                if(!name){ alert('Preencha o nome'); return; }
                // cria usuário fictício (compatível com estrutura existente)
                try{
                    const usersRef = window.users || null;
                    if(Array.isArray(usersRef)){
                        const newId = usersRef.length ? Math.max(...usersRef.map(u=>u.id)) + 1 : 1;
                        usersRef.push({ id: newId, name, visibleName, matricula: '', email, department, visibleToAll: true, photo: '', groups: [], active: true });
                    }
                } catch(e){}
                // atualiza e volta ao dashboard
                try{ renderAll(); } catch(e){}
                // ativa dashboard icon
                clearActiveIcons(); el('navDash') && el('navDash').classList.add('active');
                showOnly('viewDashboard','Admin Dashboard');
                createUserForm.reset();
            });
            el('cUserCancel').addEventListener('click', ()=>{
                clearActiveIcons(); el('navDash') && el('navDash').classList.add('active'); showOnly('viewDashboard','Admin Dashboard');
            });
        }

        const createGroupForm = el('createGroupForm');
        if(createGroupForm){
            createGroupForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                const name = el('cGroupName').value.trim();
                const isPublic = el('cGroupPublic').checked;
                if(!name){ alert('Preencha o nome do grupo'); return; }
                try{
                    const groupsRef = window.groups || null;
                    if(Array.isArray(groupsRef)){
                        const newId = 'g' + (groupsRef.length ? (Math.max(...groupsRef.map(g=>parseInt((g.id||'').replace(/\D/g,''))||0)) + 1) : 1);
                        groupsRef.push({ id: newId, name, members: 0, visibility: isPublic ? 'Público' : 'Privado' });
                    }
                } catch(e){}
                try{ renderAll(); } catch(e){}
                clearActiveIcons(); el('navDash') && el('navDash').classList.add('active'); showOnly('viewDashboard','Admin Dashboard');
                createGroupForm.reset();
            });
            el('cGroupCancel').addEventListener('click', ()=>{
                clearActiveIcons(); el('navDash') && el('navDash').classList.add('active'); showOnly('viewDashboard','Admin Dashboard');
            });
        }

        const createDepartmentForm = el('createDepartmentForm');
        if(createDepartmentForm){
            createDepartmentForm.addEventListener('submit', (e)=>{
                e.preventDefault();
                const name = el('cDepartmentName').value.trim();
                if(!name){ alert('Preencha o nome do departamento'); return; }
                try{
                    const departmentsRef = window.departments || null;
                    if(Array.isArray(departmentsRef)){
                        const newId = 'd' + (departmentsRef.length ? (Math.max(...departmentsRef.map(d=>parseInt((d.id||'').replace(/\D/g,''))||0)) + 1) : 1);
                        departmentsRef.push({ id: newId, name });
                    }
                } catch(e){}
                try{ renderAll(); } catch(e){}
                clearActiveIcons(); el('navDash') && el('navDash').classList.add('active'); showOnly('viewDashboard','Admin Dashboard');
                createDepartmentForm.reset();
            });
            el('cDepartmentCancel').addEventListener('click', ()=>{
                clearActiveIcons(); el('navDash') && el('navDash').classList.add('active'); showOnly('viewDashboard','Admin Dashboard');
            });
        }
    }

    // Inicializa: define dashboard como view ativa por padrão
    document.addEventListener('DOMContentLoaded', ()=>{
        try{ setupNavIcons(); setupCreateForms(); clearActiveIcons(); document.getElementById('navDash') && document.getElementById('navDash').classList.add('active'); showOnly('viewDashboard','Admin Dashboard'); }catch(e){}
    });

})();