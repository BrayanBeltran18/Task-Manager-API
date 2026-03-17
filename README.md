# Task Manager API

El objetivo del proyecto es tener una API Restful real (Backend) separada del Dashboard visual (Frontend), comunicándose entre sí mediante peticiones HTTP.

**Enlaces en Producción:**
- **Frontend (UI):** [Hosteado en Netlify](https://taskmanagerapibcb.netlify.app/)
- **Backend (API):** [Hosteado en Render](https://task-manager-api-22ln.onrender.com/tasks)

## Tecnologías Utilizadas

*   **Backend (La API):** Node.js y Express.js
*   **Base de Datos:** Persistencia en sistema de archivos (Módulo `fs` + `tasks.json`)
*   **Frontend (La UI):** HTML5, Vanilla JavaScript (API Fetch)
*   **Diseño Visual:** Tailwind CSS (Vía CDN)

## Características Principales

*   **Arquitectura Desacoplada:** El frontend y el backend viven en carpetas separadas.
*   **Autenticación y Seguridad:** Implementación de JSON Web Tokens (JWT) para proteger la API REST. Uso de **cookies `httpOnly`** y políticas CORS para mitigar el riesgo de vulnerabilidades XSS y asegurar la sesión.
*   **Persistencia de Datos:** Las tareas sobreviven a reinicios de la computadora gracias a `tasks.json`.
*   **Sistema de "Logros" (Límite dinámico):** Las tareas completadas se anclan en una sección dedicada hasta un máximo de 5.
*   **Responsive Design:** La interfaz se adapta perfectamente a dispositivos móviles y monitores ultra anchos utilizando Tailwind CSS.

> **Credenciales de Prueba en Producción:**
> Para evaluar el proyecto hosteado, la pantalla principal te solicitará iniciar sesión.
> **Usuario:** `admin` | **Contraseña:** `pedri8`

---

## Instrucciones de Instalación y Uso

Para ejecutar este proyecto en tu computadora de forma local, debes inicializar el backend primero y luego abrir el frontend.

### Paso 1: Levantar el Servidor Backend

1. Abre tu terminal de comandos.
2. Navega hasta la carpeta del backend:
   ```bash
   cd backend
   ```
3. Instala las dependencias de Node.js (Solo la primera vez):
   ```bash
   npm install
   ```
4. Inicia el servidor de la API:
   ```bash
   npm run start
   ```
> Deberías ver un mensaje indicando que el servidor corre en `http://localhost:3000`. **No cierres esta terminal**.

### Paso 2: Abrir el Frontend

Con el backend funcionando, ahora puedes consumir los datos desde la interfaz de usuario.
1. Abre tu explorador de archivos de Windows.
2. Navega a la carpeta `/frontend`.
3. Haz doble click sobre el archivo `index.html` para abrirlo en tu navegador web de preferencia.
4. (Opcional): Si usas VS Code, puedes abrir `index.html` usando la extensión **Live Server**.
