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
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        });
        try {
            const data = await res.json();
            if(data.success) {
                window.location.href = '/admin';
            } else {
                // Nếu lỗi phân quyền, chuyển hướng sang /test
                if (data.message && (data.message.toLowerCase().includes('không có quyền') || data.message.toLowerCase().includes('not authorized'))) {
                    window.location.href = '/index';
                } else {
                    document.querySelector('.error').textContent = data.message;
                }
            }
        } catch (err) {
            // Nếu không phải JSON (có thể là redirect hoặc lỗi), không chuyển trang nữa
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
