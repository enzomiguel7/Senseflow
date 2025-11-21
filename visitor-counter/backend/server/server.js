const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'Usuarios'
});

// Cadastro de usuário
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  db.query('INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)',
    [username, email, hash],
    (err) => err ? res.status(500).json({ error: 'Erro ao cadastrar usuário' }) : res.json({ message: 'Usuário cadastrado com sucesso!' })
  );
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Usuário não encontrado' });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.PasswordHash)) return res.status(400).json({ error: 'Senha inválida' });

    const token = jwt.sign({ id: user.id }, 'segredo123', { expiresIn: '1h' });
    res.json({ token });
  });
});

// 🔥 Deletar conta de usuário
app.delete('/delete-account/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM Users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao excluir a conta.' });
    }

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

    res.json({ message: 'Conta excluída com sucesso!' });
  });
});

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
