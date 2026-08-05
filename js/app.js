// UdharKart - Main Application Entry
class UdharKartApp {
    constructor() {
        this.currentSection = 'home';
        this.init();
    }
    
    init() {
        // Theme initialization
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
        
        // Initialize router
        this.initRouter();
        
        // Global event listeners
        console.log('%c[UdharKart] Application initialized', 'color:#14B8A6');
    }
    
    initRouter() {
        window.addEventListener('popstate', () => this.handleRoute());
    }
    
    navigate(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(section);
        if (target) {
            target.classList.add('active');
            this.currentSection = section;
        }
    }
}

function navigateTo(section) {
    if (window.udharkartApp) {
        window.udharkartApp.navigate(section);
    } else {
        const el = document.getElementById(section);
        if (el) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            el.classList.add('active');
        }
    }
}

function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
}

function addToCart(btn) {
    btn.innerHTML = 'Added ✓';
    btn.style.backgroundColor = '#0F766E';
    btn.style.color = '#fff';
    setTimeout(() => {
        btn.innerHTML = 'Add to cart';
        btn.style.backgroundColor = '';
        btn.style.color = '';
    }, 1600);
}

window.onload = () => {
    window.udharkartApp = new UdharKartApp();
};