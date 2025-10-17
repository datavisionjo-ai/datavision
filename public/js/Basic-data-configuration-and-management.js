let customers = [];
let sales = [];
let settings = {
    defaultMessage: 'مرحباً {name}، شكراً لاختيارك DataBuddy!'
};
let editingCustomerId = null;
let statusChart, salesChart;
let isAssistantTyping = false;

// إضافة الدوال الناقصة
function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
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
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // إضافة الأنماط إذا لم تكن موجودة
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
    
    // إزالة الإشعار تلقائياً بعد 5 ثواني
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
    
    // تحليلات ذكية بسيطة
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
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
        
        // تحليل البيانات
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
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    const avgSale = sales.length > 0 ? totalSales / sales.length : 0;
    
    // تحليل المبيعات الأخيرة
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentSales = sales.filter(s => new Date(s.date) >= last30Days);
    const recentSalesTotal = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
    let analysis = `📊 **تحليل متقدم للأعمال**\n\n`;
    analysis += `👥 **العملاء:** ${totalCustomers} عميل (${activeCustomers} نشط)\n`;
    analysis += `💰 **إجمالي المبيعات:** ${totalSales.toFixed(2)} دينار\n`;
    analysis += `📈 **متوسط البيع:** ${avgSale.toFixed(2)} دينار\n`;
    analysis += `🔄 **المبيعات الأخيرة (30 يوم):** ${recentSalesTotal.toFixed(2)} دينار\n\n`;
    
    // توصيات
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

function init() {
    loadData();
    updateDashboard();
    renderCustomers();
    renderSales();
    initCharts();
    document.getElementById('defaultMessage').value = settings.defaultMessage;
    document.getElementById('saleDate').valueAsDate = new Date();
    
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

function resetActivation() {
    window.location.href = "About.html";
}

function loadData() {
    const savedCustomers = localStorage.getItem('databuddy_customers');
    const savedSales = localStorage.getItem('databuddy_sales');
    const savedSettings = localStorage.getItem('databuddy_settings');
    
    if (savedCustomers) customers = JSON.parse(savedCustomers);
    if (savedSales) sales = JSON.parse(savedSales);
    if (savedSettings) settings = JSON.parse(savedSettings);
}

function saveData() {
    localStorage.setItem('databuddy_customers', JSON.stringify(customers));
    localStorage.setItem('databuddy_sales', JSON.stringify(sales));
    localStorage.setItem('databuddy_settings', JSON.stringify(settings));
}

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
    const totalSalesAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);

    document.getElementById('totalCustomers').textContent = total;
    document.getElementById('activeCustomers').textContent = active;
    document.getElementById('inactiveCustomers').textContent = inactive;
    document.getElementById('totalSales').textContent = totalSalesAmount.toFixed(2) + ' دينار';
}

function initCharts() {
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
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

    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
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
        if (salesByDay.hasOwnProperty(sale.date)) {
            salesByDay[sale.date] += parseFloat(sale.amount);
        }
    });

    salesChart.data.labels = last7Days.map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('ar-JO', { month: 'short', day: 'numeric' });
    });
    salesChart.data.datasets[0].data = last7Days.map(d => salesByDay[d]);
    salesChart.update();
}

function getCustomerPurchases(customerId) {
    const customerSales = sales.filter(s => s.customerId === customerId);
    const totalAmount = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
    
    return {
        sales: customerSales,
        count: customerSales.length,
        total: totalAmount
    };
}
