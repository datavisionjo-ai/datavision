// api-client.js - العميل للاتصال مع السيرفر
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
    const result = await apiRequest('/customers');
    return result.customers || [];
}

async function addCustomer(customerData) {
    const result = await apiRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
    });
    return result.customer;
}

async function updateCustomer(id, customerData) {
    const result = await apiRequest(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(customerData)
    });
    return result.customer;
}

async function deleteCustomer(id) {
    const result = await apiRequest(`/customers/${id}`, {
        method: 'DELETE'
    });
    return result;
}

// إدارة المبيعات
async function getSales() {
    const result = await apiRequest('/sales');
    return result.sales || [];
}

async function addSale(saleData) {
    const result = await apiRequest('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
    });
    return result.sale;
}

// الإحصائيات
async function getStats() {
    const result = await apiRequest('/user/stats');
    return result.stats;
}

// المساعد الذكي
async function analyzeWithAI(message) {
    const result = await apiRequest('/ai/analyze', {
        method: 'POST',
        body: JSON.stringify({ message })
    });
    return result.response;
}

// التحقق من حالة المستخدم
function isLoggedIn() {
    return !!authToken && !!currentUser;
}

function getCurrentUser() {
    return currentUser;
}
