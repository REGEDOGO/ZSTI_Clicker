require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large save data
app.use('/uploads', express.static('uploads'));

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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

// --- ENDPOINTS ---

// UPDATE USERNAME
app.post('/api/update-username', async (req, res) => {
    const { userId, newUsername } = req.body;
    if (!userId || !newUsername) {
        return res.status(400).json({ error: 'Brak danych' });
    }

    try {
        await pool.execute(
            'UPDATE users SET username = ? WHERE id = ?',
            [newUsername, userId]
        );
        res.json({ message: 'Nazwa użytkownika zaktualizowana' });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Nazwa użytkownika zajęta' });
        }
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

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

        res.json({ message: 'Zarejestrowano pomyślnie', userId: result.insertId });
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
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Wymagany login i hasło' });
    }

    try {
        // Find user by username OR email (optional per request)
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Błędne hasło lub użytkownik' });
        }

        const user = rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Błędne hasło' });
        }

        // Return user object and latest save data
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
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.avatar_url,
                banner_url: user.banner_url
            },
            saveData
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// SAVE (Accepts userId, saveData)
app.post('/api/save', async (req, res) => {
    const { userId, saveData } = req.body;
    if (!userId || !saveData) return res.status(400).json({ error: 'Brak danych' });

    try {
        const jsonString = JSON.stringify(saveData);
        await pool.execute(
            'UPDATE users SET save_data = ? WHERE id = ?',
            [jsonString, userId]
        );
        res.json({ message: 'Zapisano' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd zapisu' });
    }
});

// LOAD (GET /api/load/:userId)
app.get('/api/load/:userId', async (req, res) => {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'Brak ID użytkownika' });

    try {
        const [rows] = await pool.execute(
            'SELECT save_data FROM users WHERE id = ?',
            [userId]
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

// GET USER PROFILE
app.get('/api/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, email, avatar_url, banner_url FROM users WHERE id = ?',
            [userId]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'Nie znaleziono' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// UPLOAD AVATAR
app.post('/api/upload-avatar', upload.single('avatar'), async (req, res) => {
    const userId = req.body.userId;
    if (!req.file || !userId) return res.status(400).json({ error: 'Brak pliku lub ID' });

    const fileUrl = `/uploads/${req.file.filename}`;
    try {
        await pool.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [fileUrl, userId]);
        res.json({ message: 'Avatar zaktualizowany', url: fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd bazy danych' });
    }
});

// UPLOAD BANNER
app.post('/api/upload-banner', upload.single('banner'), async (req, res) => {
    const userId = req.body.userId;
    if (!req.file || !userId) return res.status(400).json({ error: 'Brak pliku lub ID' });

    const fileUrl = `/uploads/${req.file.filename}`;
    try {
        await pool.execute('UPDATE users SET banner_url = ? WHERE id = ?', [fileUrl, userId]);
        res.json({ message: 'Baner zaktualizowany', url: fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd bazy danych' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
