/* =================================================================
   UDHARKART — orders.js
   Orders listing, filtering, pagination, and actions
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  SAMPLE DATA
    // =============================================================
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

    // =============================================================
    //  DOM REFS
    // =============================================================
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
    const itemsPerPage = 5;
    let currentPage = 1;

    // =============================================================
    //  HELPERS
    // =============================================================
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

    // =============================================================
    //  FILTER & PAGINATION
    // =============================================================
    function getFilteredOrders() {
        let filtered = [...ordersData];

        // Search
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.id.toLowerCase().includes(searchTerm) ||
                o.customer.toLowerCase().includes(searchTerm) ||
                o.phone.includes(searchTerm)
            );
        }

        // Status
        const statusVal = statusFilter ? statusFilter.value : 'all';
        if (statusVal !== 'all') {
            filtered = filtered.filter(o => o.status === statusVal);
        }

        // Date
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
        const filtered = getFilteredOrders();
        const totalItems = filtered.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, totalItems);
        const pageItems = filtered.slice(start, end);

        // Update pagination info
        if (paginationInfo) {
            paginationInfo.textContent =
                totalItems === 0 ?
                'No orders found' :
                `Showing ${start + 1}–${end} of ${totalItems} orders`;
        }

        // Update page buttons
        pageButtons.forEach(btn => {
            const page = parseInt(btn.dataset.page);
            btn.classList.toggle('active', page === currentPage);
            btn.style.display = page <= totalPages ? 'inline-flex' : 'none';
        });

        if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;

        // Render rows
        if (!ordersBody) return;

        if (pageItems.length === 0) {
            ordersBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-orders">
                            <span class="material-symbols-outlined empty-icon">inbox</span>
                            <h4>No orders found</h4>
                            <p>Try adjusting your filters or create a new order.</p>
                        </div>
                    </td>
                </tr>
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

        // Attach event listeners
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.udhar && window.udhar.showToast) {
                    window.udhar.showToast('Viewing order #' + this.dataset.id, 'visibility');
                }
            });
        });
        document.querySelectorAll('.edit-order').forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.udhar && window.udhar.showToast) {
                    window.udhar.showToast('Editing order #' + this.dataset.id, 'edit');
                }
            });
        });
        document.querySelectorAll('.delete-order').forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.udhar && window.udhar.showToast) {
                    window.udhar.showToast('Order #' + this.dataset.id + ' deleted (demo)', 'delete');
                }
            });
        });
    }

    // =============================================================
    //  EVENT BINDING
    // =============================================================
    if (statusFilter) statusFilter.addEventListener('change', () => { currentPage = 1; renderOrders(); });
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            const isCustom = this.value === 'custom';
            if (dateFrom) dateFrom.style.display = isCustom ? 'inline-block' : 'none';
            if (dateTo) dateTo.style.display = isCustom ? 'inline-block' : 'none';
            currentPage = 1;
            renderOrders();
        });
    }
    if (dateFrom) dateFrom.addEventListener('change', () => { currentPage = 1; renderOrders(); });
    if (dateTo) dateTo.addEventListener('change', () => { currentPage = 1; renderOrders(); });

    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            if (statusFilter) statusFilter.value = 'all';
            if (dateFilter) dateFilter.value = 'all';
            if (dateFrom) { dateFrom.style.display = 'none'; dateFrom.value = ''; }
            if (dateTo) { dateTo.style.display = 'none'; dateTo.value = ''; }
            if (searchInput) searchInput.value = '';
            currentPage = 1;
            renderOrders();
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Filters reset', 'refresh');
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1; renderOrders(); });

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; renderOrders(); }
        });
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const total = Math.max(1, Math.ceil(getFilteredOrders().length / itemsPerPage));
            if (currentPage < total) { currentPage++; renderOrders(); }
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

    // New order & export buttons
    document.getElementById('newOrderBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('New order form would open', 'add');
        }
    });
    document.getElementById('exportBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Exporting orders as CSV (demo)', 'download');
        }
    });

    // =============================================================
    //  INIT
    // =============================================================
    renderOrders();

})();