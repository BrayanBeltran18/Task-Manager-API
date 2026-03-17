import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import tasksRoute from './routes/tasksRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key_123';

// Configuración CORS ajustada para permitir cookies (credentials)
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); // Para poder leer cookies

// Endpoint de Login
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;

    // Validación mock con credenciales del usuario
    if (usuario === 'admin' && password === 'pedri8') {
        // Firmar token válido por 1 hora
        const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '1h' });

        // Establecer la cookie httpOnly
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000
        });

        return res.status(200).json({ message: "Login exitoso" });
    }

    return res.status(401).json({ error: "Credenciales inválidas" });
});

// Middleware de Seguridad
const verifyToken = (req, res, next) => {
    // Extraer la cookie llamada "token"
    const token = req.cookies.token;

    if (!token) {
        // Bloquear el paso de inmediato si no hay gafete
        return res.status(401).json({ error: "Acceso denegado. No se encontró ninguna sesión activa." });
    }

    try {
        // Intentar leer y validar la firma usando el secreto del servidor
        const decodificado = jwt.verify(token, SECRET_KEY);

        // Adjuntar quién es el usuario a la petición
        req.usuario = decodificado.usuario;

        // El usuario es legítimo
        next();
    } catch (error) {
        // Ejecutado si el token expiró (pasó 1h) o si fue manipulado
        return res.status(401).json({ error: "El token JWT provisto es inválido o se ha vencido." });
    }
};

// Aplicar a todas las rutas que empiecen por /tasks
app.use('/tasks', verifyToken, tasksRoute);

app.listen(PORT, () => {
    console.log(`Servidor de Task Manager API corriendo al 100 en http://localhost:${PORT}`);
});
