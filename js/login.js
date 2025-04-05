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
            
            // Add loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Store authentication status in localStorage
                localStorage.setItem('isAuthenticated', 'true');
                
                // Redirect to home page
                window.location.href = 'pages/home.html';
            }, 1500);
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
    // Show loading state
    const btn = provider === 'google' ? document.querySelector('.btn-google') : document.querySelector('.btn-apple');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    btn.disabled = true;
    
    // Simulate social login
    setTimeout(() => {
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Store authentication status in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authProvider', provider);
        
        // Redirect to home page
        window.location.href = 'pages/home.html';
    }, 2000);
}

// Check authentication on home page load
function checkAuthentication() {
    if (window.location.pathname.includes('pages/home.html')) {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuthenticated) {
            window.location.href = 'index.html';
        }
    }
}

// Run authentication check when the page loads
checkAuthentication();