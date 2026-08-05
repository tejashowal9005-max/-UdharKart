/**
 * UdharKart — Validation Module
 */

export class Validator {
    static rules = {
        required: (value) => value && value.trim().length > 0,
        minLength: (value, min) => value && value.length >= min,
        maxLength: (value, max) => value && value.length <= max,
        phone: (value) => /^[0-9]{10}$/.test(value.replace(/\D/g, '')),
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        pincode: (value) => /^[0-9]{6}$/.test(value),
        gst: (value) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
        password: (value) => value && value.length >= 8,
        confirmPassword: (value, compare) => value === compare,
        numeric: (value) => /^[0-9]+$/.test(value),
        decimal: (value) => /^[0-9]+(\.[0-9]{1,2})?$/.test(value),
    };

    static validateField(value, rule, param = null) {
        if (typeof this.rules[rule] === 'function') {
            return param !== null ? this.rules[rule](value, param) : this.rules[rule](value);
        }
        return true;
    }

    static validateForm(data, schema) {
        const errors = {};
        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field] || '';
            for (const [rule, param] of Object.entries(rules)) {
                const isValid = this.validateField(value, rule, param);
                if (!isValid) {
                    errors[field] = this.getErrorMessage(field, rule, param);
                    break;
                }
            }
        }
        return errors;
    }

    static getErrorMessage(field, rule, param) {
        const messages = {
            required: `${field} is required`,
            minLength: `${field} must be at least ${param} characters`,
            maxLength: `${field} must be at most ${param} characters`,
            phone: 'Please enter a valid 10-digit phone number',
            email: 'Please enter a valid email address',
            pincode: 'Please enter a valid 6-digit PIN code',
            gst: 'Please enter a valid GST number',
            password: 'Password must be at least 8 characters',
            confirmPassword: 'Passwords do not match',
            numeric: 'Please enter a valid number',
            decimal: 'Please enter a valid decimal number',
        };
        return messages[rule] || 'Invalid value';
    }

    static getCustomerSchema() {
        return {
            fullName: { required: true, minLength: 2, maxLength: 50 },
            phone: { required: true, phone: true },
            state: { required: true },
            district: { required: true },
            city: { required: true },
            pincode: { required: true, pincode: true },
            language: { required: true },
        };
    }

    static getShopkeeperSchema() {
        return {
            ownerName: { required: true, minLength: 2, maxLength: 50 },
            shopName: { required: true, minLength: 2, maxLength: 50 },
            shopPhone: { required: true, phone: true },
            gst: { gst: true },
            shopAddress: { required: true },
            shopCategory: { required: true },
            openingTime: { required: true },
            closingTime: { required: true },
            upiId: { required: true },
        };
    }

    static getLoginSchema() {
        return {
            phone: { required: true, phone: true },
        };
    }

    static getOTPSchema() {
        return {
            otp: { required: true, minLength: 6, maxLength: 6, numeric: true },
        };
    }

    static getCheckoutSchema() {
        return {
            address: { required: true },
            deliveryType: { required: true },
            paymentMethod: { required: true },
        };
    }
}