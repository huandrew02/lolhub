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

/*
    UDEMY DAY 39: PASSWORD STRENGTH BACKGROUND
*/
const username = document.getElementById('loginUsername');
const password = document.getElementById('loginPassword');
const background = document.getElementById('background');

username.addEventListener('input', (e) => {
    const input = e.target.value;
    const length = input.length;
    const blurValue = 20 - length * 2;
    background.style.filter = `blur(${blurValue}px)`;
})

password.addEventListener('input', (e) => {
    const input = e.target.value;
    const length = input.length;
    const blurValue = 20 - length * 2;
    background.style.filter = `blur(${blurValue}px)`;
})


/*
    FROM HERE DOWN HANDLES THE ANIMATION FORM EFFECT (UDEMY DAY 8)

*/


const labels =document.querySelectorAll('.form-control label')

labels.forEach(label => {
    label.innerHTML = label.innerText
        .split('')
        .map((letter,idx) => `<span style = "transition-delay: ${idx*40}ms">${letter}</span>`)
        .join('');
})

/* 
    UDEMY DAY 8 FORM BOUNCE

*/