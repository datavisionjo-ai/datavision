class AuthSystem {
    constructor() {
        this.token = localStorage.getItem('datavision_token');
        this.user = JSON.parse(localStorage.getItem('datavision_user') || 'null');
    }

    isLoggedIn() {
        return !!(this.token && this.user);
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                
                localStorage.setItem('datavision_token', this.token);
                localStorage.setItem('datavision_user', JSON.stringify(this.user));
                
                return { success: true, user: data.user };
            } else {
                throw new Error(data.error || 'فشل تسجيل الدخول');
            }
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('datavision_token');
        localStorage.removeItem('datavision_user');
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        return this.user;
    }
}
