/* =================================================================
   UDHARKART — shopkeeper.js
   Shopkeeper dashboard interactions
   ================================================================= */

(function() {
    'use strict';

    // =============================================================
    //  QUICK ACTIONS
    // =============================================================
    document.querySelectorAll('#view-shopkeeper-dashboard .action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const label = this.querySelector('span:last-child')?.textContent || 'Action';
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast(label + ' triggered (demo)', 'bolt');
            }
        });
    });

    // =============================================================
    //  SEARCH (demo)
    // =============================================================
    const searchInput = document.querySelector('#view-shopkeeper-dashboard .search-input, .topnav .search-input');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const val = this.value.trim();
                if (val) {
                    if (window.udhar && window.udhar.showToast) {
                        window.udhar.showToast('Searching for "' + val + '" (demo)', 'search');
                    }
                }
            }
        });
    }

    // =============================================================
    //  PROFILE EDIT (if on shopkeeper profile page)
    // =============================================================
    const editProfileBtn = document.querySelector('#view-profile .profile-card .btn-primary');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Edit profile form would open here', 'edit');
            }
        });
    }

    const avatarEditBtn = document.querySelector('.avatar-edit-btn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            if (window.udhar && window.udhar.showToast) {
                window.udhar.showToast('Change avatar dialog would open', 'photo_camera');
            }
        });
    }

    // =============================================================
    //  SETTINGS TOGGLES (UI only)
    // =============================================================
    document.querySelectorAll('#view-settings .toggle-switch:not(#settingsThemeToggle)').forEach(sw => {
        sw.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            const label = this.closest('.setting-group').querySelector('.setting-label h4');
            if (label && window.udhar && window.udhar.showToast) {
                window.udhar.showToast(label.textContent + ' ' + (isActive ? 'enabled' : 'disabled'), 'toggle_on');
            }
        });
    });

    // =============================================================
    //  SETTINGS "MANAGE" BUTTON
    // =============================================================
    document.querySelector('#view-settings .setting-group .btn-secondary')?.addEventListener('click', function() {
        if (window.udhar && window.udhar.showToast) {
            window.udhar.showToast('Privacy settings management', 'privacy_tip');
        }
    });

    // =============================================================
    //  NOTIFICATIONS — Mark all as read
    // =============================================================
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
                if (remaining > 0) {
                    badge.textContent = remaining;
                } else {
                    badge.textContent = '0';
                    badge.style.display = 'none';
                }
            }
            const dot = document.querySelector('.badge-dot');
            if (dot) {
                const unread = document.querySelectorAll('.notification-item:not(.read)').length;
                dot.style.display = unread > 0 ? 'block' : 'none';
            }
            if (window.udhar && window.udhar.showToast) {
                if (count > 0) {
                    window.udhar.showToast('Marked ' + count + ' notification' + (count > 1 ? 's' : '') + ' as read', 'check_circle');
                } else {
                    window.udhar.showToast('All notifications already read', 'info');
                }
            }
        });
    }

    // =============================================================
    //  NOTIFICATION ITEM CLICK (mark single as read)
    // =============================================================
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            if (!this.classList.contains('read')) {
                this.classList.add('read');
                const remaining = document.querySelectorAll('.notification-item:not(.read)').length;
                const badge = document.querySelector('.sidebar-nav .badge');
                if (badge) {
                    if (remaining > 0) {
                        badge.textContent = remaining;
                        badge.style.display = '';
                    } else {
                        badge.textContent = '0';
                        badge.style.display = 'none';
                    }
                }
                const dot = document.querySelector('.badge-dot');
                if (dot) {
                    dot.style.display = remaining > 0 ? 'block' : 'none';
                }
                if (window.udhar && window.udhar.showToast) {
                    window.udhar.showToast('Marked as read', 'done');
                }
            }
        });
    });

})();