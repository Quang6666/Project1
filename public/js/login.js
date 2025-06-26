// Xử lý hiệu ứng chuyển tab sign in/sign up
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

if (signUpButton && signInButton && container) {
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
}

// Xử lý submit form đăng nhập
const loginForm = document.querySelector('.sign-in-container form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });
        const data = await res.json();
        if(data.success) {
            alert('Đăng nhập thành công!');
            // Chuyển hướng hoặc lưu token ở đây nếu cần
        } else {
            document.querySelector('.error').textContent = data.message;
        }
    });
}

// Xử lý submit form đăng ký
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const msg = document.getElementById('register-message');
  msg.textContent = '';
  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.success) {
      msg.style.color = '#05daf7';
      msg.textContent = 'Đăng ký thành công!';
      document.getElementById('registerForm').reset();
    } else {
      msg.style.color = '#f44336';
      msg.textContent = data.message || 'Đăng ký thất bại!';
    }
  } catch (err) {
    msg.style.color = '#f44336';
    msg.textContent = 'Lỗi hệ thống!';
  }
});
