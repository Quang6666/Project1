document.querySelector('form').addEventListener('submit', async function(e) {
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
