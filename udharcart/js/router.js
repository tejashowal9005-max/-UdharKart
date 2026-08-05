/**
 * UdharKart — Router
 * Handles page navigation and state
 */

export class Router {
    static routes = {
        'customer-dashboard': { title: 'Dashboard', subtitle: 'Welcome back' },
        'shopkeeper-dashboard': { title: 'Shop Dashboard', subtitle: 'Manage your store' },
        'products': { title: 'Products', subtitle: 'Browse our catalog' },
        'product-details': { title: 'Product Details', subtitle: 'View product' },
        'categories': { title: 'Categories', subtitle: 'Shop by category' },
        'cart': { title: 'Shopping Cart', subtitle: 'Review your items' },
        'checkout': { title: 'Checkout', subtitle: 'Complete your order' },
        'orders': { title: 'Orders', subtitle: 'Track your orders' },
        'order-details': { title: 'Order Details', subtitle: 'View order' },
        'billing': { title: 'Billing', subtitle: 'Generate invoices' },
        'invoice': { title: 'Invoice', subtitle: 'Print invoice' },
        'udhar': { title: 'Digital Khata', subtitle: 'Manage credit ledger' },
        'payments': { title: 'Payments', subtitle: 'Payment history' },
        'profile': { title: 'Profile', subtitle: 'Your account' },
        'settings': { title: 'Settings', subtitle: 'App preferences' },
        'notifications': { title: 'Notifications', subtitle: 'Recent alerts' },
        'inventory': { title: 'Inventory', subtitle: 'Stock management' },
        'customers': { title: 'Customers', subtitle: 'Manage customers' },
        'reports': { title: 'Reports', subtitle: 'Business insights' },
        'analytics': { title: 'Analytics', subtitle: 'Data & metrics' },
        'help': { title: 'Help', subtitle: 'Support resources' },
        'about': { title: 'About', subtitle: 'Learn about us' },
        'privacy': { title: 'Privacy Policy', subtitle: 'Your privacy matters' },
        'terms': { title: 'Terms of Service', subtitle: 'Terms & conditions' },
        '404': { title: '404', subtitle: 'Page not found' },
    };

    static currentPage = 'customer-dashboard';
    static currentParams = {};

    static init() {
        // Handle hash-based routing
        window.addEventListener('hashchange', () => {
            this.handleHash();
        });

        // Handle initial load
        if (window.location.hash) {
            this.handleHash();
        } else {
            // Default page based on role
            const role = localStorage.getItem('udharkart_role') || 'customer';
            const defaultPage = role === 'shopkeeper' ? 'shopkeeper-dashboard' : 'customer-dashboard';
            this.navigate(defaultPage);
        }

        // Intercept link clicks with data-page attribute
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) this.navigate(page);
            }
        });
    }

    static handleHash() {
        const hash = window.location.hash.slice(1) || 'customer-dashboard';
        const [page, ...params] = hash.split('/');
        this.navigate(page, params);
    }

    static navigate(page, params = []) {
        // Validate page exists
        const pageId = page.replace('.html', '');
        if (!this.routes[pageId] && pageId !== '404') {
            this.navigate('404');
            return;
        }

        this.currentPage = pageId;
        this.currentParams = params;

        // Update hash without triggering scroll
        history.pushState(null, '', `#${pageId}`);

        // Update page title
        const route = this.routes[pageId] || { title: 'Page', subtitle: '' };
        document.title = `${route.title} — UdharKart`;
        document.getElementById('pageTitle')?.textContent = route.title;
        document.getElementById('pageSubtitle')?.textContent = route.subtitle;

        // Show/hide sections
        document.querySelectorAll('.page-section').forEach(el => {
            el.classList.remove('active');
        });
        const target = document.getElementById(`page-${pageId}`);
        if (target) {
            target.classList.add('active');
        }

        // Update sidebar active state
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

        // Close mobile sidebar
        document.querySelector('.sidebar')?.classList.remove('open');
        document.querySelector('.sidebar-overlay')?.classList.remove('active');

        // Trigger page load callback
        this.onPageChange(pageId);
    }

    static onPageChange(page) {
        // Dispatch custom event for page change
        const event = new CustomEvent('pagechange', {
            detail: { page, params: this.currentParams }
        });
        document.dispatchEvent(event);
    }

    static getCurrentPage() {
        return this.currentPage;
    }

    static getParams() {
        return this.currentParams;
    }
}