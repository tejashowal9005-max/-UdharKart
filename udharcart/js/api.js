/**
 * UdharKart — API Layer
 * Ready for Supabase integration
 */

import { Utils } from './utils.js';

export class API {
    static baseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
    static anonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

    // Generic fetch wrapper
    static async request(endpoint, options = {}) {
        const url = `${this.baseUrl}/rest/v1${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'apikey': this.anonKey,
            'Authorization': `Bearer ${this.anonKey}`,
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Products
    static async getProducts(filters = {}) {
        let query = '/products?select=*';
        if (filters.category) {
            query += `&category=eq.${filters.category}`;
        }
        if (filters.search) {
            query += `&or=(name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%)`;
        }
        return this.request(query);
    }

    static async getProduct(id) {
        return this.request(`/products?id=eq.${id}&select=*`);
    }

    static async createProduct(data) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    static async updateProduct(id, data) {
        return this.request(`/products?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Orders
    static async getOrders(filters = {}) {
        let query = '/orders?select=*,order_items(*)';
        if (filters.status) {
            query += `&status=eq.${filters.status}`;
        }
        if (filters.customer_id) {
            query += `&customer_id=eq.${filters.customer_id}`;
        }
        return this.request(query);
    }

    static async createOrder(data) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    static async updateOrder(id, data) {
        return this.request(`/orders?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Customers
    static async getCustomers() {
        return this.request('/customers?select=*');
    }

    static async createCustomer(data) {
        return this.request('/customers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Shopkeepers
    static async getShopkeepers() {
        return this.request('/shopkeepers?select=*');
    }

    static async createShopkeeper(data) {
        return this.request('/shopkeepers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Payments / Khata
    static async getKhata(filters = {}) {
        let query = '/credit_ledger?select=*';
        if (filters.customer_id) {
            query += `&customer_id=eq.${filters.customer_id}`;
        }
        if (filters.shopkeeper_id) {
            query += `&shopkeeper_id=eq.${filters.shopkeeper_id}`;
        }
        return this.request(query);
    }

    static async createKhataEntry(data) {
        return this.request('/credit_ledger', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Inventory
    static async getInventory() {
        return this.request('/inventory?select=*,products(*)');
    }

    static async updateStock(productId, quantity) {
        return this.request(`/inventory?product_id=eq.${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        });
    }

    // Notifications
    static async getNotifications(userId) {
        return this.request(`/notifications?user_id=eq.${userId}&order=created_at.desc`);
    }

    static async markNotificationRead(id) {
        return this.request(`/notifications?id=eq.${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ read: true }),
        });
    }

    // Analytics (for reports)
    static async getSalesAnalytics(period = 'month') {
        return this.request(`/analytics/sales?period=${period}`);
    }

    static async getUdharAnalytics(shopkeeperId) {
        return this.request(`/analytics/udhar?shopkeeper_id=eq.${shopkeeperId}`);
    }

    // Realtime subscription helper
    static subscribeToOrders(callback) {
        // In production: supabase.channel('orders').on('*', callback).subscribe()
        // Simulate realtime with interval
        const interval = setInterval(() => {
            callback({ event: 'INSERT', new: { id: 'ORD-' + Date.now(), status: 'pending' } });
        }, 30000);
        return () => clearInterval(interval);
    }
}