// ============================================================
//  VERSIÓN SIMPLIFICADA - SOLO PARA PROBAR BOTONES
// ============================================================

console.log('🚀 Cargando versión simplificada...');

// Usuarios en localStorage
let users = JSON.parse(localStorage.getItem('rickmorty_users')) || [];

function saveUsers() {
    localStorage.setItem('rickmorty_users', JSON.stringify(users));
}

// Mostrar notificación
function showNotification(msg, type = 'success') {
    const n = document.getElementById('notification');
    if (!n) return;
    n.textContent = msg;
    n.className = type;
    n.classList.remove('hidden');
    clearTimeout(n._timeout);
    n._timeout = setTimeout(() => n.classList.add('hidden'), 4000);
}

// Mostrar/ocultar formularios
function toggleForms(form) {
    const login = document.getElementById('loginForm');
    const register = document.getElementById('registerForm');
    const forgot = document.getElementById('forgotPasswordForm');
    
    if (login) login.classList.remove('active');
    if (register) register.classList.remove('active');
    if (forgot) forgot.classList.remove('active');
    
    if (form === 'login' && login) login.classList.add('active');
    else if (form === 'register' && register) register.classList.add('active');
    else if (form === 'forgot' && forgot) forgot.classList.add('active');
}

// Mostrar pantalla principal
function showMain() {
    const auth = document.getElementById('authSection');
    const main = document.getElementById('mainSection');
    if (auth) auth.style.display = 'none';
    if (main) main.classList.remove('hidden');
}

// Mostrar pantalla de login
function showAuth() {
    const auth = document.getElementById('authSection');
    const main = document.getElementById('mainSection');
    if (auth) auth.style.display = 'flex';
    if (main) main.classList.add('hidden');
}

// ============================================================
//  EVENTOS - CUANDO EL DOM ESTÁ LISTO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM listo - configurando eventos...');
    
    // --- BOTÓN REGISTRARSE ---
    const registerBtn = document.getElementById('showRegister');
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en "Registrarse"');
            toggleForms('register');
        });
    } else {
        console.error('❌ No encontré #showRegister');
    }
    
    // --- BOTÓN INICIAR SESIÓN ---
    const loginBtn = document.getElementById('showLogin');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en "Iniciar sesión"');
            toggleForms('login');
        });
    } else {
        console.error('❌ No encontré #showLogin');
    }
    
    // --- BOTÓN OLVIDÉ CONTRASEÑA ---
    const forgotBtn = document.getElementById('showForgotPassword');
    if (forgotBtn) {
        forgotBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Click en "Olvidé contraseña"');
            toggleForms('forgot');
        });
    }
    
    // --- VOLVER A LOGIN DESDE FORGOT ---
    const backBtn = document.getElementById('showLoginFromForgot');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Volver a login');
            toggleForms('login');
        });
    }
    
    // --- FORMULARIO DE REGISTRO ---
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
            toggleForms('login');
            console.log('✅ Usuario registrado:', email);
        });
    } else {
        console.error('❌ No encontré #registerFormElement');
    }
    
    // --- FORMULARIO DE LOGIN ---
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
                showMain();
                console.log('✅ Login exitoso:', user.name);
            } else {
                showNotification('❌ Credenciales incorrectas', 'error');
                console.log('❌ Login fallido');
            }
        });
    } else {
        console.error('❌ No encontré #loginFormElement');
    }
    
    // --- FORMULARIO DE RECUPERACIÓN ---
    const forgotForm = document.getElementById('forgotPasswordFormElement');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotEmail')?.value.trim();
            const user = users.find(u => u.email === email);
            if (user) {
                showNotification('📧 Enlace enviado (simulado)', 'success');
            } else {
                showNotification('❌ Correo no encontrado', 'error');
            }
        });
    }
    
    // --- BOTÓN CERRAR SESIÓN ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showAuth();
            showNotification('👋 Sesión cerrada', 'success');
            console.log('🔄 Sesión cerrada');
        });
    }
    
    // --- INICIALIZAR ---
    toggleForms('login');
    showAuth();
    console.log('✅ Eventos configurados. Usuarios:', users.length);
});

console.log('📦 Script cargado correctamente');