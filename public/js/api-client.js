// api-client.js - العميل للاتصال مع السيرفر - معدل كامل
const API_BASE = window.location.origin + '/api';

// تخزين التوكن
let authToken = localStorage.getItem('datavision_token');
let currentUser = JSON.parse(localStorage.getItem('datavision_user') || 'null');

// دالة للطلبات العامة
// في دالة apiRequest - أضف معالجة لأخطاء المصادقة
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        ...options
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            // إذا كان الخطأ 401 (غير مصرح)، قم بتسجيل الخروج
            if (response.status === 401) {
                console.log('🔐 انتهت صلاحية الجلسة، تسجيل الخروج...');
                logout();
                throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
            }
            throw new Error(data.error || 'خطأ في الشبكة');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
// نظام المصادقة
async function login(email, password) {
    try {
        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.success) {
            authToken = result.token;
            currentUser = result.user;
            
            localStorage.setItem('datavision_token', authToken);
            localStorage.setItem('datavision_user', JSON.stringify(currentUser));
            
            return result;
        }
    } catch (error) {
        throw error;
    }
}

async function register(name, email, password) {
    try {
        const result = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        if (result.success) {
            authToken = result.token;
            currentUser = result.user;
            
            localStorage.setItem('datavision_token', authToken);
            localStorage.setItem('datavision_user', JSON.stringify(currentUser));
            
            return result;
        }
    } catch (error) {
        throw error;
    }
}

function logout() {
    console.log('🚪 جاري تسجيل الخروج...');
    authToken = null;
    currentUser = null;
    localStorage.removeItem('datavision_token');
    localStorage.removeItem('datavision_user');
    window.location.href = 'login.html';
}

// إدارة العملاء
async function getCustomers() {
    try {
        const result = await apiRequest('/customers');
        return result.customers || [];
    } catch (error) {
        console.error('Error fetching customers:', error);
        return [];
    }
}

async function addCustomer(customerData) {
    try {
        const result = await apiRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(customerData)
        });
        return result.customer;
    } catch (error) {
        console.error('Error adding customer:', error);
        throw error;
    }
}

async function updateCustomer(id, customerData) {
    try {
        const result = await apiRequest(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(customerData)
        });
        return result.customer;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
}

async function deleteCustomerAPI(id) {
    try {
        const result = await apiRequest(`/customers/${id}`, {
            method: 'DELETE'
        });
        return result;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
}

// إدارة المبيعات
async function getSales() {
    try {
        const result = await apiRequest('/sales');
        return result.sales || [];
    } catch (error) {
        console.error('Error fetching sales:', error);
        return [];
    }
}

async function addSale(saleData) {
    try {
        const result = await apiRequest('/sales', {
            method: 'POST',
            body: JSON.stringify(saleData)
        });
        return result.sale;
    } catch (error) {
        console.error('Error adding sale:', error);
        throw error;
    }
}

// الإحصائيات
async function getStats() {
    try {
        const result = await apiRequest('/user/stats');
        return result.stats;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            totalCustomers: 0,
            totalSales: 0,
            salesAmount: 0,
            activeCustomers: 0
        };
    }
}

// المساعد الذكي
async function analyzeWithAI(message) {
    try {
        const result = await apiRequest('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
        return result.response;
    } catch (error) {
        console.error('Error analyzing with AI:', error);
        return '⚠️ تعذر الاتصال بالمساعد الذكي حالياً. جرب مرة أخرى لاحقاً.';
    }
}

// التحقق من حالة المستخدم
function isLoggedIn() {
    return !!authToken && !!currentUser;
}

function getCurrentUser() {
    return currentUser;
}
// api-client.js - إضافة دالة فحص الحالة
function checkAuthStatus() {
    const token = localStorage.getItem('datavision_token');
    const user = localStorage.getItem('datavision_user');
    
    console.log('🔍 فحص حالة المصادقة:', {
        tokenExists: !!token,
        userExists: !!user,
        currentUser: currentUser ? currentUser.email : 'null'
    });
    
    return !!token && !!user && !!currentUser;
}

// 👥 إدارة الموظفين - الدوال الناقصة
async function getEmployees() {
    try {
        const result = await apiRequest('/users/employees');
        return result.employees || [];
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
}

async function addEmployee(employeeData) {
    try {
        const result = await apiRequest('/users/employees', {
            method: 'POST',
            body: JSON.stringify(employeeData)
        });
        return result.employee;
    } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
    }
}

async function updateEmployee(id, employeeData) {
    try {
        const result = await apiRequest(`/users/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(employeeData)
        });
        return result.employee;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
}

async function deleteEmployeeAPI(id) {
    try {
        const result = await apiRequest(`/users/employees/${id}`, {
            method: 'DELETE'
        });
        return result;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
}

async function toggleEmployeeStatusAPI(id, status) {
    try {
        const result = await apiRequest(`/users/employees/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        return result;
    } catch (error) {
        console.error('Error toggling employee status:', error);
        throw error;
    }
}

// 📊 دوال إضافية للملف الشخصي
async function updateUserProfile(profileData) {
    try {
        const result = await apiRequest('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        return result;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

async function exportUserData() {
    try {
        const result = await apiRequest('/user/export-data');
        return result.data;
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
}

async function deleteUserAccount() {
    try {
        const result = await apiRequest('/user/account', {
            method: 'DELETE'
        });
        return result;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
}

async function getUserActivities(period = '7') {
    try {
        const result = await apiRequest(`/user/activities?period=${period}`);
        return result.activities || [];
    } catch (error) {
        console.error('Error fetching activities:', error);
        return [];
    }
}

// جعل الدوال متاحة globally - أضف الدوال الجديدة
window.login = login;
window.register = register;
window.logout = logout;
window.getCustomers = getCustomers;
window.addCustomer = addCustomer;
window.updateCustomer = updateCustomer;
window.deleteCustomerAPI = deleteCustomerAPI;
window.getSales = getSales;
window.addSale = addSale;
window.getStats = getStats;
window.analyzeWithAI = analyzeWithAI;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.checkAuthStatus = checkAuthStatus;

// 👥 الدوال الجديدة للموظفين والملف الشخصي
window.getEmployees = getEmployees;
window.addEmployee = addEmployee;
window.updateEmployee = updateEmployee;
window.deleteEmployeeAPI = deleteEmployeeAPI;
window.toggleEmployeeStatusAPI = toggleEmployeeStatusAPI;
window.updateUserProfile = updateUserProfile;
window.exportUserData = exportUserData;
window.deleteUserAccount = deleteUserAccount;
window.getUserActivities = getUserActivities;
