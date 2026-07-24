/* ================================================================
   Udhar Bazaar — Complete JavaScript
   No fake data, no external libraries (except FontAwesome icons)
   ================================================================ */

// ---------- DATA LAYER (localStorage) ----------
const STORAGE_KEY = 'udharBazaarData';

function getDefaultData() {
    return {
        // Master grocery items — you can add/remove items here
        items: [
            { id: 'i1', name: 'Atta (Wheat)', price: 32, unit: 'kg' },
            { id: 'i2', name: 'Chawal (Rice)', price: 45, unit: 'kg' },
            { id: 'i3', name: 'Sugar', price: 42, unit: 'kg' },
            { id: 'i4', name: 'Cooking Oil', price: 180, unit: 'L' },
            { id: 'i5', name: 'Toor Dal', price: 120, unit: 'kg' },
            { id: 'i6', name: 'Salt', price: 20, unit: 'kg' },
            { id: 'i7', name: 'Tea (Chai)', price: 85, unit: '250g' },
            { id: 'i8', name: 'Biscuits', price: 30, unit: 'pack' },
            { id: 'i9', name: 'Soap', price: 45, unit: 'pc' },
            { id: 'i10', name: 'Shampoo', price: 120, unit: 'pc' },
        ],
        customers: [],        // { id, name, createdAt }
        orders: [],           // { id, customerId, shopkeeperId, status, items, estimatedTotal, finalTotal, createdAt, completedAt }
        ledgers: [],          // { customerId, totalOutstanding, paidAmount, bills: [orderId] }
        session: {
            customerId: null,
            shopkeeperId: null,
            shopName: null,
        }
    };
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            const def = getDefaultData();
            // Ensure all expected keys exist
            for (let k in def) {
                if (!(k in data)) data[k] = def[k];
            }
            return data;
        }
    } catch (_) { /* ignore */ }
    const def = getDefaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(def));
    return def;
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ---------- APP STATE ----------
let data = loadData();
let currentMode = 'customer';
let customerCart = {};          // { itemId: { id, name, price, unit, qty } }
let currentFulfillOrderId = null;

// ---------- TOAST NOTIFICATION ----------
let toastTimer = null;

function showToast(msg, duration = 2800) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

// ---------- MODE SWITCH ----------
function setMode(mode) {
    currentMode = mode;
    const custBtn = document.getElementById('modeCustomer');
    const shopBtn = document.getElementById('modeShopkeeper');
    const custView = document.getElementById('customerView');
    const shopView = document.getElementById('shopkeeperView');

    if (custBtn) custBtn.classList.toggle('active', mode === 'customer');
    if (shopBtn) shopBtn.classList.toggle('active', mode === 'shopkeeper');
    if (custView) custView.classList.toggle('hidden', mode !== 'customer');
    if (shopView) shopView.classList.toggle('hidden', mode !== 'shopkeeper');

    if (mode === 'customer') renderCustomerView();
    else renderShopkeeperView();
}

// ================================================================
//                     CUSTOMER FUNCTIONS
// ================================================================

function customerLogin() {
    const input = document.getElementById('customerNameInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { showToast('Please enter your name'); return; }

    let cust = data.customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!cust) {
        cust = { id: 'c' + Date.now(), name: name, createdAt: new Date().toISOString() };
        data.customers.push(cust);
        if (!data.ledgers.find(l => l.customerId === cust.id)) {
            data.ledgers.push({ customerId: cust.id, totalOutstanding: 0, paidAmount: 0, bills: [] });
        }
        saveData(data);
        showToast('Welcome ' + name + '! Start your udhar list.');
    } else {
        showToast('Welcome back, ' + name + '!');
    }

    data.session.customerId = cust.id;
    saveData(data);
    renderCustomerView();
}

function customerLogout() {
    data.session.customerId = null;
    saveData(data);
    customerCart = {};
    renderCustomerView();
    showToast('Logged out.');
}

function renderCustomerView() {
    const custId = data.session.customerId;
    const loginDiv = document.getElementById('customerLogin');
    const dashDiv = document.getElementById('customerDashboard');

    if (!custId) {
        if (loginDiv) loginDiv.classList.remove('hidden');
        if (dashDiv) dashDiv.classList.add('hidden');
        return;
    }

    if (loginDiv) loginDiv.classList.add('hidden');
    if (dashDiv) dashDiv.classList.remove('hidden');

    const cust = data.customers.find(c => c.id === custId);
    if (!cust) { customerLogout(); return; }

    const nameDisplay = document.getElementById('cUserNameDisplay');
    if (nameDisplay) nameDisplay.textContent = cust.name;

    // Stats
    const orders = data.orders.filter(o => o.customerId === custId);
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'picked');
    const completed = orders.filter(o => o.status === 'completed');
    const ledger = data.ledgers.find(l => l.customerId === custId);
    const outstanding = ledger ? ledger.totalOutstanding : 0;

    const elPending = document.getElementById('cPendingOrders');
    const elOutstanding = document.getElementById('cTotalOutstanding');
    const elBills = document.getElementById('cTotalBills');
    if (elPending) elPending.textContent = pending.length;
    if (elOutstanding) elOutstanding.textContent = '₹' + outstanding;
    if (elBills) elBills.textContent = completed.length;

    renderItems();
    renderCart();
    renderCustomerBillHistory(custId);
}

function renderItems() {
    const grid = document.getElementById('itemGrid');
    if (!grid) return;
    grid.innerHTML = '';

    data.items.forEach(item => {
        const qty = customerCart[item.id] ? customerCart[item.id].qty : 0;
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="name">${item.name}</div>
            <div class="price">₹${item.price} / ${item.unit}</div>
            <div class="qty-control">
                <button onclick="adjustQty('${item.id}', -1)">−</button>
                <span class="qty">${qty}</span>
                <button onclick="adjustQty('${item.id}', 1)">+</button>
            </div>
            <button class="add-btn" onclick="addToCart('${item.id}')" ${qty === 0 ? 'disabled' : ''}>
                ${qty > 0 ? 'Add to List' : 'Select Qty'}
            </button>
        `;
        grid.appendChild(div);
    });
}

function adjustQty(itemId, delta) {
    const item = data.items.find(i => i.id === itemId);
    if (!item) return;

    if (!customerCart[itemId]) {
        customerCart[itemId] = { ...item, qty: 0 };
    }

    const newQty = Math.max(0, customerCart[itemId].qty + delta);
    if (newQty === 0) {
        delete customerCart[itemId];
    } else {
        customerCart[itemId].qty = newQty;
    }

    renderItems();
    renderCart();
}

function addToCart(itemId) {
    if (!data.session.customerId) { showToast('Please login first'); return; }
    const entry = customerCart[itemId];
    if (!entry || entry.qty === 0) {
        showToast('Use + / - to select quantity first');
        return;
    }
    showToast(`Added ${entry.qty} × ${entry.name} to list`);
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const countEl = document.getElementById('cartCount');
    const placeBtn = document.getElementById('placeUdharBtn');

    if (!container) return;

    const entries = Object.values(customerCart);

    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding:16px 0;">
                <i class="fas fa-shopping-cart"></i>
                <p>Your udhar list is empty.<br>Add items above.</p>
            </div>
        `;
        if (totalEl) totalEl.textContent = 'Total: ₹0';
        if (countEl) countEl.textContent = '0 items';
        if (placeBtn) placeBtn.disabled = true;
        return;
    }

    let html = '';
    let total = 0;
    entries.forEach(item => {
        const sub = item.price * item.qty;
        total += sub;
        html += `
            <div class="cart-item">
                <div class="info">
                    <div class="name">${item.name}</div>
                    <div class="detail">₹${item.price} × ${item.qty} = ₹${sub}</div>
                </div>
                <div class="actions">
                    <span class="qty-badge">${item.qty}</span>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalEl) totalEl.textContent = 'Total: ₹' + total;
    if (countEl) countEl.textContent = entries.length + ' items';
    if (placeBtn) placeBtn.disabled = false;
}

function removeFromCart(itemId) {
    delete customerCart[itemId];
    renderItems();
    renderCart();
    showToast('Removed from list');
}

function clearCart() {
    if (Object.keys(customerCart).length === 0) { showToast('List is already empty'); return; }
    customerCart = {};
    renderItems();
    renderCart();
    showToast('List cleared');
}

function placeUdharOrder() {
    const custId = data.session.customerId;
    if (!custId) { showToast('Please login first'); return; }

    const entries = Object.values(customerCart);
    if (entries.length === 0) { showToast('Add items to your list first'); return; }

    let estTotal = 0;
    const orderItems = entries.map(item => {
        const sub = item.price * item.qty;
        estTotal += sub;
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            unit: item.unit,
            requestedQty: item.qty,
            actualQty: item.qty,
            total: sub,
        };
    });

    const order = {
        id: 'ord_' + Date.now(),
        customerId: custId,
        shopkeeperId: data.session.shopkeeperId || 'shop_default',
        status: 'pending',
        items: orderItems,
        estimatedTotal: Math.round(estTotal * 100) / 100,
        finalTotal: Math.round(estTotal * 100) / 100,
        createdAt: new Date().toISOString(),
        completedAt: null,
    };

    data.orders.push(order);
    saveData(data);

    customerCart = {};
    renderItems();
    renderCart();
    renderCustomerBillHistory(custId);
    showToast('✅ Udhar list placed! Order: ' + order.id.slice(-6));
}

function renderCustomerBillHistory(custId) {
    const container = document.getElementById('customerBillHistory');
    if (!container) return;

    const orders = data.orders
        .filter(o => o.customerId === custId && o.status === 'completed')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding:20px 0;">
                <i class="fas fa-receipt"></i>
                <p>No completed bills yet.</p>
            </div>
        `;
        return;
    }

    let html = '';
    orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        const ledger = data.ledgers.find(l => l.customerId === custId);
        const isPaid = ledger ? ledger.bills.includes(order.id) : false;

        html += `
            <div class="card" style="margin-bottom:10px;">
                <div class="bill-item">
                    <div class="top">
                        <span>#${order.id.slice(-6)}</span>
                        <span>₹${order.finalTotal}</span>
                    </div>
                    <div class="bottom">
                        <span>${date}</span>
                        <span class="ledger-status">
                            <span class="status ${isPaid ? 'paid' : 'unpaid'}">
                                ${isPaid ? '✅ Paid' : '⏳ Unpaid'}
                            </span>
                            ${!isPaid ? `<button class="pay-btn" onclick="markBillPaid('${order.id}')">Pay</button>` : ''}
                        </span>
                    </div>
                    <button class="bill-detail-toggle" onclick="toggleBillDetail('${order.id}')">
                        <i class="fas fa-chevron-down"></i> Show Items
                    </button>
                    <div id="billDetail_${order.id}" class="bill-items-detail hidden">
                        ${order.items.map(it => `
                            <div class="row">
                                <span>${it.name} × ${it.actualQty || it.requestedQty} ${it.unit}</span>
                                <span>₹${(it.price * (it.actualQty || it.requestedQty)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="row total">
                            <span>Total</span>
                            <span>₹${order.finalTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function toggleBillDetail(orderId) {
    const el = document.getElementById('billDetail_' + orderId);
    if (el) el.classList.toggle('hidden');
}

function markBillPaid(orderId) {
    const custId = data.session.customerId;
    if (!custId) { showToast('Please login first'); return; }

    const ledger = data.ledgers.find(l => l.customerId === custId);
    if (!ledger) { showToast('Ledger not found'); return; }

    if (ledger.bills.includes(orderId)) {
        showToast('Already paid');
        return;
    }

    const order = data.orders.find(o => o.id === orderId);
    if (!order) { showToast('Order not found'); return; }

    ledger.bills.push(orderId);
    ledger.totalOutstanding = Math.max(0, ledger.totalOutstanding - order.finalTotal);
    ledger.paidAmount = (ledger.paidAmount || 0) + order.finalTotal;

    saveData(data);
    renderCustomerBillHistory(custId);
    renderCustomerView();
    showToast('✅ Bill marked as paid!');
}

// ================================================================
//                     SHOPKEEPER FUNCTIONS
// ================================================================

function shopkeeperLogin() {
    const input = document.getElementById('shopNameInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { showToast('Please enter shop name'); return; }

    data.session.shopkeeperId = 'shop_' + Date.now();
    data.session.shopName = name;
    saveData(data);

    showToast('Welcome, ' + name + '!');
    renderShopkeeperView();
}

function shopkeeperLogout() {
    data.session.shopkeeperId = null;
    data.session.shopName = null;
    saveData(data);
    currentFulfillOrderId = null;
    renderShopkeeperView();
    showToast('Logged out.');
}

function renderShopkeeperView() {
    const shopId = data.session.shopkeeperId;
    const loginDiv = document.getElementById('shopkeeperLogin');
    const dashDiv = document.getElementById('shopkeeperDashboard');

    if (!shopId) {
        if (loginDiv) loginDiv.classList.remove('hidden');
        if (dashDiv) dashDiv.classList.add('hidden');
        return;
    }

    if (loginDiv) loginDiv.classList.add('hidden');
    if (dashDiv) dashDiv.classList.remove('hidden');

    const shopName = data.session.shopName || 'Shop';
    const nameDisplay = document.getElementById('shopNameDisplay');
    if (nameDisplay) nameDisplay.textContent = shopName;

    const allOrders = data.orders;
    const pending = allOrders.filter(o => o.status === 'pending' || o.status === 'picked');
    const completed = allOrders.filter(o => o.status === 'completed');
    const totalUdhar = completed.reduce((sum, o) => sum + o.finalTotal, 0);

    const elPending = document.getElementById('sPendingOrders');
    const elTotal = document.getElementById('sTotalUdhar');
    const elAll = document.getElementById('sTotalOrders');
    const elCount = document.getElementById('pendingCount');
    if (elPending) elPending.textContent = pending.length;
    if (elTotal) elTotal.textContent = '₹' + totalUdhar;
    if (elAll) elAll.textContent = allOrders.length;
    if (elCount) elCount.textContent = pending.length;

    renderPendingOrders(pending);
    renderShopkeeperBillHistory();

    if (currentFulfillOrderId) {
        renderFulfillmentView(currentFulfillOrderId);
    }
}

function renderPendingOrders(orders) {
    const container = document.getElementById('pendingOrdersList');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding:16px 0;">
                <i class="fas fa-check-circle" style="color:var(--green);"></i>
                <p>No pending orders. All clear!</p>
            </div>
        `;
        return;
    }

    let html = '';
    orders.forEach(order => {
        const cust = data.customers.find(c => c.id === order.customerId);
        const custName = cust ? cust.name : 'Unknown';
        const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
        const statusLabel = order.status === 'pending' ? '🟡 Pending' : '🔵 Picked';

        html += `
            <div class="order-item" onclick="openFulfillment('${order.id}')">
                <div class="order-info">
                    <div class="cust">👤 ${custName}</div>
                    <div class="meta">${date} · ${order.items.length} items · ₹${order.estimatedTotal}</div>
                </div>
                <span class="status-badge ${order.status}">${statusLabel}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function searchCustomer() {
    const input = document.getElementById('customerSearchInput');
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    if (!query) { showToast('Enter a customer name to search'); return; }

    const matched = data.customers.filter(c => c.name.toLowerCase().includes(query));
    if (matched.length === 0) { showToast('No customer found with that name'); return; }

    const custIds = matched.map(c => c.id);
    const pendingOrders = data.orders.filter(o =>
        (o.status === 'pending' || o.status === 'picked') && custIds.includes(o.customerId)
    );

    if (pendingOrders.length === 0) {
        showToast('No pending orders for ' + matched.map(c => c.name).join(', '));
    } else {
        showToast('Found ' + pendingOrders.length + ' pending order(s)');
        renderPendingOrders(pendingOrders);
    }
}

// ================================================================
//                     FULFILLMENT
// ================================================================

function openFulfillment(orderId) {
    const order = data.orders.find(o => o.id === orderId);
    if (!order) { showToast('Order not found'); return; }

    currentFulfillOrderId = orderId;
    const fulfillView = document.getElementById('fulfillmentView');
    const pendingContainer = document.getElementById('pendingOrdersContainer');
    if (fulfillView) fulfillView.classList.remove('hidden');
    if (pendingContainer) pendingContainer.classList.add('hidden');
    renderFulfillmentView(orderId);
}

function renderFulfillmentView(orderId) {
    const order = data.orders.find(o => o.id === orderId);
    if (!order) { closeFulfillment(); return; }

    const cust = data.customers.find(c => c.id === order.customerId);
    const custNameEl = document.getElementById('fulfillCustomerName');
    if (custNameEl) custNameEl.textContent = cust ? cust.name : 'Unknown';

    const list = document.getElementById('fulfillItemsList');
    if (!list) return;

    let html = '';
    let finalTotal = 0;

    order.items.forEach((item, idx) => {
        const actual = item.actualQty !== undefined ? item.actualQty : item.requestedQty;
        const sub = item.price * actual;
        finalTotal += sub;

        html += `
            <div class="fulfill-item">
                <div class="info">
                    <div class="name">${item.name}</div>
                    <div class="requested">Requested: ${item.requestedQty} ${item.unit} · ₹${item.price}/${item.unit}</div>
                </div>
                <div class="actual-qty">
                    <input type="number" step="0.1" min="0" value="${actual}" 
                           onchange="updateFulfillQty('${orderId}', ${idx}, this.value)" />
                    <span class="unit">${item.unit}</span>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;

    const estEl = document.getElementById('fulfillEstTotal');
    const finalEl = document.getElementById('fulfillFinalAmount');
    if (estEl) estEl.textContent = order.estimatedTotal;
    if (finalEl) finalEl.textContent = finalTotal.toFixed(2);

    order._tempFinalTotal = finalTotal;
}

function updateFulfillQty(orderId, idx, value) {
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return;

    const num = parseFloat(value) || 0;
    if (idx >= 0 && idx < order.items.length) {
        order.items[idx].actualQty = num;

        let total = 0;
        order.items.forEach(item => {
            const qty = item.actualQty !== undefined ? item.actualQty : item.requestedQty;
            total += item.price * qty;
        });
        order._tempFinalTotal = total;
        const finalEl = document.getElementById('fulfillFinalAmount');
        if (finalEl) finalEl.textContent = total.toFixed(2);
        saveData(data);
    }
}

function completeFulfillment() {
    const order = data.orders.find(o => o.id === currentFulfillOrderId);
    if (!order) { showToast('Order not found'); return; }

    order.items.forEach(item => {
        if (item.actualQty === undefined || item.actualQty === null) {
            item.actualQty = item.requestedQty;
        }
    });

    let finalTotal = 0;
    order.items.forEach(item => {
        finalTotal += item.price * (item.actualQty || item.requestedQty);
    });

    order.finalTotal = Math.round(finalTotal * 100) / 100;
    order.status = 'completed';
    order.completedAt = new Date().toISOString();

    // Update ledger
    let ledger = data.ledgers.find(l => l.customerId === order.customerId);
    if (!ledger) {
        ledger = { customerId: order.customerId, totalOutstanding: 0, paidAmount: 0, bills: [] };
        data.ledgers.push(ledger);
    }
    ledger.totalOutstanding = (ledger.totalOutstanding || 0) + order.finalTotal;

    delete order._tempFinalTotal;
    saveData(data);

    showToast('✅ Bill finalized! Saved to both sides.');
    closeFulfillment();
    renderShopkeeperView();
}

function closeFulfillment() {
    currentFulfillOrderId = null;
    const fulfillView = document.getElementById('fulfillmentView');
    const pendingContainer = document.getElementById('pendingOrdersContainer');
    if (fulfillView) fulfillView.classList.add('hidden');
    if (pendingContainer) pendingContainer.classList.remove('hidden');
    renderShopkeeperView();
}

// ================================================================
//                     SHOPKEEPER LEDGER
// ================================================================

function renderShopkeeperBillHistory() {
    const container = document.getElementById('shopkeeperBillHistory');
    if (!container) return;

    const completed = data.orders
        .filter(o => o.status === 'completed')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (completed.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding:20px 0;">
                <i class="fas fa-book-open"></i>
                <p>No completed bills in ledger.</p>
            </div>
        `;
        return;
    }

    let html = '';
    completed.forEach(order => {
        const cust = data.customers.find(c => c.id === order.customerId);
        const custName = cust ? cust.name : 'Unknown';
        const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        const ledger = data.ledgers.find(l => l.customerId === order.customerId);
        const isPaid = ledger ? ledger.bills.includes(order.id) : false;

        html += `
            <div class="card" style="margin-bottom:8px;">
                <div class="bill-item">
                    <div class="top">
                        <span>👤 ${custName} · #${order.id.slice(-6)}</span>
                        <span>₹${order.finalTotal}</span>
                    </div>
                    <div class="bottom">
                        <span>${date}</span>
                        <span class="status ${isPaid ? 'paid' : 'unpaid'}">
                            ${isPaid ? '✅ Paid' : '⏳ Unpaid'}
                        </span>
                    </div>
                    <button class="bill-detail-toggle" onclick="toggleBillDetail('${order.id}')">
                        <i class="fas fa-chevron-down"></i> Show Items
                    </button>
                    <div id="billDetail_${order.id}" class="bill-items-detail hidden">
                        ${order.items.map(it => `
                            <div class="row">
                                <span>${it.name} × ${it.actualQty || it.requestedQty} ${it.unit}</span>
                                <span>₹${(it.price * (it.actualQty || it.requestedQty)).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="row total">
                            <span>Total</span>
                            <span>₹${order.finalTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ================================================================
//                     INITIALIZATION
// ================================================================

function init() {
    // Ensure default items exist
    if (!data.items || data.items.length === 0) {
        const def = getDefaultData();
        data.items = def.items;
        saveData(data);
    }

    // Validate session
    const custId = data.session.customerId;
    if (custId) {
        const exists = data.customers.some(c => c.id === custId);
        if (!exists) data.session.customerId = null;
    }

    // Shopkeeper session is just a placeholder; no validation needed

    saveData(data);

    if (data.session.customerId) setMode('customer');
    else if (data.session.shopkeeperId) setMode('shopkeeper');
    else setMode('customer');
}

// ================================================================
//                     EXPOSE TO GLOBAL SCOPE
// ================================================================

window.setMode = setMode;
window.customerLogin = customerLogin;
window.customerLogout = customerLogout;
window.shopkeeperLogin = shopkeeperLogin;
window.shopkeeperLogout = shopkeeperLogout;
window.adjustQty = adjustQty;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.placeUdharOrder = placeUdharOrder;
window.toggleBillDetail = toggleBillDetail;
window.markBillPaid = markBillPaid;
window.searchCustomer = searchCustomer;
window.openFulfillment = openFulfillment;
window.closeFulfillment = closeFulfillment;
window.updateFulfillQty = updateFulfillQty;
window.completeFulfillment = completeFulfillment;

// Boot the app
document.addEventListener('DOMContentLoaded', init);
