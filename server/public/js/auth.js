const signinBtn = document.getElementById('signin-btn');
const loginBtn = document.getElementById('login-btn');
const signinForm = document.getElementById('signin-form');
const loginForm = document.getElementById('login-form');
const pageHeaderText = document.getElementById('page-header-text');
const passwordInput = document.getElementById('signup-password');
const passwordStrength = document.getElementById('password-strength');
const verifyPasswordInput = document.getElementById('signup-password-confirm');

// Toggle forms
signinBtn.addEventListener('click', () => {
    signinForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    signinBtn.classList.add('active');
    loginBtn.classList.remove('active');
    pageHeaderText.textContent = 'Create an Account';
});

loginBtn.addEventListener('click', () => {
    signinForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    signinBtn.classList.remove('active');
    loginBtn.classList.add('active');
    pageHeaderText.textContent = 'Welcome Back';
});

// Password strength checker
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    let strength = 'Weak';
    let className = 'strength-weak';

    if (value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) {
        strength = 'Strong';
        className = 'strength-strong';
    } else if (value.length >= 6 && (/[A-Z]/.test(value) || /[0-9]/.test(value))) {
        strength = 'Medium';
        className = 'strength-medium';
    }

    const strengthSpan = passwordStrength.querySelector('span');
    strengthSpan.textContent = strength;
    strengthSpan.className = className;
});

// Verify password match
verifyPasswordInput.addEventListener('input', () => {
    if (verifyPasswordInput.value !== passwordInput.value) {
        verifyPasswordInput.setCustomValidity("Passwords do not match");
    } else {
        verifyPasswordInput.setCustomValidity("");
    }
});