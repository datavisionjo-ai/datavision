// api-client.js - العميل للاتصال مع السيرفر - معدل كامل
const API_BASE = window.location.origin + '/api';

// تخزين التوكن
let authToken = localStorage.getItem('datavision_token');
let currentUser = JSON.parse(localStorage.getItem('datavision_user') || 'null');

// دالة للطلبات العامة
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
    authToken = null;
    currentUser = null;
    localStorage.removeItem('datavision_token');
    localStorage.removeItem('datavision_user');
    window.location.href = '/login';
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

// جعل الدوال متاحة globally
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
