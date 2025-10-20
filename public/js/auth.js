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
// auth.js - تحديث دالة initializeUserData
function initializeUserData() {
    console.log('🔄 تهيئة بيانات المستخدم...');
    
    // محاولات متعددة لضمان تحميل جميع الملفات
    let attempts = 0;
    const maxAttempts = 5;
    
    const tryInitialize = () => {
        attempts++;
        console.log(`🔄 محاولة التهيئة ${attempts}/${maxAttempts}`);
        
        if (typeof getCurrentUser === 'function') {
            const user = getCurrentUser();
            if (user) {
                console.log('👤 بيانات المستخدم المحملة:', user.name);
                
                // إذا كان userMenuManager موجود، قم بتحديث البيانات
                if (typeof userMenuManager !== 'undefined' && userMenuManager.updateUserInfo) {
                    userMenuManager.updateUserInfo();
                } else {
                    console.log('⚠️ userMenuManager غير جاهز بعد');
                    // إنشاء instance جديد إذا لم يكن موجود
                    if (typeof UserMenuManager !== 'undefined') {
                        window.userMenuManager = new UserMenuManager();
                    }
                }
            } else {
                console.log('❌ لا توجد بيانات مستخدم');
            }
        } else {
            console.log('⚠️ getCurrentUser غير محمل بعد');
            if (attempts < maxAttempts) {
                setTimeout(tryInitialize, 500);
            } else {
                console.error('❌ فشل في تحميل بيانات المستخدم بعد عدة محاولات');
            }
        }
    };
    
    tryInitialize();
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
