/**
 * UdharKart — Theme Manager
 */

export class Theme {
    static currentTheme = 'light';

    static init() {
        const saved = localStorage.getItem('udharkart_theme') || 'light';
        this.setTheme(saved);

        // Listen for system preference changes
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', (e) => {
            if (localStorage.getItem('udharkart_theme') === 'system') {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    static setTheme(theme) {
        if (theme === 'system') {
            const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = dark ? 'dark' : 'light';
        }

        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('udharkart_theme', theme);

        // Update theme toggle icons
        document.querySelectorAll('.theme-toggle .material-symbols-rounded').forEach(icon => {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        });

        // Update theme option buttons
        document.querySelectorAll('.theme-option').forEach(btn => {
            const isActive = btn.dataset.theme === theme;
            btn.className = `btn ${isActive ? 'btn-primary' : 'btn-outline'} btn-sm theme-option`;
        });

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    static toggle() {
        const next = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(next);
    }

    static getCurrentTheme() {
        return this.currentTheme;
    }

    static isDark() {
        return this.currentTheme === 'dark';
    }
}