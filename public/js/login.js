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
