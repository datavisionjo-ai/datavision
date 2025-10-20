// js/auth.js - فحص المصادقة
const API_BASE_URL = "https://datavision-nilx.onrender.com";

// فحص إذا كان المستخدم مسجل دخول
function checkAuthentication() {
    const token = localStorage.getItem('datavision_token');
    const user = localStorage.getItem('datavision_user');
    
    console.log('🔍 فحص المصادقة:', { token: !!token, user: !!user });
    
    if (!token || !user) {
        console.log('❌ لا يوجد توكن، التوجيه إلى Login');
        // تأكد أننا في الصفحة الرئيسية وليس في Login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    
    try {
        const userData = JSON.parse(user);
        console.log('✅ المستخدم مسجل:', userData.email);
        return true;
    } catch (error) {
        console.error('❌ خطأ في بيانات المستخدم:', error);
        localStorage.removeItem('datavision_token');
        localStorage.removeItem('datavision_user');
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
}

// فحص المصادقة في الصفحات التي تحتاجها
document.addEventListener('DOMContentLoaded', function() {
    // لا تفحص في صفحة Login
    if (!window.location.pathname.includes('login.html')) {
        const isAuthenticated = checkAuthentication();
        console.log('🔐 حالة المصادقة:', isAuthenticated);
        
        if (isAuthenticated) {
            // إذا كان مسجل دخول، تأكد من تحميل بيانات المستخدم
            initializeUserData();
        }
    }
});

// تهيئة بيانات المستخدم بعد التأكد من المصادقة
function initializeUserData() {
    console.log('🔄 تهيئة بيانات المستخدم...');
    
    // انتظر حتى يتم تحميل api-client.js و user-menu.js
    setTimeout(() => {
        if (typeof getCurrentUser === 'function' && typeof updateUserInfo === 'function') {
            const user = getCurrentUser();
            if (user) {
                console.log('👤 بيانات المستخدم المحملة:', user.name);
                // إذا كان userMenuManager موجود، قم بتحديث البيانات
                if (typeof userMenuManager !== 'undefined' && userMenuManager.updateUserInfo) {
                    userMenuManager.updateUserInfo();
                }
            }
        } else {
            console.log('⚠️ الدوال غير محملة بعد، إعادة المحاولة...');
            initializeUserData(); // إعادة المحاولة
        }
    }, 100);
}

// تسجيل الخروج
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('datavision_token');
        localStorage.removeItem('datavision_user');
        window.location.href = 'login.html';
    }
}

// جعل الدوال متاحة globally
window.checkAuthentication = checkAuthentication;
window.logout = logout;
window.initializeUserData = initializeUserData;
