// UdharKart - Auth Module (Ready for Supabase)
class AuthManager {
    constructor() {
        this.currentUser = null;
    }
    
    async login(phone, password, role) {
        // Placeholder for API call to Supabase
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, user: { phone, role } });
            }, 800);
        });
    }
    
    async register(data) {
        // Placeholder
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 900);
        });
    }
}

const auth = new AuthManager();

function switchLoginType(type) {
    const cust = document.getElementById('login-customer-tab');
    const shop = document.getElementById('login-shopkeeper-tab');
    
    if (type === 'customer') {
        cust.classList.add('bg-teal-900', 'text-white');
        cust.classList.remove('border', 'border-slate-300');
        shop.classList.remove('bg-teal-900', 'text-white');
        shop.classList.add('border', 'border-slate-300');
    } else {
        shop.classList.add('bg-teal-900', 'text-white');
        shop.classList.remove('border', 'border-slate-300');
        cust.classList.remove('bg-teal-900', 'text-white');
        cust.classList.add('border', 'border-slate-300');
    }
}

function switchRegisterType(type) {
    // Same logic
}

function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

async function handleLogin(e) {
    if (e) e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    
    const res = await auth.login(phone, password, 'customer');
    if (res.success) {
        window.location.href = 'customer-dashboard.html';
    }
}

async function handleRegister(e) {
    if (e) e.preventDefault();
    const res = await auth.register({});
    if (res.success) {
        window.location.href = 'login.html';
    }
}

function showForgotPassword() {
    alert('Password reset flow will connect to Supabase.');
}