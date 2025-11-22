const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // ajuste se seu MySQL tiver outro usuário
  password: '0000',      // coloque sua senha do MySQL
  database: 'Usuarios'
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'segredo123', (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next();
  })
}

app.get('/user-details', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT Username, Email FROM Users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err || results.length === 0){
        return res.sendStatus(404).json({error: 'Detalhes do usuário não encontrados'})
      }

      const userDetails = results[0]

      res.json(userDetails);
    }
  )
} )

// rota de cadastro
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)',
    [username, email, hash],
    (err) => {
      if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
      res.json({ message: 'Usuário cadastrado com sucesso!' });
    }
  );
});

// rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Usuário não encontrado' });

    const user = results[0];
    const valid = bcrypt.compareSync(password, user.PasswordHash);
    if (!valid) return res.status(400).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, 'segredo123', { expiresIn: '1h' });
    res.json({ token });
  });
});

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
