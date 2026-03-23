// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    setupModalTriggers();
    setupModalCloseButtons();
    setupSmoothScroll();
});

function setupModalTriggers() {
    // Sign up button
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            authManager.openModal('signupModal');
        });
    }

    // Sign in button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            authManager.openModal('signinModal');
        });
    }
}

function setupModalCloseButtons() {
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                authManager.closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                authManager.closeModal(modal.id);
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                authManager.closeModal(modal.id);
            });
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for modal triggers
            if (href === '#' || this.closest('.modal')) {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Prevent form submission for demo
document.addEventListener('submit', (e) => {
    if (e.target.id === 'signupForm' || e.target.id === 'signinForm' || e.target.id === 'forgotPasswordForm') {
        // Let the auth manager handle it
    }
});