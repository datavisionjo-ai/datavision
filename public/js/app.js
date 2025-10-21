// الكائنات العالمية
let authSystem;
let dataManager; 
let dashboardSystem;
let customerManager;
let salesManager;

// تهيئة التطبيق
async function initializeApp() {
    console.log('🚀 بدء تحميل التطبيق...');
    
    try {
        // 1. تهيئة نظام المصادقة
        authSystem = new AuthSystem();
        
        // 2. التحقق من تسجيل الدخول
        if (!authSystem.isLoggedIn() && !window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        }

        // 3. تهيئة الأنظمة
        dataManager = new DataManager();
        dashboardSystem = new DashboardSystem();
        customerManager = new CustomerManager();
        salesManager = new SalesManager();

        // 4. تحميل البيانات
        await dataManager.loadData();

        // 5. تهيئة الواجهة
        initializeUI();

        // 6. تحديث جميع المكونات
        updateAllComponents();

        console.log('✅ التطبيق جاهز للعمل!');

    } catch (error) {
        console.error('❌ خطأ في تهيئة التطبيق:', error);
        showNotification('خطأ في تحميل التطبيق', 'error');
    }
}

// تهيئة الواجهة
function initializeUI() {
    // ربط الأحداث
    document.getElementById('customerSearch')?.addEventListener('input', filterCustomers);
    
    // تهيئة القيم الافتراضية
    if (document.getElementById('saleDate')) {
        document.getElementById('saleDate').valueAsDate = new Date();
    }
}

// تحديث جميع المكونات
function updateAllComponents() {
    customerManager.renderCustomers();
    salesManager.renderSales();
    dashboardSystem.updateDashboard();
}

// تبديل التبويبات
function switchTab(tabName) {
    // إخفاء جميع المحتويات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إلغاء تنشيط جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إظهار المحتوى المطلوب
    document.getElementById(tabName).classList.add('active');
    
    // تنشيط الزر المطلوب
    event.target.classList.add('active');

    // تحديث البيانات حسب التبويب
    if (tabName === 'dashboard') {
        dashboardSystem.updateDashboard();
    } else if (tabName === 'customers') {
        customerManager.renderCustomers();
    } else if (tabName === 'sales') {
        salesManager.renderSales();
    }
}

// البحث في العملاء
function filterCustomers() {
    const searchTerm = document.getElementById('customerSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.customer-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

// إظهار الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
}

// إغلاق النوافذ
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// جعل الدوال متاحة globally
window.switchTab = switchTab;
window.filterCustomers = filterCustomers;
window.showNotification = showNotification;
window.closeModal = closeModal;

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);
