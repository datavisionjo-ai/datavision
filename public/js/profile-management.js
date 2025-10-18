// profile-management.js - نظام إدارة المستخدمين والصلاحيات
let employees = [];
let editingEmployeeId = null;
let userActivities = [];

class ProfileManager {
    constructor() {
        this.currentUser = getCurrentUser();
        this.init();
    }

    async init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        await this.loadUserData();
        this.renderProfile();
        this.renderEmployees();
        this.setupEventListeners();
    }

    async loadUserData() {
        try {
            // تحميل بيانات المستخدم
            const userStats = await getStats();
            this.userStats = userStats;
            
            // تحميل الموظفين إذا كان مديراً
            if (this.currentUser.role === 'admin' || this.currentUser.role === 'manager') {
                await this.loadEmployees();
            }
            
            // تحميل سجل النشاط
            await this.loadActivityLog();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            showNotification('خطأ في تحميل البيانات', 'error');
        }
    }

    async loadEmployees() {
        try {
            const response = await apiRequest('/users/employees');
            employees = response.employees || [];
        } catch (error) {
            console.error('Error loading employees:', error);
            employees = [];
        }
    }

    async loadActivityLog() {
        try {
            const response = await apiRequest('/user/activities');
            userActivities = response.activities || [];
        } catch (error) {
            console.error('Error loading activities:', error);
            userActivities = [];
        }
    }

    renderProfile() {
        // تحديث معلومات المستخدم
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('userRole').textContent = this.getRoleName(this.currentUser.role);
        
        // تحديث الإحصائيات
        if (this.userStats) {
            document.getElementById('myCustomers').textContent = this.userStats.totalCustomers || 0;
            document.getElementById('mySales').textContent = this.userStats.totalSales || 0;
            document.getElementById('myRevenue').textContent = (this.userStats.salesAmount || 0).toFixed(2) + ' دينار';
        }
        
        // تحديث معلومات النشاط
        document.getElementById('lastLogin').textContent = this.formatDate(this.currentUser.lastLogin);
        document.getElementById('accountAge').textContent = this.getAccountAge();
        document.getElementById('activeStatus').textContent = 'نشط';
        
        // تعبئة نموذج التعديل
        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
    }

    renderEmployees() {
        const container = document.getElementById('employeesList');
        if (!container) return;

        container.innerHTML = '';

        if (employees.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">لا يوجد موظفين حتى الآن.</p>';
            return;
        }

        employees.forEach(employee => {
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
                    <button class="btn btn-primary" onclick="editEmployee('${employee.id}')">✏️ تعديل</button>
                    <button class="btn btn-warning" onclick="toggleEmployeeStatus('${employee.id}')">
                        ${employee.status === 'active' ? '❌ تعطيل' : '✅ تفعيل'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteEmployee('${employee.id}')">🗑️ حذف</button>
                </div>
            `;
            container.appendChild(card);
        });
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
        return new Date(dateString).toLocaleDateString('ar-JO');
    }

    getAccountAge() {
        if (!this.currentUser.created_at) return '-';
        const created = new Date(this.currentUser.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} يوم`;
    }

    setupEventListeners() {
        // إضافة المستمعين للأحداث
        const employeeSearch = document.getElementById('employeeSearch');
        if (employeeSearch) {
            employeeSearch.onkeyup = this.filterEmployees;
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
    if (!hasPermission('manage_users')) {
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

    if (!hasPermission('manage_users')) {
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

    try {
        let result;
        if (editingEmployeeId) {
            result = await apiRequest(`/users/employees/${editingEmployeeId}`, {
                method: 'PUT',
                body: JSON.stringify(employeeData)
            });
            showNotification('تم تحديث بيانات الموظف بنجاح!', 'success');
        } else {
            result = await apiRequest('/users/employees', {
                method: 'POST',
                body: JSON.stringify(employeeData)
            });
            showNotification('تم إضافة الموظف بنجاح!', 'success');
        }

        await profileManager.loadEmployees();
        profileManager.renderEmployees();
        closeModal('employeeModal');

    } catch (error) {
        showNotification('خطأ في حفظ بيانات الموظف: ' + error.message, 'error');
    }
}

async function editEmployee(id) {
    if (!hasPermission('manage_users')) {
        showNotification('ليس لديك صلاحية لتعديل الموظفين', 'error');
        return;
    }

    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

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
    if (!hasPermission('manage_users')) {
        showNotification('ليس لديك صلاحية لتغيير حالة الموظفين', 'error');
        return;
    }

    const employee = employees.find(emp => emp.id === id);
    if (!employee) return;

    const newStatus = employee.status === 'active' ? 'inactive' : 'active';
    
    try {
        await apiRequest(`/users/employees/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });

        showNotification(`تم ${newStatus === 'active' ? 'تفعيل' : 'تعطيل'} الموظف بنجاح!`, 'success');
        await profileManager.loadEmployees();
        profileManager.renderEmployees();

    } catch (error) {
        showNotification('خطأ في تغيير حالة الموظف: ' + error.message, 'error');
    }
}

async function deleteEmployee(id) {
    if (!hasPermission('manage_users')) {
        showNotification('ليس لديك صلاحية لحذف الموظفين', 'error');
        return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.')) {
        return;
    }

    try {
        await apiRequest(`/users/employees/${id}`, {
            method: 'DELETE'
        });

        showNotification('تم حذف الموظف بنجاح!', 'success');
        await profileManager.loadEmployees();
        profileManager.renderEmployees();

    } catch (error) {
        showNotification('خطأ في حذف الموظف: ' + error.message, 'error');
    }
}

// 🔐 دوال الصلاحيات
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;

    // المدير لديه جميع الصلاحيات
    if (user.role === 'admin') return true;
    
    // المدير العادي لديه معظم الصلاحيات
    if (user.role === 'manager' && permission !== 'manage_system') return true;
    
    // التحقق من الصلاحيات المحددة
    return user.permissions?.includes(permission) || false;
}

function checkPermission(permission) {
    if (!hasPermission(permission)) {
        showNotification('ليس لديك صلاحية للقيام بهذا الإجراء', 'error');
        return false;
    }
    return true;
}

// 👤 دوال الملف الشخصي
async function updateProfile(e) {
    e.preventDefault();

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
        const result = await apiRequest('/user/profile', {
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
        showNotification('خطأ في تحديث الملف الشخصي: ' + error.message, 'error');
    }
}

async function exportMyData() {
    try {
        const result = await apiRequest('/user/export-data');
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
        showNotification('خطأ في تصدير البيانات: ' + error.message, 'error');
    }
}

function showDeleteAccountModal() {
    if (!confirm('⚠️ هل أنت متأكد من حذف حسابك؟ جميع بياناتك سيتم حذفها ولا يمكن استعادتها.')) {
        return;
    }
    
    if (confirm('❌ هذا الإجراء نهائي. اكتب "حذف حسابي" للتأكيد:')) {
        deleteAccount();
    }
}

async function deleteAccount() {
    try {
        await apiRequest('/user/account', {
            method: 'DELETE'
        });

        showNotification('تم حذف حسابك بنجاح', 'success');
        setTimeout(() => {
            logout();
        }, 2000);

    } catch (error) {
        showNotification('خطأ في حذف الحساب: ' + error.message, 'error');
    }
}

// 📊 دوال التقارير
async function loadActivityLog() {
    const period = document.getElementById('activityPeriod').value;
    
    try {
        const response = await apiRequest(`/user/activities?period=${period}`);
        const activities = response.activities || [];
        
        const logContainer = document.getElementById('activityLog');
        logContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-type">${getActivityTypeIcon(activity.type)} ${activity.type}</div>
                <div class="activity-details">${activity.details}</div>
                <div class="activity-time">${new Date(activity.timestamp).toLocaleString('ar-JO')}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading activity log:', error);
    }
}

function getActivityTypeIcon(type) {
    const icons = {
        'login': '🔐',
        'logout': '🚪',
        'create': '➕',
        'update': '✏️',
        'delete': '🗑️',
        'view': '👁️',
        'export': '📤',
        'import': '📥'
    };
    return icons[type] || '📝';
}

// 🎯 التبديل بين التبويبات
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'employees') {
        profileManager.renderEmployees();
    } else if (tabName === 'security') {
        loadActivityLog();
    }
}

// 🚪 تسجيل الخروج
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        window.logout(); // استخدام دالة الخروج من api-client.js
    }
}

// 🔧 إغلاق النوافذ
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 🌟 تهيئة النظام
let profileManager;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('profile.html')) {
        profileManager = new ProfileManager();
    }
});
