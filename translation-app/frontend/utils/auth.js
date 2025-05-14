// Simple in-memory user "database"
const users = [];

export async function registerUser(username, email, password) {
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
  }
  const user = { username, email, password };
  users.push(user);
  return { success: true, user };
}

export async function loginUser(email, password) {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'بيانات الدخول غير صحيحة' };
  }
  return { success: true, user };
} 