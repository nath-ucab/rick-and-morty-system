#  Rick and Morty System

Aplicación web interactiva que consume la API de Rick and Morty. Permite explorar personajes y episodios de la serie con funcionalidades de búsqueda, ordenamiento, edición y modo offline.

---

##  Demo

🔗 [Ver aplicación en vivo](https://nath-ucab.github.io/rick-morty-system/)

---

## Características

###  Autenticación
- Inicio de sesión con validación de credenciales
- Registro de nuevos usuarios
- Recuperación de contraseña (simulada)

###  Gestión de Personajes
- Tabla con ID, Nombre, Especie, Género y Tipo
- Búsqueda en tiempo real por nombre
- Ordenamiento ascendente/descendente por cualquier columna
- Vista detallada de cada personaje con foto
- Edición de datos del personaje

###  Gestión de Episodios
- Tabla con ID, Nombre, Fecha de emisión y Código
- Búsqueda en tiempo real por nombre
- Ordenamiento ascendente/descendente por cualquier columna
- Vista detallada de cada episodio
- Edición de datos del episodio

###  Experiencia de Usuario
- **Modo Oscuro/Claro** con selector de temas
- **Diseño Responsive** adaptable a móviles, tablets y escritorio
- **Modo Offline** con Service Worker y caché
- Notificaciones en tiempo real

---

## Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos con variables CSS y diseño responsivo
- **JavaScript (Vanilla)** - Lógica de la aplicación
- **API de Rick and Morty** - Datos de personajes y episodios
- **Service Worker** - Funcionalidad offline
- **LocalStorage** - Persistencia de datos (usuarios y caché)

---

##  Instalación y uso local

### 1. Clonar el repositorio
```bash
git clone https://github.com/nath-ucab/rick-morty-system.git
cd rick-morty-system