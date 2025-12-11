require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'nierodka_secret_key_change_me';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large save data

// Database Connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nierodka_db'
};

let pool;

async function initDB() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Database pool created');
    } catch (err) {
        console.error('Failed to create DB pool:', err);
    }
}

initDB();

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Brak tokenu' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token nieprawidłowy' });
        req.user = user;
        next();
    });
};

// --- ENDPOINTS ---

// REGISTER
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
    }

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hash]
        );

        // Generate Token
        const token = jwt.sign({ id: result.insertId, username }, SECRET_KEY, { expiresIn: '7d' });

        res.json({ message: 'Zarejestrowano pomyślnie', token, user: { id: result.insertId, username, email } });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Użytkownik lub email już istnieje' });
        }
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body; // username can be email too logically, but simplified here
    if (!username || !password) {
        return res.status(400).json({ error: 'Wymagany login i hasło' });
    }

    try {
        // Find user
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
        }

        const user = rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
        }

        // Generate Token
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '7d' });

        // Return token and save data
        let saveData = null;
        if (user.save_data) {
            try {
                saveData = JSON.parse(user.save_data);
            } catch (e) {
                console.error("Failed to parse save data", e);
            }
        }

        res.json({
            message: 'Zalogowano',
            token,
            user: { id: user.id, username: user.username, email: user.email },
            saveData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// SAVE
app.post('/api/save', authenticateToken, async (req, res) => {
    const { saveData } = req.body;
    if (!saveData) return res.status(400).json({ error: 'Brak danych zapisu' });

    try {
        const jsonString = JSON.stringify(saveData);
        await pool.execute(
            'UPDATE users SET save_data = ? WHERE id = ?',
            [jsonString, req.user.id]
        );
        res.json({ message: 'Zapisano' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd zapisu' });
    }
});

// LOAD
app.get('/api/load', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT save_data FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

        let saveData = null;
        if (rows[0].save_data) {
            saveData = JSON.parse(rows[0].save_data);
        }

        res.json({ saveData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd wczytywania' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
