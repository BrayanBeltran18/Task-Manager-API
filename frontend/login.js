const API_URL = 'https://task-manager-api-22ln.onrender.com/api/login';
// OJITO: Si el backend lo corres en local, usa: const API_URL = 'http://localhost:3000/api/login';

const loginForm = document.getElementById('login-form');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const errorAlert = document.getElementById('error-alert');
const btnSubmit = document.getElementById('btn-submit');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI state: loading
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
    errorAlert.classList.add('hidden');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                usuario: usuarioInput.value.trim(),
                password: passwordInput.value.trim()
            })
        });

        if (response.ok) {
            // Login exisoto, se guardó la cookie automáticamente
            // Redirigir al panel de control
            window.location.href = 'index.html';
        } else {
            // Mostrar error
            errorAlert.classList.remove('hidden');
            errorAlert.innerText = 'Usuario o contraseña incorrectos.';
        }
    } catch (error) {
        errorAlert.classList.remove('hidden');
        errorAlert.innerText = 'Problemas al conectar con el servidor.';
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>Entrar</span>';
    }
});
