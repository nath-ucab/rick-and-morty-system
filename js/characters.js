// ===== Characters Module =====
const Characters = {
    apiBase: 'https://rickandmortyapi.com/api/character',
    characters: [],
    filteredCharacters: [],
    currentPage: 1,
    totalPages: 1,
    sortField: null,
    sortDirection: 'asc',
    searchTerm: '',
    isLoading: false,
    cacheKey: 'rickmorty_characters_cache',
    cacheTimestamp: 'rickmorty_characters_timestamp',
    cacheTTL: 3600000, // 1 hour

    init() {
        this.loadCharacters();
        this.setupEventListeners();
    },

    async loadCharacters(page = 1) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.currentPage = page;

        // Check cache first
        const cached = this.getCache();
        if (cached && cached.length > 0) {
            this.characters = cached;
            this.filterCharacters();
            this.isLoading = false;
            this.renderTable();
            this.renderPagination();
        }

        try {
            const url = `${this.apiBase}?page=${page}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            // Store only the results, we'll handle pagination separately
            this.characters = data.results;
            this.totalPages = data.info.pages;
            
            // Save to cache
            this.setCache(this.characters);
            
            this.filterCharacters();
            this.renderTable();
            this.renderPagination();
        } catch (error) {
            console.error('Error loading characters:', error);
            // If cache exists, we already showed it
            if (!cached || cached.length === 0) {
                this.showNotification('Error al cargar personajes. Usando datos de respaldo.', 'error');
                this.loadBackupData();
            }
        } finally {
            this.isLoading = false;
        }
    },

    getCache() {
        try {
            const timestamp = localStorage.getItem(this.cacheTimestamp);
            if (timestamp) {
                const age = Date.now() - parseInt(timestamp);
                if (age > this.cacheTTL) {
                    localStorage.removeItem(this.cacheKey);
                    localStorage.removeItem(this.cacheTimestamp);
                    return null;
                }
            }
            const data = localStorage.getItem(this.cacheKey);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    },

    setCache(data) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
            localStorage.setItem(this.cacheTimestamp, Date.now().toString());
        } catch (e) {
            console.warn('Could not cache data:', e);
        }
    },

    loadBackupData() {
        // Sample backup data
        this.characters = [
            { id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', type: '', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg' },
            { id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', type: '', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg' },
            { id: 3, name: 'Summer Smith', status: 'Alive', species: 'Human', type: '', gender: 'Female', image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg' },
            { id: 4, name: 'Beth Smith', status: 'Alive', species: 'Human', type: '', gender: 'Female', image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg' },
            { id: 5, name: 'Jerry Smith', status: 'Alive', species: 'Human', type: '', gender: 'Male', image: 'https://rickandmortyapi.com/api/character/avatar/5.jpeg' }
        ];
        this.totalPages = 1;
        this.filterCharacters();
        this.renderTable();
        this.renderPagination();
    },

    filterCharacters() {
        let filtered = [...this.characters];
        
        // Apply search
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(c => 
                c.name.toLowerCase().includes(term)
            );
        }
        
        // Apply sort
        if (this.sortField) {
            filtered.sort((a, b) => {
                let valA = a[this.sortField] || '';
                let valB = b[this.sortField] || '';
                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();
                if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }
        
        this.filteredCharacters = filtered;
    },

    setupEventListeners() {
        // Search
        document.getElementById('characterSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.trim();
            this.filterCharacters();
            this.renderTable();
        });

        // Table headers for sorting
        document.querySelectorAll('#charactersTable th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.dataset.sort;
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortDirection = 'asc';
                }
                // Update header indicators
                document.querySelectorAll('#charactersTable th').forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                th.classList.add(this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
                
                this.filterCharacters();
                this.renderTable();
            });
        });
    },

    renderTable() {
        const tbody = document.getElementById('charactersTableBody');
        if (!tbody) return;

        if (this.filteredCharacters.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No se encontraron personajes.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.filteredCharacters.map(char => `
            <tr>
                <td>${char.id}</td>
                <td><strong>${char.name}</strong></td>
                <td>${char.species || 'Desconocido'}</td>
                <td>${char.gender || 'Desconocido'}</td>
                <td>${char.type || '-'}</td>
                <td>
                    <div class="action-group">
                        <button class="btn-action btn-view" data-id="${char.id}" data-action="view">Ver</button>
                        <button class="btn-action btn-edit" data-id="${char.id}" data-action="edit">Editar</button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners to action buttons
        tbody.querySelectorAll('[data-action="view"]').forEach(btn => {
            btn.addEventListener('click', () => this.viewCharacter(parseInt(btn.dataset.id)));
        });
        tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => this.editCharacter(parseInt(btn.dataset.id)));
        });
    },

    renderPagination() {
        const container = document.getElementById('charactersPagination');
        if (!container) return;
        
        let html = `
            <button ${this.currentPage <= 1 ? 'disabled' : ''} data-page="prev">←</button>
        `;
        
        const total = Math.min(this.totalPages, 10);
        const start = Math.max(1, this.currentPage - 4);
        const end = Math.min(this.totalPages, start + 9);
        
        if (start > 1) {
            html += `<button data-page="1">1</button>`;
            if (start > 2) html += `<span>…</span>`;
        }
        
        for (let i = start; i <= end; i++) {
            html += `<button data-page="${i}" class="${i === this.currentPage ? 'active-page' : ''}">${i}</button>`;
        }
        
        if (end < this.totalPages) {
            if (end < this.totalPages - 1) html += `<span>…</span>`;
            html += `<button data-page="${this.totalPages}">${this.totalPages}</button>`;
        }
        
        html += `
            <button ${this.currentPage >= this.totalPages ? 'disabled' : ''} data-page="next">→</button>
            <span>Página ${this.currentPage} de ${this.totalPages}</span>
        `;
        
        container.innerHTML = html;
        
        container.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                if (page === 'prev') this.loadCharacters(this.currentPage - 1);
                else if (page === 'next') this.loadCharacters(this.currentPage + 1);
                else this.loadCharacters(parseInt(page));
            });
        });
    },

    async viewCharacter(id) {
        try {
            // Try to find in current list
            let character = this.characters.find(c => c.id === id);
            if (!character) {
                // Fetch from API
                const response = await fetch(`${this.apiBase}/${id}`);
                if (!response.ok) throw new Error('Character not found');
                character = await response.json();
            }
            this.showCharacterDetail(character);
        } catch (error) {
            console.error('Error loading character:', error);
            this.showNotification('Error al cargar el personaje.', 'error');
        }
    },

    showCharacterDetail(character) {
        const modal = document.getElementById('detailModal');
        const body = document.getElementById('modalBody');
        
        body.innerHTML = `
            <h2>${character.name}</h2>
            <img src="${character.image || 'https://rickandmortyapi.com/api/character/avatar/placeholder.jpeg'}" alt="${character.name}" style="max-width:200px;border-radius:12px;display:block;margin:0 auto 1rem;">
            <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">${character.id}</span></div>
            <div class="detail-row"><span class="detail-label">Estado</span><span class="detail-value">${character.status || 'Desconocido'}</span></div>
            <div class="detail-row"><span class="detail-label">Especie</span><span class="detail-value">${character.species || 'Desconocido'}</span></div>
            <div class="detail-row"><span class="detail-label">Género</span><span class="detail-value">${character.gender || 'Desconocido'}</span></div>
            <div class="detail-row"><span class="detail-label">Tipo</span><span class="detail-value">${character.type || '-'}</span></div>
            <div class="detail-row"><span class="detail-label">Origen</span><span class="detail-value">${character.origin?.name || 'Desconocido'}</span></div>
            <div class="detail-row"><span class="detail-label">Ubicación</span><span class="detail-value">${character.location?.name || 'Desconocido'}</span></div>
            <div class="detail-row"><span class="detail-label">Episodios</span><span class="detail-value">${character.episode?.length || 0}</span></div>
            <div style="margin-top:1rem;display:flex;gap:0.8rem;">
                <button class="btn-action btn-edit" id="detailEditBtn">✏️ Editar</button>
                <button class="btn-action btn-cancel" id="detailCloseBtn">Cerrar</button>
            </div>
            <div id="editFormContainer"></div>
        `;

        modal.classList.add('show');

        document.getElementById('detailEditBtn').addEventListener('click', () => {
            this.showEditForm(character);
        });

        document.getElementById('detailCloseBtn').addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    },

    showEditForm(character) {
        const container = document.getElementById('editFormContainer');
        container.innerHTML = `
            <form class="edit-form" id="characterEditForm">
                <input type="text" id="editName" value="${character.name}" placeholder="Nombre" required>
                <input type="text" id="editSpecies" value="${character.species || ''}" placeholder="Especie">
                <input type="text" id="editGender" value="${character.gender || ''}" placeholder="Género">
                <input type="text" id="editType" value="${character.type || ''}" placeholder="Tipo">
                <input type="text" id="editStatus" value="${character.status || ''}" placeholder="Estado">
                <input type="text" id="editOrigin" value="${character.origin?.name || ''}" placeholder="Origen">
                <div class="edit-actions">
                    <button type="submit" class="btn-action btn-save">💾 Guardar</button>
                    <button type="button" class="btn-action btn-cancel" id="editCancelBtn">Cancelar</button>
                </div>
            </form>
        `;

        document.getElementById('characterEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const updated = {
                ...character,
                name: document.getElementById('editName').value.trim(),
                species: document.getElementById('editSpecies').value.trim(),
                gender: document.getElementById('editGender').value.trim(),
                type: document.getElementById('editType').value.trim(),
                status: document.getElementById('editStatus').value.trim(),
                origin: { name: document.getElementById('editOrigin').value.trim() || 'Unknown' }
            };
            
            // Update in local data
            const index = this.characters.findIndex(c => c.id === character.id);
            if (index !== -1) {
                this.characters[index] = updated;
                this.setCache(this.characters);
                this.filterCharacters();
                this.renderTable();
                // Update the detail view
                this.showCharacterDetail(updated);
                this.showNotification('Personaje actualizado correctamente.', 'success');
            }
        });

        document.getElementById('editCancelBtn').addEventListener('click', () => {
            container.innerHTML = '';
        });
    },

    editCharacter(id) {
        this.viewCharacter(id);
        // Small delay to let modal render, then open edit
        setTimeout(() => {
            const editBtn = document.getElementById('detailEditBtn');
            if (editBtn) editBtn.click();
        }, 300);
    },

    showNotification(message, type = 'info') {
        if (window.Auth) {
            window.Auth.showNotification(message, type);
        } else {
            console.log(message);
        }
    }
};

// Export for use in app.js
window.Characters = Characters;