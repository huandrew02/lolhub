document.addEventListener('DOMContentLoaded', function() {
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');
    const registerLink = document.getElementById('registerLink');
    const backToLoginLink = document.getElementById('backToLoginLink');

    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });

    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            alert(await response.text());
            window.location.href = 'index.html'; // Redirect to homepage after login
        } else {
            alert('Login failed');
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            alert(await response.text());
            registerContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        } else {
            alert('Registration failed');
        }
    });
});