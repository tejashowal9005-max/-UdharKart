/* =================================================================
   UDHARKART — app.js
   Main application controller: navigation, theme, sidebar, toast
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  DOM REFS
    // =============================================================
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const themeToggle = document.getElementById('themeToggle');
    const settingsThemeToggle = document.getElementById('settingsThemeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const pageTitle = document.getElementById('pageTitle');
    const allViews = document.querySelectorAll('.page-view');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const toastContainer = document.getElementById('toastContainer');

    // =============================================================
    //  STATE
    // =============================================================
    let currentView = 'customer-dashboard'; // default
    let isDark = false;
    let isSidebarOpen = false;

    // =============================================================
    //  THEME
    // =============================================================
    function setTheme(dark) {
        isDark = dark;
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        if (themeIcon) themeIcon.textContent = dark ? 'light_mode' : 'dark_mode';
        // Update settings toggle if present
        if (settingsThemeToggle) {
            if (dark) {
                settingsThemeToggle.classList.add('active');
            } else {
                settingsThemeToggle.classList.remove('active');
            }
        }
    }

    function toggleTheme() {
        setTheme(!isDark);
    }

    // =============================================================
    //  NAVIGATION
    // =============================================================
    function navigateTo(viewId) {
        // Hide all views
        allViews.forEach(v => v.classList.remove('active'));

        // Show target
        const target = document.getElementById('view-' + viewId);
        if (target) {
            target.classList.add('active');
            currentView = viewId;
        }

        // Update nav links
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const linkView = link.getAttribute('data-view');
            if (linkView === viewId) {
                link.classList.add('active');
            }
        });

        // Update page title
        const titles = {
            'customer-dashboard': 'Dashboard',
            'shopkeeper-dashboard': 'Dashboard',
            'profile': 'Profile',
            'settings': 'Settings',
            'notifications': 'Notifications',
            'customer-login': 'Customer Login',
            'shopkeeper-login': 'Shopkeeper Login'
        };
        if (pageTitle) pageTitle.textContent = titles[viewId] || 'UdharKart';

        // Close sidebar on mobile
        closeSidebar();

        // Update URL hash
        if (history.pushState) {
            history.pushState(null, '', '#' + viewId);
        }
    }

    // =============================================================
    //  SIDEBAR
    // =============================================================
    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('active');
        isSidebarOpen = true;
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        isSidebarOpen = false;
        document.body.style.overflow = '';
    }

    function toggleSidebar() {
        if (isSidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // =============================================================
    //  TOAST
    // =============================================================
    function showToast(message, icon = 'info') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="material-symbols-outlined">${icon}</span>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 3000);
    }

    // =============================================================
    //  DATE
    // =============================================================
    function updateDate() {
        const now = new Date();
        const opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const dateStr = now.toLocaleDateString('en-IN', opts);
        document.querySelectorAll('#currentDate, #currentDateShop').forEach(el => {
            if (el) el.textContent = dateStr;
        });
    }

    // =============================================================
    //  EVENT BINDING
    // =============================================================

    // --- Sidebar toggle ---
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // --- Theme toggle (top nav) ---
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // --- Theme toggle (settings) ---
    if (settingsThemeToggle) {
        settingsThemeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }

    // --- Navigation links ---
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');
            if (view) {
                navigateTo(view);
            }
        });
    });

    // --- Hash routing ---
    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const viewEl = document.getElementById('view-' + hash);
            if (viewEl) {
                navigateTo(hash);
                return;
            }
        }
        // If on login page, stay; else go to default dashboard
        if (currentView === 'customer-login' || currentView === 'shopkeeper-login') {
            // stay
        } else {
            // Determine which dashboard to show based on role (default customer)
            const defaultView = 'customer-dashboard';
            navigateTo(defaultView);
        }
    }

    window.addEventListener('hashchange', handleHash);

    // =============================================================
    //  RESIZE HANDLER (close sidebar on wider screens)
    // =============================================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && isSidebarOpen) {
                closeSidebar();
            }
        }, 200);
    });

    // =============================================================
    //  INIT
    // =============================================================
    function init() {
        // Set date
        updateDate();

        // Check for saved theme preference (no localStorage, use system)
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);

        // Handle initial hash
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const viewEl = document.getElementById('view-' + hash);
            if (viewEl) {
                navigateTo(hash);
                return;
            }
        }

        // Default: show dashboard (or login if that's the active view)
        const activeView = document.querySelector('.page-view.active');
        if (activeView) {
            const id = activeView.id.replace('view-', '');
            currentView = id;
            // update nav
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-view') === id) {
                    link.classList.add('active');
                }
            });
            if (pageTitle) {
                pageTitle.textContent = {
                    'customer-dashboard': 'Dashboard',
                    'shopkeeper-dashboard': 'Dashboard',
                    'profile': 'Profile',
                    'settings': 'Settings',
                    'notifications': 'Notifications',
                    'customer-login': 'Customer Login',
                    'shopkeeper-login': 'Shopkeeper Login'
                } [id] || 'UdharKart';
            }
        } else {
            navigateTo('customer-dashboard');
        }

        // Show welcome toast (if not on login page)
        if (!currentView.includes('login')) {
            setTimeout(() => {
                showToast('Welcome to UdharKart', 'storefront');
            }, 600);
        }
    }

    // Expose some functions globally for other scripts
    window.udhar = {
        showToast,
        navigateTo,
        setTheme,
        toggleTheme,
        getCurrentView: () => currentView,
        isDark: () => isDark
    };

    // Init
    document.addEventListener('DOMContentLoaded', init);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    }

})();