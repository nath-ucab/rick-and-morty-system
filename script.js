// ============================================================
//  CONFIGURACIÓN
// ============================================================
const API_BASE = 'https://rickandmortyapi.com/api';

// ============================================================
//  ESTADO GLOBAL
// ============================================================
let currentUser = null;
let currentPage = 'characters';
let charactersData = [];
let episodesData = [];
let charactersPage = 1;
let episodesPage = 1;
let totalCharactersPages = 1;
let totalEpisodesPages = 1;
let sortCharacter = { field: 'id', direction: 'asc' };
let sortEpisode = { field: 'id', direction: 'asc' };
let characterSearchTerm = '';
let episodeSearchTerm = '';

// ============================================================
//  DOM REFERENCIAS
// ============================================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const authSection = $('#authSection');
const mainSection = $('#mainSection');
const loginForm = $('#loginForm');
const registerForm = $('#registerForm');
const forgotPasswordForm = $('#forgotPasswordForm');
const charactersSection = $('#charactersSection');
const episodesSection = $('#episodesSection');
const charactersTableBody = $('#charactersTableBody');
const episodesTableBody = $('#episodesTableBody');
const characterSearch = $('#characterSearch');
const episodeSearch = $('#episodeSearch');
const charPageInfo = $('#charPageInfo');
const episodePageInfo = $('#episodePageInfo');
const charPrevPage = $('#charPrevPage');
const charNextPage = $('#charNextPage');
const episodePrevPage = $('#episodePrevPage');
const episodeNextPage = $('#episodeNextPage');
const userNameDisplay = $('#userNameDisplay');
const detailModal = $('#detailModal');
const editModal = $('#editModal');
const detailContent = $('#detailContent');
const editForm = $('#editForm');
const editFields = $('#editFields');
const notification = $('#notification');
const themeToggle = $('#themeToggle');

// ============================================================
//  AUTHENTICATION
// ============================================================
// Usuarios simulados (en memoria)
let users = JSON.parse(localStorage.getItem('rickmorty_users')) || [];

function saveUsers() {
    localStorage.setItem('rickmorty_users', JSON.stringify(users));
}

function showAuth() {
    authSection.style.display = 'flex';
    mainSection.classList.add('hidden');
}

function showMain() {
    authSection.style.display = 'none';
    mainSection.classList.remove('hidden');
}

// Login
$('#loginFormElement').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value.trim();

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        userNameDisplay.textContent = user.name;
        showMain();
        loadCharacters();
        showNotification('✅ ¡Bienvenido ' + user.name + '!', 'success');
    } else {
        showNotification('❌ Credenciales incorrectas', 'error');
    }
});

// Register
$('#registerFormElement').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#registerName').value.trim();
    const email = $('#registerEmail').value.trim();
    const password = $('#registerPassword').value.trim();
    const confirm = $('#registerConfirmPassword').value.trim();

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
    toggleAuthForms('login');
});

// Show/Hide forms
function toggleAuthForms(form) {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    forgotPasswordForm.classList.remove('active');
    if (form === 'login') loginForm.classList.add('active');
    else if (form === 'register') registerForm.classList.add('active');
    else if (form === 'forgot') forgotPasswordForm.classList.add('active');
}

$('#showRegister').addEventListener('click', () => toggleAuthForms('register'));
$('#showLogin').addEventListener('click', () => toggleAuthForms('login'));
$('#showForgotPassword').addEventListener('click', () => toggleAuthForms('forgot'));
$('#showLoginFromForgot').addEventListener('click', () => toggleAuthForms('login'));

// Forgot Password
$('#forgotPasswordFormElement').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#forgotEmail').value.trim();
    const user = users.find(u => u.email === email);
    if (user) {
        showNotification('📧 Se ha enviado un enlace a tu correo (simulado)', 'success');
    } else {
        showNotification('❌ No se encontró ese correo', 'error');
    }
});

// Logout
$('#logoutBtn').addEventListener('click', () => {
    currentUser = null;
    showAuth();
    showNotification('👋 Sesión cerrada', 'success');
});

// ============================================================
//  NAVEGACIÓN
// ============================================================
$('#navCharacters').addEventListener('click', () => {
    currentPage = 'characters';
    $('#navCharacters').classList.add('active');
    $('#navEpisodes').classList.remove('active');
    charactersSection.classList.remove('hidden');
    episodesSection.classList.add('hidden');
    loadCharacters();
});

$('#navEpisodes').addEventListener('click', () => {
    currentPage = 'episodes';
    $('#navEpisodes').classList.add('active');
    $('#navCharacters').classList.remove('active');
    episodesSection.classList.remove('hidden');
    charactersSection.classList.add('hidden');
    loadEpisodes();
});

// ============================================================
//  THEME TOGGLE
// ============================================================
let currentTheme = localStorage.getItem('rickmorty_theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    currentTheme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('rickmorty_theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});

// ============================================================
//  API FUNCTIONS
// ============================================================
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la API');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        // Intentar usar caché (Service Worker)
        showNotification('⚠️ Modo offline - usando datos en caché', 'error');
        return null;
    }
}

// ============================================================
//  CHARACTERS
// ============================================================
async function loadCharacters() {
    const search = characterSearchTerm ? `&name=${encodeURIComponent(characterSearchTerm)}` : '';
    const url = `${API_BASE}/character?page=${charactersPage}${search}`;
    const data = await fetchAPI(url);
    
    if (data && data.results) {
        charactersData = data.results;
        totalCharactersPages = data.info.pages;
        renderCharacters();
        updatePagination('characters');
    } else if (data === null) {
        // Modo offline - usar localStorage
        const cached = localStorage.getItem('rickmorty_characters');
        if (cached) {
            charactersData = JSON.parse(cached);
            renderCharacters();
        }
    }
}

function renderCharacters() {
    const sorted = [...charactersData];
    sorted.sort((a, b) => {
        let valA = a[sortCharacter.field] || '';
        let valB = b[sortCharacter.field] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortCharacter.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortCharacter.direction === 'asc' ? 1 : -1;
        return 0;
    });

    charactersTableBody.innerHTML = sorted.map(char => `
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

    // Guardar en caché
    localStorage.setItem('rickmorty_characters', JSON.stringify(charactersData));
}

function viewCharacter(id) {
    const char = charactersData.find(c => c.id === id);
    if (!char) return;

    detailContent.innerHTML = `
        <div class="detail-card">
            <img src="${char.image}" alt="${char.name}" />
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
    detailModal.classList.remove('hidden');
}

function editCharacter(id) {
    const char = charactersData.find(c => c.id === id);
    if (!char) return;

    editFields.innerHTML = `
        <input type="hidden" id="editId" value="${char.id}" />
        <input type="text" id="editName" value="${char.name}" placeholder="Nombre" required />
        <input type="text" id="editSpecies" value="${char.species}" placeholder="Especie" required />
        <select id="editGender">
            <option value="Male" ${char.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${char.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Genderless" ${char.gender === 'Genderless' ? 'selected' : ''}>Genderless</option>
            <option value="Unknown" ${char.gender === 'Unknown' ? 'selected' : ''}>Unknown</option>
        </select>
        <input type="text" id="editType" value="${char.type || ''}" placeholder="Tipo" />
        <select id="editStatus">
            <option value="Alive" ${char.status === 'Alive' ? 'selected'}