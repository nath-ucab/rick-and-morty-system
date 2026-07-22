#  Rick and Morty System

Aplicación web interactiva para la gestión de personajes y episodios de la serie Rick and Morty, consumiendo la API oficial. Desarrollada con HTML5, CSS3 y JavaScript puro.

## Características

### Autenticación
- Inicio de sesión con validación de credenciales
- Registro de nuevos usuarios
- Recuperación de contraseña (simulada)
- Persistencia de sesión con localStorage

### Gestión de Personajes
- Visualización en tabla con ID, Nombre, Especie, Género y Tipo
- Búsqueda en tiempo real por nombre
- Ordenamiento ascendente/descendente por cualquier columna
- Detalle completo con fotografía
- Edición y guardado de datos

### Gestión de Episodios
- Visualización en tabla con ID, Nombre, Fecha y Código
- Búsqueda en tiempo real por nombre
- Ordenamiento ascendente/descendente por cualquier columna
- Detalle técnico completo
- Edición y guardado de datos

### UX/UI
- Modo Oscuro/Claro con variables CSS
- Diseño 100% Responsive para móviles, tablets y escritorio
- Modo Offline con Service Worker y caché
- Notificaciones visuales para acciones del usuario
- Paginación para navegación eficiente

## Tecnologías

| Tecnología | Descripción |
|------------|-------------|
| HTML5 | Estructura semántica de la aplicación |
| CSS3 | Estilos con variables CSS para tematización |
| JavaScript (ES6+) | Lógica de negocio y consumo de API |
| Service Worker | Soporte offline y caché |
| LocalStorage | Persistencia de datos y sesión |
| Rick and Morty API | Fuente de datos oficial |

## Instalación

```bash
git clone https://github.com/nath-ucab/rick-and-morty-system.git
cd rick-and-morty-system