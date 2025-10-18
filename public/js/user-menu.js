// user-menu.js - إدارة قائمة المستخدم وبياناته
class UserMenuManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateUserInfo();
        this.setupEventListeners();
        this.showWelcomeEffect();
    }

    // تحديث معلومات المستخدم في جميع الأماكن
    updateUserInfo() {
        const user = getCurrentUser();
        if (!user) return;

        // تحديث القائمة المنسدلة
        this.updateDropdown(user);
        
        // تحديث بطاقة الداشبورد
        this.updateDashboardCard(user);
        
        // تحديث الإحصائيات
        this.updateUserStats();
    }

    // تحديث القائمة المنسدلة
    updateDropdown(user) {
        const userNameElem = document.getElementById('dropdownUserName');
        const userEmailElem = document.getElementById('dropdownUserEmail');
        
        if (userNameElem) userNameElem.textContent = user.name || 'مستخدم';
        if (userEmailElem) userEmailElem.textContent = user.email || 'user@example.com';
    }

    // تحديث بطاقة الداشبورد
    updateDashboardCard(user) {
        const nameElem = document.getElementById('dashboardUserName');
        const roleElem = document.getElementById('dashboardUserRole');
        const avatarElem = document.getElementById('dashboardUserAvatar');
        
        if (nameElem) nameElem.textContent = `مرحباً ${user.name || ''}!`;
        if (roleElem) roleElem.textContent = this.getRoleName(user.role);
        if (avatarElem) avatarElem.textContent = this.getUserAvatar(user.name);
    }

    // تحديث إحصائيات المستخدم
    async updateUserStats() {
        try {
            const stats = await getStats();
            
            document.getElementById('userCustomersCount').textContent = stats.totalCustomers || 0;
            document.getElementById('userSalesCount').textContent = stats.totalSales || 0;
            document.getElementById('userRevenue').textContent = (stats.salesAmount || 0).toFixed(2);
            document.getElementById('userActivity').textContent = this.calculateActivity(stats) + '%';
            
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // زر الذهاب لصفحة الحساب
        const profileBtn = document.querySelector('.floating-profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                window.location.href = 'public/profile.html';
            });
        }
    }

    // التعامل مع النقر خارج القائمة
    handleOutsideClick(event) {
        const dropdown = document.getElementById('userDropdown');
        const avatar = document.querySelector('.user-avatar');
        
        if (dropdown && dropdown.classList.contains('active')) {
            if (!dropdown.contains(event.target) && !avatar.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        }
    }

    // تأثير ترحيبي
    showWelcomeEffect() {
        setTimeout(() => {
            const floatingBtn = document.querySelector('.floating-profile-btn');
            if (floatingBtn) {
                floatingBtn.classList.add('pulse');
                setTimeout(() => {
                    floatingBtn.classList.remove('pulse');
                }, 3000);
            }
        }, 1000);
    }

    // دوال مساعدة
    getRoleName(role) {
        const roles = {
            'admin': 'مدير النظام',
            'manager': 'مدير',
            'employee': 'موظف',
            'viewer': 'مشاهد'
        };
        return roles[role] || 'مستخدم';
    }

    getUserAvatar(name) {
        if (!name) return '👤';
        // يمكن تطوير هذا ليعرض الحرف الأول من الاسم
        return '👤';
    }

    calculateActivity(stats) {
        // حساب نسبة النشاط بناءً على الإحصائيات
        if (!stats.totalCustomers) return '0';
        
        const activity = Math.min((stats.totalSales / stats.totalCustomers) * 100, 100);
        return Math.round(activity);
    }
}

// دوال عامة للاستخدام
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function goToProfile() {
    window.location.href = 'public/profile.html';
}

function logoutUser() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        logout();
    }
}

// تهيئة النظام
let userMenuManager;

document.addEventListener('DOMContentLoaded', function() {
    userMenuManager = new UserMenuManager();
});
