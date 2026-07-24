/* ================================================================
   UDHARKART — COMBINED JAVASCRIPT
   ================================================================
   Complete application logic for UdharKart
   Includes: App, Router, Auth, Theme, Notifications,
   Customer, Shopkeeper, Products, Orders, Billing, Cart,
   Customers, Reports, Settings, Profile, Utilities
   ================================================================ */

(function() {
    'use strict';

    /* ==============================================================
       SECTION 1: UTILITY FUNCTIONS
       ============================================================== */

    /**
     * Format currency in Indian Rupees
     */
    function formatCurrency(amount) {
        if (amount === undefined || amount === null || isNaN(amount)) {
            return '₹0';
        }
        return '₹' + Number(amount).toLocaleString('en-IN');
    }

    /**
     * Format date to readable format
     */
    function formatDate(date) {
        if (!date) return 'N/A';
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return 'Invalid Date';
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    /**
     * Get today's date as string
     */
    function getToday() {
        const now = new Date();
        return now.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    /**
     * Generate unique ID
     */
    function generateId(prefix) {
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
        return prefix ? prefix + '-' + id : id;
    }

    /**
     * Generate invoice number
     */
    function generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const seq = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        return 'INV-' + year + '-' + seq;
    }

    /**
     * Debounce function
     */
    function debounce(fn, delay) {
        delay = delay || 300;
        var timer = null;
        return function() {
            var args = arguments;
            var context = this;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        };
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(str) {
        if (!str) return '';
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(str).replace(/[&<>"']/g, function(m) {
            return map[m];
        });
    }

    /**
     * Truncate string
     */
    function truncate(str, length, suffix) {
        length = length || 50;
        suffix = suffix || '...';
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    }

    /**
     * Validate email
     */
    function validateEmail(email) {
        if (!email || !email.trim()) {
            return { valid: false, message: 'Email is required' };
        }
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.trim())) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        return { valid: true, message: '' };
    }

    /**
     * Validate phone
     */
    function validatePhone(phone) {
        if (!phone || !phone.trim()) {
            return { valid: false, message: 'Phone number is required' };
        }
        var clean = phone.trim().replace(/\s/g, '');
        var regex = /^[6-9]\d{9}$/;
        if (!regex.test(clean)) {
            return { valid: false, message: 'Please enter a valid 10-digit Indian phone number' };
        }
        return { valid: true, message: '' };
    }

    /**
     * Validate password
     */
    function validatePassword(password) {
        if (!password || !password.trim()) {
            return { valid: false, message: 'Password is required' };
        }
        if (password.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters' };
        }
        return { valid: true, message: '' };
    }

    /**
     * Validate OTP
     */
    function validateOTP(otp) {
        if (!otp || !otp.trim()) {
            return { valid: false, message: 'Please enter the OTP' };
        }
        var clean = otp.trim();
        if (!/^\d+$/.test(clean)) {
            return { valid: false, message: 'OTP must contain only numbers' };
        }
        if (clean.length !== 6) {
            return { valid: false, message: 'OTP must be exactly 6 digits' };
        }
        return { valid: true, message: '' };
    }

    /**
     * Validate name
     */
    function validateName(name) {
        if (!name || !name.trim()) {
            return { valid: false, message: 'Name is required' };
        }
        if (name.trim().length < 2) {
            return { valid: false, message: 'Name must be at least 2 characters' };
        }
        return { valid: true, message: '' };
    }

    /* ==============================================================
       SECTION 2: API LAYER (Placeholder for backend)
       ============================================================== */

    // In-memory data store
    var DB = {
        customers: [
            { id: 'CUST-001', name: 'Priya Patel', phone: '+91 98765 43201', email: 'priya@example.com', address: 'Mumbai, India', outstanding: 2450, creditLimit: 10000, status: 'active', joined: '2025-01-15' },
            { id: 'CUST-002', name: 'Amit Kumar', phone: '+91 98765 43202', email: 'amit@example.com', address: 'Delhi, India', outstanding: 1800, creditLimit: 8000, status: 'active', joined: '2025-02-20' },
            { id: 'CUST-003', name: 'Neha Singh', phone: '+91 98765 43203', email: 'neha@example.com', address: 'Bangalore, India', outstanding: 3200, creditLimit: 12000, status: 'inactive', joined: '2024-11-10' }
        ],
        products: [
            { id: 'PROD-001', name: 'Basmati Rice (5kg)', category: 'groceries', price: 350, mrp: 400, discount: 12, gst: 5, stock: 45, barcode: '8901234567890' },
            { id: 'PROD-002', name: 'Milk (1L)', category: 'dairy', price: 56, mrp: 60, discount: 6, gst: 5, stock: 12, barcode: '8901234567891' },
            { id: 'PROD-003', name: 'Wheat Flour (5kg)', category: 'groceries', price: 220, mrp: 250, discount: 12, gst: 5, stock: 15, barcode: '8901234567892' },
            { id: 'PROD-004', name: 'Coca-Cola (2L)', category: 'beverages', price: 90, mrp: 100, discount: 10, gst: 5, stock: 20, barcode: '8901234567893' },
            { id: 'PROD-005', name: 'Lays (50g)', category: 'snacks', price: 20, mrp: 25, discount: 20, gst: 5, stock: 35, barcode: '8901234567894' }
        ],
        orders: [
            { id: 'UDH-001', customerId: 'CUST-001', customerName: 'Priya Patel', date: '2026-07-20', amount: 2450, status: 'completed', items: [{ productId: 'PROD-001', name: 'Basmati Rice (5kg)', qty: 2, price: 350 }] },
            { id: 'UDH-002', customerId: 'CUST-002', customerName: 'Amit Kumar', date: '2026-07-21', amount: 1800, status: 'pending', items: [{ productId: 'PROD-003', name: 'Wheat Flour (5kg)', qty: 1, price: 220 }] },
            { id: 'UDH-003', customerId: 'CUST-003', customerName: 'Neha Singh', date: '2026-07-22', amount: 3200, status: 'processing', items: [{ productId: 'PROD-002', name: 'Milk (1L)', qty: 4, price: 56 }] }
        ],
        invoices: [],
        cart: []
    };

    // Session state
    var session = {
        isAuthenticated: false,
        user: null,
        role: null
    };

    // API functions with Promise returns
    function apiLogin(email, password, role) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                if (!email || !password) {
                    reject(new Error('Email and password are required'));
                    return;
                }
                var user = {
                    id: 'USER-001',
                    name: role === 'customer' ? 'Rahul Sharma' : 'Amit Singh',
                    email: email,
                    role: role,
                    phone: '+91 98765 43210'
                };
                session.isAuthenticated = true;
                session.user = user;
                session.role = role;
                resolve({ user: user, role: role });
            }, 500);
        });
    }

    function apiLogout() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                session.isAuthenticated = false;
                session.user = null;
                session.role = null;
                resolve();
            }, 300);
        });
    }

    function getSession() {
        return { isAuthenticated: session.isAuthenticated, user: session.user, role: session.role };
    }

    function apiLoadCustomers() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(DB.customers.slice());
            }, 300);
        });
    }

    function apiGetCustomer(id) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var customer = DB.customers.find(function(c) { return c.id === id; });
                if (!customer) {
                    reject(new Error('Customer not found'));
                    return;
                }
                resolve(customer);
            }, 300);
        });
    }

    function apiCreateCustomer(data) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var newCustomer = {
                    id: 'CUST-' + String(DB.customers.length + 1).padStart(3, '0'),
                    name: data.name,
                    phone: data.phone,
                    email: data.email || '',
                    address: data.address || '',
                    outstanding: data.outstanding || 0,
                    creditLimit: data.creditLimit || 10000,
                    status: data.status || 'active',
                    joined: new Date().toISOString().split('T')[0]
                };
                DB.customers.push(newCustomer);
                resolve(newCustomer);
            }, 400);
        });
    }

    function apiUpdateCustomer(id, data) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var index = DB.customers.findIndex(function(c) { return c.id === id; });
                if (index === -1) {
                    reject(new Error('Customer not found'));
                    return;
                }
                DB.customers[index] = { ...DB.customers[index], ...data };
                resolve(DB.customers[index]);
            }, 400);
        });
    }

    function apiDeleteCustomer(id) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var index = DB.customers.findIndex(function(c) { return c.id === id; });
                if (index === -1) {
                    reject(new Error('Customer not found'));
                    return;
                }
                DB.customers.splice(index, 1);
                resolve();
            }, 400);
        });
    }

    function apiLoadProducts() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(DB.products.slice());
            }, 300);
        });
    }

    function apiGetProduct(id) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var product = DB.products.find(function(p) { return p.id === id; });
                if (!product) {
                    reject(new Error('Product not found'));
                    return;
                }
                resolve(product);
            }, 300);
        });
    }

    function apiCreateProduct(data) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var newProduct = {
                    id: 'PROD-' + String(DB.products.length + 1).padStart(3, '0'),
                    name: data.name,
                    category: data.category || 'groceries',
                    price: data.price || 0,
                    mrp: data.mrp || data.price || 0,
                    discount: data.discount || 0,
                    gst: data.gst || 5,
                    stock: data.stock || 0,
                    barcode: data.barcode || '890' + Math.random().toString(36).substring(2, 12)
                };
                DB.products.push(newProduct);
                resolve(newProduct);
            }, 400);
        });
    }

    function apiUpdateProduct(id, data) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var index = DB.products.findIndex(function(p) { return p.id === id; });
                if (index === -1) {
                    reject(new Error('Product not found'));
                    return;
                }
                DB.products[index] = { ...DB.products[index], ...data };
                resolve(DB.products[index]);
            }, 400);
        });
    }

    function apiDeleteProduct(id) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var index = DB.products.findIndex(function(p) { return p.id === id; });
                if (index === -1) {
                    reject(new Error('Product not found'));
                    return;
                }
                DB.products.splice(index, 1);
                resolve();
            }, 400);
        });
    }

    function apiLoadOrders() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(DB.orders.slice());
            }, 300);
        });
    }

    function apiGetOrder(id) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var order = DB.orders.find(function(o) { return o.id === id; });
                if (!order) {
                    reject(new Error('Order not found'));
                    return;
                }
                resolve(order);
            }, 300);
        });
    }

    function apiCreateOrder(data) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var newOrder = {
                    id: 'UDH-' + String(DB.orders.length + 1).padStart(3, '0'),
                    customerId: data.customerId || 'CUST-001',
                    customerName: data.customerName || 'Customer',
                    date: data.date || new Date().toISOString().split('T')[0],
                    amount: data.amount || 0,
                    status: data.status || 'pending',
                    items: data.items || []
                };
                DB.orders.push(newOrder);
                resolve(newOrder);
            }, 400);
        });
    }

    function apiUpdateOrder(id, data) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var index = DB.orders.findIndex(function(o) { return o.id === id; });
                if (index === -1) {
                    reject(new Error('Order not found'));
                    return;
                }
                DB.orders[index] = { ...DB.orders[index], ...data };
                resolve(DB.orders[index]);
            }, 400);
        });
    }

    function apiDeleteOrder(id) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                var index = DB.orders.findIndex(function(o) { return o.id === id; });
                if (index === -1) {
                    reject(new Error('Order not found'));
                    return;
                }
                DB.orders.splice(index, 1);
                resolve();
            }, 400);
        });
    }

    function apiGetCart() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(DB.cart.slice());
            }, 200);
        });
    }

    function apiAddToCart(item) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var existing = DB.cart.find(function(i) { return i.productId === item.productId; });
                if (existing) {
                    existing.qty += item.qty || 1;
                } else {
                    DB.cart.push({ ...item, qty: item.qty || 1 });
                }
                resolve(DB.cart.slice());
            }, 300);
        });
    }

    function apiRemoveFromCart(productId) {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var index = DB.cart.findIndex(function(i) { return i.productId === productId; });
                if (index !== -1) {
                    DB.cart.splice(index, 1);
                }
                resolve(DB.cart.slice());
            }, 300);
        });
    }

    function apiClearCart() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                DB.cart = [];
                resolve([]);
            }, 300);
        });
    }

    function apiGetDashboardStats() {
        return new Promise(function(resolve) {
            setTimeout(function() {
                var totalOrders = DB.orders.length;
                var totalRevenue = DB.orders.reduce(function(sum, o) { return sum + o.amount; }, 0);
                var pendingOrders = DB.orders.filter(function(o) { return o.status === 'pending'; }).length;
                var totalCustomers = DB.customers.length;
                var activeCustomers = DB.customers.filter(function(c) { return c.status === 'active'; }).length;
                var outstandingTotal = DB.customers.reduce(function(sum, c) { return sum + c.outstanding; }, 0);
                var lowStock = DB.products.filter(function(p) { return p.stock <= 5 && p.stock > 0; });
                var outOfStock = DB.products.filter(function(p) { return p.stock <= 0; });
                resolve({
                    totalOrders: totalOrders,
                    totalRevenue: totalRevenue,
                    pendingOrders: pendingOrders,
                    totalCustomers: totalCustomers,
                    activeCustomers: activeCustomers,
                    outstandingTotal: outstandingTotal,
                    lowStockProducts: lowStock,
                    outOfStockProducts: outOfStock,
                    totalProducts: DB.products.length
                });
            }, 400);
        });
    }

    /* ==============================================================
       SECTION 3: NOTIFICATION SYSTEM
       ============================================================== */

    var toastContainer = null;

    function initNotifications() {
        toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
    }

    function showToast(message, type, duration) {
        type = type || 'info';
        duration = duration || 3000;
        if (!toastContainer) initNotifications();

        var icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            loading: '⏳'
        };

        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML =
            '<span class="toast-icon">' + (icons[type] || 'ℹ️') + '</span>' +
            '<span class="toast-message">' + message + '</span>' +
            '<button class="toast-close">✕</button>';

        var closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', function() {
            removeToast(toast);
        });

        toastContainer.appendChild(toast);

        if (duration > 0 && type !== 'loading') {
            setTimeout(function() {
                removeToast(toast);
            }, duration);
        }

        return toast;
    }

    function removeToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.add('hide');
        setTimeout(function() {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }

    function showSuccess(message, duration) {
        return showToast(message, 'success', duration || 3000);
    }

    function showError(message, duration) {
        return showToast(message, 'error', duration || 4000);
    }

    function showWarning(message, duration) {
        return showToast(message, 'warning', duration || 3000);
    }

    function showInfo(message, duration) {
        return showToast(message, 'info', duration || 3000);
    }

    function showLoading(message) {
        return showToast(message || 'Loading...', 'loading', 0);
    }

    function dismissToast(toast) {
        removeToast(toast);
    }

    function showConfirm(title, message, confirmText, cancelText, onConfirm, onCancel) {
        confirmText = confirmText || 'Confirm';
        cancelText = cancelText || 'Cancel';
        var modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML =
            '<div class="modal-content">' +
            '<div class="modal-header"><h2>' + title + '</h2><button class="modal-close">✕</button></div>' +
            '<p>' + message + '</p>' +
            '<div class="modal-footer">' +
            '<button class="btn btn-secondary modal-cancel">' + cancelText + '</button>' +
            '<button class="btn btn-primary modal-confirm">' + confirmText + '</button>' +
            '</div></div>';

        document.body.appendChild(modal);

        var closeBtn = modal.querySelector('.modal-close');
        var cancelBtn = modal.querySelector('.modal-cancel');
        var confirmBtn = modal.querySelector('.modal-confirm');

        function closeModal() {
            modal.remove();
        }

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', function() {
            closeModal();
            if (onCancel) onCancel();
        });
        confirmBtn.addEventListener('click', function() {
            closeModal();
            if (onConfirm) onConfirm();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
                if (onCancel) onCancel();
            }
        });

        return modal;
    }

    /* ==============================================================
       SECTION 4: THEME MANAGEMENT
       ============================================================== */

    var themeStorageKey = 'udharkart-theme';

    function initTheme() {
        var saved = loadTheme();
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var initial = saved || (prefersDark ? 'dark' : 'light');
        applyTheme(initial);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!loadTheme()) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        saveTheme(theme);
        updateThemeToggle(theme);
    }

    function toggleTheme() {
        var current = getCurrentTheme();
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        return next;
    }

    function getCurrentTheme() {
        return document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(themeStorageKey, theme);
        } catch (e) {}
    }

    function loadTheme() {
        try {
            return localStorage.getItem(themeStorageKey);
        } catch (e) {
            return null;
        }
    }

    function updateThemeToggle(theme) {
        var toggleBtn = document.getElementById('themeToggle');
        var settingsToggle = document.getElementById('settingsThemeToggle');

        if (toggleBtn) {
            var icon = toggleBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        }

        if (settingsToggle) {
            if (theme === 'dark') {
                settingsToggle.classList.add('active');
            } else {
                settingsToggle.classList.remove('active');
            }
        }
    }

    /* ==============================================================
       SECTION 5: ROUTER (SPA Navigation)
       ============================================================== */

    var currentRoute = 'home';
    var routes = {
        'home': { title: 'UdharKart', public: true, views: ['view-home'] },
        'login': { title: 'Login', public: true, views: ['view-login'] },
        'register': { title: 'Register', public: true, views: ['view-register'] },
        'shopkeeper-login': { title: 'Shopkeeper Login', public: true, views: ['view-shopkeeper-login'] },
        'shopkeeper-register': { title: 'Shop Registration', public: true, views: ['view-shopkeeper-register'] },
        'forgot-password': { title: 'Forgot Password', public: true, views: ['view-forgot-password'] },
        'otp-verification': { title: 'OTP Verification', public: true, views: ['view-otp-verification'] },
        'customer-dashboard': { title: 'Dashboard', public: false, role: 'customer', views: ['view-customer-dashboard'] },
        'shopkeeper-dashboard': { title: 'Dashboard', public: false, role: 'shopkeeper', views: ['view-shopkeeper-dashboard'] },
        'customers': { title: 'Customers', public: false, role: 'shopkeeper', views: ['view-customers'] },
        'products': { title: 'Products', public: false, role: 'shopkeeper', views: ['view-products'] },
        'orders': { title: 'Orders', public: false, role: 'shopkeeper', views: ['view-orders'] },
        'cart': { title: 'Cart', public: false, role: 'shopkeeper', views: ['view-cart'] },
        'billing': { title: 'Billing', public: false, role: 'shopkeeper', views: ['view-billing'] },
        'reports': { title: 'Reports', public: false, role: 'shopkeeper', views: ['view-reports'] },
        'notifications': { title: 'Notifications', public: false, role: 'shopkeeper', views: ['view-notifications'] },
        'settings': { title: 'Settings', public: false, role: 'shopkeeper', views: ['view-settings'] },
        'profile': { title: 'Profile', public: false, role: 'shopkeeper', views: ['view-profile'] }
    };

    function initRouter() {
        var hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash);
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);
    }

    function handleHashChange() {
        var hash = window.location.hash.replace('#', '') || 'home';
        navigateTo(hash, true);
    }

    function navigateTo(routeName, fromHistory) {
        var route = routes[routeName];
        if (!route) {
            showError('Page not found');
            navigateTo('home');
            return;
        }

        // Check authentication
        if (!route.public) {
            if (!isAuthenticated()) {
                showError('Please login to access this page');
                navigateTo('login');
                return;
            }
            if (route.role && session.role !== route.role) {
                var target = session.role === 'customer' ? 'customer-dashboard' : 'shopkeeper-dashboard';
                showError('You do not have permission to access this page');
                navigateTo(target);
                return;
            }
        }

        currentRoute = routeName;

        // Show views
        var allViews = document.querySelectorAll('.page-view');
        allViews.forEach(function(view) {
            view.classList.remove('active');
            view.style.display = 'none';
        });

        route.views.forEach(function(viewId) {
            var view = document.getElementById(viewId);
            if (view) {
                view.style.display = '';
                view.classList.add('active');
            }
        });

        // Update title
        document.title = route.title + ' — UdharKart';
        var pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = route.title;

        // Update active nav
        var navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href === '#' + routeName) {
                link.classList.add('active');
            }
        });

        // Close sidebar on mobile
        closeSidebar();

        // Update URL
        if (!fromHistory) {
            var currentHash = window.location.hash.replace('#', '');
            if (currentHash !== routeName) {
                history.pushState(null, '', '#' + routeName);
            }
        }

        // Scroll to top
        var container = document.querySelector('.page-container');
        if (container) container.scrollTop = 0;
    }

    function getCurrentRoute() {
        return currentRoute;
    }

    function isPublicRoute(routeName) {
        var route = routes[routeName];
        return route ? route.public : true;
    }

    /* ==============================================================
       SECTION 6: AUTHENTICATION
       ============================================================== */

    function initAuth() {
        // Customer login
        var customerForm = document.getElementById('customerLoginForm');
        if (customerForm) {
            customerForm.addEventListener('submit', handleCustomerLogin);
        }

        // Shopkeeper login
        var shopkeeperForm = document.getElementById('shopkeeperLoginForm');
        if (shopkeeperForm) {
            shopkeeperForm.addEventListener('submit', handleShopkeeperLogin);
        }

        // Register
        var registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        // Shopkeeper register
        var shopRegForm = document.getElementById('shopkeeperRegisterForm');
        if (shopRegForm) {
            shopRegForm.addEventListener('submit', handleShopkeeperRegister);
        }

        // Forgot password
        var forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', handleForgotPassword);
        }

        // OTP verification
        var otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', handleOTPVerification);
        }

        // Password toggle
        document.querySelectorAll('.toggle-password').forEach(function(btn) {
            btn.addEventListener('click', togglePasswordVisibility);
        });

        // Logout links
        document.querySelectorAll('[data-action="logout"]').forEach(function(link) {
            link.addEventListener('click', handleLogout);
        });

        // Check session
        var savedSession = getSession();
        if (savedSession && savedSession.isAuthenticated) {
            session.isAuthenticated = true;
            session.user = savedSession.user;
            session.role = savedSession.role;
        }
    }

    function isAuthenticated() {
        return session.isAuthenticated;
    }

    function getCurrentUser() {
        return session.user;
    }

    function getCurrentRole() {
        return session.role;
    }

    function handleCustomerLogin(e) {
        e.preventDefault();
        var email = document.getElementById('custEmail').value.trim();
        var password = document.getElementById('custPassword').value.trim();

        var emailValid = validateEmail(email);
        if (!emailValid.valid) {
            showError(emailValid.message);
            return;
        }
        var passValid = validatePassword(password);
        if (!passValid.valid) {
            showError(passValid.message);
            return;
        }

        var loading = showLoading('Logging in...');
        apiLogin(email, password, 'customer').then(function(result) {
            dismissToast(loading);
            showSuccess('Welcome back, ' + result.user.name + '!');
            navigateTo('customer-dashboard');
        }).catch(function(err) {
            dismissToast(loading);
            showError(err.message || 'Login failed');
        });
    }

    function handleShopkeeperLogin(e) {
        e.preventDefault();
        var shopName = document.getElementById('shopName').value.trim();
        var email = document.getElementById('shopEmail').value.trim();
        var password = document.getElementById('shopPassword').value.trim();

        if (!shopName || !email || !password) {
            showError('Please fill in all fields');
            return;
        }

        var loading = showLoading('Logging in...');
        apiLogin(email, password, 'shopkeeper').then(function(result) {
            dismissToast(loading);
            showSuccess('Welcome back, ' + shopName + '!');
            navigateTo('shopkeeper-dashboard');
        }).catch(function(err) {
            dismissToast(loading);
            showError(err.message || 'Login failed');
        });
    }

    function handleRegister(e) {
        e.preventDefault();
        var name = document.getElementById('regName').value.trim();
        var email = document.getElementById('regEmail').value.trim();
        var phone = document.getElementById('regPhone').value.trim();
        var password = document.getElementById('regPassword').value.trim();

        var nameValid = validateName(name);
        if (!nameValid.valid) { showError(nameValid.message); return; }
        var emailValid = validateEmail(email);
        if (!emailValid.valid) { showError(emailValid.message); return; }
        var phoneValid = validatePhone(phone);
        if (!phoneValid.valid) { showError(phoneValid.message); return; }
        var passValid = validatePassword(password);
        if (!passValid.valid) { showError(passValid.message); return; }

        showSuccess('Registration successful! Please login.');
        navigateTo('login');
    }

    function handleShopkeeperRegister(e) {
        e.preventDefault();
        var shopName = document.getElementById('shopRegName').value.trim();
        var ownerName = document.getElementById('shopRegOwner').value.trim();
        var email = document.getElementById('shopRegEmail').value.trim();
        var phone = document.getElementById('shopRegPhone').value.trim();
        var password = document.getElementById('shopRegPassword').value.trim();

        if (!shopName || !ownerName || !email || !phone || !password) {
            showError('Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        showSuccess('Shop registration successful! Please login.');
        navigateTo('shopkeeper-login');
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        var email = document.getElementById('resetEmail').value.trim();
        if (!email) {
            showError('Please enter your email');
            return;
        }
        showSuccess('Reset link sent to your email');
        navigateTo('login');
    }

    function handleOTPVerification(e) {
        e.preventDefault();
        var otp = document.getElementById('otpCode').value.trim();
        var valid = validateOTP(otp);
        if (!valid.valid) {
            showError(valid.message);
            return;
        }
        showSuccess('OTP verified successfully!');
        navigateTo('login');
    }

    function togglePasswordVisibility(e) {
        var btn = e.currentTarget;
        var input = btn.closest('.password-wrap').querySelector('input');
        if (input) {
            var type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            var icon = btn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
            }
        }
    }

    function handleLogout(e) {
        e.preventDefault();
        apiLogout().then(function() {
            showSuccess('Logged out successfully');
            navigateTo('home');
        }).catch(function() {
            showError('Logout failed');
        });
    }

    /* ==============================================================
       SECTION 7: SIDEBAR
       ============================================================== */

    var sidebarElement = document.getElementById('sidebar');
    var overlayElement = document.getElementById('sidebarOverlay');
    var toggleButton = document.getElementById('sidebarToggle');
    var isSidebarOpen = false;

    function initSidebar() {
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleSidebar);
        }
        if (overlayElement) {
            overlayElement.addEventListener('click', closeSidebar);
        }
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isSidebarOpen) {
                closeSidebar();
            }
        });
    }

    function toggleSidebar() {
        if (isSidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function openSidebar() {
        if (sidebarElement) sidebarElement.classList.add('open');
        if (overlayElement) overlayElement.classList.add('active');
        isSidebarOpen = true;
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebarElement) sidebarElement.classList.remove('open');
        if (overlayElement) overlayElement.classList.remove('active');
        isSidebarOpen = false;
        document.body.style.overflow = '';
    }

    /* ==============================================================
       SECTION 8: DASHBOARD
       ============================================================== */

    var dashboardData = null;

    function loadDashboard() {
        var loading = showLoading('Loading dashboard...');
        apiGetDashboardStats().then(function(data) {
            dashboardData = data;
            dismissToast(loading);
            renderDashboard();
        }).catch(function() {
            dismissToast(loading);
            showError('Failed to load dashboard');
        });
    }

    function renderDashboard() {
        if (!dashboardData) return;

        // Update date
        var dateEls = document.querySelectorAll('#currentDate, #currentDateShop');
        dateEls.forEach(function(el) {
            if (el) el.textContent = getToday();
        });

        // Update stats
        var statMap = {
            'statTotalOrders': dashboardData.totalOrders,
            'statTotalRevenue': formatCurrency(dashboardData.totalRevenue),
            'statPendingOrders': dashboardData.pendingOrders,
            'statTotalCustomers': dashboardData.totalCustomers,
            'statOutstanding': formatCurrency(dashboardData.outstandingTotal),
            'statLowStock': dashboardData.lowStockProducts.length
        };

        Object.keys(statMap).forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.textContent = statMap[id];
        });

        // Update welcome name
        var welcomeName = document.getElementById('welcomeName');
        if (welcomeName) {
            welcomeName.textContent = session.user ? session.user.name : 'Guest';
        }

        // Update recent orders in dashboard
        var recentTable = document.getElementById('recentOrdersTable');
        if (recentTable) {
            var orders = dashboardData.recentOrders || [];
            if (orders.length === 0) {
                recentTable.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No recent orders</td></tr>';
            } else {
                recentTable.innerHTML = orders.map(function(order) {
                    return '<tr>' +
                        '<td><strong>#' + order.id + '</strong></td>' +
                        '<td>' + escapeHtml(order.customerName) + '</td>' +
                        '<td>' + formatDate(order.date) + '</td>' +
                        '<td>' + formatCurrency(order.amount) + '</td>' +
                        '<td><span class="badge badge-' + getStatusClass(order.status) + '">' + order.status + '</span></td>' +
                        '</tr>';
                }).join('');
            }
        }

        // Update low stock alerts
        var alertsContainer = document.getElementById('lowStockAlerts');
        if (alertsContainer) {
            var lowStock = dashboardData.lowStockProducts || [];
            var outOfStock = dashboardData.outOfStockProducts || [];
            var allAlerts = lowStock.concat(outOfStock);
            if (allAlerts.length === 0) {
                alertsContainer.innerHTML = '<div class="alert alert-success">✅ All products are well stocked</div>';
            } else {
                alertsContainer.innerHTML = allAlerts.map(function(product) {
                    var cls = product.stock <= 0 ? 'alert-danger' : 'alert-warning';
                    var msg = product.stock <= 0 ? 'Out of Stock!' : 'Only ' + product.stock + ' left in stock';
                    return '<div class="alert ' + cls + '"><strong>' + escapeHtml(product.name) + '</strong> - ' + msg +
                        ' <button class="btn btn-sm btn-primary" data-product="' + product.id + '">Restock</button></div>';
                }).join('');
            }
        }
    }

    function getStatusClass(status) {
        var map = {
            'completed': 'success',
            'pending': 'warning',
            'processing': 'info',
            'cancelled': 'danger',
            'shipped': 'info',
            'delivered': 'success',
            'refunded': 'warning'
        };
        return map[status] || 'info';
    }

    /* ==============================================================
       SECTION 9: PRODUCTS
       ============================================================== */

    var allProducts = [];
    var productPage = 1;
    var productPerPage = 6;

    function initProducts() {
        var searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                productPage = 1;
                loadProducts();
            }, 300));
        }

        var categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                productPage = 1;
                loadProducts();
            });
        }

        var stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', function() {
                productPage = 1;
                loadProducts();
            });
        }

        var resetBtn = document.getElementById('resetProductFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                document.getElementById('productSearch').value = '';
                document.getElementById('categoryFilter').value = 'all';
                document.getElementById('stockFilter').value = 'all';
                productPage = 1;
                loadProducts();
                showSuccess('Filters reset');
            });
        }

        var addBtn = document.getElementById('addProductBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                openProductModal();
            });
        }

        loadProducts();
    }

    function loadProducts() {
        var loading = showLoading('Loading products...');
        apiLoadProducts().then(function(data) {
            allProducts = data;
            dismissToast(loading);
            renderProducts();
        }).catch(function() {
            dismissToast(loading);
            showError('Failed to load products');
        });
    }

    function renderProducts() {
        var grid = document.getElementById('productsGrid');
        if (!grid) return;

        var search = document.getElementById('productSearch').value.toLowerCase().trim();
        var category = document.getElementById('categoryFilter').value;
        var stock = document.getElementById('stockFilter').value;

        var filtered = allProducts.filter(function(p) {
            var matchSearch = !search || p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search);
            var matchCategory = category === 'all' || p.category === category;
            var matchStock = true;
            if (stock === 'in-stock') matchStock = p.stock > 5;
            else if (stock === 'low-stock') matchStock = p.stock > 0 && p.stock <= 5;
            else if (stock === 'out-of-stock') matchStock = p.stock <= 0;
            return matchSearch && matchCategory && matchStock;
        });

        var start = (productPage - 1) * productPerPage;
        var paginated = filtered.slice(start, start + productPerPage);
        var totalPages = Math.ceil(filtered.length / productPerPage);

        if (paginated.length === 0) {
            grid.innerHTML = '<div class="empty-products"><span class="empty-icon">📦</span><h4>No products found</h4><p>Try adjusting your filters or add a new product.</p></div>';
        } else {
            var icons = { 'groceries': 'rice_bowl', 'dairy': 'no_drinks', 'beverages': 'local_drink', 'snacks': 'fastfood', 'personal-care': 'shower', 'household': 'cleaning_services' };
            grid.innerHTML = paginated.map(function(p) {
                var icon = icons[p.category] || 'inventory_2';
                var stockClass = p.stock <= 0 ? 'out-of-stock' : (p.stock <= 5 ? 'low-stock' : 'in-stock');
                var stockLabel = p.stock <= 0 ? 'Out of Stock' : (p.stock <= 5 ? 'Low Stock (' + p.stock + ')' : 'In Stock (' + p.stock + ')');
                return '<div class="product-card glass-card" data-id="' + p.id + '">' +
                    '<div class="product-img"><span class="material-symbols-outlined">' + icon + '</span></div>' +
                    '<h4>' + escapeHtml(p.name) + '</h4>' +
                    '<div class="product-category">' + escapeHtml(p.category) + '</div>' +
                    '<div class="price">' + formatCurrency(p.price) + '</div>' +
                    '<span class="stock-badge ' + stockClass + '">' + stockLabel + '</span>' +
                    '<div class="card-actions">' +
                    '<button class="btn-add" data-id="' + p.id + '" ' + (p.stock <= 0 ? 'disabled' : '') + '>🛒 Add to Cart</button>' +
                    '<button class="btn-edit" data-id="' + p.id + '">✏️</button>' +
                    '<button class="btn-delete" data-id="' + p.id + '">🗑️</button>' +
                    '</div></div>';
            }).join('');
        }

        // Update pagination
        var paginationEl = document.querySelector('#view-products .pagination .pages');
        if (paginationEl) {
            var infoEl = document.querySelector('#view-products .pagination .info');
            if (infoEl) {
                var startNum = filtered.length === 0 ? 0 : start + 1;
                var endNum = Math.min(start + productPerPage, filtered.length);
                infoEl.textContent = filtered.length === 0 ? 'No products found' : 'Showing ' + startNum + '–' + endNum + ' of ' + filtered.length + ' products';
            }
            var html = '<button ' + (productPage <= 1 ? 'disabled' : '') + ' data-page="' + (productPage - 1) + '">‹</button>';
            for (var i = 1; i <= totalPages; i++) {
                html += '<button data-page="' + i + '" ' + (i === productPage ? 'class="active"' : '') + '>' + i + '</button>';
            }
            html += '<button ' + (productPage >= totalPages || totalPages === 0 ? 'disabled' : '') + ' data-page="' + (productPage + 1) + '">›</button>';
            paginationEl.innerHTML = html;

            paginationEl.querySelectorAll('[data-page]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var page = parseInt(this.dataset.page);
                    if (page >= 1 && page <= totalPages) {
                        productPage = page;
                        renderProducts();
                    }
                });
            });
        }

        // Attach product actions
        document.querySelectorAll('.product-card .btn-add').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.dataset.id;
                var product = allProducts.find(function(p) { return p.id === id; });
                if (product) showSuccess('Added "' + product.name + '" to cart 🛒');
            });
        });

        document.querySelectorAll('.product-card .btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.dataset.id;
                openProductModal(id);
            });
        });

        document.querySelectorAll('.product-card .btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var id = this.dataset.id;
                var product = allProducts.find(function(p) { return p.id === id; });
                if (product) {
                    showConfirm('Delete Product', 'Are you sure you want to delete "' + product.name + '"?', 'Delete', 'Cancel',
                        function() {
                            var loading = showLoading('Deleting...');
                            apiDeleteProduct(id).then(function() {
                                dismissToast(loading);
                                showSuccess('Product deleted');
                                loadProducts();
                            }).catch(function() {
                                dismissToast(loading);
                                showError('Failed to delete');
                            });
                        }
                    );
                }
            });
        });

        document.querySelectorAll('.product-card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('button')) return;
                var id = this.dataset.id;
                var product = allProducts.find(function(p) { return p.id === id; });
                if (product) showInfo('Viewing details for "' + product.name + '"');
            });
        });
    }

    function openProductModal(id) {
        var modal = document.getElementById('productModal');
        if (!modal) return;

        var title = document.getElementById('productModalTitle');
        var form = document.getElementById('productForm');

        if (id) {
            title.textContent = 'Edit Product';
            var product = allProducts.find(function(p) { return p.id === id; });
            if (product) {
                document.getElementById('productId').value = product.id;
                document.getElementById('prodName').value = product.name;
                document.getElementById('prodCategory').value = product.category;
                document.getElementById('prodPrice').value = product.price;
                document.getElementById('prodMrp').value = product.mrp || '';
                document.getElementById('prodDiscount').value = product.discount || 0;
                document.getElementById('prodGst').value = product.gst || 5;
                document.getElementById('prodStock').value = product.stock;
                document.getElementById('prodBarcode').value = product.barcode || '';
            }
        } else {
            title.textContent = 'Add New Product';
            form.reset();
            document.getElementById('productId').value = '';
        }

        modal.classList.add('active');

        // Close handlers
        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        modal.querySelector('.btn-secondary').addEventListener('click', function() {
            modal.classList.remove('active');
        });

        // Form submit
        form.onsubmit = function(e) {
            e.preventDefault();
            var id = document.getElementById('productId').value;
            var data = {
                name: document.getElementById('prodName').value.trim(),
                category: document.getElementById('prodCategory').value,
                price: parseFloat(document.getElementById('prodPrice').value) || 0,
                mrp: parseFloat(document.getElementById('prodMrp').value) || 0,
                discount: parseFloat(document.getElementById('prodDiscount').value) || 0,
                gst: parseFloat(document.getElementById('prodGst').value) || 5,
                stock: parseInt(document.getElementById('prodStock').value) || 0,
                barcode: document.getElementById('prodBarcode').value.trim()
            };

            if (!data.name || data.price <= 0) {
                showError('Name and price are required');
                return;
            }

            var loading = showLoading(id ? 'Updating...' : 'Adding...');
            var promise = id ? apiUpdateProduct(id, data) : apiCreateProduct(data);
            promise.then(function() {
                dismissToast(loading);
                showSuccess(id ? 'Product updated' : 'Product added');
                modal.classList.remove('active');
                loadProducts();
            }).catch(function() {
                dismissToast(loading);
                showError('Failed to save product');
            });
        };
    }

    /* ==============================================================
       SECTION 10: ORDERS
       ============================================================== */

    var allOrders = [];
    var orderPage = 1;
    var orderPerPage = 5;

    function initOrders() {
        var searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                orderPage = 1;
                loadOrders();
            }, 300));
        }

        var statusFilter = document.getElementById('orderStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                orderPage = 1;
                loadOrders();
            });
        }

        var resetBtn = document.getElementById('resetOrderFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                document.getElementById('orderSearch').value = '';
                document.getElementById('orderStatusFilter').value = 'all';
                orderPage = 1;
                loadOrders();
                showSuccess('Filters reset');
            });
        }

        var newBtn = document.getElementById('newOrderBtn');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                showInfo('New order form would open');
            });
        }

        loadOrders();
    }

    function loadOrders() {
        var loading = showLoading('Loading orders...');
        apiLoadOrders().then(function(data) {
            allOrders = data;
            dismissToast(loading);
            renderOrders();
        }).catch(function() {
            dismissToast(loading);
            showError('Failed to load orders');
        });
    }

    function renderOrders() {
        var table = document.getElementById('orderTable');
        if (!table) return;

        var search = document.getElementById('orderSearch').value.toLowerCase().trim();
        var status = document.getElementById('orderStatusFilter').value;

        var filtered = allOrders.filter(function(o) {
            var matchSearch = !search || o.id.toLowerCase().includes(search) || o.customerName.toLowerCase().includes(search);
            var matchStatus = status === 'all' || o.status === status;
            return matchSearch && matchStatus;
        });

        var start = (orderPage - 1) * orderPerPage;
        var paginated = filtered.slice(start, start + orderPerPage);
        var totalPages = Math.ceil(filtered.length / orderPerPage);

        var tbody = table.querySelector('tbody');
        if (!tbody) return;

        if (paginated.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="empty-state"><span class="empty-icon">📋</span><p>No orders found</p></div></td></tr>';
        } else {
            tbody.innerHTML = paginated.map(function(o) {
                return '<tr>' +
                    '<td><strong>#' + o.id + '</strong></td>' +
                    '<td>' + escapeHtml(o.customerName) + '</td>' +
                    '<td>' + formatDate(o.date) + '</td>' +
                    '<td>' + formatCurrency(o.amount) + '</td>' +
                    '<td><span class="badge badge-' + getStatusClass(o.status) + '">' + o.status + '</span></td>' +
                    '<td>' +
                    '<button class="btn-view" data-id="' + o.id + '">👁️</button>' +
                    '<button class="btn-edit" data-id="' + o.id + '">✏️</button>' +
                    '<button class="btn-delete" data-id="' + o.id + '">🗑️</button>' +
                    '</td></tr>';
            }).join('');
        }

        // Pagination
        var paginationEl = document.querySelector('#view-orders .pagination .pages');
        if (paginationEl) {
            var infoEl = document.querySelector('#view-orders .pagination .info');
            if (infoEl) {
                var startNum = filtered.length === 0 ? 0 : start + 1;
                var endNum = Math.min(start + orderPerPage, filtered.length);
                infoEl.textContent = filtered.length === 0 ? 'No orders found' : 'Showing ' + startNum + '–' + endNum + ' of ' + filtered.length + ' orders';
            }
            var html = '<button ' + (orderPage <= 1 ? 'disabled' : '') + ' data-page="' + (orderPage - 1) + '">‹</button>';
            for (var i = 1; i <= totalPages; i++) {
                html += '<button data-page="' + i + '" ' + (i === orderPage ? 'class="active"' : '') + '>' + i + '</button>';
            }
            html += '<button ' + (orderPage >= totalPages || totalPages === 0 ? 'disabled' : '') + ' data-page="' + (orderPage + 1) + '">›</button>';
            paginationEl.innerHTML = html;

            paginationEl.querySelectorAll('[data-page]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var page = parseInt(this.dataset.page);
                    if (page >= 1 && page <= totalPages) {
                        orderPage = page;
                        renderOrders();
                    }
                });
            });
        }

        // Attach actions
        tbody.querySelectorAll('.btn-view').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.dataset.id;
                var order = allOrders.find(function(o) { return o.id === id; });
                if (order) showInfo('Viewing order #' + id);
            });
        });

        tbody.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.dataset.id;
                showInfo('Editing order #' + id);
            });
        });

        tbody.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.dataset.id;
                var order = allOrders.find(function(o) { return o.id === id; });
                if (order) {
                    showConfirm('Delete Order', 'Are you sure you want to delete order #' + id + '?', 'Delete', 'Cancel',
                        function() {
                            var loading = showLoading('Deleting...');
                            apiDeleteOrder(id).then(function() {
                                dismissToast(loading);
                                showSuccess('Order deleted');
                                loadOrders();
                            }).catch(function() {
                                dismissToast(loading);
                                showError('Failed to delete');
                            });
                        }
                    );
                }
            });
        });
    }

    /* ==============================================================
       SECTION 11: CUSTOMERS
       ============================================================== */

    var allCustomers = [];
    var customerPage = 1;
    var customerPerPage = 5;

    function initCustomers() {
        var searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                customerPage = 1;
                loadCustomers();
            }, 300));
        }

        var statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                customerPage = 1;
                loadCustomers();
            });
        }

        var resetBtn = document.getElementById('resetCustomerFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                document.getElementById('customerSearch').value = '';
                document.getElementById('statusFilter').value = 'all';
                customerPage = 1;
                loadCustomers();
                showSuccess('Filters reset');
            });
        }

        var addBtn = document.getElementById('addCustomerBtn');
        if (addBtn) {
            addBtn.addEventListener('click', function() {
                openCustomerModal();
            });
        }

        loadCustomers();
    }

    function loadCustomers() {
        var loading = showLoading('Loading customers...');
        apiLoadCustomers().then(function(data) {
            allCustomers = data;
            dismissToast(loading);
            renderCustomers();
        }).catch(function() {
            dismissToast(loading);
            showError('Failed to load customers');
        });
    }

    function renderCustomers() {
        var table = document.getElementById('customerTable');
        if (!table) return;

        var search = document.getElementById('customerSearch').value.toLowerCase().trim();
        var status = document.getElementById('statusFilter').value;

        var filtered = allCustomers.filter(function(c) {
            var matchSearch = !search || c.name.toLowerCase().includes(search) || c.phone.includes(search) || c.email.toLowerCase().includes(search);
            var matchStatus = status === 'all' || c.status === status;
            return matchSearch && matchStatus;
        });

        var start = (customerPage - 1) * customerPerPage;
        var paginated = filtered.slice(start, start + customerPerPage);
        var totalPages = Math.ceil(filtered.length / customerPerPage);

        var tbody = table.querySelector('tbody');
        if (!tbody) return;

        if (paginated.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center"><div class="empty-state"><span class="empty-icon">👤</span><p>No customers found</p></div></td></tr>';
        } else {
            tbody.innerHTML = paginated.map(function(c) {
                var statusClass = c.status === 'active' ? 'badge-success' : 'badge-danger';
                return '<tr>' +
                    '<td><span class="material-symbols-outlined">account_circle</span></td>' +
                    '<td><strong>' + escapeHtml(c.name) + '</strong></td>' +
                    '<td>' + escapeHtml(c.phone) + '</td>' +
                    '<td>' + escapeHtml(c.email) + '</td>' +
                    '<td>' + formatCurrency(c.outstanding) + '</td>' +
                    '<td>' + formatCurrency(c.creditLimit) + '</td>' +
                    '<td><span class="badge ' + statusClass + '">' + c.status + '</span></td>' +
                    '<td><button class="btn-edit" data-id="' + c.id + '">✏️</button><button class="btn-delete" data-id="' + c.id + '">🗑️</button></td>' +
                    '</tr>';
            }).join('');
        }

        // Pagination
        var paginationEl = document.querySelector('#view-customers .pagination .pages');
        if (paginationEl) {
            var infoEl = document.querySelector('#view-customers .pagination .info');
            if (infoEl) {
                var startNum = filtered.length === 0 ? 0 : start + 1;
                var endNum = Math.min(start + customerPerPage, filtered.length);
                infoEl.textContent = filtered.length === 0 ? 'No customers found' : 'Showing ' + startNum + '–' + endNum + ' of ' + filtered.length + ' customers';
            }
            var html = '<button ' + (customerPage <= 1 ? 'disabled' : '') + ' data-page="' + (customerPage - 1) + '">‹</button>';
            for (var i = 1; i <= totalPages; i++) {
                html += '<button data-page="' + i + '" ' + (i === customerPage ? 'class="active"' : '') + '>' + i + '</button>';
            }
            html += '<button ' + (customerPage >= totalPages || totalPages === 0 ? 'disabled' : '') + ' data-page="' + (customerPage + 1) + '">›</button>';
            paginationEl.innerHTML = html;

            paginationEl.querySelectorAll('[data-page]').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var page = parseInt(this.dataset.page);
                    if (page >= 1 && page <= totalPages) {
                        customerPage = page;
                        renderCustomers();
                    }
                });
            });
        }

        // Attach actions
        tbody.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.dataset.id;
                openCustomerModal(id);
            });
        });

        tbody.querySelectorAll('.btn-delete').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = this.dataset.id;
                var customer = allCustomers.find(function(c) { return c.id === id; });
                if (customer) {
                    showConfirm('Delete Customer', 'Are you sure you want to delete "' + customer.name + '"?', 'Delete', 'Cancel',
                        function() {
                            var loading = showLoading('Deleting...');
                            apiDeleteCustomer(id).then(function() {
                                dismissToast(loading);
                                showSuccess('Customer deleted');
                                loadCustomers();
                            }).catch(function() {
                                dismissToast(loading);
                                showError('Failed to delete');
                            });
                        }
                    );
                }
            });
        });
    }

    function openCustomerModal(id) {
        var modal = document.getElementById('customerModal');
        if (!modal) return;

        var title = document.getElementById('customerModalTitle');
        var form = document.getElementById('customerForm');

        if (id) {
            title.textContent = 'Edit Customer';
            var customer = allCustomers.find(function(c) { return c.id === id; });
            if (customer) {
                document.getElementById('customerId').value = customer.id;
                document.getElementById('custName').value = customer.name;
                document.getElementById('custPhone').value = customer.phone;
                document.getElementById('custEmail').value = customer.email || '';
                document.getElementById('custAddress').value = customer.address || '';
                document.getElementById('custOutstanding').value = customer.outstanding || 0;
                document.getElementById('custCreditLimit').value = customer.creditLimit || 10000;
                document.getElementById('custStatus').value = customer.status || 'active';
            }
        } else {
            title.textContent = 'Add New Customer';
            form.reset();
            document.getElementById('customerId').value = '';
        }

        modal.classList.add('active');

        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        modal.querySelector('.btn-secondary').addEventListener('click', function() {
            modal.classList.remove('active');
        });

        form.onsubmit = function(e) {
            e.preventDefault();
            var id = document.getElementById('customerId').value;
            var data = {
                name: document.getElementById('custName').value.trim(),
                phone: document.getElementById('custPhone').value.trim(),
                email: document.getElementById('custEmail').value.trim(),
                address: document.getElementById('custAddress').value.trim(),
                outstanding: parseFloat(document.getElementById('custOutstanding').value) || 0,
                creditLimit: parseFloat(document.getElementById('custCreditLimit').value) || 10000,
                status: document.getElementById('custStatus').value
            };

            if (!data.name || !data.phone) {
                showError('Name and phone are required');
                return;
            }

            var loading = showLoading(id ? 'Updating...' : 'Adding...');
            var promise = id ? apiUpdateCustomer(id, data) : apiCreateCustomer(data);
            promise.then(function() {
                dismissToast(loading);
                showSuccess(id ? 'Customer updated' : 'Customer added');
                modal.classList.remove('active');
                loadCustomers();
            }).catch(function() {
                dismissToast(loading);
                showError('Failed to save customer');
            });
        };
    }

    /* ==============================================================
       SECTION 12: BILLING
       ============================================================== */

    function initBilling() {
        var printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                showSuccess('Printing invoice...');
            });
        }

        var downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showSuccess('Downloading invoice as PDF...');
                setTimeout(function() {
                    showSuccess('Invoice downloaded successfully!');
                }, 1000);
            });
        }

        var sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', function() {
                showSuccess('Sending invoice via email...');
                setTimeout(function() {
                    showSuccess('Invoice sent to priya@example.com 📧');
                }, 1200);
            });
        }

        var newBtn = document.getElementById('newInvoiceBtn');
        if (newBtn) {
            newBtn.addEventListener('click', function() {
                showSuccess('Creating new invoice...');
            });
        }

        var backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.history.back();
            });
        }

        // Update invoice totals (demo)
        updateInvoiceTotals();
    }

    function updateInvoiceTotals() {
        var subtotal = 1194;
        var gst = Math.round(subtotal * 0.05);
        var discount = 70;
        var total = subtotal + gst - discount;

        var elSub = document.getElementById('invSubtotal');
        var elGst = document.getElementById('invGst');
        var elDisc = document.getElementById('invDiscount');
        var elGrand = document.getElementById('invGrandTotal');

        if (elSub) elSub.textContent = formatCurrency(subtotal);
        if (elGst) elGst.textContent = formatCurrency(gst);
        if (elDisc) elDisc.textContent = '-' + formatCurrency(discount);
        if (elGrand) elGrand.textContent = formatCurrency(total);
    }

    /* ==============================================================
       SECTION 13: CART
       ============================================================== */

    var cartItems = [];

    function initCart() {
        loadCart();

        var checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cartItems.length === 0) {
                    showError('Your cart is empty');
                    return;
                }
                showSuccess('Redirecting to checkout...');
                setTimeout(function() {
                    navigateTo('billing');
                }, 600);
            });
        }

        var clearBtn = document.querySelector('.clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (cartItems.length === 0) {
                    showInfo('Cart is already empty');
                    return;
                }
                showConfirm('Clear Cart', 'Are you sure you want to clear your cart?', 'Clear', 'Cancel',
                    function() {
                        apiClearCart().then(function() {
                            cartItems = [];
                            renderCart();
                            showSuccess('Cart cleared');
                        });
                    }
                );
            });
        }

        var couponBtn = document.querySelector('.coupon-row button');
        if (couponBtn) {
            couponBtn.addEventListener('click', function() {
                var input = document.querySelector('.coupon-row input');
                if (input) {
                    var code = input.value.trim().toUpperCase();
                    if (code === 'SAVE10') {
                        showSuccess('🎉 Coupon SAVE10 applied! 10% discount');
                    } else if (code) {
                        showError('Invalid coupon code. Try SAVE10');
                    } else {
                        showError('Please enter a coupon code');
                    }
                }
            });
        }

        // Cart item quantity controls
        document.addEventListener('click', function(e) {
            var btn = e.target.closest('.qty-control button');
            if (btn) {
                var itemEl = btn.closest('.cart-item');
                if (itemEl) {
                    var id = itemEl.dataset.id;
                    var span = itemEl.querySelector('.qty-control span');
                    var current = parseInt(span.textContent) || 0;
                    var delta = btn.textContent === '+' ? 1 : -1;
                    var newQty = Math.max(1, current + delta);
                    span.textContent = newQty;
                    // Update total
                    var priceText = itemEl.querySelector('.item-price') ? itemEl.querySelector('.item-price').textContent.replace('₹', '').replace(' each', '').trim() : '0';
                    var price = parseFloat(priceText) || 0;
                    var totalEl = itemEl.querySelector('.item-total');
                    if (totalEl) totalEl.textContent = formatCurrency(price * newQty);
                    updateCartTotals();
                    showInfo('Updated quantity to ' + newQty);
                }
            }

            var removeBtn = e.target.closest('.remove-item');
            if (removeBtn) {
                var itemEl = removeBtn.closest('.cart-item');
                if (itemEl) {
                    var id = itemEl.dataset.id;
                    showConfirm('Remove Item', 'Remove this item from cart?', 'Remove', 'Cancel',
                        function() {
                            apiRemoveFromCart(id).then(function() {
                                loadCart();
                                showSuccess('Item removed');
                            });
                        }
                    );
                }
            }
        });
    }

    function loadCart() {
        apiGetCart().then(function(data) {
            cartItems = data;
            renderCart();
        });
    }

    function renderCart() {
        var container = document.getElementById('cartItemsList');
        if (!container) return;

        if (cartItems.length === 0) {
            container.innerHTML = '<div class="empty-cart"><span class="empty-icon">🛒</span><h4>Your cart is empty</h4><p>Looks like you haven\'t added any items yet.</p></div>';
            document.querySelector('.checkout-btn').disabled = true;
            return;
        }

        document.querySelector('.checkout-btn').disabled = false;

        var icons = { 'groceries': 'rice_bowl', 'dairy': 'no_drinks', 'beverages': 'local_drink', 'snacks': 'fastfood' };
        container.innerHTML = cartItems.map(function(item) {
            var icon = icons[item.category] || 'shopping_bag';
            return '<div class="cart-item" data-id="' + item.productId + '">' +
                '<div class="item-icon"><span class="material-symbols-outlined">' + icon + '</span></div>' +
                '<div class="item-info"><h4>' + escapeHtml(item.name) + '</h4>' +
                '<span class="item-category">' + escapeHtml(item.category || '') + '</span>' +
                '<div class="item-price">' + formatCurrency(item.price) + ' each</div></div>' +
                '<div class="qty-control"><button>−</button><span>' + item.qty + '</span><button>+</button></div>' +
                '<div class="item-total">' + formatCurrency(item.price * item.qty) + '</div>' +
                '<button class="remove-item"><span class="material-symbols-outlined">close</span></button></div>';
        }).join('');

        updateCartTotals();
        updateCartCount();
    }

    function updateCartTotals() {
        var subtotal = cartItems.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
        var shipping = subtotal >= 500 ? 0 : 40;
        var discount = 0;
        var total = subtotal + shipping - discount;

        var elSub = document.getElementById('cartSubtotal');
        var elShip = document.getElementById('cartShipping');
        var elDisc = document.getElementById('cartDiscount');
        var elGrand = document.getElementById('cartGrandTotal');
        var elDiscRow = document.getElementById('cartDiscountRow');

        if (elSub) elSub.textContent = formatCurrency(subtotal);
        if (elShip) elShip.textContent = shipping === 0 ? 'Free' : formatCurrency(shipping);
        if (elDisc) {
            elDisc.textContent = '-' + formatCurrency(discount);
            if (elDiscRow) elDiscRow.style.display = discount > 0 ? 'flex' : 'none';
        }
        if (elGrand) elGrand.textContent = formatCurrency(total);
    }

    function updateCartCount() {
        var count = cartItems.reduce(function(sum, item) { return sum + item.qty; }, 0);
        var badge = document.querySelector('.nav-link .badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? '' : 'none';
        }
        var itemCount = document.querySelector('.item-count');
        if (itemCount) {
            itemCount.textContent = count + ' items';
        }
    }

    /* ==============================================================
       SECTION 14: SETTINGS & PROFILE
       ============================================================== */

    function initSettings() {
        // Theme toggle in settings
        var settingsToggle = document.getElementById('settingsThemeToggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', function() {
                var theme = toggleTheme();
                showInfo('Theme changed to ' + theme);
            });
        }

        // Other toggles
        document.querySelectorAll('#view-settings .toggle-switch:not(#settingsThemeToggle)').forEach(function(sw) {
            sw.addEventListener('click', function() {
                this.classList.toggle('active');
                var isActive = this.classList.contains('active');
                var label = this.closest('.setting-group').querySelector('.setting-label h4');
                if (label) {
                    showInfo(label.textContent + ' ' + (isActive ? 'enabled' : 'disabled'));
                }
            });
        });

        // Privacy manage button
        var privacyBtn = document.getElementById('privacyBtn');
        if (privacyBtn) {
            privacyBtn.addEventListener('click', function() {
                showInfo('Privacy settings management');
            });
        }

        // Profile edit
        var editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                showInfo('Edit profile form would open');
            });
        }

        // Password change
        var passBtn = document.getElementById('changePasswordBtn');
        if (passBtn) {
            passBtn.addEventListener('click', function() {
                showInfo('Change password dialog would open');
            });
        }

        // Avatar edit
        var avatarBtn = document.getElementById('avatarEditBtn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', function() {
                showInfo('Change avatar dialog would open');
            });
        }

        // Profile back button
        var profileBackBtn = document.getElementById('profileBackBtn');
        if (profileBackBtn) {
            profileBackBtn.addEventListener('click', function() {
                window.history.back();
            });
        }
    }

    /* ==============================================================
       SECTION 15: NOTIFICATIONS VIEW
       ============================================================== */

    function initNotificationsView() {
        var markBtn = document.getElementById('markAllRead');
        if (markBtn) {
            markBtn.addEventListener('click', function() {
                var items = document.querySelectorAll('.notification-item');
                var count = 0;
                items.forEach(function(item) {
                    if (!item.classList.contains('read')) {
                        item.classList.add('read');
                        count++;
                    }
                });
                if (count > 0) {
                    showSuccess('Marked ' + count + ' notification' + (count > 1 ? 's' : '') + ' as read');
                } else {
                    showInfo('All notifications already read');
                }
            });
        }

        document.querySelectorAll('.notification-item').forEach(function(item) {
            item.addEventListener('click', function() {
                if (!this.classList.contains('read')) {
                    this.classList.add('read');
                    showSuccess('Marked as read');
                }
            });
        });
    }

    /* ==============================================================
       SECTION 16: REPORTS
       ============================================================== */

    function initReports() {
        // Export button in reports
        var exportBtn = document.querySelector('#view-reports .btn-secondary');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                showSuccess('Exporting reports as CSV (demo)');
            });
        }
    }

    /* ==============================================================
       SECTION 17: GLOBAL EVENT BINDING
       ============================================================== */

    function initGlobalEvents() {
        // Theme toggle (top nav)
        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                var theme = toggleTheme();
                showInfo('Theme changed to ' + theme);
            });
        }

        // Navigation links with data-view
        document.addEventListener('click', function(e) {
            var target = e.target.closest('[data-view]');
            if (target) {
                e.preventDefault();
                var view = target.getAttribute('data-view');
                if (view) {
                    navigateTo(view);
                }
            }
        });

        // Search global
        var globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    var val = this.value.trim();
                    if (val) {
                        showInfo('Searching for "' + val + '" (demo)');
                    }
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSidebar();
                document.querySelectorAll('.modal.active').forEach(function(modal) {
                    modal.classList.remove('active');
                });
            }
        });

        // Quick action buttons (dashboard)
        document.querySelectorAll('.action-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var label = this.querySelector('span:last-child')?.textContent || 'Action';
                showInfo(label + ' triggered (demo)');
            });
        });
    }

    /* ==============================================================
       SECTION 18: APP INITIALIZATION
       ============================================================== */

    function initApp() {
        // Show splash screen
        var splash = document.getElementById('splash-screen');
        if (splash) {
            setTimeout(function() {
                splash.classList.add('hidden');
                setTimeout(function() {
                    splash.style.display = 'none';
                }, 500);
            }, 800);
        }

        // Initialize modules
        initNotifications();
        initTheme();
        initSidebar();
        initAuth();
        initRouter();

        // Feature modules
        initProducts();
        initOrders();
        initCustomers();
        initCart();
        initBilling();
        initSettings();
        initNotificationsView();
        initReports();

        // Load dashboard
        loadDashboard();

        // Global events
        initGlobalEvents();

        // Show welcome message
        setTimeout(function() {
            showSuccess('Welcome to UdharKart!');
        }, 1000);
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

})();
