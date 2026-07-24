/* =================================================================
   UDHARKART — auth.js
   Login form handlers (UI only — no backend, no fake OTP)
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  CUSTOMER LOGIN
    // =============================================================
    const customerForm = document.getElementById('customerLoginForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('custEmail').value.trim();
            const password = document.getElementById('custPassword').value.trim();

            if (!email || !password) {
                if (window.udhar && window.udhar.showToast) {
                    window.udhar.showToast('Please fill in all fields', 'error');
                } else {
                    alert('Please fill in all fields');
                }
                return;
            }

            // Simulate login – just navigate to dashboard
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Welcome back, ' + (email.split('@')[0] || 'Customer') + '!', 'check_circle');
            }
            setTimeout(() => {
                if (window.udhar && window.udhar.navigateTo) {
                    window.udhar.navigateTo('customer-dashboard');
                } else {
                    window.location.hash = 'customer-dashboard';
                }
            }, 400);
        });
    }

    // =============================================================
    //  SHOPKEEPER LOGIN
    // =============================================================
    const shopkeeperForm = document.getElementById('shopkeeperLoginForm');
    if (shopkeeperForm) {
        shopkeeperForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const shopName = document.getElementById('shopName').value.trim();
            const email = document.getElementById('shopEmail').value.trim();
            const password = document.getElementById('shopPassword').value.trim();

            if (!shopName || !email || !password) {
                if (window.udhar && window.udhar.showToast) {
                    window.udhar.showToast('Please fill in all fields', 'error');
                } else {
                    alert('Please fill in all fields');
                }
                return;
            }

            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Welcome back, ' + shopName + '!', 'check_circle');
            }
            setTimeout(() => {
                if (window.udhar && window.udhar.navigateTo) {
                    window.udhar.navigateTo('shopkeeper-dashboard');
                } else {
                    window.location.hash = 'shopkeeper-dashboard';
                }
            }, 400);
        });
    }

    // =============================================================
    //  PASSWORD TOGGLE VISIBILITY
    // =============================================================
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