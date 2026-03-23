// Authentication Management
class AuthManager {
    constructor() {
        this.USERS_KEY = 'users';
        this.CURRENT_USER_KEY = 'current_user';
        this.initUsers();
        this.setupEventListeners();
    }

    initUsers() {
        if (!Storage.getItem(this.USERS_KEY)) {
            // Initialize with a demo user
            const demoUser = {
                email: 'demo@example.com',
                password: this.hashPassword('password123'),
                name: 'Demo User'
            };
            Storage.setItem(this.USERS_KEY, [demoUser]);
        }
    }

    setupEventListeners() {
        // Signup Form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Signin Form
        const signinForm = document.getElementById('signinForm');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignin(e));
        }

        // Forgot Password Form
        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Modal Switches
        this.setupModalSwitches();
    }

    handleSignup(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.elements[0].value;
        const name = form.elements[1].value;
        const password = form.elements[2].value;
        const confirmPassword = form.elements[3].value;

        // Validation
        if (!email || !name || !password || !confirmPassword) {
            this.showError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email');
            return;
        }

        const users = Storage.getItem(this.USERS_KEY) || [];
        if (users.some(u => u.email === email)) {
            this.showError('Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            email,
            name,
            password: this.hashPassword(password)
        };

        users.push(newUser);
        Storage.setItem(this.USERS_KEY, users);

        // Show success message
        this.showSuccess('Account created successfully!', 'Welcome to ProductX');
        form.reset();

        // Close modal and show signin after 2 seconds
        setTimeout(() => {
            this.closeModal('signupModal');
            this.openModal('signinModal');
        }, 2000);
    }

    handleSignin(e) {
        e.preventDefault();

        const form = e.target;
        const email = form.elements[0].value;
        const password = form.elements[1].value;
        const rememberMe = form.elements[2].checked;

        if (!email || !password) {
            this.showError('Email and password are required');
            return;
        }

        const users = Storage.getItem(this.USERS_KEY) || [];
        const user = users.find(u => u.email === email && u.password === this.hashPassword(password));

        if (!user) {
            this.showError('Invalid email or password');
            return;
        }

        // Successful login
        const userData = {
            email: user.email,
            name: user.name,
            loginTime: new Date().toISOString()
        };

        Storage.setItem(this.CURRENT_USER_KEY, userData);
        if (rememberMe) {
            Storage.setItem('remember_me', true);
        }

        this.showSuccess('Signed in successfully!', `Welcome back, ${user.name}!`);
        form.reset();

        setTimeout(() => {
            this.closeModal('signinModal');
        }, 2000);
    }

    handleForgotPassword(e) {
        e.preventDefault();

        const form = e.target;
        const email = form.elements[0].value;

        if (!email) {
            this.showError('Please enter your email');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email');
            return;
        }

        const users = Storage.getItem(this.USERS_KEY) || [];
        const userExists = users.some(u => u.email === email);

        if (!userExists) {
            this.showError('No account found with this email');
            return;
        }

        // In a real app, this would send an email
        this.showSuccess(
            'Reset link sent!',
            `A password reset link has been sent to ${email}`
        );
        form.reset();

        setTimeout(() => {
            this.closeModal('forgotPasswordModal');
            this.openModal('signinModal');
        }, 2000);
    }

    setupModalSwitches() {
        // Signup to Signin
        document.addEventListener('click', (e) => {
            if (e.target.closest('.switch-link')) {
                const link = e.target.closest('.switch-link');
                
                if (link.classList.contains('forgot-link')) {
                    this.closeModal('signinModal');
                    this.openModal('forgotPasswordModal');
                } else if (link.classList.contains('back-to-signin')) {
                    this.closeModal('forgotPasswordModal');
                    this.openModal('signinModal');
                } else {
                    const signinModal = document.getElementById('signinModal');
                    const signupModal = document.getElementById('signupModal');
                    
                    if (signinModal.classList.contains('show')) {
                        this.closeModal('signinModal');
                        this.openModal('signupModal');
                    } else {
                        this.closeModal('signupModal');
                        this.openModal('signinModal');
                    }
                }
                e.preventDefault();
            }
        });
    }

    hashPassword(password) {
        // Simple hash for demo purposes
        // In production, use proper backend authentication
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(message) {
        alert(`Error: ${message}`);
    }

    showSuccess(title, message) {
        const successModal = document.getElementById('successModal');
        document.getElementById('successTitle').textContent = title;
        document.getElementById('successMessage').textContent = message;
        this.openModal('successModal');

        const closeBtn = document.getElementById('successBtn');
        closeBtn.onclick = () => {
            this.closeModal('successModal');
        };
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// Initialize authentication
const authManager = new AuthManager();
