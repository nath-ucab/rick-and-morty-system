// ===== Auth Module =====
const Auth = {
    users: [],
    currentUser: null,

    init() {
        this.loadUsers();
        this.loadSession();
        this.setupEventListeners();
    },

    loadUsers() {
        const stored = localStorage.getItem('rickmorty_users');
        if (stored) {
            this.users = JSON.parse(stored);
        } else {
            // Default users for testing
            this.users = [
                { id: 1, name: 'Admin', email: 'admin@test.com', password: 'admin123', createdAt: new Date().toISOString() }
            ];
            this.saveUsers();
        }
    },

    saveUsers() {
        localStorage.setItem('rickmorty_users', JSON.stringify(this.users));
    },

    loadSession() {
        const session = localStorage.getItem('rickmorty_session');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.onLoginSuccess();
        }
    },

    saveSession(user) {
        this.currentUser = user;
        localStorage.setItem('rickmorty_session', JSON.stringify(user));
    },

    clearSession() {
        this.currentUser = null;
        localStorage.removeItem('rickmorty_session');
    },

    setupEventListeners() {
        // Login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            this.login(email, password);
        });

        // Register
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            this.register(name, email, password);
        });

        // Forgot Password
        document.getElementById('forgotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value.trim();
            this.forgotPassword(email);
        });

        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
            });
        });

        // Forgot password link
        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            document.getElementById('forgotForm').classList.add('active');
        });

        // Back to login
        document.getElementById('backToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            document.getElementById('loginForm').classList.add('active');
            document.querySelector('[data-tab="login"]').classList.add('active');
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    },

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.saveSession(user);
            this.onLoginSuccess();
            this.showNotification('¡Bienvenido ' + user.name + '!', 'success');
        } else {
            this.showNotification('Credenciales incorrectas. Por favor, inténtalo de nuevo.', 'error');
        }
    },

    register(name, email, password) {
        if (this.users.find(u => u.email === email)) {
            this.showNotification('Este email ya está registrado.', 'error');
            return;
        }
        if (password.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        this.saveUsers();
        this.showNotification('¡Registro exitoso! Ahora inicia sesión.', 'success');
        // Switch to login
        document.querySelector('[data-tab="login"]').click();
        document.getElementById('loginEmail').value = email;
    },

    forgotPassword(email) {
        const user = this.users.find(u => u.email === email);
        if (user) {
            this.showNotification('Se han enviado instrucciones a tu correo (simulado).', 'success');
        } else {
            this.showNotification('No se encontró una cuenta con este email.', 'error');
        }
        document.getElementById('forgotEmail').value = '';
    },

    logout() {
        this.clearSession();
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('appContent').style.display = 'none';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="characters"]').classList.add('active');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById('charactersSection').classList.add('active');
        this.showNotification('Sesión cerrada correctamente.', 'info');
    },

    onLoginSuccess() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        // Update profile info
        if (this.currentUser) {
            document.getElementById('profileName').textContent = this.currentUser.name;
            document.getElementById('profileEmail').textContent = this.currentUser.email;
            document.getElementById('profileDate').textContent = new Date(this.currentUser.createdAt).toLocaleDateString('es-ES');
        }
        // Load data
        if (window.Characters) Characters.init();
        if (window.Episodes) Episodes.init();
    },

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());

        const colors = {
            success: '#2ecc71',
            error: '#e74c6f',
            info: '#4a90d9'
        };

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 2000;
            max-width: 400px;
            font-weight: 500;
            animation: slideUp 0.3s ease;
            font-size: 0.95rem;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
};

// Initialize Auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});