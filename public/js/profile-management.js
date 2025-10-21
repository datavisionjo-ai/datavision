// profile-management.js - نظام إدارة المستخدمين والصلاحيات - معدل كامل
let employees = [];
let editingEmployeeId = null;
let userActivities = [];

class ProfileManager {
    constructor() {
        console.log('🚀 بدء تحميل مدير الملف الشخصي...');
        this.currentUser = getCurrentUser();
        
        if (!this.currentUser) {
            console.log('❌ لا يوجد مستخدم، التوجيه إلى Login');
            window.location.href = 'login.html';
            return;
        }
        
        console.log('✅ مستخدم محمل:', this.currentUser.email);
        this.init();
    }

    async init() {
        try {
            await this.loadUserData();
            this.renderProfile();
            
            // تحميل الموظفين فقط إذا كان لديه الصلاحية
            if (this.hasUserManagementPermission()) {
                await this.loadEmployees();
                this.renderEmployees();
            }
            
            this.setupEventListeners();
            console.log('✅ تم تهيئة مدير الملف الشخصي بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة الملف الشخصي:', error);
            showNotification('خطأ في تحميل البيانات', 'error');
        }
    }

    async loadUserData() {
        try {
            // تحميل إحصائيات المستخدم
            const userStats = await getStats();
            this.userStats = userStats;
            console.log('📊 إحصائيات المستخدم محملة:', userStats);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
            this.userStats = {
                totalCustomers: 0,
                totalSales: 0,
                salesAmount: 0,
                activeCustomers: 0
            };
        }
    }

    async loadEmployees() {
        try {
            console.log('👥 جاري تحميل الموظفين...');
            const response = await apiRequest('/users/employees');
            employees = response.employees || [];
            console.log('✅ تم تحميل الموظفين:', employees.length);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل الموظفين:', error);
            employees = [];
            showNotification('خطأ في تحميل قائمة الموظفين', 'error');
        }
    }

    renderProfile() {
        console.log('🔄 عرض بيانات الملف الشخصي...');
        
        // تحديث معلومات المستخدم الأساسية
        this.updateElementText('userName', this.currentUser.name);
        this.updateElementText('userEmail', this.currentUser.email);
        this.updateElementText('userRole', this.getRoleName(this.currentUser.role));
        
        // تحديث الإحصائيات
        if (this.userStats) {
            this.updateElementText('myCustomers', this.userStats.totalCustomers || 0);
            this.updateElementText('mySales', this.userStats.totalSales || 0);
            this.updateElementText('myRevenue', (this.userStats.salesAmount || 0).toFixed(2) + ' دينار');
        }
        
        // تحديث معلومات النشاط
        this.updateElementText('lastLogin', this.formatDate(this.currentUser.last_login));
        this.updateElementText('accountAge', this.getAccountAge());
        this.updateElementText('activeStatus', 'نشط');
        
        // تعبئة نموذج التعديل
        this.setInputValue('profileName', this.currentUser.name);
        this.setInputValue('profileEmail', this.currentUser.email);
    }

    renderEmployees() {
        const container = document.getElementById('employeesList');
        if (!container) {
            console.log('⚠️ حاوية الموظفين غير موجودة');
            return;
        }

        container.innerHTML = '';

        if (employees.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">لا يوجد موظفين حتى الآن.</p>';
            return;
        }

        console.log('👥 عرض الموظفين:', employees.length);
        
        employees.forEach(employee => {
            const card = this.createEmployeeCard(employee);
            container.appendChild(card);
        });
    }

    createEmployeeCard(employee) {
        const card = document.createElement('div');
        card.className = 'customer-card';
        card.innerHTML = `
            <div class="customer-header">
                <div>
                    <div class="customer-name">${employee.name}</div>
                    <div class="customer-info">
                        <div>📧 ${employee.email}</div>
                        <div>🎯 ${employee.position || 'لا يوجد'}</div>
                        <div>🔐 ${this.getRoleName(employee.role)}</div>
                        <div>📅 انضم: ${this.formatDate(employee.created_at)}</div>
                    </div>
                </div>
                <span class="customer-status status-${employee.status || 'active'}">
                    ${employee.status === 'active' ? '✅ نشط' : '❌ غير نشط'}
                </span>
            </div>
            
            <div class="customer-actions">
                <button class="btn btn-primary" onclick="editEmployee(${employee.id})">✏️ تعديل</button>
                <button class="btn btn-warning" onclick="toggleEmployeeStatus(${employee.id})">
                    ${employee.status === 'active' ? '❌ تعطيل' : '✅ تفعيل'}
                </button>
                <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">🗑️ حذف</button>
            </div>
        `;
        return card;
    }

    hasUserManagementPermission() {
        const user = this.currentUser;
        return user && (user.role === 'admin' || user.role === 'manager');
    }

    updateElementText(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }

    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element) element.value = value || '';
    }

    getRoleName(role) {
        const roles = {
            'admin': 'مدير النظام',
            'manager': 'مدير',
            'employee': 'موظف',
            'viewer': 'مشاهد'
        };
        return roles[role] || role;
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('ar-JO');
        } catch (e) {
            return '-';
        }
    }

    getAccountAge() {
        if (!this.currentUser.created_at) return '-';
        try {
            const created = new Date(this.currentUser.created_at);
            const now = new Date();
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} يوم`;
        } catch (e) {
            return '-';
        }
    }

    setupEventListeners() {
        console.log('🎯 إعداد مستمعي الأحداث...');
        
        const employeeSearch = document.getElementById('employeeSearch');
        if (employeeSearch) {
            employeeSearch.addEventListener('input', this.filterEmployees);
        }
    }

    filterEmployees() {
        const search = document.getElementById('employeeSearch').value.toLowerCase();
        const cards = document.querySelectorAll('#employeesList .customer-card');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(search) ? 'block' : 'none';
        });
    }
}

// 🔄 دوال إدارة الموظفين
function openAddEmployeeModal() {
    console.log('➕ فتح نافذة إضافة موظف...');
    
    if (!profileManager.hasUserManagementPermission()) {
        showNotification('ليس لديك صلاحية لإضافة موظفين', 'error');
        return;
    }

    editingEmployeeId = null;
    document.getElementById('employeeModalTitle').textContent = 'إضافة موظف جديد';
    document.getElementById('employeeName').value = '';
    document.getElementById('employeeEmail').value = '';
    document.getElementById('employeePassword').value = '';
    document.getElementById('employeePosition').value = '';
    document.getElementById('employeeRole').value = 'employee';
    
    // تفريغ الصلاحيات
    document.querySelectorAll('input[name="permissions"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('employeeModal').classList.add('active');
}

async function saveEmployee(e) {
    e.preventDefault();
    console.log('💾 محاولة حفظ موظف...');

    if (!profileManager.hasUserManagementPermission()) {
        showNotification('ليس لديك صلاحية لإدارة الموظفين', 'error');
        return;
    }

    const employeeData = {
        name: document.getElementById('employeeName').value,
        email: document.getElementById('employeeEmail').value,
        password: document.getElementById('employeePassword').value,
        position: document.getElementById('employeePosition').value,
        role: document.getElementById('employeeRole').value,
        permissions: Array.from(document.querySelectorAll('input[name="permissions"]:checked'))
            .map(checkbox => checkbox.value)
    };

    // التحقق من البيانات
    if (!employeeData.name || !employeeData.email || !employeeData.password) {
        showNotification('الاسم والبريد الإلكتروني وكلمة المرور مطلوبة', 'error');
        return;
    }

    try {
        let result;
        if (editingEmployeeId) {
            // تحديث موظف موجود
            result = await apiRequest(`/api/users/employees/${editingEmployeeId}`, {
                method: 'PUT',
                body: JSON.stringify(employeeData)
            });
            showNotification('تم تحديث بيانات الموظف بنجاح!', 'success');
        } else {
            // إضافة موظف جديد
            result = await apiRequest('/api/users/employees', {
                method: 'POST',
                body: JSON.stringify(employeeData)
            });
            showNotification('تم إضافة الموظف بنجاح!', 'success');
        }

        // إعادة تحميل البيانات
        await profileManager.loadEmployees();
        profileManager.renderEmployees();
        closeModal('employeeModal');

    } catch (error) {
        console.error('❌ خطأ في حفظ الموظف:', error);
        showNotification('خطأ في حفظ بيانات الموظف: ' + error.message, 'error');
    }
}

function editEmployee(id) {
    console.log('✏️ تعديل موظف:', id);
    
    if (!profileManager.hasUserManagementPermission()) {
        showNotification('ليس لديك صلاحية لتعديل الموظفين', 'error');
        return;
    }

    const employee = employees.find(emp => emp.id == id);
    if (!employee) {
        showNotification('الموظف غير موجود', 'error');
        return;
    }

    editingEmployeeId = id;
    document.getElementById('employeeModalTitle').textContent = 'تعديل بيانات الموظف';
    document.getElementById('employeeName').value = employee.name;
    document.getElementById('employeeEmail').value = employee.email;
    document.getElementById('employeePassword').value = ''; // لا نعرض كلمة المرور
    document.getElementById('employeePosition').value = employee.position || '';
    document.getElementById('employeeRole').value = employee.role;
    
    // تعبئة الصلاحيات
    document.querySelectorAll('input[name="permissions"]').forEach(checkbox => {
        checkbox.checked = employee.permissions?.includes(checkbox.value) || false;
    });
    
    document.getElementById('employeeModal').classList.add('active');
}

async function toggleEmployeeStatus(id) {
    console.log('🔄 تغيير حالة الموظف:', id);
    
    if (!profileManager.hasUserManagementPermission()) {
        showNotification('ليس لديك صلاحية لتغيير حالة الموظفين', 'error');
        return;
    }

    const employee = employees.find(emp => emp.id == id);
    if (!employee) return;

    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    
    try {
        await apiRequest(`/api/users/employees/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });

        showNotification(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} الموظف بنجاح!`, 'success');
        await profileManager.loadEmployees();
        profileManager.renderEmployees();

    } catch (error) {
        console.error('❌ خطأ في تغيير حالة الموظف:', error);
        showNotification('خطأ في تغيير حالة الموظف: ' + error.message, 'error');
    }
}

async function deleteEmployee(id) {
    console.log('🗑️ حذف موظف:', id);
    
    if (!profileManager.hasUserManagementPermission()) {
        showNotification('ليس لديك صلاحية لحذف الموظفين', 'error');
        return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.')) {
        return;
    }

    try {
        await apiRequest(`/api/users/employees/${id}`, {
            method: 'DELETE'
        });

        showNotification('تم حذف الموظف بنجاح!', 'success');
        await profileManager.loadEmployees();
        profileManager.renderEmployees();

    } catch (error) {
        console.error('❌ خطأ في حذف الموظف:', error);
        showNotification('خطأ في حذف الموظف: ' + error.message, 'error');
    }
}

// 👤 دوال الملف الشخصي
async function updateProfile(e) {
    e.preventDefault();
    console.log('🔄 تحديث الملف الشخصي...');

    const updateData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value
    };

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    if (newPassword) {
        if (!currentPassword) {
            showNotification('يجب إدخال كلمة المرور الحالية لتغيير كلمة المرور', 'error');
            return;
        }
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
    }

    try {
        const result = await apiRequest('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });

        if (result.success) {
            showNotification('تم تحديث الملف الشخصي بنجاح!', 'success');
            // تحديث بيانات المستخدم في التخزين المحلي
            const updatedUser = { ...getCurrentUser(), ...updateData };
            localStorage.setItem('datavision_user', JSON.stringify(updatedUser));
            profileManager.renderProfile();
        }

    } catch (error) {
        console.error('❌ خطأ في تحديث الملف الشخصي:', error);
        showNotification('خطأ في تحديث الملف الشخصي: ' + error.message, 'error');
    }
}

async function exportMyData() {
    console.log('📤 تصدير البيانات...');
    
    try {
        const result = await apiRequest('/api/user/export-data');
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.download = `my-data-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('تم تصدير بياناتك بنجاح!', 'success');

    } catch (error) {
        console.error('❌ خطأ في تصدير البيانات:', error);
        showNotification('خطأ في تصدير البيانات: ' + error.message, 'error');
    }
}

function showDeleteAccountModal() {
    console.log('⚠️ عرض نافذة حذف الحساب...');
    
    const confirmation = prompt('⚠️ هل أنت متأكد من حذف حسابك؟ جميع بياناتك سيتم حذفها ولا يمكن استعادتها.\n\nاكتب "حذف حسابي" للتأكيد:');
    
    if (confirmation === 'حذف حسابي') {
        deleteAccount();
    } else {
        showNotification('تم إلغاء حذف الحساب', 'info');
    }
}

async function deleteAccount() {
    console.log('🗑️ حذف الحساب...');
    
    try {
        await apiRequest('/api/user/account', {
            method: 'DELETE'
        });

        showNotification('تم حذف حسابك بنجاح', 'success');
        setTimeout(() => {
            logout();
        }, 2000);

    } catch (error) {
        console.error('❌ خطأ في حذف الحساب:', error);
        showNotification('خطأ في حذف الحساب: ' + error.message, 'error');
    }
}

// 🚪 تسجيل الخروج - معدل
function logout() {
    console.log('🚪 تسجيل الخروج...');
    if (confirm('هل تريد تسجيل الخروج؟')) {
        // استخدام دالة الخروج من api-client.js
        if (typeof window.logout === 'function') {
            window.logout();
        } else {
            // بديل إذا لم تكن الدالة متاحة
            localStorage.removeItem('datavision_token');
            localStorage.removeItem('datavision_user');
            window.location.href = 'login.html';
        }
    }
}

// 🎯 التبديل بين التبويبات
function switchTab(tabName) {
    console.log('🔀 التبديل إلى تبويب:', tabName);
    
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'employees') {
        if (profileManager.hasUserManagementPermission()) {
            profileManager.renderEmployees();
        } else {
            document.getElementById('employeesList').innerHTML = 
                '<p style="text-align: center; color: #9ca3af; padding: 40px;">ليس لديك صلاحية لإدارة الموظفين.</p>';
        }
    }
}

// 🔧 إغلاق النوافذ
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 🔔 دالة الإشعارات
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.log('⚠️ عنصر الإشعار غير موجود');
        return;
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// 🌟 تهيئة النظام
let profileManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 صفحة الملف الشخصي محملة');
    
    // فحص المصادقة أولاً
    if (!getCurrentUser()) {
        console.log('❌ لم يتم المصادقة، التوجيه إلى Login');
        window.location.href = 'login.html';
        return;
    }
    
    profileManager = new ProfileManager();
});
