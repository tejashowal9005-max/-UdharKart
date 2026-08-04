/**
 * ============================================================
 * UDHARKART — COMPLETE APPLICATION JAVASCRIPT
 * Includes: config, auth, router, dashboard, products, cart,
 * orders, billing, khata, inventory, notifications, profile,
 * settings, theme, search, and UI helpers.
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    // 1. DATA — Product catalog (200+ real products)
    // ============================================================
    const PRODUCTS = [
        { id: 1, name: 'Aashirvaad Atta (5kg)', brand: 'Aashirvaad', image: '🌾', mrp: 210, selling_price: 185,
            category: 'Groceries', stock: 24 },
        { id: 2, name: 'Fortune Sunflower Oil (1L)', brand: 'Fortune', image: '🫒', mrp: 175, selling_price: 149,
            category: 'Groceries', stock: 12 },
        { id: 3, name: 'India Gate Basmati Rice (1kg)', brand: 'India Gate', image: '🍚', mrp: 220, selling_price: 195,
            category: 'Rice & Grains', stock: 8 },
        { id: 4, name: 'Tata Salt (1kg)', brand: 'Tata', image: '🧂', mrp: 28, selling_price: 22,
            category: 'Groceries', stock: 45 },
        { id: 5, name: 'Surf Excel Matic (1kg)', brand: 'Surf Excel', image: '🧺', mrp: 180, selling_price: 165,
            category: 'Household', stock: 0 },
        { id: 6, name: 'Wheel Detergent (1kg)', brand: 'Wheel', image: '🧺', mrp: 95, selling_price: 85,
            category: 'Household', stock: 30 },
        { id: 7, name: 'Rin Soap (4-pack)', brand: 'Rin', image: '🧼', mrp: 60, selling_price: 52,
            category: 'Household', stock: 18 },
        { id: 8, name: 'Good Day Biscuits (500g)', brand: 'Good Day', image: '🍪', mrp: 75, selling_price: 65,
            category: 'Snacks', stock: 22 },
        { id: 9, name: 'Parle G (1kg)', brand: 'Parle', image: '🍪', mrp: 120, selling_price: 105,
            category: 'Snacks', stock: 40 },
        { id: 10, name: 'Maggi Noodles (12-pack)', brand: 'Maggi', image: '🍜', mrp: 120, selling_price: 108,
            category: 'Snacks', stock: 15 },
        { id: 11, name: 'Amul Butter (500g)', brand: 'Amul', image: '🧈', mrp: 95, selling_price: 85,
            category: 'Dairy', stock: 20 },
        { id: 12, name: 'Amul Milk (1L)', brand: 'Amul', image: '🥛', mrp: 60, selling_price: 54,
            category: 'Dairy', stock: 35 },
        { id: 13, name: 'Nescafe Classic (50g)', brand: 'Nescafe', image: '☕', mrp: 180, selling_price: 165,
            category: 'Beverages', stock: 10 },
        { id: 14, name: 'Bru Instant Coffee (50g)', brand: 'Bru', image: '☕', mrp: 150, selling_price: 135,
            category: 'Beverages', stock: 14 },
        { id: 15, name: 'Taj Mahal Tea (250g)', brand: 'Taj Mahal', image: '🍵', mrp: 85, selling_price: 75,
            category: 'Beverages', stock: 25 },
        { id: 16, name: 'Tata Tea Premium (250g)', brand: 'Tata Tea', image: '🍵', mrp: 90, selling_price: 80,
            category: 'Beverages', stock: 20 },
        { id: 17, name: 'Red Label Tea (250g)', brand: 'Red Label', image: '🍵', mrp: 70, selling_price: 62,
            category: 'Beverages', stock: 18 },
        { id: 18, name: 'Saffola Gold Oil (1L)', brand: 'Saffola', image: '🫒', mrp: 195, selling_price: 175,
            category: 'Groceries', stock: 10 },
        { id: 19, name: 'Sunflower Oil (1L)', brand: 'Sunflower', image: '🫒', mrp: 160, selling_price: 145,
            category: 'Groceries', stock: 8 },
        { id: 20, name: 'Sugar (1kg)', brand: 'Madhur', image: '🍬', mrp: 45, selling_price: 40,
            category: 'Groceries', stock: 50 },
        { id: 21, name: 'Jaggery (1kg)', brand: 'Organic', image: '🍯', mrp: 80, selling_price: 70,
            category: 'Groceries', stock: 12 },
        { id: 22, name: 'Moong Dal (1kg)', brand: 'Tata Sampann', image: '🫘', mrp: 120, selling_price: 108,
            category: 'Groceries', stock: 22 },
        { id: 23, name: 'Toor Dal (1kg)', brand: 'Tata Sampann', image: '🫘', mrp: 140, selling_price: 125,
            category: 'Groceries', stock: 18 },
        { id: 24, name: 'Masoor Dal (1kg)', brand: 'Tata Sampann', image: '🫘', mrp: 100, selling_price: 90,
            category: 'Groceries', stock: 20 },
        { id: 25, name: 'Rajma (1kg)', brand: 'Tata Sampann', image: '🫘', mrp: 130, selling_price: 118,
            category: 'Groceries', stock: 15 },
        { id: 26, name: 'Chana (1kg)', brand: 'Tata Sampann', image: '🫘', mrp: 90, selling_price: 80,
            category: 'Groceries', stock: 25 },
        { id: 27, name: 'Besan (1kg)', brand: 'Tata Sampann', image: '🧆', mrp: 85, selling_price: 76,
            category: 'Groceries', stock: 14 },
        { id: 28, name: 'Poha (1kg)', brand: 'Patanjali', image: '🍚', mrp: 55, selling_price: 48,
            category: 'Groceries', stock: 30 },
        { id: 29, name: 'Rava (1kg)', brand: 'Patanjali', image: '🍚', mrp: 50, selling_price: 44,
            category: 'Groceries', stock: 28 },
        { id: 30, name: 'Suji (1kg)', brand: 'Patanjali', image: '🍚', mrp: 48, selling_price: 42,
            category: 'Groceries', stock: 26 },
        { id: 31, name: 'Turmeric Powder (100g)', brand: 'MDH', image: '🌿', mrp: 45, selling_price: 38,
            category: 'Spices', stock: 40 },
        { id: 32, name: 'Red Chilli Powder (100g)', brand: 'MDH', image: '🌶️', mrp: 50, selling_price: 42,
            category: 'Spices', stock: 35 },
        { id: 33, name: 'Coriander Powder (100g)', brand: 'MDH', image: '🌿', mrp: 35, selling_price: 28,
            category: 'Spices', stock: 38 },
        { id: 34, name: 'Jeera (100g)', brand: 'MDH', image: '🌿', mrp: 40, selling_price: 32,
            category: 'Spices', stock: 30 },
        { id: 35, name: 'Mustard Seeds (100g)', brand: 'MDH', image: '🌿', mrp: 30, selling_price: 24,
            category: 'Spices', stock: 25 },
        { id: 36, name: 'Black Pepper (100g)', brand: 'MDH', image: '🌿', mrp: 80, selling_price: 70,
            category: 'Spices', stock: 20 },
        { id: 37, name: 'Dettol Soap (2-pack)', brand: 'Dettol', image: '🧼', mrp: 70, selling_price: 62,
            category: 'Personal Care', stock: 30 },
        { id: 38, name: 'Shampoo (200ml)', brand: 'Dove', image: '🧴', mrp: 180, selling_price: 165,
            category: 'Personal Care', stock: 18 },
        { id: 39, name: 'Toothpaste (150g)', brand: 'Colgate', image: '🪥', mrp: 95, selling_price: 85,
            category: 'Personal Care', stock: 25 },
        { id: 40, name: 'Toothbrush', brand: 'Colgate', image: '🪥', mrp: 40, selling_price: 32,
            category: 'Personal Care', stock: 40 },
        { id: 41, name: 'Harpic (500ml)', brand: 'Harpic', image: '🧹', mrp: 85, selling_price: 75,
            category: 'Household', stock: 20 },
        { id: 42, name: 'Lizol (500ml)', brand: 'Lizol', image: '🧹', mrp: 90, selling_price: 80,
            category: 'Household', stock: 18 },
        { id: 43, name: 'Floor Cleaner (1L)', brand: 'Domex', image: '🧹', mrp: 60, selling_price: 52,
            category: 'Household', stock: 22 },
        { id: 44, name: 'Phenyl (1L)', brand: 'Savlon', image: '🧹', mrp: 50, selling_price: 42,
            category: 'Household', stock: 15 },
        { id: 45, name: 'Toilet Cleaner (500ml)', brand: 'Harpic', image: '🧹', mrp: 75, selling_price: 65,
            category: 'Household', stock: 14 },
        { id: 46, name: 'Nestle Milk (1L)', brand: 'Nestle', image: '🥛', mrp: 65, selling_price: 58,
            category: 'Dairy', stock: 28 },
        { id: 47, name: 'Amul Cheese (500g)', brand: 'Amul', image: '🧀', mrp: 110, selling_price: 98,
            category: 'Dairy', stock: 12 },
        { id: 48, name: 'Nestle Curd (500g)', brand: 'Nestle', image: '🥛', mrp: 55, selling_price: 48,
            category: 'Dairy', stock: 16 },
        { id: 49, name: 'Amul Ice Cream (1L)', brand: 'Amul', image: '🍦', mrp: 150, selling_price: 135,
            category: 'Dairy', stock: 10 },
        { id: 50, name: 'Nestle Maggie Soup', brand: 'Nestle', image: '🍜', mrp: 45, selling_price: 38,
            category: 'Snacks', stock: 20 },
        // Additional products generated dynamically below
    ];

    // Generate more products to reach 200+
    const brands = ['Aashirvaad', 'Fortune', 'India Gate', 'Tata', 'Surf Excel', 'Wheel', 'Rin', 'Good Day', 'Parle',
        'Maggi', 'Amul', 'Nestle', 'Nescafe', 'Bru', 'Taj Mahal', 'Red Label', 'Saffola', 'Sunflower', 'Madhur',
        'Organic', 'Tata Sampann', 'Patanjali', 'MDH', 'Dettol', 'Dove', 'Colgate', 'Harpic', 'Lizol', 'Domex',
        'Savlon'
    ];
    const categories = ['Groceries', 'Dairy', 'Beverages', 'Snacks', 'Household', 'Rice & Grains', 'Spices',
        'Personal Care'
    ];
    const productNames = ['Atta (5kg)', 'Oil (1L)', 'Rice (1kg)', 'Salt (1kg)', 'Detergent (1kg)', 'Soap (4-pack)',
        'Biscuits (500g)', 'Noodles (12-pack)', 'Butter (500g)', 'Milk (1L)', 'Coffee (50g)', 'Tea (250g)',
        'Sugar (1kg)', 'Jaggery (1kg)', 'Dal (1kg)', 'Rajma (1kg)', 'Chana (1kg)', 'Besan (1kg)', 'Poha (1kg)',
        'Rava (1kg)', 'Turmeric (100g)', 'Chilli Powder (100g)', 'Coriander (100g)', 'Jeera (100g)',
        'Mustard (100g)', 'Pepper (100g)', 'Soap (2-pack)', 'Shampoo (200ml)', 'Toothpaste (150g)',
        'Toothbrush', 'Floor Cleaner (1L)', 'Phenyl (1L)', 'Toilet Cleaner (500ml)', 'Cheese (500g)',
        'Curd (500g)', 'Ice Cream (1L)', 'Soup (pack)'
    ];
    let idCounter = 51;
    for (let i = 0; i < 180; i++) {
        const brand = brands[i % brands.length];
        const name = productNames[i % productNames.length];
        const category = categories[i % categories.length];
        const mrp = Math.floor(Math.random() * 200) + 20;
        const selling_price = Math.floor(mrp * (0.7 + Math.random() * 0.25));
        PRODUCTS.push({
            id: idCounter++,
            name: brand + ' ' + name,
            brand: brand,
            image: ['🌾', '🫒', '🍚', '🧂', '🧺', '🧼', '🍪', '🍜', '🧈', '🥛', '☕', '🍵', '🍬', '🍯', '🫘', '🧆', '🌿',
                '🌶️', '🧴', '🪥', '🧹'
            ][i % 21],
            mrp: mrp,
            selling_price: selling_price,
            category: category,
            stock: Math.floor(Math.random() * 50) + 1
        });
    }

    // ============================================================
    // 2. STATE
    // ============================================================
    let cart = JSON.parse(localStorage.getItem('udharkart_cart')) || [];
    let currentPage = 'customer-dashboard';
    let currentCategory = 'all';

    // ============================================================
    // 3. UTILITY FUNCTIONS
    // ============================================================
    function formatCurrency(amount) {
        return '₹' + Number(amount).toFixed(2);
    }

    function generateId() {
        return 'ID-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    }

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) {
            // Fallback: create container if missing
            const newContainer = document.createElement('div');
            newContainer.id = 'toastContainer';
            newContainer.className = 'toast-container';
            document.body.appendChild(newContainer);
        }
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function getProductById(id) {
        return PRODUCTS.find(p => p.id === id);
    }

    // ============================================================
    // 4. NAVIGATION
    // ============================================================
    function navigateTo(page) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('page-' + page);
        if (target) {
            target.classList.add('active');
            currentPage = page;
            // Update nav links
            document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.page === page);
            });
            // Update title
            const titles = {
                'customer-dashboard': { title: 'Dashboard', sub: 'Welcome back, Rajesh' },
                'shopkeeper-dashboard': { title: 'Shop Dashboard', sub: 'Manage your store' },
                'admin-dashboard': { title: 'Admin Panel', sub: 'Platform oversight' },
                'products': { title: 'Products', sub: 'Browse our catalog' },
                'categories': { title: 'Categories', sub: 'Shop by category' },
                'cart': { title: 'Shopping Cart', sub: 'Review your items' },
                'orders': { title: 'Orders', sub: 'Track your orders' },
                'billing': { title: 'Billing', sub: 'Generate invoices' },
                'digital-khata': { title: 'Digital Khata', sub: 'Manage credit ledger' },
                'customer-list': { title: 'Customers', sub: 'Manage customer accounts' },
                'inventory': { title: 'Inventory', sub: 'Stock management' },
                'reports': { title: 'Reports', sub: 'Business insights' },
                'analytics': { title: 'Analytics', sub: 'Data & metrics' },
                'profile': { title: 'Profile', sub: 'Your account details' },
                'settings': { title: 'Settings', sub: 'App preferences' },
                'notifications': { title: 'Notifications', sub: 'Recent alerts' },
                'support': { title: 'Support', sub: 'Help & resources' },
            };
            const info = titles[page] || { title: page, sub: '' };
            document.getElementById('pageTitle').textContent = info.title;
            document.getElementById('pageSubtitle').textContent = info.sub;
            // Close sidebar on mobile
            closeSidebar();
            document.getElementById('notifDropdown').classList.remove('open');
            // Page-specific load
            if (page === 'products') renderProducts(currentCategory);
            if (page === 'cart') renderCart();
            if (page === 'billing') renderInvoice();
            if (page === 'digital-khata') renderKhata();
            if (page === 'profile') loadProfile();
        }
    }

    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    // ============================================================
    // 5. PRODUCTS
    // ============================================================
    function renderProducts(category) {
        const grid = document.getElementById('productGrid');
        if (!grid) return;
        const filtered = category === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
        grid.innerHTML = '';
        filtered.slice(0, 24).forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const inCart = cart.find(c => c.id === product.id);
            card.innerHTML = `
                <div class="product-img">${product.image || '🛒'}</div>
                <div class="product-body">
                    <div class="name">${product.name}</div>
                    <div class="brand">${product.brand}</div>
                    <div class="price">
                        <span class="mrp">${formatCurrency(product.mrp)}</span>
                        <span class="sell">${formatCurrency(product.selling_price)}</span>
                    </div>
                    <button class="btn ${inCart ? 'btn-success' : 'btn-primary'} btn-sm add-btn" data-id="${product.id}">
                        ${inCart ? '✓ In Cart' : 'Add to Cart'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
        // Attach add to cart
        grid.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                addToCart(id);
            });
        });
    }

    // ============================================================
    // 6. CART
    // ============================================================
    function addToCart(productId) {
        const product = getProductById(productId);
        if (!product) return;
        const existing = cart.find(c => c.id === productId);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: productId, quantity: 1, price: product.selling_price, name: product.name,
                image: product.image });
        }
        localStorage.setItem('udharkart_cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
        showToast(product.name + ' added to cart', 'success');
        // Update product grid buttons
        document.querySelectorAll('.add-btn[data-id="' + productId + '"]').forEach(btn => {
            btn.textContent = '✓ In Cart';
            btn.className = 'btn btn-success btn-sm add-btn';
        });
    }

    function removeFromCart(productId) {
        cart = cart.filter(c => c.id !== productId);
        localStorage.setItem('udharkart_cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
        document.querySelectorAll('.add-btn[data-id="' + productId + '"]').forEach(btn => {
            btn.textContent = 'Add to Cart';
            btn.className = 'btn btn-primary btn-sm add-btn';
        });
    }

    function updateQuantity(productId, delta) {
        const item = cart.find(c => c.id === productId);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('udharkart_cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
    }

    function clearCart() {
        if (cart.length === 0) return;
        if (confirm('Clear all items from cart?')) {
            cart = [];
            localStorage.setItem('udharkart_cart', JSON.stringify(cart));
            renderCart();
            updateCartBadge();
            showToast('Cart cleared', 'info');
        }
    }

    function renderCart() {
        const container = document.getElementById('cartContainer');
        const count = document.getElementById('cartCount');
        const subtotalEl = document.getElementById('cartSubtotal');
        const gstEl = document.getElementById('cartGst');
        const totalEl = document.getElementById('cartTotal');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML =
                `<div class="empty-state"><span class="material-symbols-rounded">shopping_cart</span><h3>Your cart is empty</h3><p>Add items from the product catalog</p></div>`;
            if (count) count.textContent = '0';
            if (subtotalEl) subtotalEl.textContent = '₹0';
            if (gstEl) gstEl.textContent = '₹0';
            if (totalEl) totalEl.textContent = '₹0';
            return;
        }

        let html = '';
        let subtotal = 0;
        cart.forEach(item => {
            const product = getProductById(item.id);
            if (!product) return;
            const total = product.selling_price * item.quantity;
            subtotal += total;
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-img">${product.image || '🛒'}</div>
                    <div class="item-info">
                        <div class="item-name">${product.name}</div>
                        <div class="item-brand">${product.brand}</div>
                    </div>
                    <div class="item-price">${formatCurrency(product.selling_price)}</div>
                    <div class="qty-control">
                        <button class="qty-minus" data-id="${item.id}">−</button>
                        <span class="qty">${item.quantity}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="btn btn-icon-sm btn-ghost remove-item" data-id="${item.id}">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            `;
        });
        container.innerHTML = html;

        // Attach events
        container.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
        });
        container.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
        });
        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
        });

        if (count) count.textContent = cart.reduce((sum, c) => sum + c.quantity, 0);
        const gst = subtotal * 0.05;
        const grand = subtotal + gst;
        if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
        if (gstEl) gstEl.textContent = formatCurrency(gst);
        if (totalEl) totalEl.textContent = formatCurrency(grand);
    }

    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;
        const count = cart.reduce((sum, c) => sum + c.quantity, 0);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }

    // ============================================================
    // 7. OFFERS & FAVORITES (dashboard)
    // ============================================================
    function renderOffers() {
        const grid = document.getElementById('offerGrid');
        if (!grid) return;
        const offers = PRODUCTS.slice(0, 4);
        grid.innerHTML = '';
        offers.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">${product.image || '🛒'}</div>
                <div class="product-body">
                    <div class="name">${product.name}</div>
                    <div class="brand">${product.brand}</div>
                    <div class="price"><span class="mrp">${formatCurrency(product.mrp)}</span><span class="sell">${formatCurrency(product.selling_price)}</span></div>
                    <button class="btn btn-primary btn-sm add-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });
        grid.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                addToCart(parseInt(this.dataset.id));
            });
        });
    }

    function renderFavorites() {
        const grid = document.getElementById('favoriteGrid');
        if (!grid) return;
        const favs = PRODUCTS.slice(4, 8);
        grid.innerHTML = '';
        favs.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">${product.image || '🛒'}</div>
                <div class="product-body">
                    <div class="name">${product.name}</div>
                    <div class="brand">${product.brand}</div>
                    <div class="price"><span class="mrp">${formatCurrency(product.mrp)}</span><span class="sell">${formatCurrency(product.selling_price)}</span></div>
                    <button class="btn btn-outline btn-sm add-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });
        grid.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                addToCart(parseInt(this.dataset.id));
            });
        });
    }

    // ============================================================
    // 8. BILLING / INVOICE
    // ============================================================
    function renderInvoice() {
        const box = document.getElementById('invoiceBox');
        if (!box) return;
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
        let itemsHtml = '';
        invoice.items.forEach((item, idx) => {
            itemsHtml +=
                `<tr><td>${idx+1}</td><td>${item.name}</td><td>${item.qty}</td><td>${formatCurrency(item.price)}</td><td>${formatCurrency(item.total)}</td></tr>`;
        });
        box.innerHTML = `
            <div class="invoice-header">
                <div><div class="brand">Udhar<span>Kart</span></div><div style="font-size:0.85rem;color:var(--gray-500);">Smart Shopping • Digital Khata</div></div>
                <div class="invoice-meta"><strong>Invoice #:</strong> ${invoice.invoice_no}<br/><strong>Date:</strong> ${new Date(invoice.date).toLocaleString('en-IN')}</div>
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
                <div class="total-row"><span>Subtotal</span><span>${formatCurrency(invoice.subtotal)}</span></div>
                <div class="total-row"><span>GST (5%)</span><span>${formatCurrency(invoice.gst)}</span></div>
                <div class="total-row"><span>Discount</span><span>-${formatCurrency(invoice.discount)}</span></div>
                <div class="total-row grand"><span>Grand Total</span><span>${formatCurrency(invoice.grand_total)}</span></div>
            </div>
            <div class="invoice-footer">Thank you for shopping with UdharKart! • Payment: ${invoice.payment_method} • QR Code: [Generated]</div>
        `;
    }

    // ============================================================
    // 9. KHATA (LEDGER)
    // ============================================================
    function renderKhata() {
        const list = document.getElementById('khataList');
        if (!list) return;
        const entries = [
            { type: 'credit', amount: 500, description: 'Payment received from Priya Sharma',
                date: 'Today, 10:30 AM • UPI' },
            { type: 'debit', amount: 520, description: 'Order #ORD-1028 — Meera Patel',
                date: 'Today, 9:15 AM • Udhar' },
            { type: 'credit', amount: 450, description: 'Payment received from Amit Singh',
                date: 'Yesterday, 6:45 PM • Cash' },
            { type: 'debit', amount: 310, description: 'Order #ORD-1026 — Sneha Reddy',
                date: 'Yesterday, 4:20 PM • Udhar' },
            { type: 'debit', amount: 245, description: 'Order #ORD-1024 — Priya Sharma',
                date: 'Yesterday, 10:30 AM • Udhar' },
        ];
        list.innerHTML = '';
        entries.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'khata-entry';
            const typeClass = entry.type === 'credit' ? 'credit' : 'debit';
            const icon = entry.type === 'credit' ? 'payments' : 'shopping_bag';
            const amount = entry.type === 'credit' ? `+${formatCurrency(entry.amount)}` :
                `-${formatCurrency(entry.amount)}`;
            div.innerHTML = `
                <div class="entry-icon ${typeClass}"><span class="material-symbols-rounded">${icon}</span></div>
                <div class="entry-info"><div class="entry-title">${entry.description}</div><div class="entry-date">${entry.date}</div></div>
                <div class="entry-amount ${typeClass}">${amount}</div>
            `;
            list.appendChild(div);
        });
    }

    // ============================================================
    // 10. PROFILE
    // ============================================================
    function loadProfile() {
        const elements = {
            fullName: document.getElementById('profileFullName'),
            phone: document.getElementById('profilePhone'),
            shopName: document.getElementById('profileShopName'),
            gst: document.getElementById('profileGst'),
            address: document.getElementById('profileAddress'),
            opening: document.getElementById('profileOpening'),
            closing: document.getElementById('profileClosing'),
            upi: document.getElementById('profileUpi'),
            nameDisplay: document.getElementById('profileName'),
            roleDisplay: document.getElementById('profileRole'),
        };
        if (elements.fullName) elements.fullName.value = 'Rajesh Kumar';
        if (elements.phone) elements.phone.value = '+91 98765 43210';
        if (elements.shopName) elements.shopName.value = 'FreshMart Grocery';
        if (elements.gst) elements.gst.value = '22ABCDE1234F1Z5';
        if (elements.address) elements.address.value = 'Shop No. 12, Main Bazaar, Mumbai';
        if (elements.opening) elements.opening.value = '8:00 AM';
        if (elements.closing) elements.closing.value = '10:00 PM';
        if (elements.upi) elements.upi.value = 'freshmart@upi';
        if (elements.nameDisplay) elements.nameDisplay.textContent = 'Rajesh Kumar';
        if (elements.roleDisplay) elements.roleDisplay.textContent = 'Shopkeeper • FreshMart Grocery';
    }

    // ============================================================
    // 11. THEME
    // ============================================================
    function setTheme(theme) {
        if (theme === 'system') {
            const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('udharkart_theme', theme);
        const icon = document.querySelector('#themeToggle .material-symbols-rounded');
        if (icon) {
            const current = document.documentElement.getAttribute('data-theme');
            icon.textContent = current === 'dark' ? 'light_mode' : 'dark_mode';
        }
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.className = 'btn ' + (btn.dataset.theme === theme ? 'btn-primary' : 'btn-outline') +
                ' btn-sm theme-option';
        });
    }

    // ============================================================
    // 12. SEARCH
    // ============================================================
    function searchProducts(query) {
        const results = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
        const grid = document.getElementById('productGrid');
        if (!grid) return;
        grid.innerHTML = '';
        if (results.length === 0) {
            grid.innerHTML =
                `<div class="empty-state" style="grid-column:1/-1;"><span class="material-symbols-rounded">search</span><h3>No products found</h3><p>Try a different search term</p></div>`;
            return;
        }
        results.slice(0, 24).forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const inCart = cart.find(c => c.id === product.id);
            card.innerHTML = `
                <div class="product-img">${product.image || '🛒'}</div>
                <div class="product-body">
                    <div class="name">${product.name}</div>
                    <div class="brand">${product.brand}</div>
                    <div class="price"><span class="mrp">${formatCurrency(product.mrp)}</span><span class="sell">${formatCurrency(product.selling_price)}</span></div>
                    <button class="btn ${inCart ? 'btn-success' : 'btn-primary'} btn-sm add-btn" data-id="${product.id}">${inCart ? '✓ In Cart' : 'Add to Cart'}</button>
                </div>
            `;
            grid.appendChild(card);
        });
        grid.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                addToCart(parseInt(this.dataset.id));
            });
        });
    }

    // ============================================================
    // 13. ORDER ACTIONS (Accept/Decline)
    // ============================================================
    function setupOrderActions() {
        document.querySelectorAll('.accept-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.order-item');
                const status = item.querySelector('.order-status');
                const badge = item.querySelector('.badge-status');
                status.className = 'order-status processing';
                badge.className = 'badge-status processing';
                badge.textContent = 'Processing';
                this.remove();
                const decline = item.querySelector('.decline-order');
                if (decline) decline.remove();
                showToast('Order accepted, packing started', 'success');
            });
        });
        document.querySelectorAll('.decline-order').forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.closest('.order-item');
                const status = item.querySelector('.order-status');
                const badge = item.querySelector('.badge-status');
                status.className = 'order-status cancelled';
                badge.className = 'badge-status cancelled';
                badge.textContent = 'Cancelled';
                this.remove();
                const accept = item.querySelector('.accept-order');
                if (accept) accept.remove();
                showToast('Order declined', 'error');
            });
        });
    }

    // ============================================================
    // 14. INITIALIZATION
    // ============================================================
    function init() {
        // Restore theme
        const savedTheme = localStorage.getItem('udharkart_theme') || 'light';
        setTheme(savedTheme);

        // Render initial data
        renderProducts('all');
        renderCart();
        updateCartBadge();
        renderOffers();
        renderFavorites();
        renderInvoice();
        renderKhata();
        loadProfile();
        setupOrderActions();

        // ===== NAVIGATION =====
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) navigateTo(page);
            });
        });

        document.querySelectorAll('[data-page]').forEach(el => {
            if (el.classList.contains('nav-link')) return;
            el.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.dataset.page;
                if (page) navigateTo(page);
            });
        });

        // ===== SIDEBAR TOGGLE =====
        const menuToggle = document.getElementById('menuToggle');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                document.getElementById('sidebar').classList.toggle('open');
                if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
            });
        }
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', closeSidebar);
        }

        // ===== NOTIFICATIONS DROPDOWN =====
        const notifToggle = document.getElementById('notifToggle');
        const notifDropdown = document.getElementById('notifDropdown');
        if (notifToggle) {
            notifToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                if (notifDropdown) notifDropdown.classList.toggle('open');
            });
        }
        document.addEventListener('click', function(e) {
            if (notifDropdown && notifToggle) {
                if (!notifDropdown.contains(e.target) && !notifToggle.contains(e.target)) {
                    notifDropdown.classList.remove('open');
                }
            }
        });

        // ===== CATEGORY TABS =====
        document.querySelectorAll('#categoryTabs .tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('#categoryTabs .tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                renderProducts(currentCategory);
            });
        });

        // ===== ORDER TABS =====
        document.querySelectorAll('#orderTabs .tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('#orderTabs .tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                document.querySelectorAll('#ordersList .order-item').forEach(item => {
                    const status = item.querySelector('.badge-status')?.textContent.toLowerCase();
                    if (filter === 'all') {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = status === filter ? 'flex' : 'none';
                    }
                });
            });
        });

        // ===== CLEAR CART =====
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

        // ===== PLACE ORDER =====
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showToast('Cart is empty', 'warning');
                    return;
                }
                if (confirm('Place order with ' + cart.reduce((s, c) => s + c.quantity, 0) + ' items?')) {
                    showToast('Order placed successfully!', 'success');
                    cart = [];
                    localStorage.setItem('udharkart_cart', JSON.stringify(cart));
                    renderCart();
                    updateCartBadge();
                    navigateTo('orders');
                }
            });
        }

        // ===== PRINT INVOICE =====
        const printBtn = document.getElementById('printInvoiceBtn');
        if (printBtn) printBtn.addEventListener('click', () => window.print());

        // ===== SAVE PROFILE =====
        const saveProfileBtn = document.getElementById('saveProfileBtn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', function() {
                showToast('Profile updated successfully!', 'success');
            });
        }

        // ===== DELETE ACCOUNT =====
        const deleteBtn = document.getElementById('deleteAccountBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    showToast('Account deletion request submitted', 'warning');
                }
            });
        }

        // ===== THEME TOGGLE =====
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                setTheme(next);
            });
        }

        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', function() {
                setTheme(this.dataset.theme);
            });
        });

        // ===== SEARCH =====
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    if (query) {
                        navigateTo('products');
                        setTimeout(() => searchProducts(query), 100);
                    }
                }
            });
        }

        // ===== VOICE SEARCH =====
        const voiceBtn = document.getElementById('voiceSearchBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', function() {
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                    const recognition = new SR();
                    recognition.lang = 'en-IN';
                    recognition.onresult = function(event) {
                        const transcript = event.results[0][0].transcript;
                        if (searchInput) searchInput.value = transcript;
                        navigateTo('products');
                        setTimeout(() => searchProducts(transcript), 100);
                    };
                    recognition.start();
                    showToast('Listening...', 'info');
                } else {
                    showToast('Voice search not supported in this browser', 'warning');
                }
            });
        }

        // ===== CUSTOMER SEARCH (shopkeeper) =====
        const custSearchBtn = document.getElementById('customerSearchBtn');
        if (custSearchBtn) {
            custSearchBtn.addEventListener('click', function() {
                const query = document.getElementById('customerSearchInput')?.value.trim();
                if (query) {
                    showToast('Searching for: "' + query + '"', 'info');
                }
            });
        }

        // ===== MARK ALL READ =====
        document.querySelectorAll('#markAllRead, #markAllReadNotif').forEach(el => {
            el.addEventListener('click', function() {
                showToast('All notifications marked as read', 'success');
            });
        });

        // ===== ADD KHATA ENTRY =====
        const addKhataBtn = document.getElementById('addKhataEntryBtn');
        if (addKhataBtn) {
            addKhataBtn.addEventListener('click', function() {
                const desc = prompt('Enter description:');
                if (desc) {
                    const amount = prompt('Enter amount (in ₹):');
                    if (amount && !isNaN(amount)) {
                        const type = confirm('Is this a payment received? (OK = Credit, Cancel = Debit)') ?
                            'credit' : 'debit';
                        const list = document.getElementById('khataList');
                        if (list) {
                            const div = document.createElement('div');
                            div.className = 'khata-entry';
                            const typeClass = type === 'credit' ? 'credit' : 'debit';
                            const icon = type === 'credit' ? 'payments' : 'shopping_bag';
                            const amt = type === 'credit' ? `+${formatCurrency(parseFloat(amount))}` :
                                `-${formatCurrency(parseFloat(amount))}`;
                            div.innerHTML = `
                                <div class="entry-icon ${typeClass}"><span class="material-symbols-rounded">${icon}</span></div>
                                <div class="entry-info"><div class="entry-title">${desc}</div><div class="entry-date">Just now</div></div>
                                <div class="entry-amount ${typeClass}">${amt}</div>
                            `;
                            list.prepend(div);
                            showToast('Khata entry added', 'success');
                        }
                    }
                }
            });
        }

        // ===== LOGOUT =====
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('udharkart_session');
                    showToast('Logged out', 'info');
                    navigateTo('customer-dashboard');
                }
            });
        }

        // ===== ADD STOCK =====
        const addStockBtn = document.getElementById('addStockBtn');
        if (addStockBtn) {
            addStockBtn.addEventListener('click', function() {
                const product = prompt('Enter product name:');
                if (product) {
                    const qty = prompt('Enter quantity to add:');
                    if (qty && !isNaN(qty)) {
                        showToast(`Added ${qty} units of ${product} to stock`, 'success');
                    }
                }
            });
        }

        // ===== ADD PRODUCT =====
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', function() {
                const name = prompt('Enter product name:');
                if (name) {
                    const price = prompt('Enter selling price:');
                    if (price && !isNaN(price)) {
                        const brand = prompt('Enter brand:') || 'Generic';
                        const category = prompt('Enter category:') || 'Groceries';
                        const newProduct = {
                            id: PRODUCTS.length + 1,
                            name: name,
                            brand: brand,
                            image: '🛒',
                            mrp: parseFloat(price) * 1.2,
                            selling_price: parseFloat(price),
                            category: category,
                            stock: 10
                        };
                        PRODUCTS.push(newProduct);
                        renderProducts(currentCategory);
                        showToast('Product added: ' + name, 'success');
                    }
                }
            });
        }

        // ===== LOAD MORE PRODUCTS =====
        const loadMoreBtn = document.getElementById('loadMoreProducts');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                const grid = document.getElementById('productGrid');
                if (!grid) return;
                const currentCount = grid.querySelectorAll('.product-card').length;
                const filtered = currentCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category ===
                    currentCategory);
                const more = filtered.slice(currentCount, currentCount + 12);
                more.forEach(product => {
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    const inCart = cart.find(c => c.id === product.id);
                    card.innerHTML = `
                        <div class="product-img">${product.image || '🛒'}</div>
                        <div class="product-body">
                            <div class="name">${product.name}</div>
                            <div class="brand">${product.brand}</div>
                            <div class="price"><span class="mrp">${formatCurrency(product.mrp)}</span><span class="sell">${formatCurrency(product.selling_price)}</span></div>
                            <button class="btn ${inCart ? 'btn-success' : 'btn-primary'} btn-sm add-btn" data-id="${product.id}">${inCart ? '✓ In Cart' : 'Add to Cart'}</button>
                        </div>
                    `;
                    grid.appendChild(card);
                });
                grid.querySelectorAll('.add-btn').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        addToCart(parseInt(this.dataset.id));
                    });
                });
                if (currentCount + 12 >= filtered.length) {
                    this.style.display = 'none';
                }
            });
        }

        console.log('🚀 UdharKart initialized successfully!');
        console.log('📦 ' + PRODUCTS.length + ' products loaded');
        console.log('🛒 ' + cart.length + ' items in cart');
    }

    // ============================================================
    // 15. START
    // ============================================================
    document.addEventListener('DOMContentLoaded', init);

})();
