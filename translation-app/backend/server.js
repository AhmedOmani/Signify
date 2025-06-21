const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';

// Helper to read users
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper to write users
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup endpoint
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: 'جميع الحقول مطلوبة' });

  const users = readUsers();
  if (users.find(u => u.email === email))
    return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { username, email, password: hashedPassword };
  users.push(user);
  writeUsers(users);

  // Never send password back!
  res.json({ username, email });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'جميع الحقول مطلوبة' });

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid)
    return res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });

  // Never send password back!
  res.json({ username: user.username, email: user.email });
});

// Google Signup endpoint
app.post('/google-signup', (req, res) => {
  const { email, name, picture, googleId, authProvider } = req.body;
  
  if (!email || !name || !googleId || !authProvider) {
    return res.status(400).json({ message: 'بيانات Google غير مكتملة' });
  }

  const users = readUsers();
  
  // Check if user already exists with this email
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    // If user exists but doesn't have Google auth, update their profile
    if (!existingUser.googleId) {
      existingUser.googleId = googleId;
      existingUser.authProvider = authProvider;
      existingUser.picture = picture;
      writeUsers(users);
    }
    // Return existing user data (without password)
    return res.json({ 
      username: existingUser.username || name, 
      email: existingUser.email,
      picture: existingUser.picture || picture,
      authProvider: existingUser.authProvider || authProvider
    });
  }

  // Create new user with Google data
  const newUser = {
    username: name,
    email: email,
    googleId: googleId,
    authProvider: authProvider,
    picture: picture,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ 
    username: newUser.username, 
    email: newUser.email,
    picture: newUser.picture,
    authProvider: newUser.authProvider
  });
});

// Google Login endpoint
app.post('/google-login', (req, res) => {
  const { email, googleId } = req.body;
  
  if (!email || !googleId) {
    return res.status(400).json({ message: 'بيانات Google غير مكتملة' });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email && u.googleId === googleId);
  
  if (!user) {
    return res.status(404).json({ message: 'المستخدم غير موجود' });
  }

  // Return user data (without password)
  res.json({ 
    username: user.username, 
    email: user.email,
    picture: user.picture,
    authProvider: user.authProvider
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
  console.log(`You can access it from your phone at http://172.20.10.6:${PORT}`);
}); 