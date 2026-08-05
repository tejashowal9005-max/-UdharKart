/**
 * UdharKart — Utility Functions
 */

export class Utils {
    static formatCurrency(amount) {
        return '₹' + Number(amount).toFixed(2);
    }

    static formatDate(date) {
        const d = new Date(date);
        return d.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    static formatRelativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return this.formatDate(date);
    }

    static generateId(prefix = '') {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    }

    static debounce(func, wait = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    static throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }

    static showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'toastContainer';
            newContainer.className = 'toast-container';
            document.body.appendChild(newContainer);
        }
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.getElementById('toastContainer').appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static showLoader(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text" style="width:80%;"></div>
                <div class="skeleton skeleton-text" style="width:60%;"></div>
                <div class="skeleton skeleton-text" style="width:40%;"></div>
            </div>
        `;
    }

    static hideLoader(container) {
        if (!container) return;
        container.innerHTML = '';
    }

    static getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    static isPhoneValid(phone) {
        return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
    }

    static isEmailValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static isPincodeValid(pincode) {
        return /^[0-9]{6}$/.test(pincode);
    }

    static isGSTValid(gst) {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
    }

    static animateNumber(element, target, duration = 1000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const update = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                return;
            }
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(update);
        };
        update();
    }
}