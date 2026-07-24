// ================================================================
// js/utils.js — Utility Functions
// ================================================================

/**
 * Utility module providing reusable helper functions
 * @module utils
 */

/**
 * Format a number as Indian Rupees (₹)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '₹0';
    }
    return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Format a date string to readable format
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const defaultOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    return d.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
}

/**
 * Format a date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date-time string
 */
export function formatDateTime(date) {
    return formatDate(date, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID string
 */
export function generateId(prefix = '') {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}-${id}` : id;
}

/**
 * Generate a random invoice number
 * @returns {string} Invoice number
 */
export function generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const seq = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    return `INV-${year}-${seq}`;
}

/**
 * Debounce function to limit rapid calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 300) {
    let inThrottle = false;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * Search utility for filtering arrays
 * @param {Array} items - Array to search
 * @param {string} query - Search query
 * @param {string|string[]} fields - Field(s) to search in
 * @returns {Array} Filtered array
 */
export function searchItems(items, query, fields) {
    if (!query || !query.trim()) return items;
    const searchTerm = query.toLowerCase().trim();
    const searchFields = Array.isArray(fields) ? fields : [fields];
    
    return items.filter(item => {
        return searchFields.some(field => {
            const value = item[field];
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            }
            if (typeof value === 'number') {
                return String(value).includes(searchTerm);
            }
            return false;
        });
    });
}

/**
 * Sort items by a field
 * @param {Array} items - Items to sort
 * @param {string} field - Field to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export function sortItems(items, field, order = 'asc') {
    const sorted = [...items];
    const modifier = order === 'desc' ? -1 : 1;
    
    sorted.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return -1 * modifier;
        if (valA > valB) return 1 * modifier;
        return 0;
    });
    
    return sorted;
}

/**
 * Paginate an array
 * @param {Array} items - Items to paginate
 * @param {number} page - Current page (1-indexed)
 * @param {number} perPage - Items per page
 * @returns {Object} Paginated result with items, total, and page info
 */
export function paginate(items, page = 1, perPage = 10) {
    const total = items.length;
    const totalPages = Math.ceil(total / perPage);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, total);
    
    return {
        items: items.slice(start, end),
        total,
        perPage,
        currentPage,
        totalPages,
        start: start + 1,
        end,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages
    };
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (Array.isArray(obj)) return obj.map(item => deepClone(item));
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
    if (!str) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(str).replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

/**
 * Truncate a string
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export function truncate(str, length = 50, suffix = '...') {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
}

/**
 * Get the current date as a string
 * @param {string} format - 'short' or 'long'
 * @returns {string} Formatted date
 */
export function getToday(format = 'short') {
    const now = new Date();
    if (format === 'long') {
        return now.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }
    return now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Generate a random color
 * @returns {string} Hex color string
 */
export function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export function getInitials(name) {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Calculate GST amount
 * @param {number} amount - Base amount
 * @param {number} gstRate - GST rate in percentage (e.g., 5 for 5%)
 * @returns {number} GST amount
 */
export function calculateGST(amount, gstRate = 5) {
    if (!amount || amount <= 0) return 0;
    return (amount * gstRate) / 100;
}

/**
 * Calculate discount amount
 * @param {number} amount - Base amount
 * @param {number} discountRate - Discount rate in percentage
 * @returns {number} Discount amount
 */
export function calculateDiscount(amount, discountRate = 0) {
    if (!amount || amount <= 0 || !discountRate || discountRate <= 0) return 0;
    return (amount * discountRate) / 100;
}

/**
 * Calculate subtotal from items
 * @param {Array} items - Array of items with price and quantity
 * @returns {number} Subtotal
 */
export function calculateSubtotal(items) {
    if (!items || !items.length) return 0;
    return items.reduce((sum, item) => {
        const price = item.price || item.rate || 0;
        const qty = item.quantity || item.qty || 0;
        return sum + (price * qty);
    }, 0);
}

/**
 * Calculate total with GST and discount
 * @param {number} subtotal - Subtotal amount
 * @param {number} gstRate - GST rate in percentage
 * @param {number} discountRate - Discount rate in percentage
 * @param {number} discountAmount - Fixed discount amount
 * @returns {Object} Total breakdown
 */
export function calculateTotal(subtotal, gstRate = 5, discountRate = 0, discountAmount = 0) {
    const gst = calculateGST(subtotal, gstRate);
    const discount = discountAmount > 0 ? discountAmount : calculateDiscount(subtotal, discountRate);
    const grandTotal = subtotal + gst - discount;
    
    return {
        subtotal,
        gst,
        gstRate,
        discount,
        discountRate,
        grandTotal: Math.max(0, grandTotal)
    };
}


// ================================================================
// js/validation.js — Validation Utilities
// ================================================================

/**
 * Validation module providing form validation utilities
 * @module validation
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateEmail(email) {
    if (!email || !email.trim()) {
        return { valid: false, message: 'Email is required' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validatePhone(phone) {
    if (!phone || !phone.trim()) {
        return { valid: false, message: 'Phone number is required' };
    }
    const cleanPhone = phone.trim().replace(/\s/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
        return { valid: false, message: 'Please enter a valid 10-digit Indian phone number' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, message: string }
 */
export function validatePassword(password, options = {}) {
    const {
        minLength = 6,
        requireUppercase = false,
        requireLowercase = false,
        requireNumber = false,
        requireSpecial = false
    } = options;
    
    if (!password || !password.trim()) {
        return { valid: false, message: 'Password is required' };
    }
    
    if (password.length < minLength) {
        return { valid: false, message: `Password must be at least ${minLength} characters` };
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (requireLowercase && !/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (requireNumber && !/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate confirm password match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateName(name, fieldName = 'Name') {
    if (!name || !name.trim()) {
        return { valid: false, message: `${fieldName} is required` };
    }
    if (name.trim().length < 2) {
        return { valid: false, message: `${fieldName} must be at least 2 characters` };
    }
    if (name.trim().length > 100) {
        return { valid: false, message: `${fieldName} cannot exceed 100 characters` };
    }
    return { valid: true, message: '' };
}

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateQuantity(quantity) {
    if (quantity === undefined || quantity === null) {
        return { valid: false, message: 'Quantity is required' };
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
        return { valid: false, message: 'Quantity must be a positive number' };
    }
    if (!Number.isInteger(quantity)) {
        return { valid: false, message: 'Quantity must be a whole number' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate price
 * @param {number} price - Price to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validatePrice(price) {
    if (price === undefined || price === null) {
        return { valid: false, message: 'Price is required' };
    }
    if (!Number.isFinite(price) || price < 0) {
        return { valid: false, message: 'Price must be a non-negative number' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate OTP
 * @param {string} otp - OTP to validate
 * @param {number} length - Expected OTP length
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateOTP(otp, length = 6) {
    if (!otp || !otp.trim()) {
        return { valid: false, message: `Please enter the ${length}-digit OTP` };
    }
    const cleanOTP = otp.trim();
    if (!/^\d+$/.test(cleanOTP)) {
        return { valid: false, message: 'OTP must contain only numbers' };
    }
    if (cleanOTP.length !== length) {
        return { valid: false, message: `OTP must be exactly ${length} digits` };
    }
    return { valid: true, message: '' };
}

/**
 * Validate required field
 * @param {*} value - Value to check
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateRequired(value, fieldName = 'Field') {
    if (value === undefined || value === null || value === '') {
        return { valid: false, message: `${fieldName} is required` };
    }
    if (typeof value === 'string' && !value.trim()) {
        return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true, message: '' };
}

/**
 * Validate GST number
 * @param {string} gst - GST number to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validateGST(gst) {
    if (!gst || !gst.trim()) {
        return { valid: false, message: 'GST number is required' };
    }
    const cleanGST = gst.trim().toUpperCase();
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(cleanGST)) {
        return { valid: false, message: 'Please enter a valid GST number' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate PAN number
 * @param {string} pan - PAN number to validate
 * @returns {Object} { valid: boolean, message: string }
 */
export function validatePAN(pan) {
    if (!pan || !pan.trim()) {
        return { valid: false, message: 'PAN number is required' };
    }
    const cleanPAN = pan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(cleanPAN)) {
        return { valid: false, message: 'Please enter a valid PAN number' };
    }
    return { valid: true, message: '' };
}

/**
 * Validate a form using validation rules
 * @param {Object} data - Form data object
 * @param {Object} rules - Validation rules
 * @returns {Object} { valid: boolean, errors: Object }
 */
export function validateForm(data, rules) {
    const errors = {};
    let valid = true;
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];
        const result = rule(value);
        if (!result.valid) {
            errors[field] = result.message;
            valid = false;
        }
    }
    
    return { valid, errors };
}


// ================================================================
// js/notifications.js — Notification System
// ================================================================

/**
 * Notification module for toast messages and alerts
 * @module notifications
 */

// Toast container reference
let toastContainer = null;

/**
 * Initialize the notification system
 */
export function initNotifications() {
    toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'warning', 'info', 'loading'
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) {
        initNotifications();
    }
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">✕</button>
    `;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after duration
    if (duration > 0 && type !== 'loading') {
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    }
    
    return toast;
}

/**
 * Remove a toast with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-hide');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

/**
 * Show a success toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showSuccess(message, duration = 3000) {
    return showToast(message, 'success', duration);
}

/**
 * Show an error toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showError(message, duration = 4000) {
    return showToast(message, 'error', duration);
}

/**
 * Show a warning toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showWarning(message, duration = 3000) {
    return showToast(message, 'warning', duration);
}

/**
 * Show an info toast
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
export function showInfo(message, duration = 3000) {
    return showToast(message, 'info', duration);
}

/**
 * Show a loading toast (persists until removed)
 * @param {string} message - Loading message
 * @returns {HTMLElement} Toast element
 */
export function showLoading(message = 'Loading...') {
    return showToast(message, 'loading', 0);
}

/**
 * Remove a specific toast
 * @param {HTMLElement} toast - Toast element to remove
 */
export function dismissToast(toast) {
    removeToast(toast);
}

/**
 * Clear all toasts
 */
export function clearToasts() {
    if (!toastContainer) return;
    const toasts = toastContainer.querySelectorAll('.toast');
    toasts.forEach(toast => removeToast(toast));
}

/**
 * Show an alert (modal-style)
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} confirmText - Confirm button text
 * @param {Function} onConfirm - Callback on confirm
 */
export function showAlert(title, message, type = 'info', confirmText = 'OK', onConfirm = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-alert';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-box">
            <div class="modal-icon">${getAlertIcon(type)}</div>
            <h3 class="modal-title">${title}</h3>
            <p class="modal-message">${message}</p>
            <div class="modal-actions">
                <button class="btn btn-primary modal-confirm">${confirmText}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = modal.querySelector('.modal-confirm');
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    // Click outside to close
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    return modal;
}

/**
 * Get icon for alert type
 * @param {string} type - Alert type
 * @returns {string} Icon emoji
 */
function getAlertIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

/**
 * Show a confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Confirm button text
 * @param {string} cancelText - Cancel button text
 * @param {Function} onConfirm - Callback on confirm
 * @param {Function} onCancel - Callback on cancel
 */
export function showConfirm(title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm = null, onCancel = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-alert modal-confirm';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-box">
            <h3 class="modal-title">${title}</h3>
            <p class="modal-message">${message}</p>
            <div class="modal-actions">
                <button class="btn btn-secondary modal-cancel">${cancelText}</button>
                <button class="btn btn-primary modal-confirm">${confirmText}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const confirmBtn = modal.querySelector('.modal-confirm');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const overlay = modal.querySelector('.modal-overlay');
    
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.remove();
        if (onCancel) onCancel();
    });
    
    overlay.addEventListener('click', () => {
        modal.remove();
        if (onCancel) onCancel();
    });
    
    return modal;
}


// ================================================================
// js/theme.js — Theme Management
// ================================================================

/**
 * Theme module for managing light/dark mode
 * @module theme
 */

const STORAGE_KEY = 'udharkart-theme';

/**
 * Initialize theme system
 */
export function initTheme() {
    const savedTheme = loadTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use saved theme, fallback to system preference
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!loadTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Apply a theme to the document
 * @param {string} theme - 'light' or 'dark'
 */
export function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    saveTheme(theme);
    updateThemeToggle(theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    return newTheme;
}

/**
 * Get the current theme
 * @returns {string} 'light' or 'dark'
 */
export function getCurrentTheme() {
    return document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
}

/**
 * Save theme preference to localStorage
 * @param {string} theme - 'light' or 'dark'
 */
export function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
        // localStorage not available
    }
}

/**
 * Load theme preference from localStorage
 * @returns {string|null} 'light', 'dark', or null
 */
export function loadTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
        return null;
    }
}

/**
 * Update the theme toggle button state
 * @param {string} theme - 'light' or 'dark'
 */
function updateThemeToggle(theme) {
    const toggleBtn = document.getElementById('themeToggle');
    const settingsToggle = document.getElementById('settingsThemeToggle');
    
    if (toggleBtn) {
        const icon = toggleBtn.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    if (settingsToggle) {
        if (theme === 'dark') {
            settingsToggle.classList.add('active');
        } else {
            settingsToggle.classList.remove('active');
        }
    }
}


// ================================================================
// js/api.js — API Layer (Placeholder for Supabase)
// ================================================================

/**
 * API module providing placeholder methods for backend integration
 * All methods return Promises for easy Supabase connection later
 * @module api
 */

// Simulated delay for async operations
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data storage for demo
const mockDB = {
    customers: [
        {
            id: 'CUST-001',
            name: 'Priya Patel',
            phone: '+91 98765 43201',
            email: 'priya@example.com',
            address: 'Mumbai, India',
            outstanding: 2450,
            creditLimit: 10000,
            status: 'active',
            joined: '2025-01-15'
        },
        {
            id: 'CUST-002',
            name: 'Amit Kumar',
            phone: '+91 98765 43202',
            email: 'amit@example.com',
            address: 'Delhi, India',
            outstanding: 1800,
            creditLimit: 8000,
            status: 'active',
            joined: '2025-02-20'
        },
        {
            id: 'CUST-003',
            name: 'Neha Singh',
            phone: '+91 98765 43203',
            email: 'neha@example.com',
            address: 'Bangalore, India',
            outstanding: 3200,
            creditLimit: 12000,
            status: 'inactive',
            joined: '2024-11-10'
        }
    ],
    products: [
        {
            id: 'PROD-001',
            name: 'Basmati Rice (5kg)',
            category: 'groceries',
            price: 350,
            mrp: 400,
            discount: 12,
            gst: 5,
            stock: 45,
            barcode: '8901234567890',
            icon: 'rice_bowl'
        },
        {
            id: 'PROD-002',
            name: 'Milk (1L)',
            category: 'dairy',
            price: 56,
            mrp: 60,
            discount: 6,
            gst: 5,
            stock: 12,
            barcode: '8901234567891',
            icon: 'no_drinks'
        },
        {
            id: 'PROD-003',
            name: 'Wheat Flour (5kg)',
            category: 'groceries',
            price: 220,
            mrp: 250,
            discount: 12,
            gst: 5,
            stock: 15,
            barcode: '8901234567892',
            icon: 'bakery_dining'
        },
        {
            id: 'PROD-004',
            name: 'Coca-Cola (2L)',
            category: 'beverages',
            price: 90,
            mrp: 100,
            discount: 10,
            gst: 5,
            stock: 20,
            barcode: '8901234567893',
            icon: 'local_drink'
        },
        {
            id: 'PROD-005',
            name: 'Lays (50g)',
            category: 'snacks',
            price: 20,
            mrp: 25,
            discount: 20,
            gst: 5,
            stock: 35,
            barcode: '8901234567894',
            icon: 'fastfood'
        }
    ],
    orders: [
        {
            id: 'UDH-001',
            customerId: 'CUST-001',
            customerName: 'Priya Patel',
            date: '2026-07-20',
            amount: 2450,
            status: 'completed',
            items: [
                { productId: 'PROD-001', name: 'Basmati Rice (5kg)', qty: 2, price: 350 }
            ]
        },
        {
            id: 'UDH-002',
            customerId: 'CUST-002',
            customerName: 'Amit Kumar',
            date: '2026-07-21',
            amount: 1800,
            status: 'pending',
            items: [
                { productId: 'PROD-003', name: 'Wheat Flour (5kg)', qty: 1, price: 220 }
            ]
        },
        {
            id: 'UDH-003',
            customerId: 'CUST-003',
            customerName: 'Neha Singh',
            date: '2026-07-22',
            amount: 3200,
            status: 'processing',
            items: [
                { productId: 'PROD-002', name: 'Milk (1L)', qty: 4, price: 56 }
            ]
        }
    ],
    invoices: [],
    cart: []
};

// Current session state
let session = {
    isAuthenticated: false,
    user: null,
    role: null // 'customer' or 'shopkeeper'
};

// ================================================================
// AUTHENTICATION API
// ================================================================

/**
 * Login a user
 * @param {string} email - Email or phone
 * @param {string} password - Password
 * @param {string} role - 'customer' or 'shopkeeper'
 * @returns {Promise<Object>} User data
 */
export async function login(email, password, role = 'customer') {
    await simulateDelay(800);
    
    // Simple validation (placeholder)
    if (!email || !password) {
        throw new Error('Email and password are required');
    }
    
    // Simulate authentication
    const user = {
        id: 'USER-001',
        name: role === 'customer' ? 'Rahul Sharma' : 'Amit Singh',
        email: email,
        role: role,
        phone: '+91 98765 43210'
    };
    
    session.isAuthenticated = true;
    session.user = user;
    session.role = role;
    
    return { user, role };
}

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export async function logout() {
    await simulateDelay(300);
    session.isAuthenticated = false;
    session.user = null;
    session.role = null;
}

/**
 * Get the current session
 * @returns {Object} Session object
 */
export function getSession() {
    return { ...session };
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return session.isAuthenticated;
}

/**
 * Get the current user role
 * @returns {string|null} 'customer' or 'shopkeeper'
 */
export function getCurrentRole() {
    return session.role;
}

/**
 * Verify OTP
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Verification result
 */
export async function verifyOTP(phone, otp) {
    await simulateDelay(500);
    // Always accept for demo
    return { verified: true, message: 'OTP verified successfully' };
}

/**
 * Send OTP to phone number
 * @param {string} phone - Phone number
 * @returns {Promise<Object>} Result
 */
export async function sendOTP(phone) {
    await simulateDelay(600);
    return { sent: true, message: 'OTP sent successfully', otp: '123456' };
}

/**
 * Reset password
 * @param {string} email - Email address
 * @returns {Promise<Object>} Result
 */
export async function resetPassword(email) {
    await simulateDelay(500);
    return { sent: true, message: 'Password reset link sent to your email' };
}

// ================================================================
// CUSTOMER API
// ================================================================

/**
 * Load all customers
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of customers
 */
export async function loadCustomers(filters = {}) {
    await simulateDelay(400);
    let customers = [...mockDB.customers];
    
    if (filters.status) {
        customers = customers.filter(c => c.status === filters.status);
    }
    if (filters.search) {
        const query = filters.search.toLowerCase();
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.email.toLowerCase().includes(query)
        );
    }
    
    return customers;
}

/**
 * Get a single customer by ID
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} Customer data
 */
export async function getCustomer(customerId) {
    await simulateDelay(300);
    const customer = mockDB.customers.find(c => c.id === customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }
    return { ...customer };
}

/**
 * Create a new customer
 * @param {Object} data - Customer data
 * @returns {Promise<Object>} Created customer
 */
export async function createCustomer(data) {
    await simulateDelay(500);
    const newCustomer = {
        id: 'CUST-' + String(mockDB.customers.length + 1).padStart(3, '0'),
        ...data,
        joined: new Date().toISOString().split('T')[0],
        outstanding: data.outstanding || 0,
        creditLimit: data.creditLimit || 10000,
        status: data.status || 'active'
    };
    mockDB.customers.push(newCustomer);
    return newCustomer;
}

/**
 * Update a customer
 * @param {string} customerId - Customer ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated customer
 */
export async function updateCustomer(customerId, data) {
    await simulateDelay(400);
    const index = mockDB.customers.findIndex(c => c.id === customerId);
    if (index === -1) {
        throw new Error('Customer not found');
    }
    mockDB.customers[index] = { ...mockDB.customers[index], ...data };
    return { ...mockDB.customers[index] };
}

/**
 * Delete a customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<void>}
 */
export async function deleteCustomer(customerId) {
    await simulateDelay(400);
    const index = mockDB.customers.findIndex(c => c.id === customerId);
    if (index === -1) {
        throw new Error('Customer not found');
    }
    mockDB.customers.splice(index, 1);
}

// ================================================================
// PRODUCTS API
// ================================================================

/**
 * Load all products
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of products
 */
export async function loadProducts(filters = {}) {
    await simulateDelay(400);
    let products = [...mockDB.products];
    
    if (filters.category && filters.category !== 'all') {
        products = products.filter(p => p.category === filters.category);
    }
    if (filters.stock && filters.stock !== 'all') {
        if (filters.stock === 'in-stock') {
            products = products.filter(p => p.stock > 5);
        } else if (filters.stock === 'low-stock') {
            products = products.filter(p => p.stock > 0 && p.stock <= 5);
        } else if (filters.stock === 'out-of-stock') {
            products = products.filter(p => p.stock <= 0);
        }
    }
    if (filters.search) {
        const query = filters.search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }
    if (filters.sort) {
        const [field, order] = filters.sort.split('-');
        products.sort((a, b) => {
            const valA = a[field] || '';
            const valB = b[field] || '';
            if (typeof valA === 'string') {
                return order === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            }
            return order === 'desc' ? valB - valA : valA - valB;
        });
    }
    
    return products;
}

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product data
 */
export async function getProduct(productId) {
    await simulateDelay(300);
    const product = mockDB.products.find(p => p.id === productId);
    if (!product) {
        throw new Error('Product not found');
    }
    return { ...product };
}

/**
 * Create a new product
 * @param {Object} data - Product data
 * @returns {Promise<Object>} Created product
 */
export async function createProduct(data) {
    await simulateDelay(500);
    const newProduct = {
        id: 'PROD-' + String(mockDB.products.length + 1).padStart(3, '0'),
        ...data,
        stock: data.stock || 0,
        discount: data.discount || 0,
        gst: data.gst || 5,
        barcode: data.barcode || '890' + Math.random().toString(36).substring(2, 12)
    };
    mockDB.products.push(newProduct);
    return newProduct;
}

/**
 * Update a product
 * @param {string} productId - Product ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated product
 */
export async function updateProduct(productId, data) {
    await simulateDelay(400);
    const index = mockDB.products.findIndex(p => p.id === productId);
    if (index === -1) {
        throw new Error('Product not found');
    }
    mockDB.products[index] = { ...mockDB.products[index], ...data };
    return { ...mockDB.products[index] };
}

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
export async function deleteProduct(productId) {
    await simulateDelay(400);
    const index = mockDB.products.findIndex(p => p.id === productId);
    if (index === -1) {
        throw new Error('Product not found');
    }
    mockDB.products.splice(index, 1);
}

// ================================================================
// ORDERS API
// ================================================================

/**
 * Load all orders
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of orders
 */
export async function loadOrders(filters = {}) {
    await simulateDelay(400);
    let orders = [...mockDB.orders];
    
    if (filters.status && filters.status !== 'all') {
        orders = orders.filter(o => o.status === filters.status);
    }
    if (filters.customerId) {
        orders = orders.filter(o => o.customerId === filters.customerId);
    }
    if (filters.search) {
        const query = filters.search.toLowerCase();
        orders = orders.filter(o =>
            o.id.toLowerCase().includes(query) ||
            o.customerName.toLowerCase().includes(query)
        );
    }
    if (filters.dateFrom) {
        orders = orders.filter(o => o.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
        orders = orders.filter(o => o.date <= filters.dateTo);
    }
    
    // Sort by date descending
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return orders;
}

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order data
 */
export async function getOrder(orderId) {
    await simulateDelay(300);
    const order = mockDB.orders.find(o => o.id === orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    return { ...order };
}

/**
 * Create a new order
 * @param {Object} data - Order data
 * @returns {Promise<Object>} Created order
 */
export async function createOrder(data) {
    await simulateDelay(500);
    const newOrder = {
        id: 'UDH-' + String(mockDB.orders.length + 1).padStart(3, '0'),
        ...data,
        date: data.date || new Date().toISOString().split('T')[0],
        status: data.status || 'pending'
    };
    mockDB.orders.push(newOrder);
    return newOrder;
}

/**
 * Update an order
 * @param {string} orderId - Order ID
 * @param {Object} data - Updated data
 * @returns {Promise<Object>} Updated order
 */
export async function updateOrder(orderId, data) {
    await simulateDelay(400);
    const index = mockDB.orders.findIndex(o => o.id === orderId);
    if (index === -1) {
        throw new Error('Order not found');
    }
    mockDB.orders[index] = { ...mockDB.orders[index], ...data };
    return { ...mockDB.orders[index] };
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export async function updateOrderStatus(orderId, status) {
    return updateOrder(orderId, { status });
}

/**
 * Delete an order
 * @param {string} orderId - Order ID
 * @returns {Promise<void>}
 */
export async function deleteOrder(orderId) {
    await simulateDelay(400);
    const index = mockDB.orders.findIndex(o => o.id === orderId);
    if (index === -1) {
        throw new Error('Order not found');
    }
    mockDB.orders.splice(index, 1);
}

// ================================================================
// BILLING / INVOICE API
// ================================================================

/**
 * Generate an invoice
 * @param {Object} data - Invoice data
 * @returns {Promise<Object>} Generated invoice
 */
export async function generateInvoice(data) {
    await simulateDelay(600);
    const invoice = {
        id: 'INV-' + new Date().getFullYear() + '-' + String(mockDB.invoices.length + 1).padStart(4, '0'),
        ...data,
        generatedAt: new Date().toISOString()
    };
    mockDB.invoices.push(invoice);
    return invoice;
}

/**
 * Get all invoices
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of invoices
 */
export async function loadInvoices(filters = {}) {
    await simulateDelay(300);
    let invoices = [...mockDB.invoices];
    if (filters.customerId) {
        invoices = invoices.filter(i => i.customerId === filters.customerId);
    }
    return invoices;
}

/**
 * Get a single invoice by ID
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Object>} Invoice data
 */
export async function getInvoice(invoiceId) {
    await simulateDelay(300);
    const invoice = mockDB.invoices.find(i => i.id === invoiceId);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    return { ...invoice };
}

// ================================================================
// CART API
// ================================================================

/**
 * Get the current cart
 * @returns {Promise<Array>} Cart items
 */
export async function getCart() {
    await simulateDelay(200);
    return [...mockDB.cart];
}

/**
 * Add item to cart
 * @param {Object} item - Cart item
 * @returns {Promise<Array>} Updated cart
 */
export async function addToCart(item) {
    await simulateDelay(300);
    const existing = mockDB.cart.find(i => i.productId === item.productId);
    if (existing) {
        existing.qty += item.qty || 1;
    } else {
        mockDB.cart.push({
            ...item,
            qty: item.qty || 1
        });
    }
    return [...mockDB.cart];
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID
 * @returns {Promise<Array>} Updated cart
 */
export async function removeFromCart(productId) {
    await simulateDelay(300);
    const index = mockDB.cart.findIndex(i => i.productId === productId);
    if (index !== -1) {
        mockDB.cart.splice(index, 1);
    }
    return [...mockDB.cart];
}

/**
 * Update cart item quantity
 * @param {string} productId - Product ID
 * @param {number} qty - New quantity
 * @returns {Promise<Array>} Updated cart
 */
export async function updateCartQty(productId, qty) {
    await simulateDelay(300);
    const item = mockDB.cart.find(i => i.productId === productId);
    if (item) {
        if (qty <= 0) {
            return removeFromCart(productId);
        }
        item.qty = qty;
    }
    return [...mockDB.cart];
}

/**
 * Clear the cart
 * @returns {Promise<Array>} Empty cart
 */
export async function clearCart() {
    await simulateDelay(300);
    mockDB.cart = [];
    return [];
}

// ================================================================
// ANALYTICS / DASHBOARD API
// ================================================================

/**
 * Get dashboard statistics
 * @param {string} role - 'customer' or 'shopkeeper'
 * @returns {Promise<Object>} Dashboard stats
 */
export async function getDashboardStats(role = 'shopkeeper') {
    await simulateDelay(400);
    
    const totalOrders = mockDB.orders.length;
    const totalRevenue = mockDB.orders.reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = mockDB.orders.filter(o => o.status === 'pending').length;
    const totalCustomers = mockDB.customers.length;
    const activeCustomers = mockDB.customers.filter(c => c.status === 'active').length;
    const outstandingTotal = mockDB.customers.reduce((sum, c) => sum + c.outstanding, 0);
    
    // Recent orders (last 5)
    const recentOrders = [...mockDB.orders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    // Low stock products
    const lowStockProducts = mockDB.products.filter(p => p.stock <= 5 && p.stock > 0);
    const outOfStockProducts = mockDB.products.filter(p => p.stock <= 0);
    
    return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalCustomers,
        activeCustomers,
        outstandingTotal,
        recentOrders,
        lowStockProducts,
        outOfStockProducts,
        totalProducts: mockDB.products.length
    };
}

/**
 * Get customer dashboard stats
 * @param {string} customerId - Customer ID
 * @returns {Promise<Object>} Customer stats
 */
export async function getCustomerStats(customerId) {
    await simulateDelay(300);
    
    const customer = mockDB.customers.find(c => c.id === customerId);
    if (!customer) {
        throw new Error('Customer not found');
    }
    
    const orders = mockDB.orders.filter(o => o.customerId === customerId);
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    
    return {
        customer,
        totalOrders,
        totalSpent,
        pendingOrders,
        completedOrders,
        outstanding: customer.outstanding,
        creditLimit: customer.creditLimit,
        availableCredit: customer.creditLimit - customer.outstanding
    };
}


// ================================================================
// js/auth.js — Authentication Module
// ================================================================

import { 
    validateEmail, 
    validatePhone, 
    validatePassword,
    validateConfirmPassword 
} from './validation.js';
import { login as apiLogin, logout as apiLogout, sendOTP, verifyOTP, resetPassword, getSession } from './api.js';
import { showSuccess, showError, showInfo, showLoading, dismissToast } from './notifications.js';
import { navigateTo } from './router.js';

/**
 * Authentication module handling login, logout, OTP, and session management
 * @module auth
 */

// Current auth state
let authState = {
    isAuthenticated: false,
    user: null,
    role: null,
    otpVerified: false
};

// DOM Elements cache
let elements = {};

/**
 * Initialize authentication module
 */
export function initAuth() {
    cacheElements();
    bindEvents();
    checkSession();
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements = {
        customerLoginForm: document.getElementById('customerLoginForm'),
        shopkeeperLoginForm: document.getElementById('shopkeeperLoginForm'),
        customerRegisterForm: document.getElementById('registerForm'),
        shopkeeperRegisterForm: document.getElementById('shopRegisterForm'),
        forgotForm: document.getElementById('forgotForm'),
        otpForm: document.getElementById('otpForm'),
        logoutLinks: document.querySelectorAll('[data-action="logout"]'),
        loginLinks: document.querySelectorAll('[data-action="login"]'),
        registerLinks: document.querySelectorAll('[data-action="register"]'),
        otpContainer: document.getElementById('otpContainer'),
        forgotContainer: document.getElementById('forgotContainer'),
        loginContainer: document.getElementById('loginContainer'),
        registerContainer: document.getElementById('registerContainer')
    };
}

/**
 * Bind event listeners
 */
function bindEvents() {
    // Customer Login
    if (elements.customerLoginForm) {
        elements.customerLoginForm.addEventListener('submit', handleCustomerLogin);
    }
    
    // Shopkeeper Login
    if (elements.shopkeeperLoginForm) {
        elements.shopkeeperLoginForm.addEventListener('submit', handleShopkeeperLogin);
    }
    
    // Customer Register
    if (elements.customerRegisterForm) {
        elements.customerRegisterForm.addEventListener('submit', handleCustomerRegister);
    }
    
    // Shopkeeper Register
    if (elements.shopkeeperRegisterForm) {
        elements.shopkeeperRegisterForm.addEventListener('submit', handleShopkeeperRegister);
    }
    
    // Forgot Password
    if (elements.forgotForm) {
        elements.forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // OTP Verification
    if (elements.otpForm) {
        elements.otpForm.addEventListener('submit', handleOTPVerification);
    }
    
    // Logout links
    elements.logoutLinks.forEach(link => {
        link.addEventListener('click', handleLogout);
    });
    
    // Login/Register switch links
    elements.loginLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('login');
        });
    });
    
    elements.registerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('register');
        });
    });
    
    // Password toggle buttons
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });
}

/**
 * Handle customer login
 * @param {Event} e - Form submit event
 */
async function handleCustomerLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('custEmail')?.value.trim();
    const password = document.getElementById('custPassword')?.value.trim();
    const remember = document.getElementById('rememberMe')?.checked || false;
    
    // Validate
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showError(emailValidation.message);
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showError(passwordValidation.message);
        return;
    }
    
    const loadingToast = showLoading('Logging in...');
    
    try {
        const result = await apiLogin(email, password, 'customer');
        dismissToast(loadingToast);
        
        authState.isAuthenticated = true;
        authState.user = result.user;
        authState.role = 'customer';
        
        showSuccess('Welcome back, ' + result.user.name + '!');
        navigateTo('customer-dashboard');
        
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'Login failed. Please try again.');
    }
}

/**
 * Handle shopkeeper login
 * @param {Event} e - Form submit event
 */
async function handleShopkeeperLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('shopEmail')?.value.trim();
    const password = document.getElementById('shopPassword')?.value.trim();
    const shopName = document.getElementById('shopName')?.value.trim();
    
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    const loadingToast = showLoading('Logging in...');
    
    try {
        const result = await apiLogin(email, password, 'shopkeeper');
        dismissToast(loadingToast);
        
        authState.isAuthenticated = true;
        authState.user = result.user;
        authState.role = 'shopkeeper';
        
        showSuccess('Welcome back, ' + (shopName || result.user.name) + '!');
        navigateTo('shopkeeper-dashboard');
        
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'Login failed. Please try again.');
    }
}

/**
 * Handle customer registration
 * @param {Event} e - Form submit event
 */
async function handleCustomerRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const password = document.getElementById('regPassword')?.value.trim();
    const confirm = document.getElementById('regConfirmPassword')?.value.trim();
    
    // Validate all fields
    if (!name || !email || !phone || !password || !confirm) {
        showError('Please fill in all fields');
        return;
    }
    
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
        showError(nameValidation.message);
        return;
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showError(emailValidation.message);
        return;
    }
    
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        showError(phoneValidation.message);
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showError(passwordValidation.message);
        return;
    }
    
    const confirmValidation = validateConfirmPassword(password, confirm);
    if (!confirmValidation.valid) {
        showError(confirmValidation.message);
        return;
    }
    
    showSuccess('Registration successful! Please login.');
    navigateTo('login');
}

/**
 * Handle shopkeeper registration
 * @param {Event} e - Form submit event
 */
async function handleShopkeeperRegister(e) {
    e.preventDefault();
    
    const shopName = document.getElementById('shopRegName')?.value.trim();
    const ownerName = document.getElementById('shopRegOwner')?.value.trim();
    const email = document.getElementById('shopRegEmail')?.value.trim();
    const phone = document.getElementById('shopRegPhone')?.value.trim();
    const password = document.getElementById('shopRegPassword')?.value.trim();
    const confirm = document.getElementById('shopRegConfirmPassword')?.value.trim();
    
    if (!shopName || !ownerName || !email || !phone || !password || !confirm) {
        showError('Please fill in all fields');
        return;
    }
    
    // Basic validation
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirm) {
        showError('Passwords do not match');
        return;
    }
    
    showSuccess('Shop registration successful! Please login.');
    navigateTo('shopkeeper-login');
}

/**
 * Handle forgot password
 * @param {Event} e - Form submit event
 */
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail')?.value.trim();
    if (!email) {
        showError('Please enter your email or phone');
        return;
    }
    
    const loadingToast = showLoading('Sending reset link...');
    
    try {
        const result = await resetPassword(email);
        dismissToast(loadingToast);
        showSuccess(result.message);
        navigateTo('login');
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'Failed to send reset link');
    }
}

/**
 * Handle OTP verification
 * @param {Event} e - Form submit event
 */
async function handleOTPVerification(e) {
    e.preventDefault();
    
    const otp = document.getElementById('otpCode')?.value.trim();
    const phone = document.getElementById('otpPhone')?.value.trim();
    
    if (!otp || otp.length < 4) {
        showError('Please enter a valid OTP');
        return;
    }
    
    const loadingToast = showLoading('Verifying OTP...');
    
    try {
        const result = await verifyOTP(phone, otp);
        dismissToast(loadingToast);
        
        if (result.verified) {
            authState.otpVerified = true;
            showSuccess('OTP verified successfully!');
            navigateTo('login');
        } else {
            showError('Invalid OTP. Please try again.');
        }
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'OTP verification failed');
    }
}

/**
 * Handle logout
 * @param {Event} e - Click event
 */
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        await apiLogout();
        authState.isAuthenticated = false;
        authState.user = null;
        authState.role = null;
        authState.otpVerified = false;
        showSuccess('Logged out successfully');
        navigateTo('home');
    } catch (error) {
        showError('Logout failed');
    }
}

/**
 * Toggle password visibility
 * @param {Event} e - Click event
 */
function togglePasswordVisibility(e) {
    const btn = e.currentTarget;
    const input = btn.closest('.password-wrap')?.querySelector('input');
    if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        }
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return authState.isAuthenticated;
}

/**
 * Get current user
 * @returns {Object|null}
 */
export function getCurrentUser() {
    return authState.user;
}

/**
 * Get current role
 * @returns {string|null}
 */
export function getCurrentRole() {
    return authState.role;
}

/**
 * Check session status
 */
function checkSession() {
    const session = getSession();
    if (session && session.isAuthenticated) {
        authState.isAuthenticated = true;
        authState.user = session.user;
        authState.role = session.role;
    }
}

/**
 * Require authentication for a page
 * @param {string} role - Required role (optional)
 * @returns {boolean} Whether access is granted
 */
export function requireAuth(role = null) {
    if (!authState.isAuthenticated) {
        navigateTo('login');
        showError('Please login to access this page');
        return false;
    }
    
    if (role && authState.role !== role) {
        const target = authState.role === 'customer' ? 'customer-dashboard' : 'shopkeeper-dashboard';
        navigateTo(target);
        showError('You do not have permission to access this page');
        return false;
    }
    
    return true;
}


// ================================================================
// js/router.js — SPA Router
// ================================================================

import { getCurrentRole, requireAuth } from './auth.js';
import { showInfo, showError } from './notifications.js';

/**
 * Router module for SPA navigation
 * @module router
 */

// Route configurations
const routes = {
    'home': {
        title: 'UdharKart',
        public: true,
        views: ['view-home']
    },
    'login': {
        title: 'Login',
        public: true,
        views: ['view-customer-login']
    },
    'register': {
        title: 'Register',
        public: true,
        views: ['view-customer-login']
    },
    'shopkeeper-login': {
        title: 'Shopkeeper Login',
        public: true,
        views: ['view-shopkeeper-login']
    },
    'shopkeeper-register': {
        title: 'Shop Registration',
        public: true,
        views: ['view-shopkeeper-register']
    },
    'forgot-password': {
        title: 'Forgot Password',
        public: true,
        views: ['view-forgot-password']
    },
    'otp-verification': {
        title: 'OTP Verification',
        public: true,
        views: ['view-otp-verification']
    },
    'customer-dashboard': {
        title: 'Dashboard',
        public: false,
        role: 'customer',
        views: ['view-customer-dashboard']
    },
    'shopkeeper-dashboard': {
        title: 'Dashboard',
        public: false,
        role: 'shopkeeper',
        views: ['view-shopkeeper-dashboard']
    },
    'products': {
        title: 'Products',
        public: false,
        role: 'shopkeeper',
        views: ['view-products']
    },
    'product-details': {
        title: 'Product Details',
        public: false,
        role: 'shopkeeper',
        views: ['view-product-details']
    },
    'customers': {
        title: 'Customers',
        public: false,
        role: 'shopkeeper',
        views: ['view-customers']
    },
    'customer-profile': {
        title: 'Customer Profile',
        public: false,
        role: 'shopkeeper',
        views: ['view-customer-profile']
    },
    'orders': {
        title: 'Orders',
        public: false,
        role: 'shopkeeper',
        views: ['view-orders']
    },
    'order-details': {
        title: 'Order Details',
        public: false,
        role: 'shopkeeper',
        views: ['view-order-details']
    },
    'cart': {
        title: 'Cart',
        public: false,
        role: 'shopkeeper',
        views: ['view-cart']
    },
    'billing': {
        title: 'Billing',
        public: false,
        role: 'shopkeeper',
        views: ['view-billing']
    },
    'invoice-preview': {
        title: 'Invoice Preview',
        public: false,
        role: 'shopkeeper',
        views: ['view-invoice-preview']
    },
    'reports': {
        title: 'Reports',
        public: false,
        role: 'shopkeeper',
        views: ['view-reports']
    },
    'notifications': {
        title: 'Notifications',
        public: false,
        role: 'shopkeeper',
        views: ['view-notifications']
    },
    'settings': {
        title: 'Settings',
        public: false,
        role: 'shopkeeper',
        views: ['view-settings']
    },
    'profile': {
        title: 'Profile',
        public: false,
        role: 'shopkeeper',
        views: ['view-profile']
    },
    'help': {
        title: 'Help Center',
        public: true,
        views: ['view-help']
    },
    'about': {
        title: 'About',
        public: true,
        views: ['view-about']
    },
    'contact': {
        title: 'Contact',
        public: true,
        views: ['view-contact']
    }
};

let currentRoute = 'home';
let previousRoute = null;

/**
 * Initialize the router
 */
export function initRouter() {
    // Handle initial hash
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Handle browser back/forward
    window.addEventListener('popstate', handleHashChange);
}

/**
 * Handle hash change event
 */
function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, true);
}

/**
 * Navigate to a route
 * @param {string} routeName - Route identifier
 * @param {boolean} fromHistory - Whether navigation came from history
 */
export function navigateTo(routeName, fromHistory = false) {
    const route = routes[routeName];
    
    if (!route) {
        showError('Page not found');
        navigateTo('home');
        return;
    }
    
    // Check authentication
    if (!route.public) {
        if (!requireAuth(route.role)) {
            return;
        }
    }
    
    // Update route state
    previousRoute = currentRoute;
    currentRoute = routeName;
    
    // Update active views
    showViews(route.views);
    
    // Update page title
    document.title = route.title + ' — UdharKart';
    
    // Update active nav links
    updateActiveNav(routeName);
    
    // Update URL hash
    if (!fromHistory) {
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash !== routeName) {
            history.pushState(null, '', '#' + routeName);
        }
    }
}

/**
 * Show specific views, hide all others
 * @param {Array} viewIds - Array of view element IDs to show
 */
function showViews(viewIds) {
    const allViews = document.querySelectorAll('.page-view');
    
    // Hide all views
    allViews.forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });
    
    // Show target views
    viewIds.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) {
            view.style.display = '';
            view.classList.add('active');
        }
    });
    
    // Scroll to top
    const container = document.querySelector('.page-container');
    if (container) {
        container.scrollTop = 0;
    }
}

/**
 * Update active navigation link
 * @param {string} routeName - Current route
 */
function updateActiveNav(routeName) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + routeName) {
            link.classList.add('active');
        }
    });
}

/**
 * Get the current route
 * @returns {string} Current route name
 */
export function getCurrentRoute() {
    return currentRoute;
}

/**
 * Get the previous route
 * @returns {string} Previous route name
 */
export function getPreviousRoute() {
    return previousRoute;
}

/**
 * Check if a route is public
 * @param {string} routeName - Route identifier
 * @returns {boolean} Whether the route is public
 */
export function isPublicRoute(routeName) {
    const route = routes[routeName];
    return route ? route.public : true;
}

/**
 * Register a new route
 * @param {string} name - Route identifier
 * @param {Object} config - Route configuration
 */
export function registerRoute(name, config) {
    routes[name] = config;
}

/**
 * Get all routes
 * @returns {Object} Routes object
 */
export function getRoutes() {
    return { ...routes };
}

/**
 * Get navigation menu items based on role
 * @param {string} role - 'customer' or 'shopkeeper'
 * @returns {Array} Menu items
 */
export function getMenuItems(role) {
    const commonItems = [
        { name: 'Dashboard', route: role + '-dashboard', icon: 'dashboard' },
        { name: 'Profile', route: 'profile', icon: 'person' },
        { name: 'Settings', route: 'settings', icon: 'settings' },
        { name: 'Notifications', route: 'notifications', icon: 'notifications' }
    ];
    
    const shopkeeperItems = [
        { name: 'Customers', route: 'customers', icon: 'people' },
        { name: 'Products', route: 'products', icon: 'inventory_2' },
        { name: 'Orders', route: 'orders', icon: 'receipt_long' },
        { name: 'Billing', route: 'billing', icon: 'receipt' },
        { name: 'Reports', route: 'reports', icon: 'analytics' },
        { name: 'Cart', route: 'cart', icon: 'shopping_cart' }
    ];
    
    const customerItems = [
        { name: 'My Orders', route: 'orders', icon: 'receipt_long' },
        { name: 'Payment History', route: 'billing', icon: 'payments' },
        { name: 'Help', route: 'help', icon: 'help' }
    ];
    
    let items = [];
    
    if (role === 'shopkeeper') {
        items = [...shopkeeperItems, ...commonItems];
    } else if (role === 'customer') {
        items = [...customerItems, ...commonItems];
    }
    
    return items;
}


// ================================================================
// js/app.js — Main Application Entry Point
// ================================================================

import { initRouter, navigateTo } from './router.js';
import { initAuth } from './auth.js';
import { initTheme } from './theme.js';
import { initNotifications, showSuccess } from './notifications.js';
import { initProducts } from './products.js';
import { initOrders } from './orders.js';
import { initBilling } from './billing.js';
import { initCustomer } from './customer.js';
import { initShopkeeper } from './shopkeeper.js';

/**
 * Main Application Module
 * @module app
 */

// App state
const appState = {
    initialized: false,
    splashShown: false,
    ready: false
};

/**
 * Initialize the application
 */
export function initApp() {
    if (appState.initialized) return;
    
    // Show splash screen
    showSplashScreen();
    
    // Initialize modules
    initNotifications();
    initTheme();
    initAuth();
    initRouter();
    
    // Initialize feature modules
    initProducts();
    initOrders();
    initBilling();
    initCustomer();
    initShopkeeper();
    
    // Bind global events
    bindGlobalEvents();
    
    appState.initialized = true;
    
    // Hide splash and show app
    setTimeout(() => {
        hideSplashScreen();
        appState.ready = true;
        showSuccess('Welcome to UdharKart!');
    }, 800);
}

/**
 * Show splash screen
 */
function showSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.style.display = 'flex';
        splash.classList.add('active');
    }
    appState.splashShown = true;
}

/**
 * Hide splash screen
 */
function hideSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        splash.classList.remove('active');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 400);
    }
}

/**
 * Bind global event listeners
 */
function bindGlobalEvents() {
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) {
                overlay.classList.toggle('active');
            }
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.remove('open');
            }
            overlay.classList.remove('active');
        });
    }
    
    // Close sidebar on window resize (desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && sidebar) {
            sidebar.classList.remove('open');
            if (overlay) {
                overlay.classList.remove('active');
            }
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key - close modals and sidebars
        if (e.key === 'Escape') {
            if (sidebar) {
                sidebar.classList.remove('open');
            }
            if (overlay) {
                overlay.classList.remove('active');
            }
            // Close any open modals
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Handle clicks on data-view links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-view]');
        if (link) {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            if (view) {
                navigateTo(view);
            }
        }
    });
}

/**
 * Check if the app is ready
 * @returns {boolean}
 */
export function isAppReady() {
    return appState.ready;
}

/**
 * Get the current app state
 * @returns {Object}
 */
export function getAppState() {
    return { ...appState };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);


// ================================================================
// js/customer.js — Customer Module
// ================================================================

import { loadCustomers, getCustomer, getCustomerStats, updateCustomer } from './api.js';
import { showSuccess, showError, showInfo, showLoading, dismissToast } from './notifications.js';
import { formatCurrency, formatDate, searchItems, sortItems, paginate, escapeHtml } from './utils.js';

/**
 * Customer module for customer management
 * @module customer
 */

// State
let customers = [];
let currentCustomer = null;
let currentPage = 1;
const perPage = 10;
let filters = {
    search: '',
    status: 'all'
};

// DOM cache
let elements = {};

/**
 * Initialize customer module
 */
export function initCustomer() {
    cacheElements();
    bindEvents();
    loadCustomerList();
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements = {
        customerTable: document.getElementById('customerTable'),
        customerGrid: document.getElementById('customerGrid'),
        customerSearch: document.getElementById('customerSearch'),
        statusFilter: document.getElementById('statusFilter'),
        customerPagination: document.getElementById('customerPagination'),
        customerCount: document.getElementById('customerCount'),
        addCustomerBtn: document.getElementById('addCustomerBtn'),
        customerModal: document.getElementById('customerModal'),
        customerForm: document.getElementById('customerForm'),
        customerProfileContainer: document.getElementById('customerProfileContainer')
    };
}

/**
 * Bind event listeners
 */
function bindEvents() {
    // Search
    if (elements.customerSearch) {
        elements.customerSearch.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', handleFilter);
    }
    
    // Add customer
    if (elements.addCustomerBtn) {
        elements.addCustomerBtn.addEventListener('click', () => openCustomerModal());
    }
    
    // Customer form submit
    if (elements.customerForm) {
        elements.customerForm.addEventListener('submit', handleCustomerSubmit);
    }
    
    // Pagination buttons (event delegation)
    if (elements.customerPagination) {
        elements.customerPagination.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-page]');
            if (btn) {
                currentPage = parseInt(btn.dataset.page);
                renderCustomers();
            }
        });
    }
}

/**
 * Load customer list
 */
async function loadCustomerList() {
    const loadingToast = showLoading('Loading customers...');
    try {
        customers = await loadCustomers(filters);
        dismissToast(loadingToast);
        renderCustomers();
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load customers: ' + error.message);
    }
}

/**
 * Handle search input
 */
function handleSearch() {
    filters.search = elements.customerSearch.value.trim();
    currentPage = 1;
    loadCustomerList();
}

/**
 * Handle filter change
 */
function handleFilter() {
    filters.status = elements.statusFilter.value;
    currentPage = 1;
    loadCustomerList();
}

/**
 * Render customers list
 */
function renderCustomers() {
    if (!elements.customerTable) return;
    
    // Filter and paginate
    let filtered = [...customers];
    
    if (filters.search) {
        filtered = searchItems(filtered, filters.search, ['name', 'phone', 'email']);
    }
    
    if (filters.status !== 'all') {
        filtered = filtered.filter(c => c.status === filters.status);
    }
    
    const paginated = paginate(filtered, currentPage, perPage);
    
    // Update count
    if (elements.customerCount) {
        elements.customerCount.textContent = `Showing ${paginated.start}–${paginated.end} of ${paginated.total} customers`;
    }
    
    // Render table rows
    if (paginated.items.length === 0) {
        elements.customerTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <span class="empty-icon">👤</span>
                        <p>No customers found</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        elements.customerTable.innerHTML = paginated.items.map(customer => `
            <tr>
                <td>
                    <div class="customer-avatar-sm">
                        ${customer.photo ? `<img src="${customer.photo}" alt="${escapeHtml(customer.name)}">` : 
                        `<span>${getInitials(customer.name)}</span>`}
                    </div>
                </td>
                <td><strong>${escapeHtml(customer.name)}</strong></td>
                <td>${escapeHtml(customer.phone)}</td>
                <td>${escapeHtml(customer.email)}</td>
                <td>${formatCurrency(customer.outstanding)}</td>
                <td>${formatCurrency(customer.creditLimit)}</td>
                <td>
                    <span class="badge ${customer.status === 'active' ? 'badge-success' : 'badge-danger'}">
                        ${customer.status}
                    </span>
                </td>
                <td>
                    <button class="btn-view" data-id="${customer.id}">👁️</button>
                    <button class="btn-edit" data-id="${customer.id}">✏️</button>
                    <button class="btn-delete" data-id="${customer.id}">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    // Update pagination
    renderPagination(paginated);
    
    // Attach row actions
    attachRowActions();
}

/**
 * Render pagination
 * @param {Object} paginated - Paginated result
 */
function renderPagination(paginated) {
    if (!elements.customerPagination) return;
    
    let html = '';
    html += `<button ${!paginated.hasPrev ? 'disabled' : ''} data-page="${paginated.currentPage - 1}">‹</button>`;
    
    for (let i = 1; i <= paginated.totalPages; i++) {
        html += `<button data-page="${i}" ${i === paginated.currentPage ? 'class="active"' : ''}>${i}</button>`;
    }
    
    html += `<button ${!paginated.hasNext ? 'disabled' : ''} data-page="${paginated.currentPage + 1}">›</button>`;
    
    elements.customerPagination.innerHTML = html;
}

/**
 * Attach row action buttons
 */
function attachRowActions() {
    // View customer
    document.querySelectorAll('[data-id].btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            viewCustomer(id);
        });
    });
    
    // Edit customer
    document.querySelectorAll('[data-id].btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            openCustomerModal(id);
        });
    });
    
    // Delete customer
    document.querySelectorAll('[data-id].btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            deleteCustomer(id);
        });
    });
}

/**
 * View customer profile
 * @param {string} id - Customer ID
 */
async function viewCustomer(id) {
    const loadingToast = showLoading('Loading customer details...');
    try {
        const customer = await getCustomer(id);
        const stats = await getCustomerStats(id);
        dismissToast(loadingToast);
        
        // Navigate to customer profile view
        navigateTo('customer-profile');
        
        // Render customer profile
        renderCustomerProfile(customer, stats);
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load customer: ' + error.message);
    }
}

/**
 * Render customer profile
 * @param {Object} customer - Customer data
 * @param {Object} stats - Customer stats
 */
function renderCustomerProfile(customer, stats) {
    const container = document.getElementById('customerProfileContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="customer-profile-card">
            <div class="customer-avatar">
                <div class="avatar-large">
                    ${getInitials(customer.name)}
                </div>
            </div>
            <div class="customer-info">
                <h3>${escapeHtml(customer.name)}</h3>
                <p>📞 ${escapeHtml(customer.phone)}</p>
                <p>📧 ${escapeHtml(customer.email)}</p>
                <p>📍 ${escapeHtml(customer.address || 'N/A')}</p>
                <p><strong>Outstanding:</strong> ${formatCurrency(customer.outstanding)}</p>
                <p><strong>Credit Limit:</strong> ${formatCurrency(customer.creditLimit)}</p>
                <p><strong>Available Credit:</strong> ${formatCurrency(stats.availableCredit)}</p>
                <p><strong>Status:</strong> <span class="badge ${customer.status === 'active' ? 'badge-success' : 'badge-danger'}">${customer.status}</span></p>
                <p><strong>Joined:</strong> ${formatDate(customer.joined)}</p>
                <div class="customer-stats">
                    <div class="stat-mini">
                        <span>Total Orders</span>
                        <span>${stats.totalOrders}</span>
                    </div>
                    <div class="stat-mini">
                        <span>Total Spent</span>
                        <span>${formatCurrency(stats.totalSpent)}</span>
                    </div>
                    <div class="stat-mini">
                        <span>Pending Orders</span>
                        <span>${stats.pendingOrders}</span>
                    </div>
                </div>
                <div class="customer-actions">
                    <button class="btn btn-primary" onclick="editCustomer('${customer.id}')">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteCustomer('${customer.id}')">🗑️ Delete</button>
                    <button class="btn btn-secondary" onclick="navigateTo('orders')">📦 View Orders</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Open customer modal for add/edit
 * @param {string} id - Customer ID for editing
 */
async function openCustomerModal(id = null) {
    const modal = document.getElementById('customerModal');
    if (!modal) return;
    
    const form = document.getElementById('customerForm');
    const title = document.getElementById('customerModalTitle');
    
    if (id) {
        title.textContent = 'Edit Customer';
        try {
            const customer = await getCustomer(id);
            fillCustomerForm(customer);
        } catch (error) {
            showError('Failed to load customer data');
            return;
        }
    } else {
        title.textContent = 'Add New Customer';
        form.reset();
        document.getElementById('customerId').value = '';
    }
    
    modal.classList.add('active');
}

/**
 * Fill customer form with data
 * @param {Object} customer - Customer data
 */
function fillCustomerForm(customer) {
    document.getElementById('customerId').value = customer.id;
    document.getElementById('custName').value = customer.name;
    document.getElementById('custPhone').value = customer.phone;
    document.getElementById('custEmail').value = customer.email;
    document.getElementById('custAddress').value = customer.address || '';
    document.getElementById('custOutstanding').value = customer.outstanding || 0;
    document.getElementById('custCreditLimit').value = customer.creditLimit || 10000;
    document.getElementById('custStatus').value = customer.status || 'active';
}

/**
 * Handle customer form submission
 * @param {Event} e - Form submit event
 */
async function handleCustomerSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('customerId').value;
    const data = {
        name: document.getElementById('custName').value.trim(),
        phone: document.getElementById('custPhone').value.trim(),
        email: document.getElementById('custEmail').value.trim(),
        address: document.getElementById('custAddress').value.trim(),
        outstanding: parseFloat(document.getElementById('custOutstanding').value) || 0,
        creditLimit: parseFloat(document.getElementById('custCreditLimit').value) || 10000,
        status: document.getElementById('custStatus').value
    };
    
    // Validate
    if (!data.name || !data.phone) {
        showError('Name and phone are required');
        return;
    }
    
    const loadingToast = showLoading(id ? 'Updating customer...' : 'Adding customer...');
    
    try {
        if (id) {
            await updateCustomer(id, data);
            showSuccess('Customer updated successfully');
        } else {
            await createCustomer(data);
            showSuccess('Customer added successfully');
        }
        dismissToast(loadingToast);
        closeCustomerModal();
        loadCustomerList();
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'Failed to save customer');
    }
}

/**
 * Close customer modal
 */
function closeCustomerModal() {
    const modal = document.getElementById('customerModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Delete a customer
 * @param {string} id - Customer ID
 */
async function deleteCustomer(id) {
    showConfirm(
        'Delete Customer',
        'Are you sure you want to delete this customer? This action cannot be undone.',
        'Delete',
        'Cancel',
        async () => {
            const loadingToast = showLoading('Deleting customer...');
            try {
                await deleteCustomer(id);
                dismissToast(loadingToast);
                showSuccess('Customer deleted successfully');
                loadCustomerList();
            } catch (error) {
                dismissToast(loadingToast);
                showError('Failed to delete customer');
            }
        }
    );
}

/**
 * Edit customer (from profile view)
 * @param {string} id - Customer ID
 */
window.editCustomer = (id) => {
    openCustomerModal(id);
};

// Debounce helper
function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}


// ================================================================
// js/shopkeeper.js — Shopkeeper Module
// ================================================================

import { getDashboardStats, loadCustomers, loadOrders, loadProducts } from './api.js';
import { formatCurrency, formatDate, getToday } from './utils.js';
import { showSuccess, showError, showLoading, dismissToast } from './notifications.js';

/**
 * Shopkeeper module for shopkeeper dashboard and management
 * @module shopkeeper
 */

// State
let dashboardData = null;
let refreshInterval = null;

// DOM cache
let elements = {};

/**
 * Initialize shopkeeper module
 */
export function initShopkeeper() {
    cacheElements();
    bindEvents();
    loadDashboard();
    
    // Auto-refresh every 60 seconds
    refreshInterval = setInterval(loadDashboard, 60000);
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements = {
        statTotalOrders: document.getElementById('statTotalOrders'),
        statTotalRevenue: document.getElementById('statTotalRevenue'),
        statPendingOrders: document.getElementById('statPendingOrders'),
        statTotalCustomers: document.getElementById('statTotalCustomers'),
        statOutstanding: document.getElementById('statOutstanding'),
        statLowStock: document.getElementById('statLowStock'),
        recentOrdersTable: document.getElementById('recentOrdersTable'),
        customerList: document.getElementById('customerList'),
        currentDate: document.getElementById('currentDate'),
        welcomeName: document.getElementById('welcomeName')
    };
}

/**
 * Bind event listeners
 */
function bindEvents() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboard();
            showSuccess('Dashboard refreshed');
        });
    }
}

/**
 * Load dashboard data
 */
async function loadDashboard() {
    const loadingToast = showLoading('Loading dashboard...');
    try {
        dashboardData = await getDashboardStats('shopkeeper');
        dismissToast(loadingToast);
        renderDashboard();
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load dashboard: ' + error.message);
    }
}

/**
 * Render dashboard
 */
function renderDashboard() {
    if (!dashboardData) return;
    
    // Update date
    if (elements.currentDate) {
        elements.currentDate.textContent = getToday('long');
    }
    
    // Update welcome name
    if (elements.welcomeName) {
        elements.welcomeName.textContent = 'Amit';
    }
    
    // Update stats
    updateStats();
    
    // Update recent orders
    renderRecentOrders();
    
    // Update low stock alerts
    renderLowStockAlerts();
}

/**
 * Update statistics cards
 */
function updateStats() {
    const stats = [
        { id: 'statTotalOrders', value: dashboardData.totalOrders, label: 'Total Orders' },
        { id: 'statTotalRevenue', value: formatCurrency(dashboardData.totalRevenue), label: 'Total Revenue' },
        { id: 'statPendingOrders', value: dashboardData.pendingOrders, label: 'Pending Orders' },
        { id: 'statTotalCustomers', value: dashboardData.totalCustomers, label: 'Customers' },
        { id: 'statOutstanding', value: formatCurrency(dashboardData.outstandingTotal), label: 'Outstanding' },
        { id: 'statLowStock', value: dashboardData.lowStockProducts.length, label: 'Low Stock Items' }
    ];
    
    stats.forEach(({ id, value }) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    });
}

/**
 * Render recent orders
 */
function renderRecentOrders() {
    const table = elements.recentOrdersTable;
    if (!table) return;
    
    const orders = dashboardData.recentOrders || [];
    
    if (orders.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">No recent orders</td>
            </tr>
        `;
        return;
    }
    
    table.innerHTML = orders.map(order => `
        <tr>
            <td><strong>#${order.id}</strong></td>
            <td>${order.customerName}</td>
            <td>${formatDate(order.date)}</td>
            <td>${formatCurrency(order.amount)}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(order.status)}">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * Render low stock alerts
 */
function renderLowStockAlerts() {
    const container = document.getElementById('lowStockAlerts');
    if (!container) return;
    
    const lowStock = dashboardData.lowStockProducts || [];
    const outOfStock = dashboardData.outOfStockProducts || [];
    const allAlerts = [...lowStock, ...outOfStock];
    
    if (allAlerts.length === 0) {
        container.innerHTML = `
            <div class="alert alert-success">
                ✅ All products are well stocked
            </div>
        `;
        return;
    }
    
    container.innerHTML = allAlerts.map(product => `
        <div class="alert ${product.stock <= 0 ? 'alert-danger' : 'alert-warning'}">
            <strong>${product.name}</strong> - 
            ${product.stock <= 0 ? 'Out of Stock!' : `Only ${product.stock} left in stock`}
            <button class="btn btn-sm btn-primary" data-product="${product.id}">Restock</button>
        </div>
    `).join('');
    
    // Bind restock buttons
    container.querySelectorAll('[data-product]').forEach(btn => {
        btn.addEventListener('click', () => {
            showInfo(`Restock ${btn.dataset.product} - feature coming soon`);
        });
    });
}

/**
 * Get status badge class
 * @param {string} status - Order status
 * @returns {string} Badge class
 */
function getStatusBadgeClass(status) {
    const map = {
        'completed': 'badge-success',
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'cancelled': 'badge-danger',
        'shipped': 'badge-info',
        'delivered': 'badge-success',
        'refunded': 'badge-warning'
    };
    return map[status] || 'badge-info';
}

/**
 * Cleanup on module destroy
 */
export function destroyShopkeeper() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}


// ================================================================
// js/products.js — Products Module
// ================================================================

import { loadProducts, getProduct, createProduct, updateProduct, deleteProduct } from './api.js';
import { formatCurrency, searchItems, sortItems, paginate, escapeHtml, debounce } from './utils.js';
import { showSuccess, showError, showLoading, showConfirm, dismissToast } from './notifications.js';

/**
 * Products module for product management
 * @module products
 */

// State
let products = [];
let currentPage = 1;
const perPage = 12;
let filters = {
    search: '',
    category: 'all',
    stock: 'all',
    sort: 'name-asc'
};

// DOM cache
let elements = {};

/**
 * Initialize products module
 */
export function initProducts() {
    cacheElements();
    bindEvents();
    loadProductList();
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements = {
        productsGrid: document.getElementById('productsGrid'),
        productSearch: document.getElementById('productSearch'),
        categoryFilter: document.getElementById('categoryFilter'),
        stockFilter: document.getElementById('stockFilter'),
        sortFilter: document.getElementById('sortFilter'),
        productPagination: document.getElementById('productPagination'),
        productCount: document.getElementById('productCount'),
        addProductBtn: document.getElementById('addProductBtn'),
        productModal: document.getElementById('productModal'),
        productForm: document.getElementById('productForm'),
        productDetailContainer: document.getElementById('productDetailContainer')
    };
}

/**
 * Bind event listeners
 */
function bindEvents() {
    // Search
    if (elements.productSearch) {
        elements.productSearch.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filters
    if (elements.categoryFilter) {
        elements.categoryFilter.addEventListener('change', handleFilter);
    }
    if (elements.stockFilter) {
        elements.stockFilter.addEventListener('change', handleFilter);
    }
    if (elements.sortFilter) {
        elements.sortFilter.addEventListener('change', handleFilter);
    }
    
    // Add product
    if (elements.addProductBtn) {
        elements.addProductBtn.addEventListener('click', () => openProductModal());
    }
    
    // Product form submit
    if (elements.productForm) {
        elements.productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Reset filters
    const resetBtn = document.getElementById('resetProductFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Pagination
    if (elements.productPagination) {
        elements.productPagination.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-page]');
            if (btn) {
                currentPage = parseInt(btn.dataset.page);
                renderProducts();
            }
        });
    }
}

/**
 * Load product list
 */
async function loadProductList() {
    const loadingToast = showLoading('Loading products...');
    try {
        products = await loadProducts(filters);
        dismissToast(loadingToast);
        renderProducts();
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load products: ' + error.message);
    }
}

/**
 * Handle search input
 */
function handleSearch() {
    filters.search = elements.productSearch?.value.trim() || '';
    currentPage = 1;
    loadProductList();
}

/**
 * Handle filter change
 */
function handleFilter() {
    filters.category = elements.categoryFilter?.value || 'all';
    filters.stock = elements.stockFilter?.value || 'all';
    filters.sort = elements.sortFilter?.value || 'name-asc';
    currentPage = 1;
    loadProductList();
}

/**
 * Reset all filters
 */
function resetFilters() {
    if (elements.productSearch) elements.productSearch.value = '';
    if (elements.categoryFilter) elements.categoryFilter.value = 'all';
    if (elements.stockFilter) elements.stockFilter.value = 'all';
    if (elements.sortFilter) elements.sortFilter.value = 'name-asc';
    filters = { search: '', category: 'all', stock: 'all', sort: 'name-asc' };
    currentPage = 1;
    loadProductList();
    showSuccess('Filters reset');
}

/**
 * Render products grid
 */
function renderProducts() {
    if (!elements.productsGrid) return;
    
    // Filter and sort
    let filtered = [...products];
    
    if (filters.search) {
        filtered = searchItems(filtered, filters.search, ['name', 'category']);
    }
    
    if (filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.stock !== 'all') {
        if (filters.stock === 'in-stock') {
            filtered = filtered.filter(p => p.stock > 5);
        } else if (filters.stock === 'low-stock') {
            filtered = filtered.filter(p => p.stock > 0 && p.stock <= 5);
        } else if (filters.stock === 'out-of-stock') {
            filtered = filtered.filter(p => p.stock <= 0);
        }
    }
    
    // Sort
    const [field, order] = filters.sort.split('-');
    filtered = sortItems(filtered, field, order);
    
    const paginated = paginate(filtered, currentPage, perPage);
    
    // Update count
    if (elements.productCount) {
        elements.productCount.textContent = `Showing ${paginated.start}–${paginated.end} of ${paginated.total} products`;
    }
    
    // Render grid
    if (paginated.items.length === 0) {
        elements.productsGrid.innerHTML = `
            <div class="empty-products">
                <span class="empty-icon">📦</span>
                <h4>No products found</h4>
                <p>Try adjusting your filters or add a new product.</p>
            </div>
        `;
    } else {
        elements.productsGrid.innerHTML = paginated.items.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-img">${getProductIcon(product)}</div>
                <h4>${escapeHtml(product.name)}</h4>
                <span class="category">${escapeHtml(product.category)}</span>
                <div class="price">${formatCurrency(product.price)}</div>
                <div class="mrp">MRP: ${formatCurrency(product.mrp || product.price)}</div>
                <div class="discount">${product.discount ? product.discount + '% off' : ''}</div>
                <div class="gst">GST: ${product.gst || 5}%</div>
                <div class="quantity">Qty: ${product.stock}</div>
                <div class="stock-status ${getStockClass(product.stock)}">
                    ${getStockLabel(product.stock)}
                </div>
                <div class="barcode">${product.barcode || 'N/A'}</div>
                <div class="card-actions">
                    <button class="btn-add" data-id="${product.id}">🛒 Add to Cart</button>
                    <button class="btn-edit" data-id="${product.id}">✏️</button>
                    <button class="btn-delete" data-id="${product.id}">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update pagination
    renderPagination(paginated);
    
    // Attach product actions
    attachProductActions();
}

/**
 * Render pagination
 */
function renderPagination(paginated) {
    if (!elements.productPagination) return;
    
    let html = '';
    html += `<button ${!paginated.hasPrev ? 'disabled' : ''} data-page="${paginated.currentPage - 1}">‹</button>`;
    
    for (let i = 1; i <= paginated.totalPages; i++) {
        html += `<button data-page="${i}" ${i === paginated.currentPage ? 'class="active"' : ''}>${i}</button>`;
    }
    
    html += `<button ${!paginated.hasNext ? 'disabled' : ''} data-page="${paginated.currentPage + 1}">›</button>`;
    
    elements.productPagination.innerHTML = html;
}

/**
 * Attach product action buttons
 */
function attachProductActions() {
    // View product
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            const id = card.dataset.id;
            viewProduct(id);
        });
    });
    
    // Add to cart
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            addToCart(id);
        });
    });
    
    // Edit product
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            openProductModal(id);
        });
    });
    
    // Delete product
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            deleteProductHandler(id);
        });
    });
}

/**
 * View product details
 * @param {string} id - Product ID
 */
async function viewProduct(id) {
    const loadingToast = showLoading('Loading product details...');
    try {
        const product = await getProduct(id);
        dismissToast(loadingToast);
        // Navigate to product details view
        navigateTo('product-details');
        renderProductDetails(product);
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load product: ' + error.message);
    }
}

/**
 * Render product details
 * @param {Object} product - Product data
 */
function renderProductDetails(product) {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail-card">
            <div class="product-detail-img">${getProductIcon(product)}</div>
            <div class="product-detail-info">
                <h3>${escapeHtml(product.name)}</h3>
                <p><strong>Category:</strong> ${escapeHtml(product.category)}</p>
                <p><strong>Price:</strong> ${formatCurrency(product.price)}</p>
                <p><strong>MRP:</strong> ${formatCurrency(product.mrp || product.price)}</p>
                <p><strong>Discount:</strong> ${product.discount || 0}%</p>
                <p><strong>GST:</strong> ${product.gst || 5}%</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p><strong>Barcode:</strong> ${product.barcode || 'N/A'}</p>
                <div class="stock-status ${getStockClass(product.stock)}">
                    ${getStockLabel(product.stock)}
                </div>
                <div class="product-detail-actions">
                    <button class="btn btn-primary" data-id="${product.id}">🛒 Add to Cart</button>
                    <button class="btn btn-secondary" data-id="${product.id}">✏️ Edit</button>
                    <button class="btn btn-danger" data-id="${product.id}">🗑️ Delete</button>
                </div>
            </div>
        </div>
    `;
    
    // Bind actions in detail view
    container.querySelectorAll('[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (btn.classList.contains('btn-primary')) {
                addToCart(id);
            } else if (btn.classList.contains('btn-secondary')) {
                openProductModal(id);
            } else if (btn.classList.contains('btn-danger')) {
                deleteProductHandler(id);
            }
        });
    });
}

/**
 * Add product to cart
 * @param {string} id - Product ID
 */
async function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        showError('Product not found');
        return;
    }
    
    if (product.stock <= 0) {
        showError('Product is out of stock');
        return;
    }
    
    // Add to cart (API placeholder)
    showSuccess(`Added "${product.name}" to cart 🛒`);
}

/**
 * Open product modal for add/edit
 * @param {string} id - Product ID for editing
 */
async function openProductModal(id = null) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
    
    if (id) {
        title.textContent = 'Edit Product';
        try {
            const product = await getProduct(id);
            fillProductForm(product);
        } catch (error) {
            showError('Failed to load product data');
            return;
        }
    } else {
        title.textContent = 'Add New Product';
        form.reset();
        document.getElementById('productId').value = '';
    }
    
    modal.classList.add('active');
}

/**
 * Fill product form with data
 */
function fillProductForm(product) {
    document.getElementById('productId').value = product.id;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodMrp').value = product.mrp || '';
    document.getElementById('prodDiscount').value = product.discount || 0;
    document.getElementById('prodGst').value = product.gst || 5;
    document.getElementById('prodStock').value = product.stock;
    document.getElementById('prodBarcode').value = product.barcode || '';
}

/**
 * Handle product form submission
 */
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('prodName').value.trim(),
        category: document.getElementById('prodCategory').value,
        price: parseFloat(document.getElementById('prodPrice').value) || 0,
        mrp: parseFloat(document.getElementById('prodMrp').value) || 0,
        discount: parseFloat(document.getElementById('prodDiscount').value) || 0,
        gst: parseFloat(document.getElementById('prodGst').value) || 5,
        stock: parseInt(document.getElementById('prodStock').value) || 0,
        barcode: document.getElementById('prodBarcode').value.trim()
    };
    
    if (!data.name || data.price <= 0) {
        showError('Name and price are required');
        return;
    }
    
    const loadingToast = showLoading(id ? 'Updating product...' : 'Adding product...');
    
    try {
        if (id) {
            await updateProduct(id, data);
            showSuccess('Product updated successfully');
        } else {
            await createProduct(data);
            showSuccess('Product added successfully');
        }
        dismissToast(loadingToast);
        closeProductModal();
        loadProductList();
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'Failed to save product');
    }
}

/**
 * Close product modal
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Delete product handler
 */
async function deleteProductHandler(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        showError('Product not found');
        return;
    }
    
    showConfirm(
        'Delete Product',
        `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        'Delete',
        'Cancel',
        async () => {
            const loadingToast = showLoading('Deleting product...');
            try {
                await deleteProduct(id);
                dismissToast(loadingToast);
                showSuccess('Product deleted successfully');
                loadProductList();
            } catch (error) {
                dismissToast(loadingToast);
                showError('Failed to delete product');
            }
        }
    );
}

/**
 * Get product icon
 */
function getProductIcon(product) {
    const icons = {
        'groceries': '🍚',
        'dairy': '🥛',
        'beverages': '🥤',
        'snacks': '🍿',
        'personal-care': '🧴',
        'household': '🧹'
    };
    return icons[product.category] || '📦';
}

/**
 * Get stock status class
 */
function getStockClass(stock) {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
}

/**
 * Get stock label
 */
function getStockLabel(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 5) return `Low Stock (${stock} left)`;
    return `In Stock (${stock})`;
}


// ================================================================
// js/orders.js — Orders Module
// ================================================================

import { loadOrders, getOrder, createOrder, updateOrder, updateOrderStatus, deleteOrder } from './api.js';
import { formatCurrency, formatDate, searchItems, paginate, escapeHtml, debounce } from './utils.js';
import { showSuccess, showError, showLoading, showConfirm, dismissToast } from './notifications.js';

/**
 * Orders module for order management
 * @module orders
 */

// State
let orders = [];
let currentPage = 1;
const perPage = 10;
let filters = {
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: ''
};

// DOM cache
let elements = {};

/**
 * Initialize orders module
 */
export function initOrders() {
    cacheElements();
    bindEvents();
    loadOrderList();
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements = {
        ordersTable: document.getElementById('ordersTable'),
        orderSearch: document.getElementById('orderSearch'),
        statusFilter: document.getElementById('statusFilter'),
        dateFrom: document.getElementById('dateFrom'),
        dateTo: document.getElementById('dateTo'),
        orderPagination: document.getElementById('orderPagination'),
        orderCount: document.getElementById('orderCount'),
        newOrderBtn: document.getElementById('newOrderBtn'),
        orderModal: document.getElementById('orderModal'),
        orderForm: document.getElementById('orderForm'),
        orderDetailContainer: document.getElementById('orderDetailContainer'),
        resetFilters: document.getElementById('resetFilters')
    };
}

/**
 * Bind event listeners
 */
function bindEvents() {
    // Search
    if (elements.orderSearch) {
        elements.orderSearch.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filters
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', handleFilter);
    }
    if (elements.dateFrom) {
        elements.dateFrom.addEventListener('change', handleFilter);
    }
    if (elements.dateTo) {
        elements.dateTo.addEventListener('change', handleFilter);
    }
    
    // New order
    if (elements.newOrderBtn) {
        elements.newOrderBtn.addEventListener('click', () => openOrderModal());
    }
    
    // Order form submit
    if (elements.orderForm) {
        elements.orderForm.addEventListener('submit', handleOrderSubmit);
    }
    
    // Reset filters
    if (elements.resetFilters) {
        elements.resetFilters.addEventListener('click', resetFilters);
    }
    
    // Pagination
    if (elements.orderPagination) {
        elements.orderPagination.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-page]');
            if (btn) {
                currentPage = parseInt(btn.dataset.page);
                renderOrders();
            }
        });
    }
}

/**
 * Load order list
 */
async function loadOrderList() {
    const loadingToast = showLoading('Loading orders...');
    try {
        orders = await loadOrders(filters);
        dismissToast(loadingToast);
        renderOrders();
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load orders: ' + error.message);
    }
}

/**
 * Handle search input
 */
function handleSearch() {
    filters.search = elements.orderSearch?.value.trim() || '';
    currentPage = 1;
    loadOrderList();
}

/**
 * Handle filter change
 */
function handleFilter() {
    filters.status = elements.statusFilter?.value || 'all';
    filters.dateFrom = elements.dateFrom?.value || '';
    filters.dateTo = elements.dateTo?.value || '';
    currentPage = 1;
    loadOrderList();
}

/**
 * Reset all filters
 */
function resetFilters() {
    if (elements.orderSearch) elements.orderSearch.value = '';
    if (elements.statusFilter) elements.statusFilter.value = 'all';
    if (elements.dateFrom) { elements.dateFrom.value = ''; elements.dateFrom.style.display = 'none'; }
    if (elements.dateTo) { elements.dateTo.value = ''; elements.dateTo.style.display = 'none'; }
    filters = { search: '', status: 'all', dateFrom: '', dateTo: '' };
    currentPage = 1;
    loadOrderList();
    showSuccess('Filters reset');
}

/**
 * Render orders table
 */
function renderOrders() {
    if (!elements.ordersTable) return;
    
    let filtered = [...orders];
    
    if (filters.search) {
        filtered = searchItems(filtered, filters.search, ['id', 'customerName']);
    }
    
    if (filters.status !== 'all') {
        filtered = filtered.filter(o => o.status === filters.status);
    }
    
    const paginated = paginate(filtered, currentPage, perPage);
    
    if (elements.orderCount) {
        elements.orderCount.textContent = `Showing ${paginated.start}–${paginated.end} of ${paginated.total} orders`;
    }
    
    if (paginated.items.length === 0) {
        elements.ordersTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <span class="empty-icon">📋</span>
                        <p>No orders found</p>
                    </div>
                </td>
            </tr>
        `;
    } else {
        elements.ordersTable.innerHTML = paginated.items.map(order => `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${escapeHtml(order.customerName)}</td>
                <td>${formatDate(order.date)}</td>
                <td>${formatCurrency(order.amount)}</td>
                <td>
                    <span class="badge ${getStatusBadgeClass(order.status)}">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <button class="btn-view" data-id="${order.id}">👁️</button>
                    <button class="btn-edit" data-id="${order.id}">✏️</button>
                    <button class="btn-delete" data-id="${order.id}">🗑️</button>
                </td>
            </tr>
        `).join('');
    }
    
    renderPagination(paginated);
    attachOrderActions();
}

/**
 * Render pagination
 */
function renderPagination(paginated) {
    if (!elements.orderPagination) return;
    
    let html = '';
    html += `<button ${!paginated.hasPrev ? 'disabled' : ''} data-page="${paginated.currentPage - 1}">‹</button>`;
    
    for (let i = 1; i <= paginated.totalPages; i++) {
        html += `<button data-page="${i}" ${i === paginated.currentPage ? 'class="active"' : ''}>${i}</button>`;
    }
    
    html += `<button ${!paginated.hasNext ? 'disabled' : ''} data-page="${paginated.currentPage + 1}">›</button>`;
    
    elements.orderPagination.innerHTML = html;
}

/**
 * Attach order action buttons
 */
function attachOrderActions() {
    document.querySelectorAll('[data-id].btn-view').forEach(btn => {
        btn.addEventListener('click', () => viewOrder(btn.dataset.id));
    });
    
    document.querySelectorAll('[data-id].btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openOrderModal(btn.dataset.id));
    });
    
    document.querySelectorAll('[data-id].btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteOrderHandler(btn.dataset.id));
    });
}

/**
 * View order details
 */
async function viewOrder(id) {
    const loadingToast = showLoading('Loading order details...');
    try {
        const order = await getOrder(id);
        dismissToast(loadingToast);
        navigateTo('order-details');
        renderOrderDetails(order);
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to load order: ' + error.message);
    }
}

/**
 * Render order details
 */
function renderOrderDetails(order) {
    const container = document.getElementById('orderDetailContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="order-detail-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
            </div>
            <div class="order-info">
                <p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>
                <p><strong>Date:</strong> ${formatDate(order.date)}</p>
                <p><strong>Amount:</strong> ${formatCurrency(order.amount)}</p>
                <p><strong>Items:</strong> ${order.items ? order.items.length : 0}</p>
            </div>
            ${order.items ? `
                <div class="order-items">
                    <h4>Items</h4>
                    <table class="order-items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${escapeHtml(item.name)}</td>
                                    <td>${item.qty}</td>
                                    <td>${formatCurrency(item.price)}</td>
                                    <td>${formatCurrency(item.price * item.qty)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
            <div class="order-actions">
                <button class="btn btn-secondary" data-id="${order.id}">📄 Print</button>
                <button class="btn btn-secondary" data-id="${order.id}">⬇️ Download</button>
                <select class="btn btn-sm" id="statusUpdate">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                <button class="btn btn-primary" id="updateStatusBtn">Update Status</button>
            </div>
        </div>
    `;
    
    // Bind status update
    const updateBtn = document.getElementById('updateStatusBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            const status = document.getElementById('statusUpdate').value;
            updateOrderStatusHandler(order.id, status);
        });
    }
}

/**
 * Open order modal for add/edit
 */
async function openOrderModal(id = null) {
    const modal = document.getElementById('orderModal');
    if (!modal) return;
    
    const title = document.getElementById('orderModalTitle');
    const form = document.getElementById('orderForm');
    
    if (id) {
        title.textContent = 'Edit Order';
        try {
            const order = await getOrder(id);
            fillOrderForm(order);
        } catch (error) {
            showError('Failed to load order data');
            return;
        }
    } else {
        title.textContent = 'Create New Order';
        form.reset();
        document.getElementById('orderId').value = '';
    }
    
    modal.classList.add('active');
}

/**
 * Fill order form
 */
function fillOrderForm(order) {
    document.getElementById('orderId').value = order.id;
    document.getElementById('orderCustomer').value = order.customerName;
    document.getElementById('orderAmount').value = order.amount;
    document.getElementById('orderStatus').value = order.status;
    document.getElementById('orderDate').value = order.date;
}

/**
 * Handle order form submission
 */
async function handleOrderSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('orderId').value;
    const data = {
        customerName: document.getElementById('orderCustomer').value.trim(),
        amount: parseFloat(document.getElementById('orderAmount').value) || 0,
        status: document.getElementById('orderStatus').value,
        date: document.getElementById('orderDate').value || new Date().toISOString().split('T')[0]
    };
    
    if (!data.customerName || data.amount <= 0) {
        showError('Customer name and amount are required');
        return;
    }
    
    const loadingToast = showLoading(id ? 'Updating order...' : 'Creating order...');
    
    try {
        if (id) {
            await updateOrder(id, data);
            showSuccess('Order updated successfully');
        } else {
            await createOrder(data);
            showSuccess('Order created successfully');
        }
        dismissToast(loadingToast);
        closeOrderModal();
        loadOrderList();
    } catch (error) {
        dismissToast(loadingToast);
        showError(error.message || 'Failed to save order');
    }
}

/**
 * Close order modal
 */
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Update order status
 */
async function updateOrderStatusHandler(id, status) {
    const loadingToast = showLoading('Updating status...');
    try {
        await updateOrderStatus(id, status);
        dismissToast(loadingToast);
        showSuccess('Order status updated');
        loadOrderList();
    } catch (error) {
        dismissToast(loadingToast);
        showError('Failed to update status');
    }
}

/**
 * Delete order handler
 */
async function deleteOrderHandler(id) {
    showConfirm(
        'Delete Order',
        'Are you sure you want to delete this order? This action cannot be undone.',
        'Delete',
        'Cancel',
        async () => {
            const loadingToast = showLoading('Deleting order...');
            try {
                await deleteOrder(id);
                dismissToast(loadingToast);
                showSuccess('Order deleted successfully');
                loadOrderList();
            } catch (error) {
                dismissToast(loadingToast);
                showError('Failed to delete order');
            }
        }
    );
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status) {
    const map = {
        'completed': 'badge-success',
        'pending': 'badge-warning',
        'processing': 'badge-info',
        'cancelled': 'badge-danger',
        'shipped': 'badge-info',
        'delivered': 'badge-success',
        'refunded': 'badge-warning'
    };
    return map[status] || 'badge-info';
}


// ================================================================
// js/billing.js — Billing Module
// ================================================================

import { generateInvoice, getInvoice, loadInvoices } from './api.js';
import { formatCurrency, formatDate, calculateTotal, generateInvoiceNumber, getToday } from './utils.js';
import { showSuccess, showError, showLoading, dismissToast } from './notifications.js';

/**
 * Billing module for invoice generation and management
 * @module billing
 */

// State
let currentInvoice = null;
let invoiceItems = [];

// DOM cache
let elements = {};

/**
 * Initialize billing module
 */
export function initBilling() {
    cacheElements();
    bindEvents();
    loadInvoicePreview();
}

/**
 * Cache DOM elements
 */
function cacheElements() {
    elements = {
        invoiceNumber: document.getElementById('invoiceNumber'),
        invoiceDate: document.getElementById('invoiceDate'),
        invoiceStatus: document.getElementById('invoiceStatus'),
        customerName: document.getElementById('billingCustomerName'),
        customerPhone: document.getElementById('billingCustomerPhone'),
        customerEmail: document.getElementById('billingCustomerEmail'),
        paymentMethod: document.getElementById('paymentMethod'),
        invoiceItemsBody: document.getElementById('invoiceItemsBody'),
        invSubtotal: document.getElementById('invSubtotal'),
        invGst: document.getElementById('invGst'),
        invDiscount: document.getElementById('invDiscount'),
        invGrandTotal: document.getElementById('invGrandTotal'),
        printBtn: document.getElementById('printBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        sendBtn: document.getElementById('sendBtn'),
        newInvoiceBtn: document.getElementById('newInvoiceBtn'),
        backBtn: document.getElementById('backBtn')
    };
}

/**
 * Bind event listeners
 */
function bindEvents() {
    if (elements.printBtn) {
        elements.printBtn.addEventListener('click', handlePrint);
    }
    
    if (elements.downloadBtn) {
        elements.downloadBtn.addEventListener('click', handleDownload);
    }
    
    if (elements.sendBtn) {
        elements.sendBtn.addEventListener('click', handleSendEmail);
    }
    
    if (elements.newInvoiceBtn) {
        elements.newInvoiceBtn.addEventListener('click', handleNewInvoice);
    }
    
    if (elements.backBtn) {
        elements.backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
}

/**
 * Load invoice preview
 */
function loadInvoicePreview() {
    // Sample invoice data for preview
    const sampleItems = [
        { name: 'Basmati Rice (5kg)', price: 350, qty: 2 },
        { name: 'Wheat Flour (5kg)', price: 220, qty: 1 },
        { name: 'Milk (1L)', price: 56, qty: 4 },
        { name: 'Coca-Cola (2L)', price: 90, qty: 3 },
        { name: 'Lays (50g)', price: 20, qty: 5 }
    ];
    
    currentInvoice = {
        id: generateInvoiceNumber(),
        date: getToday(),
        status: 'Paid',
        customer: {
            name: 'Priya Patel',
            phone: '+91 98765 43201',
            email: 'priya@example.com'
        },
        paymentMethod: 'UPI / Google Pay',
        items: sampleItems,
        subtotal: 0,
        gst: 0,
        discount: 0,
        grandTotal: 0,
        transactionId: 'UPI-2026-07-23-001'
    };
    
    calculateInvoiceTotals();
    renderInvoice();
}

/**
 * Calculate invoice totals
 */
function calculateInvoiceTotals() {
    const subtotal = currentInvoice.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const gstRate = 5;
    const discountRate = 10;
    
    const total = calculateTotal(subtotal, gstRate, discountRate);
    
    currentInvoice.subtotal = total.subtotal;
    currentInvoice.gst = total.gst;
    currentInvoice.discount = total.discount;
    currentInvoice.grandTotal = total.grandTotal;
}

/**
 * Render invoice
 */
function renderInvoice() {
    const invoice = currentInvoice;
    if (!invoice) return;
    
    // Header
    if (elements.invoiceNumber) {
        elements.invoiceNumber.textContent = '#' + invoice.id;
    }
    if (elements.invoiceDate) {
        elements.invoiceDate.textContent = 'Issued: ' + invoice.date;
    }
    if (elements.invoiceStatus) {
        elements.invoiceStatus.textContent = invoice.status;
    }
    
    // Customer
    if (elements.customerName) {
        elements.customerName.textContent = invoice.customer.name;
    }
    if (elements.customerPhone) {
        elements.customerPhone.textContent = invoice.customer.phone;
    }
    if (elements.customerEmail) {
        elements.customerEmail.textContent = invoice.customer.email;
    }
    if (elements.paymentMethod) {
        elements.paymentMethod.textContent = invoice.paymentMethod;
    }
    
    // Items
    if (elements.invoiceItemsBody) {
        elements.invoiceItemsBody.innerHTML = invoice.items.map(item => `
            <tr>
                <td class="item-name">${item.name}</td>
                <td class="item-price">${formatCurrency(item.price)}</td>
                <td class="item-qty">${item.qty}</td>
                <td class="item-total" style="text-align:right;">${formatCurrency(item.price * item.qty)}</td>
            </tr>
        `).join('');
    }
    
    // Totals
    if (elements.invSubtotal) {
        elements.invSubtotal.textContent = formatCurrency(invoice.subtotal);
    }
    if (elements.invGst) {
        elements.invGst.textContent = formatCurrency(invoice.gst);
    }
    if (elements.invDiscount) {
        elements.invDiscount.textContent = '-' + formatCurrency(invoice.discount);
        elements.invDiscount.parentElement.style.display = invoice.discount > 0 ? 'flex' : 'none';
    }
    if (elements.invGrandTotal) {
        elements.invGrandTotal.textContent = formatCurrency(invoice.grandTotal);
    }
}

/**
 * Handle print invoice
 */
function handlePrint() {
    const content = document.getElementById('invoiceContent');
    if (!content) return;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
        const styles = document.querySelector('style')?.innerHTML || '';
        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice ${currentInvoice.id}</title>
                    <style>${styles}</style>
                    <style>
                        body { padding: 40px; background: #fff; }
                        .glass-card { background: #fff; box-shadow: none; border: 1px solid #e5e7eb; }
                        .invoice-actions, .no-print { display: none !important; }
                    </style>
                </head>
                <body>
                    ${content.outerHTML}
                    <script>
                        window.onload = function() { window.print(); window.close(); };
                    <\/script>
                </body>
            </html>
        `);
        printWindow.document.close();
        showSuccess('Printing invoice...');
    } else {
        showError('Please allow popups to print');
    }
}

/**
 * Handle download PDF (placeholder)
 */
function handleDownload() {
    showSuccess('Downloading invoice as PDF...');
    setTimeout(() => {
        showSuccess('Invoice downloaded successfully!');
    }, 1000);
}

/**
 * Handle send email (placeholder)
 */
function handleSendEmail() {
    showSuccess('Sending invoice via email...');
    setTimeout(() => {
        showSuccess('Invoice sent to ' + currentInvoice.customer.email + ' 📧');
    }, 1200);
}

/**
 * Handle new invoice
 */
function handleNewInvoice() {
    // Reset with new data
    const newItems = [
        { name: 'Sample Item 1', price: 100, qty: 1 },
        { name: 'Sample Item 2', price: 200, qty: 1 }
    ];
    
    currentInvoice = {
        id: generateInvoiceNumber(),
        date: getToday(),
        status: 'Draft',
        customer: {
            name: 'New Customer',
            phone: '+91 90000 00000',
            email: 'customer@example.com'
        },
        paymentMethod: 'Cash / UPI',
        items: newItems,
        subtotal: 0,
        gst: 0,
        discount: 0,
        grandTotal: 0,
        transactionId: ''
    };
    
    calculateInvoiceTotals();
    renderInvoice();
    showSuccess('New invoice created');
}

/**
 * Generate invoice from order
 * @param {Object} order - Order data
 */
export function generateInvoiceFromOrder(order) {
    currentInvoice = {
        id: generateInvoiceNumber(),
        date: getToday(),
        status: 'Generated',
        customer: {
            name: order.customerName || 'Customer',
            phone: order.customerPhone || '',
            email: order.customerEmail || ''
        },
        paymentMethod: 'UPI / Cash',
        items: order.items || [],
        subtotal: 0,
        gst: 0,
        discount: 0,
        grandTotal: 0,
        transactionId: 'TXN-' + Date.now()
    };
    
    calculateInvoiceTotals();
    renderInvoice();
    navigateTo('billing');
    showSuccess('Invoice generated from order');
}

/**
 * Get current invoice data
 * @returns {Object} Current invoice
 */
export function getCurrentInvoice() {
    return currentInvoice ? { ...currentInvoice } : null;
}


// Export all modules for global access
export {
    initApp,
    isAppReady,
    getAppState
} from './app.js';

export {
    initRouter,
    navigateTo,
    getCurrentRoute,
    getPreviousRoute
} from './router.js';

export {
    initAuth,
    isAuthenticated,
    getCurrentUser,
    getCurrentRole,
    requireAuth
} from './auth.js';

export {
    initTheme,
    toggleTheme,
    getCurrentTheme
} from './theme.js';

export {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showAlert,
    showConfirm,
    dismissToast,
    clearToasts
} from './notifications.js';

export {
    formatCurrency,
    formatDate,
    generateId,
    generateInvoiceNumber,
    debounce,
    throttle,
    searchItems,
    sortItems,
    paginate,
    escapeHtml,
    truncate,
    getToday,
    calculateGST,
    calculateDiscount,
    calculateSubtotal,
    calculateTotal
} from './utils.js';

export {
    validateEmail,
    validatePhone,
    validatePassword,
    validateConfirmPassword,
    validateName,
    validateQuantity,
    validatePrice,
    validateOTP,
    validateRequired,
    validateGST,
    validatePAN,
    validateForm
} from './validation.js';

// API exports
export {
    login,
    logout,
    getSession,
    isAuthenticated as isAuthenticatedAPI,
    getCurrentRole as getCurrentRoleAPI,
    verifyOTP,
    sendOTP,
    resetPassword,
    loadCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    loadProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    loadOrders,
    getOrder,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    generateInvoice,
    getInvoice,
    loadInvoices,
    getCart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    getDashboardStats,
    getCustomerStats
} from './api.js';
