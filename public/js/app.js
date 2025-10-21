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
// 🔄 نظام الاستيراد والتصدير المحدث
async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (!importedData.customers || !importedData.sales) {
                throw new Error('ملف غير صالح - هيكل البيانات غير مكتمل');
            }

            // استيراد العملاء
            if (Array.isArray(importedData.customers)) {
                dataManager.customers = importedData.customers.map(customer => ({
                    id: customer.id || 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    name: customer.name || 'عميل بدون اسم',
                    phone: customer.phone || '',
                    email: customer.email || '',
                    governorate: customer.governorate || 'غير محدد',
                    status: customer.status || 'active',
                    notes: customer.notes || '',
                    createdAt: customer.createdAt || new Date().toISOString(),
                    lastContact: customer.lastContact || new Date().toISOString().split('T')[0]
                }));
            }

            // استيراد المبيعات
            if (Array.isArray(importedData.sales)) {
                dataManager.sales = importedData.sales.map(sale => ({
                    id: sale.id || 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    customer_id: sale.customer_id,
                    amount: parseFloat(sale.amount) || 0,
                    sale_date: sale.sale_date || sale.date || new Date().toISOString().split('T')[0],
                    description: sale.description || '',
                    createdAt: sale.createdAt || new Date().toISOString()
                })).filter(sale => sale.amount > 0);
            }

            // حفظ البيانات
            await dataManager.saveData();
            
            // تحديث الواجهة
            updateAllComponents();
            
            showNotification(`✅ تم استيراد ${dataManager.customers.length} عميل و ${dataManager.sales.length} عملية بيع بنجاح!`, 'success');
            
        } catch (error) {
            console.error('❌ خطأ في الاستيراد:', error);
            showNotification('❌ فشل في استيراد الملف: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// 📤 التصدير
function exportData() {
    try {
        const exportData = {
            customers: dataManager.customers,
            sales: dataManager.sales,
            settings: dataManager.settings,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.download = `datavision-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('✅ تم تصدير البيانات بنجاح!', 'success');
        
    } catch (error) {
        showNotification('❌ خطأ في تصدير البيانات', 'error');
    }
}

// 🗑️ مسح البيانات
function clearAllData() {
    if (!confirm('⚠️ هل أنت متأكد من مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
        return;
    }
    
    dataManager.customers = [];
    dataManager.sales = [];
    dataManager.saveData();
    updateAllComponents();
    showNotification('✅ تم مسح جميع البيانات', 'success');
}

// 💾 حفظ الرسالة الافتراضية
function saveDefaultMessage() {
    const message = document.getElementById('defaultMessage').value;
    dataManager.settings.defaultMessage = message;
    dataManager.saveData();
    showNotification('✅ تم حفظ القالب بنجاح!', 'success');
}

// 🔓 جعل الدوال متاحة globally
window.importData = importData;
window.exportData = exportData;
window.clearAllData = clearAllData;
window.saveDefaultMessage = saveDefaultMessage;
window.openExportModal = () => document.getElementById('exportModal').classList.add('active');
window.openImportModal = () => document.getElementById('importModal').classList.add('active');
// جعل الدوال متاحة globally
window.switchTab = switchTab;
window.filterCustomers = filterCustomers;
window.showNotification = showNotification;
window.closeModal = closeModal;

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeApp);
