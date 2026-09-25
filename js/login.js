document.addEventListener('DOMContentLoaded', function() {
    // Initialize Landing Page
    initLandingPage();
    
    // Handle Start Trial button click
    const startTrialBtn = document.getElementById('start-trial-btn');
    if (startTrialBtn) {
        startTrialBtn.addEventListener('click', function(e) {
            e.preventDefault();
            transitionToLogin();
        });
    }
    
    // Initialize login page if it's already active (direct navigation)
    if (document.getElementById('login-page').classList.contains('active')) {
        initLoginPage();
    }
});

function initLandingPage() {
    // Add hover effect to logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            const icon = logo.querySelector('i');
            if (icon) icon.style.transform = 'rotate(20deg)';
        });
        logo.addEventListener('mouseleave', () => {
            const icon = logo.querySelector('i');
            if (icon) icon.style.transform = 'rotate(0deg)';
        });
    }
    
    // Pulse animation for CTA button
    const ctaButton = document.querySelector('.btn-primary.pulse-animation');
    if (ctaButton) {
        setInterval(() => {
            ctaButton.classList.toggle('pulse-active');
        }, 2000);
    }
}

function transitionToLogin() {
    const landingPage = document.getElementById('landing-page');
    const loginPage = document.getElementById('login-page');
    
    if (!landingPage || !loginPage) {
        console.error("Missing page elements!");
        return;
    }
    
    // Start exit animation
    landingPage.classList.add('page-exit');
    
    // Wait for animation to complete
    const onTransitionEnd = () => {
        landingPage.removeEventListener('transitionend', onTransitionEnd);
        landingPage.classList.remove('active', 'page-exit');
        loginPage.classList.add('active');
        initLoginPage();
    };
    
    landingPage.addEventListener('transitionend', onTransitionEnd);
    
    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
        landingPage.removeEventListener('transitionend', onTransitionEnd);
        landingPage.classList.remove('active', 'page-exit');
        loginPage.classList.add('active');
        initLoginPage();
    }, 1000);
}

function initLoginPage() {
    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
  
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            if (!tabName) return;
            
            // Remove active class from all buttons and forms
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding form
            const formToShow = document.getElementById(`${tabName}-form`);
            if (formToShow) formToShow.classList.add('active');
        });
    });
  
    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (!input) return;
            
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
  
    // Password Strength Check
    const passwordInput = document.getElementById('signup-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
  
    // Form Submission
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (this.id === 'signup-form') {
                createAccount(this);
            } else {
                loginAccount(this);
            }
        });
    });
    
    // Google Login
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('google');
        });
    }
    
    // Apple Login
    const appleBtn = document.querySelector('.btn-apple');
    if (appleBtn) {
        appleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin('apple');
        });
    }
}

function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    // Reset
    strengthBar.style.width = '0%';
    strengthBar.style.backgroundColor = '#ff4757';
    strengthText.textContent = 'Password strength: weak';
    
    if (password.length === 0) return;
    
    // Calculate strength
    let strength = 0;
    
    // Length check
    if (password.length > 7) strength += 1;
    if (password.length > 11) strength += 1;
    
    // Character variety
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Update UI
    const width = (strength / 5) * 100;
    strengthBar.style.width = `${width}%`;
    
    if (width < 40) {
        strengthBar.style.backgroundColor = '#ff4757';
        strengthText.textContent = 'Password strength: weak';
    } else if (width < 70) {
        strengthBar.style.backgroundColor = '#ffa502';
        strengthText.textContent = 'Password strength: medium';
    } else {
        strengthBar.style.backgroundColor = '#2ed573';
        strengthText.textContent = 'Password strength: strong';
    }
}

function handleSocialLogin(provider) {
    const btn = provider === 'google' ? document.querySelector('.btn-google') : document.querySelector('.btn-apple');
    showAuthMessage(btn.closest('.auth-form'), `${provider} login is not configured yet. Create an account with your email instead.`, 'error');
}

async function createAccount(form) {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const users = getStoredUsers();

    if (password.length < 8) {
        showAuthMessage(form, 'Password must be at least 8 characters long.', 'error');
        return;
    }

    if (users[email]) {
        showAuthMessage(form, 'An account with this email already exists. Please log in.', 'error');
        return;
    }

    users[email] = { name, password: await hashPassword(password) };
    localStorage.setItem('focusFlowUsers', JSON.stringify(users));
    startSession(email, name);
}

async function loginAccount(form) {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const user = getStoredUsers()[email];

    if (!user) {
        showAuthMessage(form, 'No account was found for this email. Please use Sign Up first.', 'error');
        return;
    }

    if (user.password !== await hashPassword(password)) {
        showAuthMessage(form, 'Incorrect email or password.', 'error');
        return;
    }

    startSession(email, user.name);
}

function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem('focusFlowUsers') || '{}');
    } catch (error) {
        return {};
    }
}

async function hashPassword(password) {
    if (window.crypto?.subtle) {
        const data = new TextEncoder().encode(password);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    return btoa(unescape(encodeURIComponent(password)));
}

function startSession(email, name) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ email, name }));
    window.location.href = 'pages/home.html';
}

function showAuthMessage(form, message, type) {
    let messageElement = form.querySelector('.auth-message');
    if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.className = 'auth-message';
        form.prepend(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `auth-message ${type}`;
}

// Check authentication on home page load
function checkAuthentication() {
    if (window.location.pathname.includes('pages/home.html')) {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const currentUser = localStorage.getItem('currentUser');
        if (!isAuthenticated || !currentUser) {
            window.location.href = 'index.html';
        }
    }
}

// Run authentication check when the page loads
checkAuthentication();