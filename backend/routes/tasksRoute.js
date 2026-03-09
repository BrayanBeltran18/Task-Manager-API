import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ruta absoluta al archivo JSON
const dataFilePath = path.join(process.cwd(), 'data', 'tasks.json');

function readTasks() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o está vacío, devuelve un arreglo vacío
        return [];
    }
}

function writeTasks(tasks) {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2), 'utf8');
}

// Generador de ID auto-incremental
function generateNextId(tasks) {
    if (tasks.length === 0) return 1;
    const maxId = Math.max(...tasks.map(t => t.id));
    return maxId + 1;
}

// GET - Obtener todas las tareas
router.get('/', (req, res) => {
    const tasks = readTasks();
    res.status(200).json(tasks);
});

// POST - Crear nueva tarea
router.post('/', (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: "El título es vacío o inválido" });
    }

    const tasks = readTasks();

    const newTask = {
        id: generateNextId(tasks),
        title: title.trim(),
        completed: false // Toda nueva tarea entra como pendiente por defecto
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
});

// PUT/PATCH - Marcar tarea como completada (Lógica Máximo 5 Completadas)
router.patch('/:id/complete', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let tasks = readTasks();

    // Encontrar la tarea
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Marcar como completada
    tasks[taskIndex].completed = true;

    // Lógica del Límite de 5 Tareas Completadas
    const completedTasks = tasks.filter(t => t.completed);

    if (completedTasks.length > 5) {
        // Encontrar la tarea completada más antigua
        const oldestCompletedTask = tasks.find(t => t.completed);
        // Filtrar el arreglo general para quitar esa tarea más antigua
        tasks = tasks.filter(t => t.id !== oldestCompletedTask.id);
    }

    writeTasks(tasks);
    res.status(200).json(tasks[taskIndex]);
});

// DELETE - Eliminar tarea por id
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let tasks = readTasks();
    const initialLength = tasks.length;

    tasks = tasks.filter(task => task.id !== id);

    if (tasks.length < initialLength) {
        writeTasks(tasks);
        res.status(200).json({ message: "Tarea eliminada correctamente" });
    } else {
        res.status(404).json({ error: "Tarea no encontrada" });
    }
});

export default router;
