/**
 * UdharKart — Authentication Module
 * Ready for Supabase Phone Auth integration
 */

import { Utils } from './utils.js';
import { API } from './api.js';

export class Auth {
    static currentUser = null;
    static currentRole = null;
    static isAuthenticated = false;

    static async init() {
        // Check for existing session (localStorage for now, Supabase later)
        const session = localStorage.getItem('udharkart_session');
        if (session) {
            try {
                const data = JSON.parse(session);
                this.currentUser = data.user;
                this.currentRole = data.role;
                this.isAuthenticated = true;
                return true;
            } catch {
                return false;
            }
        }
        return false;
    }

    static async loginWithOTP(phone, role) {
        try {
            // In production: await supabase.auth.signInWithOtp({ phone })
            // Simulate OTP sending
            Utils.showToast(`OTP sent to +91 ${phone}`, 'info');
            // Store phone for verification
            sessionStorage.setItem('otp_phone', phone);
            sessionStorage.setItem('otp_role', role);
            return { success: true, message: 'OTP sent successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    static async verifyOTP(token) {
        try {
            const phone = sessionStorage.getItem('otp_phone');
            const role = sessionStorage.getItem('otp_role');

            if (!phone) {
                return { success: false, message: 'Phone number not found' };
            }

            // In production: await supabase.auth.verifyOtp({ phone, token })
            // For demo, accept 123456 as valid OTP
            if (token !== '123456') {
                return { success: false, message: 'Invalid OTP' };
            }

            // Mock user data
            const user = {
                id: 'user_' + Date.now(),
                phone: '+91' + phone,
                name: role === 'shopkeeper' ? 'Shopkeeper' : 'Customer',
                role: role,
            };

            this.currentUser = user;
            this.currentRole = role;
            this.isAuthenticated = true;

            // Store session
            localStorage.setItem('udharkart_session', JSON.stringify({ user, role }));
            localStorage.setItem('udharkart_role', role);

            sessionStorage.removeItem('otp_phone');
            sessionStorage.removeItem('otp_role');

            return { success: true, user, role };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    static async register(data, role) {
        try {
            // In production: await supabase.from('users').insert({ ...data, role })
            // Simulate registration
            const user = {
                id: 'user_' + Date.now(),
                ...data,
                role,
                created_at: new Date().toISOString(),
            };

            this.currentUser = user;
            this.currentRole = role;
            this.isAuthenticated = true;

            localStorage.setItem('udharkart_session', JSON.stringify({ user, role }));
            localStorage.setItem('udharkart_role', role);

            return { success: true, user };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    static async logout() {
        // In production: await supabase.auth.signOut()
        this.currentUser = null;
        this.currentRole = null;
        this.isAuthenticated = false;
        localStorage.removeItem('udharkart_session');
        localStorage.removeItem('udharkart_role');
        window.location.href = '/login.html';
    }

    static getRole() {
        return this.currentRole || localStorage.getItem('udharkart_role');
    }

    static getUser() {
        return this.currentUser;
    }

    static isLoggedIn() {
        return this.isAuthenticated;
    }

    static async resetPassword(phone) {
        try {
            // In production: await supabase.auth.resetPasswordForEmail(email)
            Utils.showToast('Password reset link sent', 'info');
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}