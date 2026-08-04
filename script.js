/**
 * ============================================================
 * UDHARKART — COMBINED JAVASCRIPT
 * Includes: config, auth, router, dashboard, products, cart,
 * orders, billing, khata, inventory, reports, notifications,
 * profile, settings, theme, validation, helpers, API, storage.
 * ============================================================
 */

// ============================================================
// 1. CONFIGURATION
// ============================================================
const CONFIG = {
    SUPABASE_URL: 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key',
    APP_NAME: 'UdharKart',
    VERSION: '1.0.0',
    // Role constants
    ROLES: {
        CUSTOMER: 'customer',
        SHOPKEEPER: 'shopkeeper',
        ADMIN: 'admin'
    },
    // API endpoints (if using direct REST)
    API_BASE: '/api',
};

// ============================================================
// 2. SUPABASE CLIENT (stub – replace with real client)
// ============================================================
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.auth = {
            signInWithOtp: async (phone) => {
                console.log(`[Supabase] OTP sent to ${phone}`);
                // Simulate OTP
                return { data: { user: { phone } }, error: null };
            },
            verifyOtp: async (phone, token) => {
                console.log(`[Supabase] Verifying OTP ${token} for ${phone}`);
                // Simulate verification
                if (token === '123456') {
                    return { data: { user: { phone, role: 'customer' } }, error: null };
                }
                return { data: null, error: { message: 'Invalid OTP' } };
            },
            getSession: () => {
                const session = JSON.parse(localStorage.getItem('udharkart_session'));
                return { data: { session }, error: null };
            },
            signOut: async () => {
                localStorage.removeItem('udharkart_session');
                return { error: null };
            }
        };
        this.from = (table) => ({
            select: (columns) => ({
                eq: (field, value) => ({
                    order: (col, { ascending }) => ({
                        then: (callback) => {
                            // Mock data
                            const mockData = getMockData(table);
                            const filtered = mockData.filter(item => item[field] === value);
                            const sorted = filtered.sort((a, b) => ascending ? a[col] - b[col] : b[col] - a[col]);
                            callback({ data: sorted, error: null });
                            return this;
                        }
                    }),
                    then: (callback) => {
                        const mockData = getMockData(table);
                        const filtered = mockData.filter(item => item[field] === value);
                        callback({ data: filtered, error: null });
                        return this;
                    }
                }),
                then: (callback) => {
                    const mockData = getMockData(table);
                    callback({ data: mockData, error: null });
                    return this;
                }
            }),
            insert: (data) => ({
                then: (callback) => {
                    console.log(`[Supabase] Insert into ${table}:`, data);
                    callback({ data, error: null });
                    return this;
                }
            }),
            update: (data) => ({
                eq: (field, value) => ({
                    then: (callback) => {
                        console.log(`[Supabase] Update ${table} set`, data, 'where', field, '=', value);
                        callback({ data, error: null });
                        return this;
                    }
                })
            }),
            delete: () => ({
                eq: (field, value) => ({
                    then: (callback) => {
                        console.log(`[Supabase] Delete from ${table} where ${field}=${value}`);
                        callback({ data: null, error: null });
                        return this;
                    }
                })
            })
        });
        this.channel = (name) => ({
            on: (event, filter, callback) => {
                console.log(`[Supabase] Realtime channel ${name} listening`);
                // Simulate realtime events
                setInterval(() => {
                    callback({ new: { id: Date.now(), status: 'pending' } });
                }, 30000);
                return this;
            },
            subscribe: () => {
                console.log(`[Supabase] Subscribed to channel ${name}`);
                return this;
            }
        });
        this.removeChannel = (channel) => {
            console.log(`[Supabase] Removed channel`);
        };
    }
}

// Mock data helper
function getMockData(table) {
    const mockDB = {
        customers: [
            { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', state: 'Maharashtra', district: 'Mumbai', city: 'Mumbai', pincode: '400001', language: 'English' },
            { id: 2, name: 'Amit Singh', phone: '+91 87654 32109', state: 'Delhi', district: 'Delhi', city: 'Delhi', pincode: '110001', language: 'Hindi' },
        ],
        shopkeepers: [
            { id: 1, owner_name: 'Rajesh Kumar', shop_name: 'FreshMart Grocery', gst: '22ABCDE1234F1Z5', phone: '+91 98765 43210', address: 'Shop No. 12, Main Bazaar', category: 'Grocery', opening: '8:00 AM', closing: '10:00 PM', upi: 'freshmart@upi' },
        ],
        products: [
            { id: 1, name: 'Aashirvaad Atta (5kg)', brand: 'Aashirvaad', image: '🛒', mrp: 210, selling_price: 185, category: 'Groceries', barcode: '8901234567890', gst: 5, unit: 'kg', stock: 24 },
            { id: 2, name: 'Fortune Sunflower Oil (1L)', brand: 'Fortune', image: '🛒', mrp: 175, selling_price: 149, category: 'Groceries', barcode: '8901234567891', gst: 5, unit: 'L', stock: 12 },
            // ... more products
        ],
        orders: [
            { id: 'ORD-1024', customer_id: 1, shopkeeper_id: 1, status: 'completed', total: 245, created_at: '2026-08-03T10:30:00' },
            { id: 'ORD-1023', customer_id: 2, shopkeeper_id: 1, status: 'processing', total: 680, created_at: '2026-08-03T09:15:00' },
            { id: 'ORD-1022', customer_id: 1, shopkeeper_id: 1, status: 'pending', total: 432.5, created_at: '2026-08-02T18:45:00' },
        ],
        order_items: [
            { order_id: 'ORD-1024', product_id: 1, quantity: 2, price: 185 },
            { order_id: 'ORD-1024', product_id: 2, quantity: 1, price: 149 },
            { order_id: 'ORD-1023', product_id: 3, quantity: 1, price: 195 },
        ],
        bills: [
            { id: 1, order_id: 'ORD-1024', invoice_no: 'INV-2026-001', total: 729.70, created_at: '2026-08-03T10:45:00' },
        ],
        payments: [
            { id: 1, order_id: 'ORD-1024', amount: 729.70, method: 'UPI', status: 'completed', created_at: '2026-08-03T10:45:00' },
        ],
        credit_ledger: [
            { id: 1, customer_id: 1, shopkeeper_id: 1, type: 'credit', amount: 500, description: 'Payment received', date: '2026-08-03T10:30:00' },
            { id: 2, customer_id: 1, shopkeeper_id: 1, type: 'debit', amount: 520, description: 'Order #ORD-1028', date: '2026-08-03T09:15:00' },
        ],
        inventory: [
            { product_id: 1, quantity: 24, low_stock_threshold: 10 },
            { product_id: 2, quantity: 12, low_stock_threshold: 10 },
        ],
        notifications: [
            { id: 1, user_id: 1, message: 'New order #ORD-1028 from Meera Patel', read: false, created_at: '2026-08-03T10:32:00' },
        ],
    };
    return mockDB[table] || [];
}

// Instantiate Supabase client
const supabase = new SupabaseClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

// ============================================================
// 3. UTILITY FUNCTIONS
// ============================================================
const Utils = {
    // Format currency
    formatCurrency: (amount) => {
        return '₹' + Number(amount).toFixed(2);
    },
    // Format date
    formatDate: (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    // Generate random ID
    generateId: () => {
        return 'ID-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    },
    // Debounce
    debounce: (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },
    // Deep clone
    clone: (obj) => JSON.parse(JSON.stringify(obj)),
    // Get URL params
    getParams: () => {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }
};

// ============================================================
// 4. STORAGE (localStorage wrapper)
// ============================================================
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem('udharkart_' + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: (key, value) => {
        localStorage.setItem('udharkart_' + key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem('udharkart_' + key);
    },
    // Cart specific
    getCart: () => Storage.get('cart', []),
    saveCart: (cart) => Storage.set('cart', cart),
    // Wishlist
    getWishlist: () => Storage.get('wishlist', []),
    saveWishlist: (wishlist) => Storage.set('wishlist', wishlist),
    // Theme
    getTheme: () => Storage.get('theme', 'light'),
    saveTheme: (theme) => Storage.set('theme', theme),
};

// ============================================================
// 5. VALIDATION
// ============================================================
const Validator = {
    isPhone: (phone) => {
        return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
    },
    isEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    isPincode: (pincode) => {
        return /^[0-9]{6}$/.test(pincode);
    },
    isGST: (gst) => {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
    },
    required: (value) => {
        return value && value.trim().length > 0;
    },
    minLength: (value, min) => {
        return value && value.length >= min;
    },
    maxLength: (value, max) => {
        return value && value.length <= max;
    },
    validateForm: (formData, rules) => {
        const errors = {};
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field] || '';
            if (rule.required && !Validator.required(value)) {
                errors[field] = 'This field is required';
            } else if (rule.min && value.length < rule.min) {
                errors[field] = `Minimum ${rule.min} characters required`;
            } else if (rule.max && value.length > rule.max) {
                errors[field] = `Maximum ${rule.max} characters allowed`;
            } else if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.message || 'Invalid format';
            }
        }
        return errors;
    }
};

// ============================================================
// 6. AUTHENTICATION
// ============================================================
const Auth = {
    currentUser: null,
    currentRole: null,

    init: async () => {
        const session = Storage.get('session', null);
        if (session) {
            Auth.currentUser = session.user;
            Auth.currentRole = session.role;
            return true;
        }
        return false;
    },

    loginWithOTP: async (phone, role) => {
        try {
            const { data, error } = await supabase.auth.signInWithOtp(phone);
            if (error) throw error;
            // Store phone temporarily for verification
            Storage.set('otp_phone', phone);
            Storage.set('otp_role', role);
            return { success: true, message: 'OTP sent to ' + phone };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    verifyOTP: async (token) => {
        try {
            const phone = Storage.get('otp_phone');
            const role = Storage.get('otp_role');
            if (!phone) throw new Error('Phone number not found');
            const { data, error } = await supabase.auth.verifyOtp(phone, token);
            if (error) throw error;
            // Set user
            Auth.currentUser = data.user;
            Auth.currentRole = role;
            Storage.set('session', { user: data.user, role });
            Storage.remove('otp_phone');
            Storage.remove('otp_role');
            // Navigate based on role
            const dashboard = role === 'customer' ? 'customer-dashboard' :
                             role === 'shopkeeper' ? 'shopkeeper-dashboard' :
                             'admin-dashboard';
            Router.navigate(dashboard);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        Auth.currentUser = null;
        Auth.currentRole = null;
        Storage.remove('session');
        Router.navigate('login');
    },

    getRole: () => Auth.currentRole,
    getUser: () => Auth.currentUser,
    isAuthenticated: () => !!Auth.currentUser,
};

// ============================================================
// 7. ROUTER
// ============================================================
const Router = {
    routes: {
        'customer-dashboard': { title: 'Dashboard', subtitle: 'Welcome back' },
        'shopkeeper-dashboard': { title: 'Shop Dashboard', subtitle: 'Manage your store' },
        'admin-dashboard': { title: 'Admin Panel', subtitle: 'Platform oversight' },
        'products': { title: 'Products', subtitle: 'Browse our catalog' },
        'categories': { title: 'Categories', subtitle: 'Shop by category' },
        'cart': { title: 'Shopping Cart', subtitle: 'Review your items' },
        'orders': { title: 'Orders', subtitle: 'Track your orders' },
        'billing': { title: 'Billing', subtitle: 'Generate invoices' },
        'digital-khata': { title: 'Digital Khata', subtitle: 'Manage credit ledger' },
        'customer-list': { title: 'Customers', subtitle: 'Manage customer accounts' },
        'inventory': { title: 'Inventory', subtitle: 'Stock management' },
        'reports': { title: 'Reports', subtitle: 'Business insights' },
        'analytics': { title: 'Analytics', subtitle: 'Data & metrics' },
        'profile': { title: 'Profile', subtitle: 'Your account details' },
        'settings': { title: 'Settings', subtitle: 'App preferences' },
        'notifications': { title: 'Notifications', subtitle: 'Recent alerts' },
        'support': { title: 'Support', subtitle: 'Help & resources' },
        'login': { title: 'Login', subtitle: 'Sign in to your account' },
        'register': { title: 'Register', subtitle: 'Create new account' },
        '404': { title: '404', subtitle: 'Page not found' },
        'maintenance': { title: 'Maintenance', subtitle: 'Under construction' },
    },

    currentPage: 'customer-dashboard',

    navigate: (pageId, params = {}) => {
        // If login/register, handle separately
        if (pageId === 'login' || pageId === 'register') {
            // Hide all sections and show login/register overlay? For simplicity, we'll just show the page.
            // In real app, we might have separate HTML.
            // For now, we'll just use the same logic.
        }
        // Hide all page sections
        document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('page-' + pageId);
        if (target) {
            target.classList.add('active');
            Router.currentPage = pageId;
            // Update nav links
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.page === pageId);
            });
            // Update title
            const info = Router.routes[pageId] || { title: pageId, subtitle: '' };
            document.getElementById('pageTitle').textContent = info.title;
            document.getElementById('pageSubtitle').textContent = info.subtitle || '';
            // Close sidebar on mobile
            UI.closeSidebar();
            // Close notification dropdown
            UI.closeNotifications();
            // Trigger page-specific load
            Router.onPageChange(pageId);
        } else {
            // 404
            Router.navigate('404');
        }
    },

    onPageChange: (pageId) => {
        // Load data for specific pages
        switch (pageId) {
            case 'customer-dashboard':
                Dashboard.loadCustomerStats();
                break;
            case 'shopkeeper-dashboard':
                Dashboard.loadShopkeeperStats();
                break;
            case 'admin-dashboard':
                Dashboard.loadAdminStats();
                break;
            case 'products':
                Products.loadProducts();
                break;
            case 'cart':
                Cart.renderCart();
                break;
            case 'orders':
                Orders.loadOrders();
                break;
            case 'billing':
                Billing.loadInvoiceData();
                break;
            case 'digital-khata':
                Khata.loadLedger();
                break;
            case 'inventory':
                Inventory.loadInventory();
                break;
            case 'notifications':
                Notifications.loadNotifications();
                break;
            case 'profile':
                Profile.loadProfile();
                break;
            default:
                break;
        }
    }
};

// ============================================================
// 8. UI HELPERS
// ============================================================
const UI = {
    closeSidebar: () => {
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebarOverlay')?.classList.remove('active');
    },
    openSidebar: () => {
        document.getElementById('sidebar')?.classList.add('open');
        document.getElementById('sidebarOverlay')?.classList.add('active');
    },
    closeNotifications: () => {
        document.getElementById('notifDropdown')?.classList.remove('open');
    },
    toggleNotifications: () => {
        document.getElementById('notifDropdown')?.classList.toggle('open');
    },
    showToast: (message, type = 'info') => {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; bottom: 24px; right: 24px;
            padding: 12px 24px; border-radius: var(--radius-sm);
            background: var(--gray-900); color: white;
            font-family: var(--font-sans); font-size: 0.9rem;
            box-shadow: var(--shadow-lg); z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        if (type === 'success') toast.style.background = 'var(--success)';
        else if (type === 'error') toast.style.background = 'var(--danger)';
        else if (type === 'warning') toast.style.background = 'var(--warning)';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    confirm: (message) => {
        return confirm(message);
    },
    // Render skeleton loader
    showSkeleton: (container, count = 3) => {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            skeleton.style.cssText = `
                height: 80px; background: var(--gray-200); border-radius: var(--radius-sm);
                animation: pulse 1.5s infinite;
            `;
            container.appendChild(skeleton);
        }
    },
};

// ============================================================
// 9. DASHBOARD
// ============================================================
const Dashboard = {
    loadCustomerStats: async () => {
        // Fetch stats from API
        const stats = {
            totalOrders: 24,
            pendingUdhar: 4320,
            savedCarts: 3,
            favorites: 18,
        };
        document.querySelector('.stats-grid .stat-value')?.forEach((el, idx) => {
            const values = [stats.totalOrders, stats.pendingUdhar, stats.savedCarts, stats.favorites];
            if (el) el.textContent = idx === 1 ? '₹' + values[idx] : values[idx];
        });
        // Load recent orders
        const orders = await Orders.getOrders();
        const orderContainer = document.querySelector('.order-item')?.parentElement;
        if (orderContainer) {
            orderContainer.innerHTML = '';
            orders.slice(0, 3).forEach(order => {
                const item = document.createElement('div');
                item.className = 'order-item';
                item.innerHTML = `
                    <span class="order-status ${order.status}"></span>
                    <div class="order-info">
                        <div class="order-id">#${order.id}</div>
                        <div class="order-meta">${order.customer_name || 'Customer'} • ${order.items || 0} items • ${Utils.formatDate(order.created_at)}</div>
                    </div>
                    <div class="order-amount">${Utils.formatCurrency(order.total)}</div>
                    <span class="badge-status ${order.status}">${order.status}</span>
                `;
                orderContainer.appendChild(item);
            });
        }
    },
    loadShopkeeperStats: async () => {
        // Similar
        const stats = {
            todayRevenue: 8420,
            monthlyRevenue: 142300,
            pendingUdhar: 24580,
            newOrders: 12,
        };
        // Update stat cards
    },
    loadAdminStats: async () => {
        // Admin stats
    }
};

// ============================================================
// 10. PRODUCTS
// ============================================================
const Products = {
    products: [],
    categories: [],

    loadProducts: async (category = null) => {
        let query = supabase.from('products').select('*');
        if (category) {
            query = query.eq('category', category);
        }
        const { data, error } = await query.then(res => res);
        if (error) {
            console.error('Error loading products:', error);
            return;
        }
        Products.products = data || [];
        Products.renderProducts(data);
    },

    renderProducts: (products) => {
        const grid = document.querySelector('.product-grid');
        if (!grid) return;
        grid.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">${product.image || '🛒'}</div>
                <div class="product-body">
                    <div class="name">${product.name}</div>
                    <div class="brand">${product.brand || ''}</div>
                    <div class="price">
                        <span class="mrp">${Utils.formatCurrency(product.mrp)}</span>
                        <span class="sell">${Utils.formatCurrency(product.selling_price)}</span>
                    </div>
                    <button class="btn btn-primary btn-sm add-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });
        // Attach add to cart events
        grid.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.productId);
                const product = Products.products.find(p => p.id === id);
                if (product) Cart.addItem(product);
            });
        });
    },

    searchProducts: async (query) => {
        // Simulate search
        const { data } = await supabase.from('products').select('*').then(res => res);
        const filtered = data.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));
        Products.renderProducts(filtered);
    },

    loadCategories: async () => {
        // Mock categories
        const categories = [
            { name: 'Groceries', count: 48 },
            { name: 'Dairy', count: 32 },
            { name: 'Beverages', count: 27 },
            { name: 'Snacks', count: 39 },
            { name: 'Household', count: 22 },
            { name: 'Rice & Grains', count: 18 },
            { name: 'Spices', count: 25 },
            { name: 'Personal Care', count: 30 },
        ];
        Products.categories = categories;
        // Render categories if needed
    }
};

// ============================================================
// 11. CART
// ============================================================
const Cart = {
    items: [],

    init: () => {
        Cart.items = Storage.getCart();
        Cart.renderCart();
    },

    addItem: (product, quantity = 1) => {
        const existing = Cart.items.find(item => item.product.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            Cart.items.push({ product, quantity });
        }
        Storage.saveCart(Cart.items);
        Cart.renderCart();
        UI.showToast(`${product.name} added to cart`, 'success');
    },

    removeItem: (productId) => {
        Cart.items = Cart.items.filter(item => item.product.id !== productId);
        Storage.saveCart(Cart.items);
        Cart.renderCart();
    },

    updateQuantity: (productId, delta) => {
        const item = Cart.items.find(item => item.product.id === productId);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            Cart.removeItem(productId);
            return;
        }
        Storage.saveCart(Cart.items);
        Cart.renderCart();
    },

    clearCart: () => {
        Cart.items = [];
        Storage.saveCart(Cart.items);
        Cart.renderCart();
    },

    renderCart: () => {
        const container = document.querySelector('.cart-items-container');
        if (!container) return;
        if (Cart.items.length === 0) {
            container.innerHTML = `<div class="empty-state"><span class="material-symbols-rounded">shopping_cart</span><h3>Your cart is empty</h3><p>Add items from the product catalog</p></div>`;
            return;
        }
        let html = '';
        let subtotal = 0;
        Cart.items.forEach(item => {
            const total = item.product.selling_price * item.quantity;
            subtotal += total;
            html += `
                <div class="cart-item" data-product-id="${item.product.id}">
                    <div class="item-img">${item.product.image || '🛒'}</div>
                    <div class="item-info">
                        <div class="item-name">${item.product.name}</div>
                        <div class="item-brand">${item.product.brand || ''}</div>
                    </div>
                    <div class="item-price">${Utils.formatCurrency(item.product.selling_price)}</div>
                    <div class="qty-control">
                        <button class="qty-minus" data-id="${item.product.id}">−</button>
                        <span class="qty">${item.quantity}</span>
                        <button class="qty-plus" data-id="${item.product.id}">+</button>
                    </div>
                    <button class="btn btn-icon-sm btn-ghost remove-item" data-id="${item.product.id}">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            `;
        });
        container.innerHTML = html;
        // Attach events
        container.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                Cart.updateQuantity(id, -1);
            });
        });
        container.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                Cart.updateQuantity(id, 1);
            });
        });
        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                Cart.removeItem(id);
            });
        });
        // Update totals
        const totalEl = document.querySelector('.cart-total');
        if (totalEl) {
            const gst = subtotal * 0.05;
            const grand = subtotal + gst;
            totalEl.innerHTML = `
                <div>Subtotal: ${Utils.formatCurrency(subtotal)}</div>
                <div>GST (5%): ${Utils.formatCurrency(gst)}</div>
                <div><strong>Total: ${Utils.formatCurrency(grand)}</strong></div>
            `;
        }
    },

    getTotal: () => {
        let subtotal = 0;
        Cart.items.forEach(item => {
            subtotal += item.product.selling_price * item.quantity;
        });
        const gst = subtotal * 0.05;
        return { subtotal, gst, grand: subtotal + gst };
    }
};

// ============================================================
// 12. ORDERS
// ============================================================
const Orders = {
    orders: [],

    loadOrders: async () => {
        const { data } = await supabase.from('orders').select('*').then(res => res);
        Orders.orders = data || [];
        Orders.renderOrders(data);
    },

    renderOrders: (orders) => {
        const container = document.querySelector('.orders-list');
        if (!container) return;
        container.innerHTML = '';
        orders.forEach(order => {
            const item = document.createElement('div');
            item.className = 'order-item';
            item.innerHTML = `
                <span class="order-status ${order.status}"></span>
                <div class="order-info">
                    <div class="order-id">#${order.id}</div>
                    <div class="order-meta">${order.customer_name || 'Customer'} • ${order.items || 0} items • ${Utils.formatDate(order.created_at)}</div>
                </div>
                <div class="order-amount">${Utils.formatCurrency(order.total)}</div>
                <span class="badge-status ${order.status}">${order.status}</span>
            `;
            container.appendChild(item);
        });
    },

    placeOrder: async (cartItems, customerId, shopkeeperId, paymentMethod) => {
        // Calculate totals
        let total = 0;
        cartItems.forEach(item => {
            total += item.product.selling_price * item.quantity;
        });
        const orderData = {
            id: 'ORD-' + Date.now().toString().slice(-6),
            customer_id: customerId,
            shopkeeper_id: shopkeeperId,
            status: 'pending',
            total: total,
            created_at: new Date().toISOString(),
            items: cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.selling_price
            }))
        };
        // Insert order
        const { data, error } = await supabase.from('orders').insert(orderData).then(res => res);
        if (error) {
            UI.showToast('Order failed: ' + error.message, 'error');
            return false;
        }
        // Clear cart
        Cart.clearCart();
        UI.showToast('Order placed successfully!', 'success');
        // Navigate to orders
        Router.navigate('orders');
        return true;
    }
};

// ============================================================
// 13. BILLING
// ============================================================
const Billing = {
    loadInvoiceData: () => {
        // Mock invoice data
        const invoice = {
            invoice_no: 'INV-2026-001',
            date: new Date().toISOString(),
            customer: { name: 'Priya Sharma', phone: '+91 98765 43210', address: 'Mumbai, Maharashtra' },
            shop: { name: 'FreshMart Grocery', address: 'Shop No. 12, Main Bazaar', phone: '+91 87654 32109' },
            items: [
                { name: 'Aashirvaad Atta (5kg)', qty: 2, price: 185, total: 370 },
                { name: 'Fortune Oil (1L)', qty: 1, price: 149, total: 149 },
                { name: 'India Gate Rice (1kg)', qty: 1, price: 195, total: 195 },
            ],
            subtotal: 714,
            gst: 35.70,
            discount: 20,
            grand_total: 729.70,
            payment_method: 'UPI'
        };
        // Render invoice
        const container = document.querySelector('.invoice-box');
        if (!container) return;
        // Build HTML
        let itemsHtml = '';
        invoice.items.forEach((item, idx) => {
            itemsHtml += `<tr><td>${idx+1}</td><td>${item.name}</td><td>${item.qty}</td><td>${Utils.formatCurrency(item.price)}</td><td>${Utils.formatCurrency(item.total)}</td></tr>`;
        });
        container.innerHTML = `
            <div class="invoice-header">
                <div><div class="brand">Udhar<span>Kart</span></div><div style="font-size:0.85rem;color:var(--gray-500);">Smart Shopping • Digital Khata</div></div>
                <div class="invoice-meta"><strong>Invoice #:</strong> ${invoice.invoice_no}<br/><strong>Date:</strong> ${Utils.formatDate(invoice.date)}</div>
            </div>
            <div class="invoice-details">
                <div class="detail-group"><h4>Bill To</h4><p>${invoice.customer.name}<br/>${invoice.customer.phone}<br/>${invoice.customer.address}</p></div>
                <div class="detail-group"><h4>Shop</h4><p>${invoice.shop.name}<br/>${invoice.shop.address}<br/>${invoice.shop.phone}</p></div>
            </div>
            <table class="invoice-table">
                <thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            <div class="invoice-totals">
                <div class="total-row"><span>Subtotal</span><span>${Utils.formatCurrency(invoice.subtotal)}</span></div>
                <div class="total-row"><span>GST (5%)</span><span>${Utils.formatCurrency(invoice.gst)}</span></div>
                <div class="total-row"><span>Discount</span><span>−${Utils.formatCurrency(invoice.discount)}</span></div>
                <div class="total-row grand"><span>Grand Total</span><span>${Utils.formatCurrency(invoice.grand_total)}</span></div>
            </div>
            <div class="invoice-footer">Thank you for shopping with UdharKart! • Payment: ${invoice.payment_method} • QR Code: [Generated]</div>
        `;
    },

    printInvoice: () => {
        window.print();
    },

    generatePDF: () => {
        UI.showToast('PDF generation will be available soon.', 'info');
    }
};

// ============================================================
// 14. KHATA (LEDGER)
// ============================================================
const Khata = {
    entries: [],

    loadLedger: async () => {
        const { data } = await supabase.from('credit_ledger').select('*').then(res => res);
        Khata.entries = data || [];
        Khata.renderLedger(data);
    },

    renderLedger: (entries) => {
        const container = document.querySelector('.khata-list');
        if (!container) return;
        container.innerHTML = '';
        entries.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'khata-entry';
            const typeClass = entry.type === 'credit' ? 'credit' : 'debit';
            const icon = entry.type === 'credit' ? 'payments' : 'shopping_bag';
            const amount = entry.type === 'credit' ? `+${Utils.formatCurrency(entry.amount)}` : `-${Utils.formatCurrency(entry.amount)}`;
            div.innerHTML = `
                <div class="entry-icon ${typeClass}"><span class="material-symbols-rounded">${icon}</span></div>
                <div class="entry-info">
                    <div class="entry-title">${entry.description}</div>
                    <div class="entry-date">${Utils.formatDate(entry.date)}</div>
                </div>
                <div class="entry-amount ${typeClass}">${amount}</div>
            `;
            container.appendChild(div);
        });
    },

    addEntry: async (data) => {
        // data: { customer_id, shopkeeper_id, type, amount, description }
        const { error } = await supabase.from('credit_ledger').insert(data).then(res => res);
        if (!error) {
            UI.showToast('Entry added', 'success');
            Khata.loadLedger();
        } else {
            UI.showToast('Failed to add entry', 'error');
        }
    }
};

// ============================================================
// 15. INVENTORY
// ============================================================
const Inventory = {
    loadInventory: async () => {
        const { data } = await supabase.from('inventory').select('*').then(res => res);
        Inventory.renderInventory(data);
    },

    renderInventory: (inventory) => {
        const container = document.querySelector('.inventory-table tbody');
        if (!container) return;
        container.innerHTML = '';
        inventory.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="Product">${item.product_name || 'Product'}</td>
                <td data-label="Category">${item.category || 'General'}</td>
                <td data-label="Stock">${item.quantity}</td>
                <td data-label="Price">${Utils.formatCurrency(item.price || 0)}</td>
                <td data-label="Status"><span class="badge-status ${item.quantity > 10 ? 'completed' : 'pending'}">${item.quantity > 10 ? 'In Stock' : 'Low Stock'}</span></td>
            `;
            container.appendChild(tr);
        });
    },

    updateStock: async (productId, quantity) => {
        const { error } = await supabase.from('inventory').update({ quantity }).eq('product_id', productId).then(res => res);
        if (!error) {
            UI.showToast('Stock updated', 'success');
            Inventory.loadInventory();
        } else {
            UI.showToast('Update failed', 'error');
        }
    }
};

// ============================================================
// 16. NOTIFICATIONS
// ============================================================
const Notifications = {
    notifications: [],

    loadNotifications: async () => {
        const { data } = await supabase.from('notifications').select('*').then(res => res);
        Notifications.notifications = data || [];
        Notifications.renderNotifications(data);
    },

    renderNotifications: (notifs) => {
        const container = document.querySelector('.notifications-list');
        if (!container) return;
        container.innerHTML = '';
        notifs.forEach(notif => {
            const div = document.createElement('div');
            div.className = 'notif-item';
            div.innerHTML = `
                <span class="material-symbols-rounded notif-icon">notifications</span>
                <div class="notif-text">
                    <strong>${notif.message}</strong>
                    <span class="time">${Utils.formatDate(notif.created_at)}</span>
                </div>
            `;
            container.appendChild(div);
        });
    },

    markAsRead: async (id) => {
        // Update read status
        const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id).then(res => res);
        if (!error) Notifications.loadNotifications();
    }
};

// ============================================================
// 17. PROFILE
// ============================================================
const Profile = {
    loadProfile: () => {
        // Mock user data
        const user = Auth.currentUser || { name: 'Rajesh Kumar', phone: '+91 98765 43210', role: 'shopkeeper' };
        const profileForm = document.querySelector('.profile-form');
        if (!profileForm) return;
        // Fill form fields
        profileForm.querySelector('[name="name"]').value = user.name || '';
        profileForm.querySelector('[name="phone"]').value = user.phone || '';
        profileForm.querySelector('[name="role"]').value = user.role || '';
        // For shopkeeper specific fields
        if (user.role === 'shopkeeper') {
            // Additional fields
        }
    },

    updateProfile: async (data) => {
        // Update user profile in DB
        const { error } = await supabase.from('customers').update(data).eq('id', Auth.currentUser.id).then(res => res);
        if (!error) {
            UI.showToast('Profile updated', 'success');
        } else {
            UI.showToast('Update failed', 'error');
        }
    }
};

// ============================================================
// 18. SETTINGS
// ============================================================
const Settings = {
    loadSettings: () => {
        const theme = Storage.getTheme();
        document.querySelector('#theme-select')?.value = theme;
    },

    setTheme: (theme) => {
        Storage.saveTheme(theme);
        document.documentElement.setAttribute('data-theme', theme);
        UI.showToast(`Theme set to ${theme}`, 'info');
    },

    setLanguage: (lang) => {
        // Change language (placeholder)
        UI.showToast(`Language changed to ${lang}`, 'info');
    },

    toggleNotifications: (type, enabled) => {
        const prefs = Storage.get('notif_prefs', {});
        prefs[type] = enabled;
        Storage.set('notif_prefs', prefs);
    }
};

// ============================================================
// 19. THEME (initialization)
// ============================================================
const Theme = {
    init: () => {
        const theme = Storage.getTheme() || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        // Listen for theme toggle
        document.querySelector('.theme-toggle')?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            Settings.setTheme(next);
        });
    }
};

// ============================================================
// 20. HELPERS & API
// ============================================================
const API = {
    // Generic fetch wrapper
    fetch: async (endpoint, options = {}) => {
        const url = CONFIG.API_BASE + endpoint;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        return response.json();
    }
};

// ============================================================
// 21. ANIMATIONS
// ============================================================
const Animations = {
    init: () => {
        // Add CSS for animations if not present
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            @keyframes slideIn { from { transform:translateX(-20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
            @keyframes pulse { 0% { opacity:0.6; } 50% { opacity:1; } 100% { opacity:0.6; } }
            .fade-in { animation: fadeIn 0.3s ease; }
            .slide-in { animation: slideIn 0.3s ease; }
            .skeleton { animation: pulse 1.5s infinite; }
        `;
        document.head.appendChild(style);
    }
};

// ============================================================
// 22. MAIN INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme
    Theme.init();
    Animations.init();

    // Check authentication
    const isAuthed = await Auth.init();
    if (!isAuthed && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        // Redirect to login (but since we're in a single page, we navigate)
        Router.navigate('login');
        return;
    }

    // Setup event listeners
    // Navigation links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) Router.navigate(page);
        });
    });

    // "See all" links
    document.querySelectorAll('[data-page]').forEach(el => {
        if (el.classList.contains('nav-link')) return;
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const page = el.dataset.page;
            if (page) Router.navigate(page);
        });
    });

    // Sidebar toggle
    document.getElementById('menuToggle')?.addEventListener('click', UI.openSidebar);
    document.getElementById('sidebarOverlay')?.addEventListener('click', UI.closeSidebar);

    // Notification toggle
    document.getElementById('notifToggle')?.addEventListener('click', (e) => {
        e.stopPropagation();
        UI.toggleNotifications();
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notif-dropdown') && !e.target.closest('#notifToggle')) {
            UI.closeNotifications();
        }
    });

    // Global search
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('keydown', Utils.debounce(async (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    await Products.searchProducts(query);
                }
            }
        }, 300));
    }

    // Cart quantity controls (delegated)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.qty-minus, .qty-plus');
        if (target) {
            const id = parseInt(target.dataset.id);
            const delta = target.classList.contains('qty-plus') ? 1 : -1;
            Cart.updateQuantity(id, delta);
        }
        const removeBtn = e.target.closest('.remove-item');
        if (removeBtn) {
            const id = parseInt(removeBtn.dataset.id);
            Cart.removeItem(id);
        }
    });

    // Add to cart buttons (delegated)
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-btn');
        if (addBtn) {
            const id = parseInt(addBtn.dataset.productId);
            const product = Products.products.find(p => p.id === id);
            if (product) Cart.addItem(product);
        }
    });

    // Place order button
    document.querySelector('.place-order-btn')?.addEventListener('click', async () => {
        if (Cart.items.length === 0) {
            UI.showToast('Cart is empty', 'warning');
            return;
        }
        // Get current user
        const user = Auth.currentUser;
        if (!user) {
            UI.showToast('Please login first', 'error');
            return;
        }
        // For demo, assume customer ID = 1, shopkeeper ID = 1
        const success = await Orders.placeOrder(Cart.items, 1, 1, 'UPI');
        if (success) {
            // Optionally navigate to orders
        }
    });

    // Print invoice
    document.querySelector('.print-invoice')?.addEventListener('click', Billing.printInvoice);

    // Profile save
    document.querySelector('.profile-save')?.addEventListener('click', () => {
        const form = document.querySelector('.profile-form');
        if (form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            Profile.updateProfile(data);
        }
    });

    // Theme switch
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        Settings.setTheme(next);
    });

    // Load initial page based on route
    const initialPage = window.location.hash.replace('#', '') || 'customer-dashboard';
    Router.navigate(initialPage);

    // Listen to hash changes
    window.addEventListener('hashchange', () => {
        const page = window.location.hash.replace('#', '');
        if (page) Router.navigate(page);
    });

    // Init cart
    Cart.init();

    // Load products
    Products.loadProducts();

    // Load categories
    Products.loadCategories();

    // Start realtime notifications
    const channel = supabase.channel('public:orders');
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        UI.showToast('New order received!', 'info');
        // Reload orders if on orders page
        if (Router.currentPage === 'orders') Orders.loadOrders();
    }).subscribe();

    console.log('UdharKart initialized!');
});

// ============================================================
// EXPOSE GLOBALS (for debugging)
// ============================================================
window.UdharKart = {
    Auth,
    Router,
    Cart,
    Products,
    Orders,
    Billing,
    Khata,
    Inventory,
    Notifications,
    Profile,
    Settings,
    Utils,
    Storage,
    UI,
    supabase,
};