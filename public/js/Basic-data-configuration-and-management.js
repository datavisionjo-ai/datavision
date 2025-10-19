// Basic-data-configuration-and-management.js - معدل كامل
let customers = [];
let sales = [];
let settings = {
    defaultMessage: 'مرحباً {name}، شكراً لاختيارك Data Vision!'
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

            customers = customersData || [];
            sales = salesData || [];
            
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
    try {
        const savedCustomers = localStorage.getItem('datavision_customers');
        const savedSales = localStorage.getItem('datavision_sales');
        const savedSettings = localStorage.getItem('datavision_settings');
        
        if (savedCustomers) {
            customers = JSON.parse(savedCustomers);
            if (!Array.isArray(customers)) customers = [];
        } else {
            customers = [];
        }
        
        if (savedSales) {
            sales = JSON.parse(savedSales);
            if (!Array.isArray(sales)) sales = [];
        } else {
            sales = [];
        }
        
        if (savedSettings) {
            try {
                settings = JSON.parse(savedSettings);
            } catch (e) {
                settings = { defaultMessage: 'مرحباً {name}، شكراً لاختيارك Data Vision!' };
            }
        }
        
        console.log('📁 تم تحميل البيانات من التخزين المحلي:', {
            customers: customers.length,
            sales: sales.length
        });
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات المحلية:', error);
        customers = [];
        sales = [];
        settings = { defaultMessage: 'مرحباً {name}، شكراً لاختيارك Data Vision!' };
    }
}

async function saveData() {
    try {
        if (isLoggedIn()) {
            console.log('💾 البيانات محفوظة في السيرفر');
        } else {
            localStorage.setItem('datavision_customers', JSON.stringify(customers));
            localStorage.setItem('datavision_sales', JSON.stringify(sales));
            localStorage.setItem('datavision_settings', JSON.stringify(settings));
            console.log('💾 البيانات محفوظة محلياً:', {
                customers: customers.length,
                sales: sales.length
            });
        }
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
        showNotification('خطأ في حفظ البيانات', 'error');
    }
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
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
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

// ============ نظام استيراد وتصدير البيانات ============

function openExportModal() {
    document.getElementById('exportModal').style.display = 'block';
}

function openImportModal() {
    document.getElementById('importModal').style.display = 'block';
}

function exportData() {
    try {
        const data = {
            customers: customers,
            sales: sales,
            settings: settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.download = `datavision-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('تم تصدير البيانات بنجاح!', 'success');
        closeModal('exportModal');
    } catch (error) {
        console.error('خطأ في التصدير:', error);
        showNotification('خطأ في تصدير البيانات', 'error');
    }
}

function exportToExcel() {
    try {
        // جلب البيانات
        const customers = JSON.parse(localStorage.getItem('datavision_customers')) || [];
        const sales = JSON.parse(localStorage.getItem('datavision_sales')) || [];
        
        // إنشاء مصنف Excel
        const wb = XLSX.utils.book_new();
        
        // تحضير بيانات العملاء لـ Excel
        const customersData = customers.map(customer => ({
            'الاسم': customer.name,
            'رقم الهاتف': customer.phone,
            'البريد الإلكتروني': customer.email || '',
            'الحالة': customer.status === 'active' ? 'نشط' : 'غير نشط',
            'تاريخ الإضافة': customer.createdAt,
            'ملاحظات': customer.notes || ''
        }));
        
        // تحضير بيانات المبيعات لـ Excel
        const salesData = sales.map(sale => {
            const customer = customers.find(c => c.id === sale.customerId);
            return {
                'اسم العميل': customer ? customer.name : 'غير معروف',
                'المبلغ (دينار)': sale.amount,
                'التاريخ': sale.date,
                'الوصف': sale.description || '',
                'رقم العملية': sale.id
            };
        });
        
        // إنشاء أوراق العمل
        const customersWs = XLSX.utils.json_to_sheet(customersData);
        const salesWs = XLSX.utils.json_to_sheet(salesData);
        
        // إضافة أوراق العمل للمصنف
        XLSX.utils.book_append_sheet(wb, customersWs, 'العملاء');
        XLSX.utils.book_append_sheet(wb, salesWs, 'المبيعات');
        
        // تصدير الملف
        XLSX.writeFile(wb, `DataVision_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showNotification('✅ تم تصدير البيانات بنجاح بصيغة Excel', 'success');
        closeModal('exportModal');
    } catch (error) {
        console.error('خطأ في تصدير Excel:', error);
        showNotification('❌ فشل في تصدير البيانات بصيغة Excel', 'error');
    }
}

function exportToCSV() {
    try {
        // جلب البيانات
        const customers = JSON.parse(localStorage.getItem('datavision_customers')) || [];
        const sales = JSON.parse(localStorage.getItem('datavision_sales')) || [];
        
        // تصدير العملاء كـ CSV
        if (customers.length > 0) {
            const customersHeaders = ['الاسم', 'رقم الهاتف', 'البريد الإلكتروني', 'الحالة', 'تاريخ الإضافة', 'ملاحظات'];
            let customersCsv = '\uFEFF' + customersHeaders.join(',') + '\n';
            
            customers.forEach(customer => {
                const row = [
                    `"${customer.name}"`,
                    `"${customer.phone}"`,
                    `"${customer.email || ''}"`,
                    `"${customer.status === 'active' ? 'نشط' : 'غير نشط'}"`,
                    `"${customer.createdAt}"`,
                    `"${(customer.notes || '').replace(/"/g, '""')}"`
                ];
                customersCsv += row.join(',') + '\n';
            });
            
            downloadCSV(customersCsv, `DataVision_Customers_${new Date().toISOString().split('T')[0]}.csv`);
        }
        
        // تصدير المبيعات كـ CSV
        if (sales.length > 0) {
            const salesHeaders = ['اسم العميل', 'المبلغ (دينار)', 'التاريخ', 'الوصف', 'رقم العملية'];
            let salesCsv = '\uFEFF' + salesHeaders.join(',') + '\n';
            
            sales.forEach(sale => {
                const customer = customers.find(c => c.id === sale.customerId);
                const row = [
                    `"${customer ? customer.name : 'غير معروف'}"`,
                    sale.amount,
                    `"${sale.date}"`,
                    `"${(sale.description || '').replace(/"/g, '""')}"`,
                    sale.id
                ];
                salesCsv += row.join(',') + '\n';
            });
            
            downloadCSV(salesCsv, `DataVision_Sales_${new Date().toISOString().split('T')[0]}.csv`);
        }
        
        showNotification('✅ تم تصدير البيانات بنجاح بصيغة CSV', 'success');
        closeModal('exportModal');
    } catch (error) {
        console.error('خطأ في تصدير CSV:', error);
        showNotification('❌ فشل في تصدير البيانات بصيغة CSV', 'error');
    }
}

// دالة مساعدة لتحميل ملف CSV
function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // التحقق من صحة هيكل البيانات
            if (!importedData || (typeof importedData !== 'object')) {
                throw new Error('ملف غير صالح');
            }
            
            // معالجة البيانات المستوردة
            let importedCustomers = [];
            let importedSales = [];
            let importedSettings = settings;
            
            if (Array.isArray(importedData)) {
                // إذا كان الملف يحتوي على مصفوفة مباشرة (نسخة قديمة)
                importedCustomers = importedData.filter(item => item.phone);
                importedSales = importedData.filter(item => item.amount);
            } else if (importedData.customers || importedData.sales) {
                // إذا كان الملف يحتوي على هيكل منظم
                importedCustomers = Array.isArray(importedData.customers) ? importedData.customers : [];
                importedSales = Array.isArray(importedData.sales) ? importedData.sales : [];
                if (importedData.settings) {
                    importedSettings = { ...settings, ...importedData.settings };
                }
            } else {
                throw new Error('هيكل البيانات غير معروف');
            }
            
            // تنظيف وتجهيز البيانات
            importedCustomers = cleanImportedCustomers(importedCustomers);
            importedSales = cleanImportedSales(importedSales);
            
            // دمج البيانات الجديدة مع الحالية
            customers = [...customers, ...importedCustomers];
            sales = [...sales, ...importedSales];
            settings = importedSettings;
            
            // حفظ البيانات
            saveData().then(() => {
                // تحديث الواجهة
                renderCustomers();
                renderSales();
                updateDashboard();
                updateCharts();
                updateAIInsights();
                
                showNotification(`تم استيراد ${importedCustomers.length} عميل و ${importedSales.length} عملية بيع بنجاح!`, 'success');
                console.log('✅ استيراد ناجح:', {
                    customers: importedCustomers.length,
                    sales: importedSales.length
                });
            });
            
        } catch (error) {
            console.error('❌ خطأ في استيراد البيانات:', error);
            showNotification('خطأ في استيراد الملف: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('خطأ في قراءة الملف', 'error');
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            let importedCustomers = [];
            let importedSales = [];
            
            // معالجة ورقة العملاء
            if (workbook.Sheets['العملاء']) {
                const customersData = XLSX.utils.sheet_to_json(workbook.Sheets['العملاء']);
                importedCustomers = customersData.map(row => ({
                    id: generateId(),
                    name: row['الاسم'] || '',
                    phone: String(row['رقم الهاتف'] || ''),
                    email: row['البريد الإلكتروني'] || '',
                    status: row['الحالة'] === 'نشط' ? 'active' : 'inactive',
                    createdAt: row['تاريخ الإضافة'] || new Date().toISOString().split('T')[0],
                    notes: row['ملاحظات'] || '',
                    lastContact: new Date().toISOString().split('T')[0]
                })).filter(customer => customer.name && customer.phone); // تصفية البيانات الفارغة
            }
            
            // معالجة ورقة المبيعات
            if (workbook.Sheets['المبيعات']) {
                const salesData = XLSX.utils.sheet_to_json(workbook.Sheets['المبيعات']);
                const allCustomers = [...customers, ...importedCustomers]; // دمج العملاء الحاليين والمستوردين
                
                importedSales = salesData.map(row => {
                    // البحث عن العميل المطابق (بالاسم أو الهاتف)
                    const customerName = row['اسم العميل'] || '';
                    const customer = allCustomers.find(c => 
                        c.name === customerName || 
                        c.phone === String(row['رقم الهاتف'] || '')
                    );
                    
                    return {
                        id: generateId(),
                        customerId: customer ? customer.id : null,
                        customerName: customerName, // حفظ اسم العميل للرجوع إليه
                        amount: parseFloat(row['المبلغ (دينار)']) || 0,
                        date: formatDate(row['التاريخ']) || new Date().toISOString().split('T')[0],
                        description: row['الوصف'] || '',
                        createdAt: new Date().toISOString()
                    };
                }).filter(sale => sale.amount > 0); // استبعاد المبيعات ذات المبلغ صفر
            }
            
            // 🔄 تحديث البيانات في الذاكرة والتخزين
            if (importedCustomers.length > 0) {
                customers = [...customers, ...importedCustomers];
                console.log(`✅ تم استيراد ${importedCustomers.length} عميل`);
            }
            
            if (importedSales.length > 0) {
                sales = [...sales, ...importedSales];
                console.log(`✅ تم استيراد ${importedSales.length} عملية بيع`);
            }
            
            // حفظ البيانات المحدثة
            saveData().then(() => {
                showNotification(`✅ تم استيراد ${importedCustomers.length} عميل و ${importedSales.length} عملية بيع من Excel`, 'success');
                closeModal('importModal');
                
                // تحديث الواجهة
                renderCustomers();
                renderSales();
                updateDashboard();
                updateCharts();
                updateAIInsights();
                
            }).catch(error => {
                console.error('خطأ في حفظ البيانات بعد الاستيراد:', error);
                showNotification('❌ فشل في حفظ البيانات المستوردة', 'error');
            });
            
        } catch (error) {
            console.error('خطأ في استيراد Excel:', error);
            showNotification('❌ فشل في استيراد البيانات من Excel: ' + error.message, 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('❌ خطأ في قراءة الملف', 'error');
    };
    
    reader.readAsArrayBuffer(file);
    event.target.value = ''; // reset input
}

// دالة مساعدة لتنسيق التواريخ
function formatDate(dateInput) {
    if (!dateInput) return null;
    
    try {
        // إذا كان التاريخ كائن Date
        if (dateInput instanceof Date) {
            return dateInput.toISOString().split('T')[0];
        }
        
        // إذا كان سلسلة نصية
        if (typeof dateInput === 'string') {
            // تحويل من صيغة Excel (أرقام متسلسلة)
            if (!isNaN(dateInput) && dateInput > 25568) { // Excel date serial number
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + (dateInput - 1) * 24 * 60 * 60 * 1000);
                return date.toISOString().split('T')[0];
            }
            
            // محاولة تحليل الصيغ الشائعة
            const date = new Date(dateInput);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        return null;
    } catch (error) {
        console.warn('تعذر تنسيق التاريخ:', dateInput, error);
        return null;
    }
}

function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csvText = e.target.result;
            const lines = csvText.split('\n');
            
            if (lines.length < 2) {
                throw new Error('الملف لا يحتوي على بيانات كافية');
            }
            
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            let importedData = [];
            
            // معالجة البيانات
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;
                
                const values = parseCSVLine(lines[i]);
                if (values.length !== headers.length) continue;
                
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index].replace(/^"|"$/g, '');
                });
                importedData.push(row);
            }
            
            // تحديد نوع البيانات (عملاء أو مبيعات)
            if (headers.includes('الاسم') && headers.includes('رقم الهاتف')) {
                // بيانات العملاء
                const importedCustomers = importedData.map(row => ({
                    id: generateId(),
                    name: row['الاسم'] || '',
                    phone: row['رقم الهاتف'] || '',
                    email: row['البريد الإلكتروني'] || '',
                    status: row['الحالة'] === 'نشط' ? 'active' : 'inactive',
                    createdAt: row['تاريخ الإضافة'] || new Date().toISOString().split('T')[0],
                    notes: row['ملاحظات'] || '',
                    lastContact: new Date().toISOString().split('T')[0]
                }));
                
                const existingCustomers = JSON.parse(localStorage.getItem('datavision_customers')) || [];
                const mergedCustomers = [...existingCustomers, ...importedCustomers];
                localStorage.setItem('datavision_customers', JSON.stringify(mergedCustomers));
                
                showNotification(`✅ تم استيراد ${importedCustomers.length} عميل من CSV`, 'success');
                
            } else if (headers.includes('اسم العميل') && headers.includes('المبلغ (دينار)')) {
                // بيانات المبيعات
                const existingCustomers = JSON.parse(localStorage.getItem('datavision_customers')) || [];
                const importedSales = importedData.map(row => {
                    const customer = existingCustomers.find(c => c.name === row['اسم العميل']);
                    
                    return {
                        id: generateId(),
                        customerId: customer ? customer.id : null,
                        amount: parseFloat(row['المبلغ (دينار)']) || 0,
                        date: row['التاريخ'] || new Date().toISOString().split('T')[0],
                        description: row['الوصف'] || '',
                        createdAt: new Date().toISOString()
                    };
                }).filter(sale => sale.customerId !== null);
                
                const existingSales = JSON.parse(localStorage.getItem('datavision_sales')) || [];
                const mergedSales = [...existingSales, ...importedSales];
                localStorage.setItem('datavision_sales', JSON.stringify(mergedSales));
                
                showNotification(`✅ تم استيراد ${importedSales.length} عملية بيع من CSV`, 'success');
            } else {
                throw new Error('تنسيق CSV غير معروف');
            }
            
            closeModal('importModal');
            
            // تحديث الواجهة
            setTimeout(() => {
                if (typeof loadCustomers === 'function') loadCustomers();
                if (typeof loadSales === 'function') loadSales();
                if (typeof updateDashboard === 'function') updateDashboard();
            }, 500);
            
        } catch (error) {
            console.error('خطأ في استيراد CSV:', error);
            showNotification('❌ فشل في استيراد البيانات من CSV', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ============ وظائف مساعدة للاستيراد والتصدير ============

// دالة تحليل سطور CSV
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// دالة إنشاء معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function cleanImportedCustomers(customersArray) {
    return customersArray.map(customer => {
        return {
            id: customer.id || 'c_' + Date.now() + Math.random(),
            name: customer.name || 'عميل بدون اسم',
            phone: customer.phone || '0000000000',
            email: customer.email || '',
            status: customer.status || 'active',
            notes: customer.notes || '',
            createdAt: customer.createdAt || new Date().toISOString()
        };
    }).filter(customer => customer.name && customer.phone);
}

function cleanImportedSales(salesArray) {
    return salesArray.map(sale => {
        return {
            id: sale.id || 's_' + Date.now() + Math.random(),
            customerId: sale.customerId || sale.customer_id || '',
            amount: parseFloat(sale.amount) || 0,
            date: sale.date || sale.sale_date || new Date().toISOString().split('T')[0],
            description: sale.description || '',
            createdAt: sale.createdAt || new Date().toISOString()
        };
    }).filter(sale => sale.customerId && sale.amount > 0);
}

function clearAllData() {
    if (!confirm('⚠️ هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء!')) {
        return;
    }
    
    customers = [];
    sales = [];
    settings = { defaultMessage: 'مرحباً {name}، شكراً لاختيارك Data Vision!' };
    
    saveData().then(() => {
        renderCustomers();
        renderSales();
        updateDashboard();
        updateCharts();
        updateAIInsights();
        showNotification('تم مسح جميع البيانات بنجاح', 'success');
    });
}

function saveDefaultMessage() {
    const message = document.getElementById('defaultMessage').value;
    settings.defaultMessage = message;
    saveData();
    showNotification('تم حفظ قالب الرسالة بنجاح!', 'success');
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

// ============ دوال العرض الأساسية المفقودة ============

function renderCustomers() {
    console.log('🔄 عرض العملاء:', customers.length);
    const container = document.getElementById('customersContainer');
    if (!container) return;
    
    if (customers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>لا يوجد عملاء حتى الآن</p>
                <button class="btn btn-primary" onclick="document.getElementById('customerModal').style.display='block'">
                    إضافة أول عميل
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = customers.map(customer => {
        const purchases = getCustomerPurchases(customer.id);
        return `
            <div class="customer-card">
                <div class="customer-info">
                    <h3>${customer.name}</h3>
                    <p>📱 ${customer.phone}</p>
                    ${customer.email ? `<p>📧 ${customer.email}</p>` : ''}
                    <p>الحالة: <span class="status ${customer.status}">${customer.status === 'active' ? 'نشط' : 'غير نشط'}</span></p>
                    ${purchases.count > 0 ? `<p>🛒 ${purchases.count} عملية شراء (${purchases.total.toFixed(2)} دينار)</p>` : ''}
                    ${customer.notes ? `<p>📝 ${customer.notes}</p>` : ''}
                </div>
                <div class="customer-actions">
                    <button class="btn btn-primary" onclick="sendWhatsApp('${customer.id}')">
                        💬 واتساب
                    </button>
                    <button class="btn btn-secondary" onclick="editCustomer('${customer.id}')">
                        ✏️ تعديل
                    </button>
                    <button class="btn btn-danger" onclick="deleteCustomer('${customer.id}')">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderSales() {
    console.log('🔄 عرض المبيعات:', sales.length);
    const container = document.getElementById('salesContainer');
    if (!container) return;
    
    if (sales.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>لا توجد مبيعات حتى الآن</p>
                <button class="btn btn-primary" onclick="document.getElementById('saleModal').style.display='block'">
                    إضافة أول عملية بيع
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sales.map(sale => {
        const customer = customers.find(c => c.id === sale.customerId || c.id === sale.customer_id);
        return `
            <div class="sale-card">
                <div class="sale-info">
                    <h3>💰 ${parseFloat(sale.amount).toFixed(2)} دينار</h3>
                    <p>👤 ${customer ? customer.name : 'عميل غير معروف'}</p>
                    <p>📅 ${sale.date || sale.sale_date}</p>
                    ${sale.description ? `<p>📝 ${sale.description}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    editingCustomerId = id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerStatus').value = customer.status;
    document.getElementById('customerNotes').value = customer.notes || '';
    
    document.getElementById('customerModal').style.display = 'block';
}

// ============ دوال المساعد AI المفقودة ============

function addMessageToChat(message, type) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    messageDiv.innerHTML = `
        <div class="message-avatar">${type === 'user' ? '👤' : '🤖'}</div>
        <div class="message-content">
            <div class="message-text">${message}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendFreeMessage() {
    const inputField = document.getElementById('assistantInput');
    if (!inputField) return;
    
    const message = inputField.value.trim();
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addMessageToChat(message, 'user');
    inputField.value = '';
    
    // عرض مؤشر الكتابة
    showTypingIndicator();
    
    // محاكاة رد المساعد
    setTimeout(() => {
        hideTypingIndicator();
        
        let response = '';
        if (message.includes('تحليل') || message.includes('تحليلات')) {
            response = analyzeBusinessDataSync();
        } else if (message.includes('عملاء') || message.includes('زبائن')) {
            response = `لديك ${customers.length} عميل (${customers.filter(c => c.status === 'active').length} نشطين)`;
        } else if (message.includes('مبيعات') || message.includes('بيع')) {
            const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            response = `إجمالي المبيعات: ${totalSales.toFixed(2)} دينار من ${sales.length} عملية بيع`;
        } else {
            response = `يمكنني مساعدتك في تحليل بيانات العملاء والمبيعات. اسألني عن:\n• عدد العملاء والمبيعات\n• تحليلات الأعمال\n• التوصيات والإحصائيات`;
        }
        
        addMessageToChat(response, 'ai');
    }, 1500);
}

function analyzeBusinessDataSync() {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    const avgSale = sales.length > 0 ? totalSales / sales.length : 0;
    
    let analysis = `📊 **تحليل الأعمال الحالي:**\n\n`;
    analysis += `👥 **العملاء:** ${totalCustomers} عميل (${activeCustomers} نشط)\n`;
    analysis += `💰 **إجمالي المبيعات:** ${totalSales.toFixed(2)} دينار\n`;
    analysis += `📈 **متوسط البيع:** ${avgSale.toFixed(2)} دينار\n\n`;
    
    if (totalCustomers < 10) {
        analysis += `💡 **توصية:** ركز على جذب المزيد من العملاء\n`;
    }
    
    if (activeCustomers / totalCustomers < 0.7) {
        analysis += `💡 **توصية:** انتبه لنسبة العملاء النشطين\n`;
    }
    
    if (sales.length === 0) {
        analysis += `💡 **توصية:** ابدأ بتسجيل عمليات البيع\n`;
    }
    
    return analysis;
}

// ============ التهيئة التلقائية ============

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Data Vision - جاهز للعمل!');
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
window.openExportModal = openExportModal;
window.openImportModal = openImportModal;
window.exportData = exportData;
window.importData = importData;
window.exportToExcel = exportToExcel;
window.exportToCSV = exportToCSV;
window.importFromExcel = importFromExcel;
window.importFromCSV = importFromCSV;
window.clearAllData = clearAllData;
window.saveDefaultMessage = saveDefaultMessage;
window.renderCustomers = renderCustomers;
window.renderSales = renderSales;
window.editCustomer = editCustomer;
