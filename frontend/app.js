const API_URL = 'http://localhost:3000/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');
const errorMessage = document.getElementById('error-message');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

document.addEventListener('DOMContentLoaded', fetchTasks);
taskForm.addEventListener('submit', handleAddTask);

// GET - Cargar todas las tareas
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener tareas');

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error(error);
        showError("No se pudo conectar al servidor. Asegúrate de que el Backend esté corriendo.");
    }
}

// POST - Crear nueva tarea
async function createTask(title) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (!response.ok) throw new Error('Error al crear la tarea');
        fetchTasks();
    } catch (error) {
        console.error(error);
        showError("No se pudo guardar la tarea.");
    }
}

// PATCH - Marcar como completada
async function completeTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}/complete`, {
            method: 'PATCH'
        });

        if (!response.ok) throw new Error('Error al completar la tarea');
        fetchTasks();
    } catch (error) {
        console.error(error);
        showError("No se pudo completar la tarea.");
    }
}

// DELETE - Eliminar tarea
async function deleteTask(id, liElement) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar la tarea');

        liElement.style.opacity = '0';
        liElement.style.transform = 'translateY(10px)';

        setTimeout(() => {
            fetchTasks();
        }, 300);

    } catch (error) {
        console.error(error);
        showError("No se pudo eliminar la tarea.");
    }
}


// Funciones de la Interfaz (DOM)
function handleAddTask(event) {
    event.preventDefault();
    const title = taskInput.value.trim();

    if (title === "") {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');
    createTask(title);
    taskInput.value = "";
}

function renderTasks(tasks) {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    // Filtrar listas visuales
    const pendingTasks = tasks.filter(t => !t.completed);
    const completeds = tasks.filter(t => t.completed);

    // Actualizar Contadores
    pendingCount.textContent = pendingTasks.length;
    completedCount.textContent = `${completeds.length}/5`;

    // Render Pendientes
    if (pendingTasks.length === 0) {
        pendingEmpty.classList.remove('hidden');
    } else {
        pendingEmpty.classList.add('hidden');
        pendingTasks.forEach(task => appendPendingTask(task));
    }

    // Render Completadas
    if (completeds.length === 0) {
        completedEmpty.classList.remove('hidden');
    } else {
        completedEmpty.classList.add('hidden');
        completeds.forEach(task => appendCompletedTask(task));
    }
}

function appendPendingTask(task) {
    const li = document.createElement('li');
    li.className = "flex items-center justify-between p-3.5 bg-white rounded-xl shadow-sm border border-slate-200 transition-all hover:border-blue-300 hover:shadow-md fade-in group";

    li.innerHTML = `
        <div class="flex items-center gap-3 overflow-hidden">
            <button onclick="completeTask(${task.id})" class="text-slate-300 hover:text-green-500 transition-colors flex-shrink-0" title="Marcar como completada">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            <span class="text-sm font-medium text-slate-700 truncate" title="${escapeHTML(task.title)}">${escapeHTML(task.title)}</span>
        </div>
        <button 
            onclick="deleteTask(${task.id}, this.parentElement)"
            class="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
            title="Eliminar permanentemente"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    pendingList.appendChild(li);
}

function appendCompletedTask(task) {
    const li = document.createElement('li');
    li.className = "flex items-center justify-between p-3.5 bg-slate-50 opacity-80 rounded-xl shadow-sm border border-slate-200 transition-all hover:opacity-100 fade-in group";

    li.innerHTML = `
        <div class="flex items-center gap-3 overflow-hidden">
            <div class="text-green-500 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
            </div>
            <span class="text-sm font-medium completed-strike truncate" title="${escapeHTML(task.title)}">${escapeHTML(task.title)}</span>
        </div>
        <button 
            onclick="deleteTask(${task.id}, this.parentElement)"
            class="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
            title="Eliminar permanentemente"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
        </button>
    `;
    completedList.prepend(li); // Mostrar la completada más nueva arriba
}

function showError(msg) {
    errorMessage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        ${msg}
    `;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 4000);
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
}
