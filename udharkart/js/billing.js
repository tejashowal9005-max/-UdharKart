/* =================================================================
   UDHARKART — billing.js
   Invoice display, print, download, and email actions
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  INVOICE DATA
    // =============================================================
    const invoiceItems = [
        { name: 'Basmati Rice (5kg)', price: 350, qty: 2 },
        { name: 'Wheat Flour (5kg)', price: 220, qty: 1 },
        { name: 'Milk (1L)', price: 56, qty: 4 },
        { name: 'Coca-Cola (2L)', price: 90, qty: 3 },
        { name: 'Lays (50g)', price: 20, qty: 5 },
    ];

    const SHIPPING_COST = 40;
    let discountApplied = true; // For demo

    // =============================================================
    //  DOM REFS
    // =============================================================
    const invoiceItemsBody = document.getElementById('invoiceItemsBody');
    const invSubtotal = document.getElementById('invSubtotal');
    const invShipping = document.getElementById('invShipping');
    const invDiscountRow = document.getElementById('invDiscountRow');
    const invDiscount = document.getElementById('invDiscount');
    const invGrandTotal = document.getElementById('invGrandTotal');

    // =============================================================
    //  HELPERS
    // =============================================================
    function formatPrice(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    function getSubtotal() {
        return invoiceItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    function getShipping() {
        const subtotal = getSubtotal();
        return subtotal >= 500 ? 0 : SHIPPING_COST;
    }

    function getDiscount() {
        return discountApplied ? Math.round(getSubtotal() * 0.10) : 0;
    }

    function getGrandTotal() {
        return getSubtotal() + getShipping() - getDiscount();
    }

    // =============================================================
    //  RENDER INVOICE
    // =============================================================
    function renderInvoice() {
        if (!invoiceItemsBody) return;

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
        invoiceItemsBody.innerHTML = html;

        // Update totals
        const subtotal = getSubtotal();
        const shipping = getShipping();
        const discount = getDiscount();
        const grandTotal = getGrandTotal();

        if (invSubtotal) invSubtotal.textContent = formatPrice(subtotal);
        if (invShipping) invShipping.textContent = shipping === 0 ? 'Free' : formatPrice(shipping);

        if (invDiscountRow && invDiscount) {
            if (discount > 0) {
                invDiscountRow.style.display = 'flex';
                invDiscount.textContent = '-' + formatPrice(discount);
            } else {
                invDiscountRow.style.display = 'none';
            }
        }

        if (invGrandTotal) invGrandTotal.textContent = formatPrice(grandTotal);
    }

    // =============================================================
    //  ACTION BUTTONS
    // =============================================================
    // Back button
    document.getElementById('backBtn')?.addEventListener('click', function() {
        window.history.back();
    });

    // New Invoice
    document.getElementById('newInvoiceBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Creating new invoice...', 'receipt');
        }
    });

    // Print
    document.getElementById('printBtn')?.addEventListener('click', function() {
        const content = document.getElementById('invoiceContent');
        if (!content) return;
        const clone = content.cloneNode(true);
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
            // Get styles from the page
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
                    <body>
                        ${clone.outerHTML}
                        <script>
                            window.onload = function() { window.print(); window.close(); };
                        <\/script>
                    </body>
                </html>
            `);
            printWindow.document.close();
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Printing invoice...', 'print');
            }
        } else {
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Please allow popups to print', 'error');
            }
        }
    });

    // Download PDF (simulated)
    document.getElementById('downloadBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Downloading invoice as PDF...', 'download');
            setTimeout(() => {
                window.udhar.showToast('Invoice downloaded successfully!', 'check_circle');
            }, 1000);
        }
    });

    // Send Email
    document.getElementById('sendBtn')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Sending invoice via email...', 'send');
            setTimeout(() => {
                window.udhar.showToast('Invoice sent to priya@example.com 📧', 'check_circle');
            }, 1200);
        }
    });

    // =============================================================
    //  INIT
    // =============================================================
    renderInvoice();

})();