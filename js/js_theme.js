// Theme Management
class ThemeManager {
    constructor() {
        this.THEME_KEY = 'theme-preference';
        this.DARK_MODE = 'dark';
        this.LIGHT_MODE = 'light';
        this.init();
    }

    init() {
        const savedTheme = Storage.getItem(this.THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? this.DARK_MODE : this.LIGHT_MODE);
        
        this.setTheme(theme);
        this.setupToggle();
    }

    setTheme(theme) {
        const html = document.documentElement;
        
        if (theme === this.DARK_MODE) {
            html.setAttribute('data-theme', 'dark');
            Storage.setItem(this.THEME_KEY, 'dark');
            this.updateToggleIcon('sun');
        } else {
            html.removeAttribute('data-theme');
            Storage.setItem(this.THEME_KEY, 'light');
            this.updateToggleIcon('moon');
        }
    }

    updateToggleIcon(icon) {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.innerHTML = `<i class="fas fa-${icon}"></i>`;
        }
    }

    setupToggle() {
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        this.setTheme(isDark ? this.LIGHT_MODE : this.DARK_MODE);
    }

    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
}

// Initialize theme
const themeManager = new ThemeManager();