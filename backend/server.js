import express from 'express';
import cors from 'cors';
import tasksRoute from './routes/tasksRoute.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRoute);

app.listen(PORT, () => {
    console.log(`Servidor de Task Manager API corriendo al 100 en http://localhost:${PORT}`);
});
