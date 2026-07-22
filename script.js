// ============================================================
//  RICK AND MORTY SYSTEM - VERSIÓN CORREGIDA
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
//  NAVEGACIÓN ENTRE FORMULARIOS
// ============================================================
function showForm(formName) {
    const login = document.getElementById('loginForm');
    const register = document.getElementById('registerForm');
    const forgot = document.getElementById('forgotPasswordForm');
    
    // Ocultar todos
    if (login) login.style.display = 'none';
    if (register) register.style.display = 'none';
    if (forgot) forgot.style.display = 'none';
    
    // Mostrar el seleccionado
    if (formName === 'login' && login) login.style.display = 'block';
    else if (formName === 'register' && register) register.style.display = 'block';
    else if (formName === 'forgot' && forgot) forgot.style.display = 'block';
}

// ============================================================
//  MOSTRAR PANTALLA PRINCIPAL
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
//  CARGAR PERSONAJES
// ============================================================
async function loadCharacters() {
    const tbody = document.getElementById('charactersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">🔄 Cargando personajes...</td></tr>';
    
    try {
        const res = await fetch('https://rickandmortyapi.com/api/character');
        const data = await res.json();
        
        if (data && data.results) {
            tbody.innerHTML = data.results.map(char => `
                <tr>
                    <td>${char.id}</td>
                    <td>${char.name}</td>
                    <td>${char.species}</td>
                    <td>${char.gender}</td>
                    <td>${char.type || '-'}</td>
                    <td>
                        <button class="action-btn view" onclick="alert('Ver personaje ${char.id}')">👁️ Ver</button>
                        <button class="action-btn edit" onclick="alert('Editar personaje ${char.id}')">✏️ Editar</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">❌ Error al cargar personajes</td></tr>';
        console.error(e);
    }
}

// ============================================================
//  CARGAR EPISODIOS
// ============================================================
async function loadEpisodes() {
    const tbody = document.getElementById('episodesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">🔄 Cargando episodios...</td></tr>';
    
    try {
        const res = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await res.json();
        
        if (data && data.results) {
            tbody.innerHTML = data.results.map(ep => `
                <tr>
                    <td>${ep.id}</td>
                    <td>${ep.name}</td>
                    <td>${ep.air_date}</td>
                    <td>${ep.episode}</td>
                    <td>
                        <button class="action-btn view" onclick="alert('Ver episodio ${ep.id}')">👁️ Ver</button>
                        <button class="action-btn edit" onclick="alert('Editar episodio ${ep.id}')">✏️ Editar</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">❌ Error al cargar episodios</td></tr>';
        console.error(e);
    }
}

// ============================================================
//  FUNCIÓN PRINCIPAL - SE EJECUTA CUANDO CARGA LA PÁGINA
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado - configurando eventos...');
    
    // ============================================================
    //  MOSTRAR FORMULARIO DE LOGIN POR DEFECTO
    // ============================================================
    showForm('login');
    showAuthScreen();
    
    // ============================================================
    //  BOTÓN: REGISTRARSE
    // ============================================================
    const showRegister = document.getElementById('showRegister');
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en "Registrarse"');
            showForm('register');
        });
    } else {
        console.error('❌ No se encontró #showRegister');
    }
    
    // ============================================================
    //  BOTÓN: INICIAR SESIÓN
    // ============================================================
    const showLogin = document.getElementById('showLogin');
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en "Iniciar sesión"');
            showForm('login');
        });
    } else {
        console.error('❌ No se encontró #showLogin');
    }
    
    // ============================================================
    //  BOTÓN: OLVIDÉ CONTRASEÑA
    // ============================================================
    const showForgot = document.getElementById('showForgotPassword');
    if (showForgot) {
        showForgot.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en "Olvidé contraseña"');
            showForm('forgot');
        });
    }
    
    // ============================================================
    //  BOTÓN: VOLVER A LOGIN DESDE FORGOT
    // ============================================================
    const backToLogin = document.getElementById('showLoginFromForgot');
    if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Volver a login');
            showForm('login');
        });
    }
    
    // ============================================================
    //  FORMULARIO: REGISTRO
    // ============================================================
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🔄 Enviando registro...');
            
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
            console.log('✅ Usuario registrado:', email, 'Total:', users.length);
        });
    } else {
        console.error('❌ No se encontró #registerFormElement');
    }
    
    // ============================================================
    //  FORMULARIO: LOGIN
    // ============================================================
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🔄 Enviando login...');
            
            const email = document.getElementById('loginEmail')?.value.trim();
            const password = document.getElementById('loginPassword')?.value.trim();
            
            if (!email || !password) {
                showNotification('❌ Completa todos los campos', 'error');
                return;
            }
            
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                showNotification('✅ ¡Bienvenido ' + user.name + '!', 'success');
                showMainScreen();
                document.getElementById('userNameDisplay').textContent = user.name;
                loadCharacters();
                console.log('✅ Login exitoso:', user.name);
            } else {
                showNotification('❌ Credenciales incorrectas', 'error');
                console.log('❌ Login fallido');
            }
        });
    } else {
        console.error('❌ No se encontró #loginFormElement');
    }
    
    // ============================================================
    //  FORMULARIO: RECUPERAR CONTRASEÑA
    // ============================================================
    const forgotForm = document.getElementById('forgotPasswordFormElement');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotEmail')?.value.trim();
            const user = users.find(u => u.email === email);
            if (user) {
                showNotification('📧 Enlace enviado a tu correo (simulado)', 'success');
            } else {
                showNotification('❌ Correo no encontrado', 'error');
            }
        });
    }
    
    // ============================================================
    //  BOTÓN: CERRAR SESIÓN
    // ============================================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showAuthScreen();
            showNotification('👋 Sesión cerrada', 'success');
            console.log('🔄 Sesión cerrada');
        });
    }
    
    // ============================================================
    //  NAVEGACIÓN: PERSONAJES
    // ============================================================
    const navChars = document.getElementById('navCharacters');
    if (navChars) {
        navChars.addEventListener('click', function() {
            console.log('🔄 Navegando a Personajes');
            document.getElementById('charactersSection').style.display = 'block';
            document.getElementById('episodesSection').style.display = 'none';
            navChars.classList.add('active');
            document.getElementById('navEpisodes').classList.remove('active');
            loadCharacters();
        });
    }
    
    // ============================================================
    //  NAVEGACIÓN: EPISODIOS
    // ============================================================
    const navEps = document.getElementById('navEpisodes');
    if (navEps) {
        navEps.addEventListener('click', function() {
            console.log('🔄 Navegando a Episodios');
            document.getElementById('episodesSection').style.display = 'block';
            document.getElementById('charactersSection').style.display = 'none';
            navEps.classList.add('active');
            document.getElementById('navCharacters').classList.remove('active');
            loadEpisodes();
        });
    }
    
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
    
    // ============================================================
    //  CONFIGURAR TEMA INICIAL
    // ============================================================
    const savedTheme = localStorage.getItem('rickmorty_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }
    
    console.log('✅ Todos los eventos configurados correctamente');
    console.log('👥 Usuarios guardados:', users.length);
});