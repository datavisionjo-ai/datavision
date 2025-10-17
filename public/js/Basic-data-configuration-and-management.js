// Basic-data-configuration-and-management.js - معدل كامل
let customers = [];
let sales = [];
let settings = {
    defaultMessage: 'مرحباً {name}، شكراً لاختيارك DataBuddy!'
};
let editingCustomerId = null;
let statusChart, salesChart;
let isAssistantTyping = false;

// ============ نظام التهيئة والتحميل ============

function init() {
    checkAuthStatus();
    loadData();
    updateDashboard();
    renderCustomers();
    renderSales();
    initCharts();
    
    if (document.getElementById('defaultMessage')) {
        document.getElementById('defaultMessage').value = settings.defaultMessage;
    }
    if (document.getElementById('saleDate')) {
        document.getElementById('saleDate').valueAsDate = new Date();
    }
    
    setTimeout(updateAIInsights, 1000);
    addAdvancedAnalysisButton();
    
    // ربط الأزرار
    const sendBtn = document.querySelector('#assistant .btn-primary');
    const inputField = document.getElementById('assistantInput');
    
    if (sendBtn) sendBtn.onclick = sendFreeMessage;
    if (inputField) {
        inputField.onkeypress = (e) => {
            if (e.key === 'Enter') sendFreeMessage();
        };
    }
}

function checkAuthStatus() {
    if (isLoggedIn()) {
        console.log('✅ المستخدم مسجل:', getCurrentUser().name);
        document.body.classList.add('user-logged-in');
    } else {
        console.log('ℹ️ المستخدم غير مسجل - استخدام وضع الزائر');
        document.body.classList.add('guest-mode');
    }
}

async function loadData() {
    try {
        if (isLoggedIn()) {
            console.log('🔄 جلب البيانات من السيرفر...');
            const [customersData, salesData] = await Promise.all([
                getCustomers(),
                getSales()
            ]);

            customers = customersData;
            sales = salesData;
            
            console.log('✅ تم تحميل البيانات من السيرفر:', {
                customers: customers.length,
                sales: sales.length
            });
        } else {
            loadFromLocalStorage();
        }
    } catch (error) {
        console.error('❌ فشل تحميل البيانات من السيرفر:', error);
        loadFromLocalStorage();
    }
}

function loadFromLocalStorage() {
    const savedCustomers = localStorage.getItem('databuddy_customers');
    const savedSales = localStorage.getItem('databuddy_sales');
    const savedSettings = localStorage.getItem('databuddy_settings');
    
    if (savedCustomers) customers = JSON.parse(savedCustomers);
    if (savedSales) sales = JSON.parse(savedSales);
    if (savedSettings) settings = JSON.parse(savedSettings);
    
    console.log('📁 تم تحميل البيانات من التخزين المحلي:', {
        customers: customers.length,
        sales: sales.length
    });
}

async function saveData() {
    try {
        if (isLoggedIn()) {
            // البيانات تحفظ في السيرفر تلقائياً عند كل عملية
            console.log('💾 البيانات محفوظة في السيرفر');
        } else {
            localStorage.setItem('databuddy_customers', JSON.stringify(customers));
            localStorage.setItem('databuddy_sales', JSON.stringify(sales));
            localStorage.setItem('databuddy_settings', JSON.stringify(settings));
            console.log('💾 البيانات محفوظة محلياً');
        }
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
    }
}

function resetActivation() {
    window.location.href = "About.html";
}

// ============ نظام التبويب والواجهة ============

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'dashboard') {
        updateDashboard();
        updateCharts();
    } else if (tabName === 'sales') {
        renderSales();
    } else if (tabName === 'assistant') {
        updateAIInsights();
    }
}

function updateDashboard() {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const inactive = total - active;
    const totalSalesAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || sale.sale_amount || 0), 0);

    if (document.getElementById('totalCustomers')) {
        document.getElementById('totalCustomers').textContent = total;
    }
    if (document.getElementById('activeCustomers')) {
        document.getElementById('activeCustomers').textContent = active;
    }
    if (document.getElementById('inactiveCustomers')) {
        document.getElementById('inactiveCustomers').textContent = inactive;
    }
    if (document.getElementById('totalSales')) {
        document.getElementById('totalSales').textContent = totalSalesAmount.toFixed(2) + ' دينار';
    }
}

// ============ النظام البياني ============

function initCharts() {
    const statusCtx = document.getElementById('statusChart');
    const salesCtx = document.getElementById('salesChart');
    
    if (!statusCtx || !salesCtx) {
        console.log('⏳ Charts containers not ready yet');
        return;
    }

    statusChart = new Chart(statusCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['نشط', 'غير نشط'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#00087aff', '#ff0000ff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    salesChart = new Chart(salesCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'المبيعات (دينار)',
                data: [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    updateCharts();
}

function updateCharts() {
    if (!statusChart || !salesChart) return;

    const active = customers.filter(c => c.status === 'active').length;
    const inactive = customers.length - active;
    
    statusChart.data.datasets[0].data = [active, inactive];
    statusChart.update();

    const last7Days = [];
    const salesByDay = {};
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push(dateStr);
        salesByDay[dateStr] = 0;
    }

    sales.forEach(sale => {
        const saleDate = sale.sale_date || sale.date;
        if (salesByDay.hasOwnProperty(saleDate)) {
            salesByDay[saleDate] += parseFloat(sale.amount || 0);
        }
    });

    salesChart.data.labels = last7Days.map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('ar-JO', { month: 'short', day: 'numeric' });
    });
    salesChart.data.datasets[0].data = last7Days.map(d => salesByDay[d]);
    salesChart.update();
}

// ============ دوال المساعدة ============

function getCustomerPurchases(customerId) {
    const customerSales = sales.filter(s => s.customer_id === customerId || s.customerId === customerId);
    const totalAmount = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    
    return {
        sales: customerSales,
        count: customerSales.length,
        total: totalAmount
    };
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message ai-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-text typing">جاري الكتابة...</div>
        </div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .notification-error { background: var(--danger); }
            .notification-warning { background: var(--warning); color: var(--dark); }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function sendWhatsApp(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const message = settings.defaultMessage.replace('{name}', customer.name);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${customer.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

function updateAIInsights() {
    const insightsContainer = document.getElementById('aiInsights');
    if (!insightsContainer) return;
    
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    
    let insights = [];
    
    if (totalCustomers === 0) {
        insights.push('💡 ابدأ بإضافة عملائك الأولين لتحصل على تحليلات ذكية');
    } else {
        insights.push(`👥 لديك ${totalCustomers} عميل (${activeCustomers} نشطين)`);
        
        if (totalSales > 0) {
            const avgSale = totalSales / sales.length;
            insights.push(`💰 إجمالي المبيعات: ${totalSales.toFixed(2)} دينار`);
            insights.push(`📊 متوسط قيمة البيع: ${avgSale.toFixed(2)} دينار`);
        }
        
        if (activeCustomers / totalCustomers < 0.5) {
            insights.push('⚠️ انتبه: أقل من نصف عملائك نشطين');
        }
    }
    
    insightsContainer.innerHTML = insights.map(insight => 
        `<div class="insight-item">${insight}</div>`
    ).join('');
}

function addAdvancedAnalysisButton() {
    const assistantTab = document.getElementById('assistant');
    if (!assistantTab) return;
    
    const existingButton = document.getElementById('advancedAnalysisBtn');
    if (existingButton) return;
    
    const button = document.createElement('button');
    button.id = 'advancedAnalysisBtn';
    button.className = 'btn btn-primary';
    button.innerHTML = '🧠 تحليل متقدم للبيانات';
    button.style.marginTop = '10px';
    button.style.width = '100%';
    
    button.onclick = async function() {
        showTypingIndicator();
        
        const analysis = await analyzeBusinessData();
        
        hideTypingIndicator();
        addMessageToChat(analysis, 'ai');
    };
    
    const chatContainer = document.querySelector('#assistant .chat-container');
    if (chatContainer) {
        chatContainer.parentNode.insertBefore(button, chatContainer.nextSibling);
    }
}

async function analyzeBusinessData() {
    try {
        if (isLoggedIn()) {
            const response = await analyzeWithAI('تحليل شامل للأعمال');
            return response;
        } else {
            // تحليل محلي
            const totalCustomers = customers.length;
            const activeCustomers = customers.filter(c => c.status === 'active').length;
            const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            const avgSale = sales.length > 0 ? totalSales / sales.length : 0;
            
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            const recentSales = sales.filter(s => {
                const saleDate = new Date(s.sale_date || s.date);
                return saleDate >= last30Days;
            });
            const recentSalesTotal = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            
            let analysis = `📊 **تحليل متقدم للأعمال**\n\n`;
            analysis += `👥 **العملاء:** ${totalCustomers} عميل (${activeCustomers} نشط)\n`;
            analysis += `💰 **إجمالي المبيعات:** ${totalSales.toFixed(2)} دينار\n`;
            analysis += `📈 **متوسط البيع:** ${avgSale.toFixed(2)} دينار\n`;
            analysis += `🔄 **المبيعات الأخيرة (30 يوم):** ${recentSalesTotal.toFixed(2)} دينار\n\n`;
            
            if (totalCustomers < 10) {
                analysis += `💡 **توصية:** ركز على جذب المزيد من العملاء\n`;
            }
            
            if (activeCustomers / totalCustomers < 0.7) {
                analysis += `💡 **توصية:** انتبه لنسبة العملاء النشطين\n`;
            }
            
            if (recentSales.length === 0) {
                analysis += `💡 **توصية:** لا توجد مبيعات حديثة، ركز على المبيعات\n`;
            }
            
            return analysis;
        }
    } catch (error) {
        return '⚠️ تعذر تحليل البيانات حالياً. حاول مرة أخرى.';
    }
}

// ============ التكامل مع API ============

async function saveCustomer(e) {
    e.preventDefault();

    const customerData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        status: document.getElementById('customerStatus').value,
        notes: document.getElementById('customerNotes').value
    };

    try {
        let savedCustomer;
        
        if (editingCustomerId) {
            if (isLoggedIn()) {
                savedCustomer = await updateCustomer(editingCustomerId, customerData);
            } else {
                const index = customers.findIndex(c => c.id === editingCustomerId);
                customers[index] = { ...customers[index], ...customerData };
                savedCustomer = customers[index];
            }
            showNotification('تم تحديث بيانات العميل بنجاح!', 'success');
        } else {
            if (isLoggedIn()) {
                savedCustomer = await addCustomer(customerData);
                customers.push(savedCustomer);
            } else {
                savedCustomer = {
                    id: 'c_' + Date.now(),
                    ...customerData,
                    createdAt: new Date().toISOString()
                };
                customers.push(savedCustomer);
            }
            showNotification('تم إضافة العميل بنجاح!', 'success');
        }

        await saveData();
        renderCustomers();
        updateDashboard();
        updateCharts();
        closeModal('customerModal');

    } catch (error) {
        showNotification('خطأ في حفظ العميل: ' + error.message, 'error');
    }
}

async function deleteCustomer(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

    try {
        if (isLoggedIn()) {
            await deleteCustomerAPI(id);
        }
        
        customers = customers.filter(c => c.id !== id);
        sales = sales.filter(s => s.customer_id !== id && s.customerId !== id);
        
        await saveData();
        renderCustomers();
        renderSales();
        updateDashboard();
        updateCharts();
        showNotification('تم حذف العميل بنجاح!', 'success');

    } catch (error) {
        showNotification('خطأ في حذف العميل: ' + error.message, 'error');
    }
}

async function saveSale(e) {
    e.preventDefault();

    const saleData = {
        customer_id: document.getElementById('saleCustomerId').value,
        amount: document.getElementById('saleAmount').value,
        sale_date: document.getElementById('saleDate').value,
        description: document.getElementById('saleDescription').value
    };

    try {
        let savedSale;
        
        if (isLoggedIn()) {
            savedSale = await addSale(saleData);
        } else {
            savedSale = {
                id: 's_' + Date.now(),
                ...saleData,
                createdAt: new Date().toISOString()
            };
        }
        
        sales.push(savedSale);
        await saveData();
        renderSales();
        renderCustomers();
        updateDashboard();
        updateCharts();
        closeModal('saleModal');
        showNotification('تم إضافة عملية البيع بنجاح!', 'success');

    } catch (error) {
        showNotification('خطأ في إضافة البيع: ' + error.message, 'error');
    }
}

// ============ التهيئة التلقائية ============

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DataBuddy - جاهز للعمل!');
    setTimeout(init, 100);
});

// جعل الدوال متاحة globally
window.init = init;
window.switchTab = switchTab;
window.saveCustomer = saveCustomer;
window.saveSale = saveSale;
window.deleteCustomer = deleteCustomer;
window.closeModal = closeModal;
window.sendWhatsApp = sendWhatsApp;
window.showNotification = showNotification;
window.addMessageToChat = addMessageToChat;
window.sendFreeMessage = sendFreeMessage;
