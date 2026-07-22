// ===== Main Application =====
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const sections = {
        characters: document.getElementById('charactersSection'),
        episodes: document.getElementById('episodesSection'),
        profile: document.getElementById('profileSection')
    };

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = link.dataset.page;
            
            navLinks.forEach(function(l) {
                l.classList.remove('active');
            });
            link.classList.add('active');
            
            Object.keys(sections).forEach(function(key) {
                sections[key].classList.remove('active');
            });
            if (sections[page]) {
                sections[page].classList.add('active');
            }
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    let currentTheme = localStorage.getItem('rickmorty_theme') || 'light';
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('rickmorty_theme', theme);
        currentTheme = theme;
    }
    
    setTheme(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });

        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
            });
        });
    }

    // Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(function(error) {
                console.log('Error al registrar Service Worker:', error);
            });
    }

    console.log('🪐 Rick and Morty System iniciado correctamente.');
});