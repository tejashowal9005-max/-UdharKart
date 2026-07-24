/* =================================================================
   UDHARKART — COMBINED JAVASCRIPT
   Includes: app, auth, billing, customer, orders, products, shopkeeper
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  APP CONTROLLER (app.js)
    // =============================================================
    const app = (function() {
        // DOM REFS
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

        // STATE
        let currentView = 'customer-dashboard';
        let isDark = false;
        let isSidebarOpen = false;

        // THEME
        function setTheme(dark) {
            isDark = dark;
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
            if (themeIcon) themeIcon.textContent = dark ? 'light_mode' : 'dark_mode';
            if (settingsThemeToggle) {
                if (dark) settingsThemeToggle.classList.add('active');
                else settingsThemeToggle.classList.remove('active');
            }
        }

        function toggleTheme() {
            setTheme(!isDark);
        }

        // NAVIGATION
        function navigateTo(viewId) {
            allViews.forEach(v => v.classList.remove('active'));
            const target = document.getElementById('view-' + viewId);
            if (target) {
                target.classList.add('active');
                currentView = viewId;
            }
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                const linkView = link.getAttribute('data-view');
                if (linkView === viewId) link.classList.add('active');
            });
            const titles = {
                'customer-dashboard': 'Dashboard',
                'shopkeeper-dashboard': 'Dashboard',
                'profile': 'Profile',
                'settings': 'Settings',
                'notifications': 'Notifications',
                'customer-login': 'Customer Login',
                'shopkeeper-login': 'Shopkeeper Login',
                'home': 'UdharKart',
                'orders': 'Orders',
                'products': 'Products',
                'cart': 'Cart',
                'billing': 'Billing'
            };
            if (pageTitle) pageTitle.textContent = titles[viewId] || 'UdharKart';
            closeSidebar();
            if (history.pushState) {
                history.pushState(null, '', '#' + viewId);
            }
        }

        // SIDEBAR
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
            if (isSidebarOpen) closeSidebar();
            else openSidebar();
        }

        // TOAST
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

        // DATE
        function updateDate() {
            const now = new Date();
            const opts = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            const dateStr = now.toLocaleDateString('en-IN', opts);
            document.querySelectorAll('#currentDate, #currentDateShop').forEach(el => {
                if (el) el.textContent = dateStr;
            });
        }

        // HASH ROUTING
        function handleHash() {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const viewEl = document.getElementById('view-' + hash);
                if (viewEl) {
                    navigateTo(hash);
                    return;
                }
            }
            if (currentView === 'customer-login' || currentView === 'shopkeeper-login' || currentView === 'home') {
                // stay
            } else {
                navigateTo('customer-dashboard');
            }
        }

        // INIT
        function init() {
            updateDate();
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark);

            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const viewEl = document.getElementById('view-' + hash);
                if (viewEl) {
                    navigateTo(hash);
                    return;
                }
            }

            const activeView = document.querySelector('.page-view.active');
            if (activeView) {
                const id = activeView.id.replace('view-', '');
                currentView = id;
                allNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-view') === id) link.classList.add('active');
                });
                if (pageTitle) {
                    pageTitle.textContent = {
                        'customer-dashboard': 'Dashboard',
                        'shopkeeper-dashboard': 'Dashboard',
                        'profile': 'Profile',
                        'settings': 'Settings',
                        'notifications': 'Notifications',
                        'customer-login': 'Customer Login',
                        'shopkeeper-login': 'Shopkeeper Login',
                        'home': 'UdharKart',
                        'orders': 'Orders',
                        'products': 'Products',
                        'cart': 'Cart',
                        'billing': 'Billing'
                    } [id] || 'UdharKart';
                }
            } else {
                navigateTo('customer-dashboard');
            }

            if (!currentView.includes('login') && currentView !== 'home') {
                setTimeout(() => {
                    showToast('Welcome to UdharKart', 'storefront');
                }, 600);
            }
        }

        // EVENT BINDING
        if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (settingsThemeToggle) {
            settingsThemeToggle.addEventListener('click', function() {
                toggleTheme();
            });
        }

        allNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const view = this.getAttribute('data-view');
                if (view) navigateTo(view);
            });
        });

        window.addEventListener('hashchange', handleHash);

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && isSidebarOpen) closeSidebar();
            }, 200);
        });

        // Expose public API
        return {
            init,
            navigateTo,
            setTheme,
            toggleTheme,
            showToast,
            updateDate,
            getCurrentView: () => currentView,
            isDark: () => isDark
        };
    })();

    // =============================================================
    //  AUTH (auth.js)
    // =============================================================
    (function() {
        // Customer login
        const customerForm = document.getElementById('customerLoginForm');
        if (customerForm) {
            customerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('custEmail').value.trim();
                const password = document.getElementById('custPassword').value.trim();
                if (!email || !password) {
                    app.showToast('Please fill in all fields', 'error');
                    return;
                }
                app.showToast('Welcome back, ' + (email.split('@')[0] || 'Customer') + '!', 'check_circle');
                setTimeout(() => {
                    app.navigateTo('customer-dashboard');
                }, 400);
            });
        }

        // Shopkeeper login
        const shopkeeperForm = document.getElementById('shopkeeperLoginForm');
        if (shopkeeperForm) {
            shopkeeperForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const shopName = document.getElementById('shopName').value.trim();
                const email = document.getElementById('shopEmail').value.trim();
                const password = document.getElementById('shopPassword').value.trim();
                if (!shopName || !email || !password) {
                    app.showToast('Please fill in all fields', 'error');
                    return;
                }
                app.showToast('Welcome back, ' + shopName + '!', 'check_circle');
                setTimeout(() => {
                    app.navigateTo('shopkeeper-dashboard');
                }, 400);
            });
        }

        // Password toggle
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.closest('.password-wrap').querySelector('input');
                if (input) {
                    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                    input.setAttribute('type', type);
                    this.querySelector('.material-symbols-outlined').textContent =
                        type === 'password' ? 'visibility' : 'visibility_off';
                }
            });
        });
    })();

    // =============================================================
    //  BILLING (billing.js)
    // =============================================================
    (function() {
        const invoiceItems = [
            { name: 'Basmati Rice (5kg)', price: 350, qty: 2 },
            { name: 'Wheat Flour (5kg)', price: 220, qty: 1 },
            { name: 'Milk (1L)', price: 56, qty: 4 },
            { name: 'Coca-Cola (2L)', price: 90, qty: 3 },
            { name: 'Lays (50g)', price: 20, qty: 5 },
        ];
        const SHIPPING_COST = 40;
        let discountApplied = true;

        function formatPrice(amount) {
            return '₹' + amount.toLocaleString('en-IN');
        }

        function getSubtotal() {
            return invoiceItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        }

        function getShipping() {
            return getSubtotal() >= 500 ? 0 : SHIPPING_COST;
        }

        function getDiscount() {
            return discountApplied ? Math.round(getSubtotal() * 0.10) : 0;
        }

        function getGrandTotal() {
            return getSubtotal() + getShipping() - getDiscount();
        }

        function renderInvoice() {
            const body = document.getElementById('invoiceItemsBody');
            if (!body) return;
            let html = '';
            invoiceItems.forEach(item => {
                const total = item.price * item.qty;
                html += `
                    <tr>
                        <td class="item-name">${item.name}</td>
                        <td class="item-price">${formatPrice(item.price)}</td>
                        <td class="item-qty">${item.qty}</td>
                        <td class="item-total" style="text-align:right;">${formatPrice(total)}</td>
                    </tr>
                `;
            });
            body.innerHTML = html;

            const subtotal = getSubtotal();
            const shipping = getShipping();
            const discount = getDiscount();
            const grandTotal = getGrandTotal();

            const elSub = document.getElementById('invSubtotal');
            const elShip = document.getElementById('invShipping');
            const elDiscRow = document.getElementById('invDiscountRow');
            const elDisc = document.getElementById('invDiscount');
            const elGrand = document.getElementById('invGrandTotal');

            if (elSub) elSub.textContent = formatPrice(subtotal);
            if (elShip) elShip.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
            if (elDiscRow && elDisc) {
                if (discount > 0) {
                    elDiscRow.style.display = 'flex';
                    elDisc.textContent = '-' + formatPrice(discount);
                } else {
                    elDiscRow.style.display = 'none';
                }
            }
            if (elGrand) elGrand.textContent = formatPrice(grandTotal);
        }

        // Event listeners
        document.getElementById('backBtn')?.addEventListener('click', function() {
            window.history.back();
        });
        document.getElementById('newInvoiceBtn')?.addEventListener('click', function() {
            app.showToast('Creating new invoice...', 'receipt');
        });
        document.getElementById('printBtn')?.addEventListener('click', function() {
            const content = document.getElementById('invoiceContent');
            if (!content) return;
            const clone = content.cloneNode(true);
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            if (printWindow) {
                const styles = document.querySelector('style')?.innerHTML || '';
                printWindow.document.write(`
                    <html>
                        <head><title>Invoice</title>
                        <style>${styles}</style>
                        <style>
                            body { padding: 40px; background: #fff; }
                            .glass-card { background: #fff; box-shadow: none; border: 1px solid #e5e7eb; }
                            .invoice-actions, .no-print { display: none !important; }
                        </style>
                        </head>
                        <body>${clone.outerHTML}
                        <script>
                            window.onload = function() { window.print(); window.close(); };
                        <\/script>
                    </body></html>
                `);
                printWindow.document.close();
                app.showToast('Printing invoice...', 'print');
            } else {
                app.showToast('Please allow popups to print', 'error');
            }
        });
        document.getElementById('downloadBtn')?.addEventListener('click', function() {
            app.showToast('Downloading invoice as PDF...', 'download');
            setTimeout(() => {
                app.showToast('Invoice downloaded successfully!', 'check_circle');
            }, 1000);
        });
        document.getElementById('sendBtn')?.addEventListener('click', function() {
            app.showToast('Sending invoice via email...', 'send');
            setTimeout(() => {
                app.showToast('Invoice sent to priya@example.com 📧', 'check_circle');
            }, 1200);
        });

        // Render on load
        if (document.getElementById('invoiceItemsBody')) {
            renderInvoice();
        }
    })();

    // =============================================================
    //  CUSTOMER (customer.js)
    // =============================================================
    (function() {
        // Quick actions in customer dashboard
        document.querySelectorAll('#view-customer-dashboard .action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const label = this.querySelector('span:last-child')?.textContent || 'Action';
                app.showToast(label + ' triggered (demo)', 'bolt');
            });
        });

        // Search (demo)
        const searchInput = document.querySelector('#view-customer-dashboard .search-input, .topnav .search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const val = this.value.trim();
                    if (val) app.showToast('Searching for "' + val + '" (demo)', 'search');
                }
            });
        }

        // Profile edit
        const editProfileBtn = document.querySelector('#view-profile .profile-card .btn-primary');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                app.showToast('Edit profile form would open here', 'edit');
            });
        }
        const avatarEditBtn = document.querySelector('.avatar-edit-btn');
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', function() {
                app.showToast('Change avatar dialog would open', 'photo_camera');
            });
        }

        // Settings toggles
        document.querySelectorAll('#view-settings .toggle-switch:not(#settingsThemeToggle)').forEach(sw => {
            sw.addEventListener('click', function() {
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                const label = this.closest('.setting-group').querySelector('.setting-label h4');
                if (label) app.showToast(label.textContent + ' ' + (isActive ? 'enabled' : 'disabled'), 'toggle_on');
            });
        });

        // Privacy manage
        document.querySelector('#view-settings .setting-group .btn-secondary')?.addEventListener('click', function() {
            app.showToast('Privacy settings management', 'privacy_tip');
        });

        // Notifications: mark all read
        const markAllReadBtn = document.getElementById('markAllRead');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                const items = document.querySelectorAll('.notification-item');
                let count = 0;
                items.forEach(item => {
                    if (!item.classList.contains('read')) {
                        item.classList.add('read');
                        count++;
                    }
                });
                const badge = document.querySelector('.sidebar-nav .badge');
                if (badge) {
                    const remaining = document.querySelectorAll('.notification-item:not(.read)').length;
                    badge.textContent = remaining > 0 ? remaining : '0';
                    badge.style.display = remaining > 0 ? '' : 'none';
                }
                const dot = document.querySelector('.badge-dot');
                if (dot) {
                    const unread = document.querySelectorAll('.notification-item:not(.read)').length;
                    dot.style.display = unread > 0 ? 'block' : 'none';
                }
                if (count > 0) app.showToast('Marked ' + count + ' notification' + (count > 1 ? 's' : '') + ' as read', 'check_circle');
                else app.showToast('All notifications already read', 'info');
            });
        }

        // Single notification click
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                if (!this.classList.contains('read')) {
                    this.classList.add('read');
                    const remaining = document.querySelectorAll('.notification-item:not(.read)').length;
                    const badge = document.querySelector('.sidebar-nav .badge');
                    if (badge) {
                        badge.textContent = remaining > 0 ? remaining : '0';
                        badge.style.display = remaining > 0 ? '' : 'none';
                    }
                    const dot = document.querySelector('.badge-dot');
                    if (dot) {
                        dot.style.display = remaining > 0 ? 'block' : 'none';
                    }
                    app.showToast('Marked as read', 'done');
                }
            });
        });
    })();

    // =============================================================
    //  ORDERS (orders.js)
    // =============================================================
    (function() {
        const ordersData = [
            { id: 'UDH-001', customer: 'Priya Patel', phone: '+91 98765 43201', date: '2026-07-20', amount: 2450, status: 'completed' },
            { id: 'UDH-002', customer: 'Amit Kumar', phone: '+91 98765 43202', date: '2026-07-21', amount: 1800, status: 'processing' },
            { id: 'UDH-003', customer: 'Neha Singh', phone: '+91 98765 43203', date: '2026-07-22', amount: 3200, status: 'pending' },
            { id: 'UDH-004', customer: 'Rohit Verma', phone: '+91 98765 43204', date: '2026-07-18', amount: 750, status: 'shipped' },
            { id: 'UDH-005', customer: 'Sneha Reddy', phone: '+91 98765 43205', date: '2026-07-17', amount: 5600, status: 'delivered' },
            { id: 'UDH-006', customer: 'Vikram Joshi', phone: '+91 98765 43206', date: '2026-07-16', amount: 2100, status: 'cancelled' },
            { id: 'UDH-007', customer: 'Kavya Nair', phone: '+91 98765 43207', date: '2026-07-15', amount: 980, status: 'refunded' },
            { id: 'UDH-008', customer: 'Arjun Mehta', phone: '+91 98765 43208', date: '2026-07-14', amount: 4300, status: 'completed' },
            { id: 'UDH-009', customer: 'Divya Menon', phone: '+91 98765 43209', date: '2026-07-13', amount: 1650, status: 'processing' },
            { id: 'UDH-010', customer: 'Karan Shah', phone: '+91 98765 43210', date: '2026-07-12', amount: 2890, status: 'pending' },
            { id: 'UDH-011', customer: 'Meera Iyer', phone: '+91 98765 43211', date: '2026-07-11', amount: 3750, status: 'shipped' },
            { id: 'UDH-012', customer: 'Suresh Goyal', phone: '+91 98765 43212', date: '2026-07-10', amount: 1200, status: 'delivered' },
        ];

        const itemsPerPage = 5;
        let currentPage = 1;

        const ordersBody = document.getElementById('ordersBody');
        const statusFilter = document.getElementById('statusFilter');
        const dateFilter = document.getElementById('dateFilter');
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        const resetFilters = document.getElementById('resetFilters');
        const searchInput = document.getElementById('searchOrders');
        const paginationInfo = document.getElementById('paginationInfo');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const pageButtons = document.querySelectorAll('.pages button[data-page]');

        function formatDate(dateStr) {
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        }

        function getStatusBadge(status) {
            const map = {
                'completed': 'completed',
                'processing': 'processing',
                'pending': 'pending',
                'shipped': 'shipped',
                'delivered': 'delivered',
                'cancelled': 'cancelled',
                'refunded': 'refunded'
            };
            const cls = map[status] || 'pending';
            return `<span class="status-badge ${cls}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
        }

        function getFilteredOrders() {
            let filtered = [...ordersData];
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            if (searchTerm) {
                filtered = filtered.filter(o =>
                    o.id.toLowerCase().includes(searchTerm) ||
                    o.customer.toLowerCase().includes(searchTerm) ||
                    o.phone.includes(searchTerm)
                );
            }
            const statusVal = statusFilter ? statusFilter.value : 'all';
            if (statusVal !== 'all') filtered = filtered.filter(o => o.status === statusVal);

            const dateVal = dateFilter ? dateFilter.value : 'all';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dateVal === 'today') {
                filtered = filtered.filter(o => {
                    const d = new Date(o.date + 'T00:00:00');
                    return d.getTime() === today.getTime();
                });
            } else if (dateVal === 'week') {
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay());
                filtered = filtered.filter(o => {
                    const d = new Date(o.date + 'T00:00:00');
                    return d >= weekStart && d <= today;
                });
            } else if (dateVal === 'month') {
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                filtered = filtered.filter(o => {
                    const d = new Date(o.date + 'T00:00:00');
                    return d >= monthStart && d <= today;
                });
            } else if (dateVal === 'custom') {
                const from = dateFrom ? dateFrom.value : '';
                const to = dateTo ? dateTo.value : '';
                if (from) {
                    const fromDate = new Date(from + 'T00:00:00');
                    filtered = filtered.filter(o => {
                        const d = new Date(o.date + 'T00:00:00');
                        return d >= fromDate;
                    });
                }
                if (to) {
                    const toDate = new Date(to + 'T00:00:00');
                    toDate.setHours(23, 59, 59, 999);
                    filtered = filtered.filter(o => {
                        const d = new Date(o.date + 'T00:00:00');
                        return d <= toDate;
                    });
                }
            }
            return filtered;
        }

        function renderOrders() {
            if (!ordersBody) return;
            const filtered = getFilteredOrders();
            const totalItems = filtered.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            const start = (currentPage - 1) * itemsPerPage;
            const end = Math.min(start + itemsPerPage, totalItems);
            const pageItems = filtered.slice(start, end);

            if (paginationInfo) {
                paginationInfo.textContent =
                    totalItems === 0 ? 'No orders found' :
                    `Showing ${start + 1}–${end} of ${totalItems} orders`;
            }

            pageButtons.forEach(btn => {
                const page = parseInt(btn.dataset.page);
                btn.classList.toggle('active', page === currentPage);
                btn.style.display = page <= totalPages ? 'inline-flex' : 'none';
            });
            if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
            if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;

            if (pageItems.length === 0) {
                ordersBody.innerHTML = `
                    <tr><td colspan="6">
                        <div class="empty-orders">
                            <span class="material-symbols-outlined empty-icon">inbox</span>
                            <h4>No orders found</h4>
                            <p>Try adjusting your filters or create a new order.</p>
                        </div>
                    </td></tr>
                `;
                return;
            }

            ordersBody.innerHTML = pageItems.map(o => `
                <tr>
                    <td><span class="order-id">#${o.id}</span></td>
                    <td>
                        <div class="customer-name">${o.customer}</div>
                        <span class="customer-phone">${o.phone}</span>
                    </td>
                    <td class="date">${formatDate(o.date)}</td>
                    <td class="amount">₹${o.amount.toLocaleString('en-IN')}</td>
                    <td>${getStatusBadge(o.status)}</td>
                    <td style="text-align:center;">
                        <div class="table-actions" style="justify-content:center;">
                            <button class="action-icon view-order" data-id="${o.id}" title="View Order">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="action-icon edit-order" data-id="${o.id}" title="Edit Order">
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="action-icon delete delete-order" data-id="${o.id}" title="Delete Order">
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            document.querySelectorAll('.view-order').forEach(btn => {
                btn.addEventListener('click', function() {
                    app.showToast('Viewing order #' + this.dataset.id, 'visibility');
                });
            });
            document.querySelectorAll('.edit-order').forEach(btn => {
                btn.addEventListener('click', function() {
                    app.showToast('Editing order #' + this.dataset.id, 'edit');
                });
            });
            document.querySelectorAll('.delete-order').forEach(btn => {
                btn.addEventListener('click', function() {
                    app.showToast('Order #' + this.dataset.id + ' deleted (demo)', 'delete');
                });
            });
        }

        // Event listeners for orders
        if (statusFilter) statusFilter.addEventListener('change', () => { currentPage = 1;
            renderOrders(); });
        if (dateFilter) {
            dateFilter.addEventListener('change', function() {
                const isCustom = this.value === 'custom';
                if (dateFrom) dateFrom.style.display = isCustom ? 'inline-block' : 'none';
                if (dateTo) dateTo.style.display = isCustom ? 'inline-block' : 'none';
                currentPage = 1;
                renderOrders();
            });
        }
        if (dateFrom) dateFrom.addEventListener('change', () => { currentPage = 1;
            renderOrders(); });
        if (dateTo) dateTo.addEventListener('change', () => { currentPage = 1;
            renderOrders(); });
        if (resetFilters) {
            resetFilters.addEventListener('click', function() {
                if (statusFilter) statusFilter.value = 'all';
                if (dateFilter) dateFilter.value = 'all';
                if (dateFrom) { dateFrom.style.display = 'none';
                    dateFrom.value = ''; }
                if (dateTo) { dateTo.style.display = 'none';
                    dateTo.value = ''; }
                if (searchInput) searchInput.value = '';
                currentPage = 1;
                renderOrders();
                app.showToast('Filters reset', 'refresh');
            });
        }
        if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1;
            renderOrders(); });
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) { currentPage--;
                    renderOrders(); }
            });
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const total = Math.max(1, Math.ceil(getFilteredOrders().length / itemsPerPage));
                if (currentPage < total) { currentPage++;
                    renderOrders(); }
            });
        }
        pageButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.dataset.page);
                const total = Math.max(1, Math.ceil(getFilteredOrders().length / itemsPerPage));
                if (page >= 1 && page <= total) {
                    currentPage = page;
                    renderOrders();
                }
            });
        });

        document.getElementById('newOrderBtn')?.addEventListener('click', function() {
            app.showToast('New order form would open', 'add');
        });
        document.getElementById('exportOrdersBtn')?.addEventListener('click', function() {
            app.showToast('Exporting orders as CSV (demo)', 'download');
        });

        // Initial render if orders body exists
        if (ordersBody) renderOrders();
    })();

    // =============================================================
    //  PRODUCTS (products.js)
    // =============================================================
    (function() {
        const productsData = [
            { id: 1, name: 'Basmati Rice (5kg)', category: 'groceries', price: 350, stock: 45, icon: 'rice_bowl' },
            { id: 2, name: 'Toor Dal (1kg)', category: 'groceries', price: 120, stock: 28, icon: 'lunch_dining' },
            { id: 3, name: 'Wheat Flour (5kg)', category: 'groceries', price: 220, stock: 15, icon: 'bakery_dining' },
            { id: 4, name: 'Sugar (1kg)', category: 'groceries', price: 45, stock: 60, icon: 'cookies' },
            { id: 5, name: 'Milk (1L)', category: 'dairy', price: 56, stock: 12, icon: 'no_drinks' },
            { id: 6, name: 'Curd (500g)', category: 'dairy', price: 45, stock: 8, icon: 'cup' },
            { id: 7, name: 'Paneer (200g)', category: 'dairy', price: 80, stock: 3, icon: 'cheese' },
            { id: 8, name: 'Butter (100g)', category: 'dairy', price: 55, stock: 6, icon: 'spa' },
            { id: 9, name: 'Coca-Cola (2L)', category: 'beverages', price: 90, stock: 20, icon: 'local_drink' },
            { id: 10, name: 'Pepsi (2L)', category: 'beverages', price: 85, stock: 18, icon: 'local_drink' },
            { id: 11, name: 'Sprite (2L)', category: 'beverages', price: 85, stock: 10, icon: 'local_drink' },
            { id: 12, name: 'Water Bottle (1L)', category: 'beverages', price: 20, stock: 50, icon: 'water_drop' },
            { id: 13, name: 'Lays (50g)', category: 'snacks', price: 20, stock: 35, icon: 'fastfood' },
            { id: 14, name: 'Kurkure (50g)', category: 'snacks', price: 20, stock: 22, icon: 'fastfood' },
            { id: 15, name: 'Biscuits (75g)', category: 'snacks', price: 30, stock: 40, icon: 'cookies' },
            { id: 16, name: 'Shampoo (200ml)', category: 'personal-care', price: 180, stock: 7, icon: 'shower' },
            { id: 17, name: 'Soap (75g)', category: 'personal-care', price: 35, stock: 30, icon: 'bathtub' },
            { id: 18, name: 'Toothpaste (100g)', category: 'personal-care', price: 85, stock: 14, icon: 'cleaning_services' },
            { id: 19, name: 'Dish Soap (500ml)', category: 'household', price: 65, stock: 9, icon: 'spa' },
            { id: 20, name: 'Floor Cleaner (1L)', category: 'household', price: 120, stock: 4, icon: 'cleaning_services' },
        ];

        const grid = document.getElementById('productsGrid');
        const searchInput = document.getElementById('searchProducts');
        const categoryFilter = document.getElementById('categoryFilter');
        const stockFilter = document.getElementById('stockFilter');
        const sortFilter = document.getElementById('sortFilter');
        const resetBtn = document.getElementById('resetProductFilters');

        function getStockStatus(stock) {
            if (stock <= 0) return 'out-of-stock';
            if (stock <= 5) return 'low-stock';
            return 'in-stock';
        }

        function getStockLabel(stock) {
            if (stock <= 0) return 'Out of Stock';
            if (stock <= 5) return 'Low Stock (' + stock + ' left)';
            return 'In Stock (' + stock + ')';
        }

        function getStockClass(stock) {
            return getStockStatus(stock);
        }

        function getFilteredProducts() {
            let filtered = [...productsData];
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            if (searchTerm) {
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.category.toLowerCase().includes(searchTerm)
                );
            }
            const catVal = categoryFilter ? categoryFilter.value : 'all';
            if (catVal !== 'all') filtered = filtered.filter(p => p.category === catVal);

            const stockVal = stockFilter ? stockFilter.value : 'all';
            if (stockVal !== 'all') filtered = filtered.filter(p => getStockStatus(p.stock) === stockVal);

            const sortVal = sortFilter ? sortFilter.value : 'name-asc';
            switch (sortVal) {
                case 'name-asc':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'price-asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
            }
            return filtered;
        }

        function renderProducts() {
            if (!grid) return;
            const filtered = getFilteredProducts();
            if (filtered.length === 0) {
                grid.innerHTML = `
                    <div class="empty-products">
                        <span class="material-symbols-outlined empty-icon">inventory_2</span>
                        <h4>No products found</h4>
                        <p>Try adjusting your filters or add a new product.</p>
                    </div>
                `;
                return;
            }
            grid.innerHTML = filtered.map(p => {
                const stockClass = getStockClass(p.stock);
                const stockLabel = getStockLabel(p.stock);
                const icon = p.icon || 'inventory_2';
                const isOutOfStock = p.stock <= 0;
                return `
                    <div class="product-card glass-card" data-id="${p.id}">
                        <div class="product-img">
                            <span class="material-symbols-outlined">${icon}</span>
                        </div>
                        <h4>${p.name}</h4>
                        <div class="product-category">${p.category.charAt(0).toUpperCase() + p.category.slice(1)}</div>
                        <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
                        <span class="stock-badge ${stockClass}">${stockLabel}</span>
                        <div class="card-actions">
                            <button class="btn-add" data-id="${p.id}" ${isOutOfStock ? 'disabled' : ''}>
                                <span class="material-symbols-outlined" style="font-size:16px;">shopping_cart</span>
                                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button class="btn-edit" data-id="${p.id}">
                                <span class="material-symbols-outlined" style="font-size:16px;">edit</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            document.querySelectorAll('.btn-add:not(:disabled)').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    const product = productsData.find(p => p.id === id);
                    if (product) app.showToast(`Added "${product.name}" to cart 🛒`, 'shopping_cart');
                });
            });
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    const product = productsData.find(p => p.id === id);
                    if (product) app.showToast(`Editing "${product.name}" (demo)`, 'edit');
                });
            });
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (e.target.closest('button')) return;
                    const id = parseInt(this.dataset.id);
                    const product = productsData.find(p => p.id === id);
                    if (product) app.showToast(`Viewing details for "${product.name}"`, 'visibility');
                });
            });
        }

        if (searchInput) searchInput.addEventListener('input', renderProducts);
        if (categoryFilter) categoryFilter.addEventListener('change', renderProducts);
        if (stockFilter) stockFilter.addEventListener('change', renderProducts);
        if (sortFilter) sortFilter.addEventListener('change', renderProducts);
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                if (searchInput) searchInput.value = '';
                if (categoryFilter) categoryFilter.value = 'all';
                if (stockFilter) stockFilter.value = 'all';
                if (sortFilter) sortFilter.value = 'name-asc';
                renderProducts();
                app.showToast('Filters reset', 'refresh');
            });
        }

        document.getElementById('addProductBtn')?.addEventListener('click', function() {
            app.showToast('Add product form would open', 'add');
        });
        document.getElementById('exportProductsBtn')?.addEventListener('click', function() {
            app.showToast('Exporting products as CSV (demo)', 'download');
        });

        if (grid) renderProducts();
    })();

    // =============================================================
    //  SHOPKEEPER (shopkeeper.js)
    // =============================================================
    (function() {
        // Quick actions in shopkeeper dashboard
        document.querySelectorAll('#view-shopkeeper-dashboard .action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const label = this.querySelector('span:last-child')?.textContent || 'Action';
                app.showToast(label + ' triggered (demo)', 'bolt');
            });
        });

        // Search (demo)
        const searchInput = document.querySelector('#view-shopkeeper-dashboard .search-input, .topnav .search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const val = this.value.trim();
                    if (val) app.showToast('Searching for "' + val + '" (demo)', 'search');
                }
            });
        }

        // Profile edit (reuse same as customer, but we can keep separate)
        const editProfileBtn = document.querySelector('#view-profile .profile-card .btn-primary');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                app.showToast('Edit profile form would open here', 'edit');
            });
        }
        const avatarEditBtn = document.querySelector('.avatar-edit-btn');
        if (avatarEditBtn) {
            avatarEditBtn.addEventListener('click', function() {
                app.showToast('Change avatar dialog would open', 'photo_camera');
            });
        }

        // Settings toggles
        document.querySelectorAll('#view-settings .toggle-switch:not(#settingsThemeToggle)').forEach(sw => {
            sw.addEventListener('click', function() {
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                const label = this.closest('.setting-group').querySelector('.setting-label h4');
                if (label) app.showToast(label.textContent + ' ' + (isActive ? 'enabled' : 'disabled'), 'toggle_on');
            });
        });

        // Privacy manage
        document.querySelector('#view-settings .setting-group .btn-secondary')?.addEventListener('click', function() {
            app.showToast('Privacy settings management', 'privacy_tip');
        });

        // Notifications: mark all read (same as customer, but we can duplicate)
        const markAllReadBtn = document.getElementById('markAllRead');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function() {
                const items = document.querySelectorAll('.notification-item');
                let count = 0;
                items.forEach(item => {
                    if (!item.classList.contains('read')) {
                        item.classList.add('read');
                        count++;
                    }
                });
                const badge = document.querySelector('.sidebar-nav .badge');
                if (badge) {
                    const remaining = document.querySelectorAll('.notification-item:not(.read)').length;
                    badge.textContent = remaining > 0 ? remaining : '0';
                    badge.style.display = remaining > 0 ? '' : 'none';
                }
                const dot = document.querySelector('.badge-dot');
                if (dot) {
                    const unread = document.querySelectorAll('.notification-item:not(.read)').length;
                    dot.style.display = unread > 0 ? 'block' : 'none';
                }
                if (count > 0) app.showToast('Marked ' + count + ' notification' + (count > 1 ? 's' : '') + ' as read', 'check_circle');
                else app.showToast('All notifications already read', 'info');
            });
        }

        // Single notification click
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                if (!this.classList.contains('read')) {
                    this.classList.add('read');
                    const remaining = document.querySelectorAll('.notification-item:not(.read)').length;
                    const badge = document.querySelector('.sidebar-nav .badge');
                    if (badge) {
                        badge.textContent = remaining > 0 ? remaining : '0';
                        badge.style.display = remaining > 0 ? '' : 'none';
                    }
                    const dot = document.querySelector('.badge-dot');
                    if (dot) {
                        dot.style.display = remaining > 0 ? 'block' : 'none';
                    }
                    app.showToast('Marked as read', 'done');
                }
            });
        });
    })();

    // =============================================================
    //  ADDITIONAL GLOBAL NAVIGATION FOR LINKS WITH data-view
    //  (already handled in app.js, but we need to ensure clicks on
    //  elements with data-view that are not .nav-link also work)
    // =============================================================
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-view]');
        if (target && !target.closest('.nav-link')) {
            e.preventDefault();
            const view = target.getAttribute('data-view');
            if (view) app.navigateTo(view);
        }
    });

    // =============================================================
    //  INITIALISE APP
    // =============================================================
    document.addEventListener('DOMContentLoaded', function() {
        app.init();
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        app.init();
    }

})();