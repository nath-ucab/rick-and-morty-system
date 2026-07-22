// ===== Episodes Module =====
const Episodes = {
    apiBase: 'https://rickandmortyapi.com/api/episode',
    episodes: [],
    filteredEpisodes: [],
    currentPage: 1,
    totalPages: 1,
    sortField: null,
    sortDirection: 'asc',
    searchTerm: '',
    isLoading: false,
    cacheKey: 'rickmorty_episodes_cache',
    cacheTimestamp: 'rickmorty_episodes_timestamp',
    cacheTTL: 3600000, // 1 hour

    init() {
        this.loadEpisodes();
        this.setupEventListeners();
    },

    async loadEpisodes(page = 1) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.currentPage = page;

        // Check cache
        const cached = this.getCache();
        if (cached && cached.length > 0) {
            this.episodes = cached;
            this.filterEpisodes();
            this.isLoading = false;
            this.renderTable();
            this.renderPagination();
        }

        try {
            const url = `${this.apiBase}?page=${page}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            this.episodes = data.results;
            this.totalPages = data.info.pages;
            
            this.setCache(this.episodes);
            this.filterEpisodes();
            this.renderTable();
            this.renderPagination();
        } catch (error) {
            console.error('Error loading episodes:', error);
            if (!cached || cached.length === 0) {
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
            console.warn('Could not cache episode data:', e);
        }
    },

    loadBackupData() {
        this.episodes = [
            { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01' },
            { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02' },
            { id: 3, name: 'Anatomy Park', air_date: 'December 16, 2013', episode: 'S01E03' },
            { id: 4, name: 'M. Night Shaym-Aliens!', air_date: 'December 23, 2013', episode: 'S01E04' },
            { id: 5, name: 'Meeseeks and Destroy', air_date: 'December 30, 2013', episode: 'S01E05' }
        ];
        this.totalPages = 1;
        this.filterEpisodes();
        this.renderTable();
        this.renderPagination();
    },

    filterEpisodes() {
        let filtered = [...this.episodes];
        
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(e => 
                e.name.toLowerCase().includes(term)
            );
        }
        
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
        
        this.filteredEpisodes = filtered;
    },

    setupEventListeners() {
        document.getElementById('episodeSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.trim();
            this.filterEpisodes();
            this.renderTable();
        });

        document.querySelectorAll('#episodesTable th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.dataset.sort;
                if (this.sortField === field) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = field;
                    this.sortDirection = 'asc';
                }
                document.querySelectorAll('#episodesTable th').forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                th.classList.add(this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
                
                this.filterEpisodes();
                this.renderTable();
            });
        });
    },

    renderTable() {
        const tbody = document.getElementById('episodesTableBody');
        if (!tbody) return;

        if (this.filteredEpisodes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No se encontraron episodios.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.filteredEpisodes.map(ep => `
            <tr>
                <td>${ep.id}</td>
                <td><strong>${ep.name}</strong></td>
                <td>${ep.air_date || 'Desconocida'}</td>
                <td>${ep.episode || '-'}</td>
                <td>
                    <div class="action-group">
                        <button class="btn-action btn-view" data-id="${ep.id}" data-action="view">Ver</button>
                        <button class="btn-action btn-edit" data-id="${ep.id}" data-action="edit">Editar</button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('[data-action="view"]').forEach(btn => {
            btn.addEventListener('click', () => this.viewEpisode(parseInt(btn.dataset.id)));
        });
        tbody.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', () => this.editEpisode(parseInt(btn.dataset.id)));
        });
    },

    renderPagination() {
        const container = document.getElementById('episodesPagination');
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
                if (page === 'prev') this.loadEpisodes(this.currentPage - 1);
                else if (page === 'next') this.loadEpisodes(this.currentPage + 1);
                else this.loadEpisodes(parseInt(page));
            });
        });
    },

    async viewEpisode(id) {
        try {
            let episode = this.episodes.find(e => e.id === id);
            if (!episode) {
                const response = await fetch(`${this.apiBase}/${id}`);
                if (!response.ok) throw new Error('Episode not found');
                episode = await response.json();
            }
            this.showEpisodeDetail(episode);
        } catch (error) {
            console.error('Error loading episode:', error);
            this.showNotification('Error al cargar el episodio.', 'error');
        }
    },

    showEpisodeDetail(episode) {
        const modal = document.getElementById('detailModal');
        const body = document.getElementById('modalBody');
        
        const charactersList = episode.characters?.slice(0, 5).map(url => {
            const id = url.split('/').pop();
            const character = window.Characters?.characters?.find(c => c.id === parseInt(id));
            return character ? character.name : `Personaje ${id}`;
        }).join(', ') || 'No disponibles';

        body.innerHTML = `
            <h2>${episode.name}</h2>
            <div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">${episode.id}</span></div>
            <div class="detail-row"><span class="detail-label">Fecha de Emisión</span><span class="detail-value">${episode.air_date || 'Desconocida'}</span></div>
            <div class="detail-row"><span class="detail-label">Código</span><span class="detail-value">${episode.episode || '-'}</span></div>
            <div class="detail-row"><span class="detail-label">Personajes</span><span class="detail-value">${charactersList}</span></div>
            <div class="detail-row"><span class="detail-label">Total Personajes</span><span class="detail-value">${episode.characters?.length || 0}</span></div>
            <div style="margin-top:1rem;display:flex;gap:0.8rem;">
                <button class="btn-action btn-edit" id="detailEditBtn">✏️ Editar</button>
                <button class="btn-action btn-cancel" id="detailCloseBtn">Cerrar</button>
            </div>
            <div id="editFormContainer"></div>
        `;

        modal.classList.add('show');

        document.getElementById('detailEditBtn').addEventListener('click', () => {
            this.showEditForm(episode);
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

    showEditForm(episode) {
        const container = document.getElementById('editFormContainer');
        container.innerHTML = `
            <form class="edit-form" id="episodeEditForm">
                <input type="text" id="editName" value="${episode.name}" placeholder="Nombre" required>
                <input type="text" id="editAirDate" value="${episode.air_date || ''}" placeholder="Fecha de Emisión">
                <input type="text" id="editCode" value="${episode.episode || ''}" placeholder="Código">
                <div class="edit-actions">
                    <button type="submit" class="btn-action btn-save">💾 Guardar</button>
                    <button type="button" class="btn-action btn-cancel" id="editCancelBtn">Cancelar</button>
                </div>
            </form>
        `;

        document.getElementById('episodeEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const updated = {
                ...episode,
                name: document.getElementById('editName').value.trim(),
                air_date: document.getElementById('editAirDate').value.trim(),
                episode: document.getElementById('editCode').value.trim()
            };
            
            const index = this.episodes.findIndex(e => e.id === episode.id);
            if (index !== -1) {
                this.episodes[index] = updated;
                this.setCache(this.episodes);
                this.filterEpisodes();
                this.renderTable();
                this.showEpisodeDetail(updated);
                this.showNotification('Episodio actualizado correctamente.', 'success');
            }
        });

        document.getElementById('editCancelBtn').addEventListener('click', () => {
            container.innerHTML = '';
        });
    },

    editEpisode(id) {
        this.viewEpisode(id);
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

window.Episodes = Episodes;