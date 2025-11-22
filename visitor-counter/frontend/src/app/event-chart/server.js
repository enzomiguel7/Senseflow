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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // 💡 CORREÇÃO CRÍTICA: deve ser split(' ') com espaço
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'segredo123', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/user-details', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.query(
    'SELECT Username, Email FROM Users WHERE id = ?', // Vírgula no lugar certo
    [userId],
    (err, results) => {
      if (err) {
          console.error("Erro no BD ao buscar usuário:", err);
          return res.status(500).json({ error: 'Erro interno do servidor' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Detalhes do usuário não encontrados' }); 
      }

      const userDetails = results[0];
      res.json(userDetails); 
    }
  );
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

// 🔑 Alterar senha do usuário
app.put('/change-password/:id', (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Buscar a senha atual do usuário
  db.query('SELECT PasswordHash FROM Users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar usuário.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = results[0];

    // Verificar se a senha atual está correta
    if (!bcrypt.compareSync(currentPassword, user.PasswordHash)) {
      return res.status(400).json({ message: 'Senha atual incorreta.' });
    }

    // Hash da nova senha
    const newHash = bcrypt.hashSync(newPassword, 10);

    // Atualizar a senha no banco
    db.query('UPDATE Users SET PasswordHash = ? WHERE id = ?', [newHash, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao atualizar a senha.' });
      }

      res.json({ message: 'Senha alterada com sucesso!' });
    });
  });
});

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
