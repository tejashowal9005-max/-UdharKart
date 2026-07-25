/* =================================================================
   UDHARKART — products.js
   Product listing, filtering, search, and add-to-cart demo
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  SAMPLE DATA
    // =============================================================
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

    // =============================================================
    //  DOM REFS
    // =============================================================
    const grid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchProducts');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    const sortFilter = document.getElementById('sortFilter');
    const resetBtn = document.getElementById('resetFilters');

    // =============================================================
    //  HELPERS
    // =============================================================
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

    function getCategoryIcon(category) {
        const map = {
            'groceries': 'rice_bowl',
            'dairy': 'no_drinks',
            'beverages': 'local_drink',
            'snacks': 'fastfood',
            'personal-care': 'shower',
            'household': 'cleaning_services'
        };
        return map[category] || 'inventory_2';
    }

    // =============================================================
    //  FILTER & RENDER
    // =============================================================
    function getFilteredProducts() {
        let filtered = [...productsData];

        // Search
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }

        // Category
        const catVal = categoryFilter ? categoryFilter.value : 'all';
        if (catVal !== 'all') {
            filtered = filtered.filter(p => p.category === catVal);
        }

        // Stock
        const stockVal = stockFilter ? stockFilter.value : 'all';
        if (stockVal !== 'all') {
            filtered = filtered.filter(p => getStockStatus(p.stock) === stockVal);
        }

        // Sort
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
            const icon = p.icon || getCategoryIcon(p.category);
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

        // Attach event listeners
        document.querySelectorAll('.btn-add:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                const product = productsData.find(p => p.id === id);
                if (product && window.udhar && window.udhar.showToast) {
                    window.udhar.showToast(`Added "${product.name}" to cart 🛒`, 'shopping_cart');
                }
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                const product = productsData.find(p => p.id === id);
                if (product && window.udhar && window.udhar.showToast) {
                    window.udhar.showToast(`Editing "${product.name}" (demo)`, 'edit');
                }
            });
        });

        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('button')) return;
                const id = parseInt(this.dataset.id);
                const product = productsData.find(p => p.id === id);
                if (product && window.udhar && window.udhar.showToast) {
                    window.udhar.showToast(`Viewing details for "${product.name}"`, 'visibility');
                }
            });
        });
    }

    // =============================================================
    //  EVENT BINDING
    // =============================================================
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
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Filters reset', 'refresh');
            }
        });
    }

    // Add product & export buttons (demo)
    document.getElementById('addProductBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Add product form would open', 'add');
        }
    });

    document.getElementById('exportProductsBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Exporting products as CSV (demo)', 'download');
        }
    });

    // =============================================================
    //  INIT
    // =============================================================
    renderProducts();

})();