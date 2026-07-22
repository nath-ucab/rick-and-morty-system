// ============================================================
//  RICK AND MORTY SYSTEM - VERSIÓN FINAL
// ============================================================

console.log('🚀 Iniciando Rick and Morty System...');

// ============================================================
//  USUARIOS
// ============================================================
let users = JSON.parse(localStorage.getItem('rickmorty_users')) || [];

function saveUsers() {
    localStorage.setItem('rickmorty_users', JSON.stringify(users));
}

// ============================================================
//  NOTIFICACIONES
// ============================================================
function showNotification(msg, type = 'success') {
    const n = document.getElementById('notification');
    if (!n) return;
    n.textContent = msg;
    n.className = type;
    n.classList.remove('hidden');
    clearTimeout(n._timeout);
    n._timeout = setTimeout(() => n.classList.add('hidden'), 4000);
}

// ============================================================
//  MOSTRAR FORMULARIOS
// ============================================================
function showForm(formName) {
    const login = document.getElementById('loginForm');
    const register = document.getElementById('registerForm');
    const forgot = document.getElementById('forgotPasswordForm');
    
    if (login) login.style.display = 'none';
    if (register) register.style.display = 'none';
    if (forgot) forgot.style.display = 'none';
    
    if (formName === 'login' && login) {
        login.style.display = 'block';
        login.classList.add('active');
    } else if (formName === 'register' && register) {
        register.style.display = 'block';
        register.classList.add('active');
    } else if (formName === 'forgot' && forgot) {
        forgot.style.display = 'block';
        forgot.classList.add('active');
    }
}

// ============================================================
//  MOSTRAR PANTALLAS
// ============================================================
function showMainScreen() {
    const auth = document.getElementById('authSection');
    const main = document.getElementById('mainSection');
    if (auth) auth.style.display = 'none';
    if (main) main.style.display = 'block';
}

function showAuthScreen() {
    const auth = document.getElementById('authSection');
    const main = document.getElementById('mainSection');
    if (auth) auth.style.display = 'flex';
    if (main) main.style.display = 'none';
}

// ============================================================
//  CERRAR MODALES
// ============================================================
function closeModals() {
    document.getElementById('detailModal')?.classList.add('hidden');
    document.getElementById('editModal')?.classList.add('hidden');
}

// ============================================================
//  VARIABLES GLOBALES
// ============================================================
let allCharacters = [];
let allEpisodes = [];

// ============================================================
//  CARGAR PERSONAJES
// ============================================================
async function loadCharacters(search = '') {
    const tbody = document.getElementById('charactersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">🔄 Cargando personajes...</td></tr>';
    
    try {
        let url = 'https://rickandmortyapi.com/api/character';
        if (search) {
            url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(search)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.results) {
            allCharacters = data.results;
            renderCharacters(allCharacters);
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">❌ No se encontraron personajes</td></tr>';
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">❌ Error al cargar personajes</td></tr>';
        console.error(e);
    }
}

function renderCharacters(characters) {
    const tbody = document.getElementById('charactersTableBody');
    if (!tbody) return;
    
    if (!characters || characters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">❌ No hay personajes para mostrar</td></tr>';
        return;
    }
    
    tbody.innerHTML = characters.map(char => `
        <tr>
            <td>${char.id}</td>
            <td>${char.name}</td>
            <td>${char.species}</td>
            <td>${char.gender}</td>
            <td>${char.type || '-'}</td>
            <td>
                <button class="action-btn view" onclick="viewCharacter(${char.id})">👁️ Ver</button>
                <button class="action-btn edit" onclick="editCharacter(${char.id})">✏️ Editar</button>
            </td>
        </tr>
    `).join('');
}

// ============================================================
//  VER PERSONAJE
// ============================================================
function viewCharacter(id) {
    const char = allCharacters.find(c => c.id === id);
    if (!char) {
        showNotification('❌ Personaje no encontrado', 'error');
        return;
    }

    const content = document.getElementById('detailContent');
    if (content) {
        content.innerHTML = `
            <div class="detail-card">
                <img src="${char.image}" alt="${char.name}" style="width:150px;height:150px;border-radius:50%;object-fit:cover;border:4px solid #e94560;" />
                <div class="detail-info">
                    <h2>${char.name}</h2>
                    <p><strong>ID:</strong> ${char.id}</p>
                    <p><strong>Especie:</strong> ${char.species}</p>
                    <p><strong>Género:</strong> ${char.gender}</p>
                    <p><strong>Tipo:</strong> ${char.type || 'N/A'}</p>
                    <p><strong>Estado:</strong> ${char.status}</p>
                    <p><strong>Origen:</strong> ${char.origin?.name || 'N/A'}</p>
                    <p><strong>Ubicación:</strong> ${char.location?.name || 'N/A'}</p>
                    <p><strong>Episodios:</strong> ${char.episode?.length || 0}</p>
                </div>
            </div>
        `;
    }
    document.getElementById('detailModal')?.classList.remove('hidden');
}

// ============================================================
//  EDITAR PERSONAJE
// ============================================================
function editCharacter(id) {
    const char = allCharacters.find(c => c.id === id);
    if (!char) {
        showNotification('❌ Personaje no encontrado', 'error');
        return;
    }

    const fields = document.getElementById('editFields');
    if (fields) {
        fields.innerHTML = `
            <input type="hidden" id="editId" value="${char.id}" />
            <label>Nombre:</label>
            <input type="text" id="editName" value="${char.name}" required />
            <label>Especie:</label>
            <input type="text" id="editSpecies" value="${char.species}" required />
            <label>Género:</label>
            <select id="editGender">
                <option value="Male" ${char.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${char.gender === 'Female' ? 'selected' : ''}>Female</option>
                <option value="Genderless" ${char.gender === 'Genderless' ? 'selected' : ''}>Genderless</option>
                <option value="Unknown" ${char.gender === 'Unknown' ? 'selected' : ''}>Unknown</option>
            </select>
            <label>Tipo:</label>
            <input type="text" id="editType" value="${char.type || ''}" />
            <label>Estado:</label>
            <select id="editStatus">
                <option value="Alive" ${char.status === 'Alive' ? 'selected' : ''}>Alive</option>
                <option value="Dead" ${char.status === 'Dead' ? 'selected' : ''}>Dead</option>
                <option value="Unknown" ${char.status === 'Unknown' ? 'selected' : ''}>Unknown</option>
            </select>
        `;
    }
    document.getElementById('editModal')?.classList.remove('hidden');
}

function saveEdit() {
    const id = parseInt(document.getElementById('editId')?.value);
    const name = document.getElementById('editName')?.value.trim();
    const species = document.getElementById('editSpecies')?.value.trim();
    const gender = document.getElementById('editGender')?.value;
    const type = document.getElementById('editType')?.value.trim();
    const status = document.getElementById('editStatus')?.value;

    const char = allCharacters.find(c => c.id === id);
    if (char) {
        char.name = name || char.name;
        char.species = species || char.species;
        char.gender = gender || char.gender;
        char.type = type || '';
        char.status = status || char.status;
        
        renderCharacters(allCharacters);
        closeModals();
        showNotification('✅ Personaje actualizado correctamente', 'success');
    } else {
        showNotification('❌ Error al guardar', 'error');
    }
}

// ============================================================
//  CARGAR EPISODIOS
// ============================================================
async function loadEpisodes(search = '') {
    const tbody = document.getElementById('episodesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">🔄 Cargando episodios...</td></tr>';
    
    try {
        let url = 'https://rickandmortyapi.com/api/episode';
        if (search) {
            url = `https://rickandmortyapi.com/api/episode/?name=${encodeURIComponent(search)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.results) {
            allEpisodes = data.results;
            renderEpisodes(allEpisodes);
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">❌ No se encontraron episodios</td></tr>';
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">❌ Error al cargar episodios</td></tr>';
        console.error(e);
    }
}

function renderEpisodes(episodes) {
    const tbody = document.getElementById('episodesTableBody');
    if (!tbody) return;
    
    if (!episodes || episodes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">❌ No hay episodios para mostrar</td></tr>';
        return;
    }
    
    tbody.innerHTML = episodes.map(ep => `
        <tr>
            <td>${ep.id}</td>
            <td>${ep.name}</td>
            <td>${ep.air_date}</td>
            <td>${ep.episode}</td>
            <td>
                <button class="action-btn view" onclick="viewEpisode(${ep.id})">👁️ Ver</button>
                <button class="action-btn edit" onclick="editEpisode(${ep.id})">✏️ Editar</button>
            </td>
        </tr>
    `).join('');
}

// ============================================================
//  VER EPISODIO
// ============================================================
function viewEpisode(id) {
    const ep = allEpisodes.find(e => e.id === id);
    if (!ep) {
        showNotification('❌ Episodio no encontrado', 'error');
        return;
    }

    const content = document.getElementById('detailContent');
    if (content) {
        content.innerHTML = `
            <div class="detail-card">
                <div class="detail-info">
                    <h2>${ep.name}</h2>
                    <p><strong>ID:</strong> ${ep.id}</p>
                    <p><strong>Código:</strong> ${ep.episode}</p>
                    <p><strong>Fecha de emisión:</strong> ${ep.air_date}</p>
                    <p><strong>Personajes:</strong> ${ep.characters?.length || 0}</p>
                </div>
            </div>
        `;
    }
    document.getElementById('detailModal')?.classList.remove('hidden');
}

// ============================================================
//  EDITAR EPISODIO
// ============================================================
function editEpisode(id) {
    const ep = allEpisodes.find(e => e.id === id);
    if (!ep) {
        showNotification('❌ Episodio no encontrado', 'error');
        return;
    }

    const fields = document.getElementById('editFields');
    if (fields) {
        fields.innerHTML = `
            <input type="hidden" id="editEpisodeId" value="${ep.id}" />
            <label>Nombre:</label>
            <input type="text" id="editEpisodeName" value="${ep.name}" required />
            <label>Código:</label>
            <input type="text" id="editEpisodeCode" value="${ep.episode}" required />
            <label>Fecha de emisión:</label>
            <input type="text" id="editEpisodeDate" value="${ep.air_date}" required />
        `;
    }
    document.getElementById('editModal')?.classList.remove('hidden');
    
    // Cambiar el submit para episodios
    const form = document.getElementById('editForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            saveEpisodeEdit();
        };
    }
}

function saveEpisodeEdit() {
    const id = parseInt(document.getElementById('editEpisodeId')?.value);
    const name = document.getElementById('editEpisodeName')?.value.trim();
    const code = document.getElementById('editEpisodeCode')?.value.trim();
    const date = document.getElementById('editEpisodeDate')?.value.trim();

    const ep = allEpisodes.find(e => e.id === id);
    if (ep) {
        ep.name = name || ep.name;
        ep.episode = code || ep.episode;
        ep.air_date = date || ep.air_date;
        
        renderEpisodes(allEpisodes);
        closeModals();
        showNotification('✅ Episodio actualizado correctamente', 'success');
    } else {
        showNotification('❌ Error al guardar', 'error');
    }
}

// ============================================================
//  BUSCADORES
// ============================================================
function searchCharacters() {
    const input = document.getElementById('characterSearch');
    if (input) {
        loadCharacters(input.value.trim());
    }
}

function searchEpisodes() {
    const input = document.getElementById('episodeSearch');
    if (input) {
        loadEpisodes(input.value.trim());
    }
}

// ============================================================
//  EVENTOS - CUANDO EL DOM ESTÁ LISTO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado - configurando eventos...');
    
    showForm('login');
    showAuthScreen();
    
    // ============================================================
    //  NAVEGACIÓN ENTRE FORMULARIOS
    // ============================================================
    document.getElementById('showRegister')?.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('register');
    });
    
    document.getElementById('showLogin')?.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('login');
    });
    
    document.getElementById('showForgotPassword')?.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('forgot');
    });
    
    document.getElementById('showLoginFromForgot')?.addEventListener('click', function(e) {
        e.preventDefault();
        showForm('login');
    });
    
    // ============================================================
    //  REGISTRO
    // ============================================================
    document.getElementById('registerFormElement')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName')?.value.trim();
        const email = document.getElementById('registerEmail')?.value.trim();
        const password = document.getElementById('registerPassword')?.value.trim();
        const confirm = document.getElementById('registerConfirmPassword')?.value.trim();
        
        if (!name || !email || !password || !confirm) {
            showNotification('❌ Completa todos los campos', 'error');
            return;
        }
        
        if (password !== confirm) {
            showNotification('❌ Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (users.find(u => u.email === email)) {
            showNotification('❌ Este correo ya está registrado', 'error');
            return;
        }
        
        users.push({ name, email, password });
        saveUsers();
        showNotification('✅ ¡Registro exitoso! Ahora inicia sesión', 'success');
        showForm('login');
    });
    
    // ============================================================
    //  LOGIN
    // ============================================================
    document.getElementById('loginFormElement')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value.trim();
        
        if (!email || !password) {
            showNotification('❌ Completa todos los campos', 'error');
            return;
        }
        
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            showNotification('✅ ¡Bienvenido ' + user.name + '!', 'success');
            document.getElementById('userNameDisplay').textContent = user.name;
            showMainScreen();
            loadCharacters();
        } else {
            showNotification('❌ Credenciales incorrectas', 'error');
        }
    });
    
    // ============================================================
    //  RECUPERAR CONTRASEÑA
    // ============================================================
    document.getElementById('forgotPasswordFormElement')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail')?.value.trim();
        const user = users.find(u => u.email === email);
        if (user) {
            showNotification('📧 Enlace enviado a tu correo (simulado)', 'success');
        } else {
            showNotification('❌ Correo no encontrado', 'error');
        }
    });
    
    // ============================================================
    //  CERRAR SESIÓN
    // ============================================================
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        showAuthScreen();
        showNotification('👋 Sesión cerrada', 'success');
    });
    
    // ============================================================
    //  NAVEGACIÓN PRINCIPAL
    // ============================================================
    document.getElementById('navCharacters')?.addEventListener('click', function() {
        document.getElementById('charactersSection').style.display = 'block';
        document.getElementById('episodesSection').style.display = 'none';
        this.classList.add('active');
        document.getElementById('navEpisodes').classList.remove('active');
        loadCharacters();
    });
    
    document.getElementById('navEpisodes')?.addEventListener('click', function() {
        document.getElementById('episodesSection').style.display = 'block';
        document.getElementById('charactersSection').style.display = 'none';
        this.classList.add('active');
        document.getElementById('navCharacters').classList.remove('active');
        loadEpisodes();
    });
    
    // ============================================================
    //  BUSCADORES
    // ============================================================
    document.getElementById('characterSearchBtn')?.addEventListener('click', searchCharacters);
    document.getElementById('characterSearch')?.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchCharacters();
    });
    
    document.getElementById('episodeSearchBtn')?.addEventListener('click', searchEpisodes);
    document.getElementById('episodeSearch')?.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchEpisodes();
    });
    
    // ============================================================
    //  CERRAR MODALES
    // ============================================================
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('detailModal')) closeModals();
        if (e.target === document.getElementById('editModal')) closeModals();
    });
    
    // ============================================================
    //  EDIT FORM
    // ============================================================
    document.getElementById('editForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        if (document.getElementById('editId')) {
            saveEdit();
        } else if (document.getElementById('editEpisodeId')) {
            saveEpisodeEdit();
        }
    });
    
    // ============================================================
    //  TEMA OSCURO/CLARO
    // ============================================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('rickmorty_theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
    }
    
    const savedTheme = localStorage.getItem('rickmorty_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
    
    console.log('✅ Todos los eventos configurados');
});