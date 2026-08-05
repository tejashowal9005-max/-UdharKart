/**
 * UdharKart — Shopping Cart
 */

import { Utils } from './utils.js';

export class Cart {
    static items = [];
    static key = 'udharkart_cart';

    static init() {
        this.items = this.load();
        this.render();
        this.updateBadge();
    }

    static load() {
        try {
            return JSON.parse(localStorage.getItem(this.key)) || [];
        } catch {
            return [];
        }
    }

    static save() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
        this.updateBadge();
    }

    static add(product, quantity = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                image: product.image,
                price: product.selling_price || product.price,
                quantity: quantity,
            });
        }
        this.save();
        this.render();
        Utils.showToast(`${product.name} added to cart`, 'success');
    }

    static remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.render();
    }

    static updateQuantity(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.remove(id);
            return;
        }
        this.save();
        this.render();
    }

    static clear() {
        if (this.items.length === 0) return;
        if (confirm('Clear all items from cart?')) {
            this.items = [];
            this.save();
            this.render();
            Utils.showToast('Cart cleared', 'info');
        }
    }

    static getTotal() {
        let subtotal = 0;
        this.items.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const gst = subtotal * 0.05;
        const grand = subtotal + gst;
        return { subtotal, gst, grand };
    }

    static getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    static render() {
        const container = document.getElementById('cartContainer');
        const count = document.getElementById('cartCount');
        const subtotalEl = document.getElementById('cartSubtotal');
        const gstEl = document.getElementById