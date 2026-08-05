/**
 * UdharKart — Main Application Entry
 * Production-ready, modular JavaScript
 * ES2023, no dependencies
 */

import { Router } from './router.js';
import { Auth } from './auth.js';
import { Theme } from './theme.js';
import { Cart } from './cart.js';
import { Utils } from './utils.js';

class App {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        // Initialize theme
        Theme.init();

        // Check authentication
        const isAuthed = await Auth.init();
        if (!isAuthed && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
            window.location.href = '/login.html';
            return;
        }

        // Initialize router
        Router.init();

        // Initialize cart
        Cart.init();

        // Setup global event listeners
        this.setupGlobalListeners();

        // Load page-specific data
        this.loadPageData();

        this.initialized = true;
        console.log('🚀 UdharKart initialized successfully');
    }

    setupGlobalListeners() {
        // Theme toggle
        document.querySelectorAll('.theme-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                Theme.setTheme(current === 'dark' ? 'light' : 'dark');
            });
        });

        // Mobile menu toggle
        document.querySelectorAll('.menu-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.sidebar')?.classList.toggle('open');
                document.querySelector('.sidebar-overlay')?.classList.toggle('active');
            });
        });

        // Notification dropdown toggle
        document.getElementById('notifToggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notifDropdown')?.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('notifDropdown');
            const toggle = document.getElementById('notifToggle');
            if (dropdown && toggle && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });

        // Global search
        document.getElementById('globalSearch')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    Router.navigate('products');
                    setTimeout(() => {
                        import('./products.js').then(module => {
                            module.Products.search(query);
                        });
                    }, 100);
                }
            }
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', async () => {
            if (confirm('Are you sure you want to logout?')) {
                await Auth.logout();
            }
        });

        // Mark all notifications read
        document.querySelectorAll('.mark-all-read').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.showToast('All notifications marked as read', 'success');
            });
        });
    }

    loadPageData() {
        const page = Router.getCurrentPage();
        // Load data based on page
        switch (page) {
            case 'customer-dashboard':
                import('./customer.js').then(module => {
                    module.Customer.loadDashboard();
                });
                break;
            case 'shopkeeper-dashboard':
                import('./shopkeeper.js').then(module => {
                    module.Shopkeeper.loadDashboard();
                });
                break;
            case 'products':
                import('./products.js').then(module => {
                    module.Products.load();
                });
                break;
            case 'cart':
                import('./cart.js').then(module => {
                    module.Cart.render();
                });
                break;
            case 'orders':
                import('./orders.js').then(module => {
                    module.Orders.load();
                });
                break;
            case 'udhar':
                import('./payments.js').then(module => {
                    module.Payments.loadUdhar();
                });
                break;
            case 'inventory':
                import('./inventory.js').then(module => {
                    module.Inventory.load();
                });
                break;
            case 'billing':
                import('./billing.js').then(module => {
                    module.Billing.load();
                });
                break;
            case 'profile':
                import('./profile.js').then(module => {
                    module.Profile.load();
                });
                break;
            case 'notifications':
                import('./notifications.js').then(module => {
                    module.Notifications.load();
                });
                break;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

    // Make app globally accessible for debugging
    window.__udharkart = app;
});

export default App;