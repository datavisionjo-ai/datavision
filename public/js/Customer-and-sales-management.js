// Customer-and-sales-management.js - معدل للعمل مع API
let customers = [];
let sales = [];
let editingCustomerId = null;

// 🔄 تهيئة البيانات من السيرفر
async function initializeData() {
    try {
        console.log('🔄 جاري تحميل البيانات من السيرفر...');
        
        // تحميل العملاء من API
        customers = await getCustomers();
        console.log('✅ تم تحميل العملاء:', customers.length);
        
        // تحميل المبيعات من API
        sales = await getSales();
        console.log('✅ تم تحميل المبيعات:', sales.length);
        
        // عرض البيانات
        renderCustomers();
        renderSales();
        updateDashboard();
        updateCharts();
        updateGovernorateAnalysis();
        updateAdvancedAnalytics();
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

// 👥 عرض العملاء - معدل
async function renderCustomers() {
    const container = document.getElementById('customersList');
    if (!container) {
        console.error('❌ عنصر customersList غير موجود');
        return;
    }
    
    container.innerHTML = '';

    if (!customers || customers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">لا يوجد عملاء حتى الآن. قم بإضافة عميل جديد!</p>';
        return;
    }

    // تحميل المبيعات لكل عميل
    for (const customer of customers) {
        if (!customer) continue;
        
        const purchases = await getCustomerPurchases(customer.id);
        
        const card = document.createElement('div');
        card.className = `customer-card ${customer.status || 'active'}`;
        card.innerHTML = `
            <div class="customer-header">
                <div>
                    <div class="customer-name">${customer.name || 'عميل بدون اسم'}</div>
                    <div class="customer-info">
                        <div>📱 ${customer.phone || 'لا يوجد رقم'}</div>
                        ${customer.email ? `<div>📧 ${customer.email}</div>` : ''}
                        <div>📍 ${customer.governorate || 'غير محدد'}</div>
                        ${customer.notes ? `<div>📝 ${customer.notes}</div>` : ''}
                    </div>
                </div>
                <span class="customer-status status-${customer.status || 'active'}">
                    ${(customer.status === 'active') ? '✓ نشط' : '⚠ غير نشط'}
                </span>
            </div>
            
            ${purchases.count > 0 ? `
            <div style="margin: 15px 0; padding: 12px; background: linear-gradient(135deg, var(--dark-700) 0%, var(--dark-600) 100%); border-radius: 8px; border-right: 3px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: var(--primary);">💰 سجل المشتريات (${purchases.count})</strong>
                    <strong style="color: var(--success);">${purchases.total.toFixed(2)} دينار</strong>
                </div>
                <div id="purchases-${customer.id}" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
                    ${purchases.sales.map(sale => {
                        const saleDate = sale.sale_date || sale.date;
                        const saleAmount = parseFloat(sale.amount || 0);
                        const saleDesc = sale.description || '';
                        
                        return `
                        <div style="padding: 8px; margin: 5px 0; background: var(--dark-600); border-radius: 6px; border: 1px solid var(--border);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);">
                                        📅 ${saleDate ? new Date(saleDate).toLocaleDateString('ar-JO', { year: 'numeric', month: 'short', day: 'numeric' }) : 'تاريخ غير محدد'}
                                    </div>
                                    ${saleDesc ? `<div style="font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 3px;">${saleDesc}</div>` : ''}
                                </div>
                                <div style="font-weight: bold; color: var(--success);">${saleAmount.toFixed(2)} دينار</div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
                <button onclick="togglePurchases('${customer.id}')" style="margin-top: 8px; padding: 6px 12px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--dark); border: none; border-radius: 6px; cursor: pointer; font-size: 13px; width: 100%; font-weight: 600; transition: all 0.3s ease;">
                    <span id="toggle-text-${customer.id}">عرض المشتريات ▼</span>
                </button>
            </div>
            ` : '<div style="padding: 10px; color: rgba(255,255,255,0.5); text-align: center; font-size: 14px;">لا توجد مشتريات بعد</div>'}
            
            <div class="customer-actions">
                <button class="btn btn-primary" onclick="editCustomer('${customer.id}')" style="padding: 8px 16px; font-size: 14px;">✏️ تعديل</button>
                <button class="btn btn-success" onclick="openSaleModal('${customer.id}')" style="padding: 8px 16px; font-size: 14px;">💰 إضافة بيع</button>
                <button class="btn btn-whatsapp" onclick="sendWhatsApp('${customer.phone}')" style="padding: 8px 16px; font-size: 14px;">📱 واتساب</button>
                <button class="btn btn-danger" onclick="deleteCustomer('${customer.id}')" style="padding: 8px 16px; font-size: 14px;">🗑️ حذف</button>
            </div>
        `;
        container.appendChild(card);
    }
}

// 🔍 الحصول على مشتريات العميل من API
async function getCustomerPurchases(customerId) {
    try {
        if (!sales || !Array.isArray(sales)) {
            return { sales: [], count: 0, total: 0 };
        }
        
        const customerSales = sales.filter(s => {
            if (!s) return false;
            return s.customer_id == customerId;
        });
        
        const totalAmount = customerSales.reduce((sum, sale) => {
            return sum + parseFloat(sale.amount || 0);
        }, 0);
        
        return {
            sales: customerSales,
            count: customerSales.length,
            total: totalAmount
        };
    } catch (error) {
        console.error('❌ خطأ في جلب مشتريات العميل:', error);
        return { sales: [], count: 0, total: 0 };
    }
}

// ➕ فتح نافذة إضافة عميل
function openAddCustomerModal() {
    editingCustomerId = null;
    document.getElementById('modalTitle').textContent = 'إضافة عميل جديد';
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerGovernorate').value = '';
    document.getElementById('customerStatus').value = 'active';
    document.getElementById('customerNotes').value = '';
    document.getElementById('customerModal').classList.add('active');
}

// ✏️ تعديل عميل
function editCustomer(id) {
    const customer = customers.find(c => c.id == id);
    if (!customer) return;

    editingCustomerId = id;
    document.getElementById('modalTitle').textContent = 'تعديل بيانات العميل';
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerGovernorate').value = customer.governorate || '';
    document.getElementById('customerStatus').value = customer.status;
    document.getElementById('customerNotes').value = customer.notes || '';
    document.getElementById('customerModal').classList.add('active');
}

// 💾 حفظ عميل - معدل للعمل مع API
async function saveCustomer(e) {
    e.preventDefault();

    const customerData = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        governorate: document.getElementById('customerGovernorate').value,
        status: document.getElementById('customerStatus').value,
        notes: document.getElementById('customerNotes').value
    };

    try {
        if (editingCustomerId) {
            // تحديث عميل موجود
            await updateCustomer(editingCustomerId, customerData);
            showNotification('تم تحديث بيانات العميل بنجاح!', 'success');
        } else {
            // إضافة عميل جديد
            await addCustomer(customerData);
            showNotification('تم إضافة العميل بنجاح!', 'success');
        }

        // إعادة تحميل البيانات
        await initializeData();
        closeModal('customerModal');

    } catch (error) {
        console.error('❌ خطأ في حفظ العميل:', error);
        showNotification('خطأ في حفظ بيانات العميل: ' + error.message, 'error');
    }
}

// 🗑️ حذف عميل - معدل للعمل مع API
async function deleteCustomer(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

    try {
        await deleteCustomerAPI(id);
        showNotification('تم حذف العميل بنجاح!', 'success');
        
        // إعادة تحميل البيانات
        await initializeData();
        
    } catch (error) {
        console.error('❌ خطأ في حذف العميل:', error);
        showNotification('خطأ في حذف العميل: ' + error.message, 'error');
    }
}

// 💰 فتح نافذة إضافة بيع
function openSaleModal(customerId) {
    document.getElementById('saleCustomerId').value = customerId;
    document.getElementById('saleAmount').value = '';
    document.getElementById('saleDate').valueAsDate = new Date();
    document.getElementById('saleDescription').value = '';
    document.getElementById('saleModal').classList.add('active');
}

// 💾 حفظ بيع - معدل للعمل مع API
async function saveSale(e) {
    e.preventDefault();

    const saleData = {
        customer_id: document.getElementById('saleCustomerId').value,
        amount: document.getElementById('saleAmount').value,
        sale_date: document.getElementById('saleDate').value,
        description: document.getElementById('saleDescription').value
    };

    try {
        await addSale(saleData);
        showNotification('تم إضافة عملية البيع بنجاح!', 'success');
        
        // إعادة تحميل البيانات
        await initializeData();
        closeModal('saleModal');

    } catch (error) {
        console.error('❌ خطأ في إضافة البيع:', error);
        showNotification('خطأ في إضافة عملية البيع: ' + error.message, 'error');
    }
}

// 📋 عرض المبيعات - معدل
async function renderSales() {
    const container = document.getElementById('salesList');
    if (!container) {
        console.error('❌ عنصر salesList غير موجود');
        return;
    }
    
    container.innerHTML = '';

    if (!sales || sales.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">لا توجد مبيعات حتى الآن.</p>';
        return;
    }

    const sortedSales = [...sales].sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

    sortedSales.forEach(sale => {
        if (!sale) return;
        
        const customer = customers.find(c => c.id == sale.customer_id);
        const item = document.createElement('div');
        item.className = 'sale-item';
        item.innerHTML = `
            <div class="sale-header">
                <div>
                    <div style="font-weight: bold; color: var(--dark); margin-bottom: 5px;">
                        ${customer ? customer.name : 'عميل محذوف'}
                    </div>
                    <div class="sale-date">${new Date(sale.sale_date).toLocaleDateString('ar-JO', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</div>
                </div>
                <div class="sale-amount">${parseFloat(sale.amount || 0).toFixed(2)} دينار</div>
            </div>
            ${sale.description ? `<div style="color: #6b7280; margin-top: 8px;">${sale.description}</div>` : ''}
        `;
        container.appendChild(item);
    });
}

// 📍 تحديث تحليل المحافظات - معدل
function updateGovernorateAnalysis() {
    const governorateStats = document.getElementById('governorateStats');
    if (!governorateStats) {
        console.error('❌ عنصر governorateStats غير موجود');
        return;
    }

    // تجميع البيانات حسب المحافظات
    const governorateData = {};
    
    customers.forEach(customer => {
        const gov = customer.governorate || 'غير محدد';
        if (!governorateData[gov]) {
            governorateData[gov] = {
                customers: 0,
                activeCustomers: 0,
                sales: 0,
                totalSales: 0
            };
        }
        
        governorateData[gov].customers++;
        if (customer.status === 'active') {
            governorateData[gov].activeCustomers++;
        }
    });

    // حساب المبيعات لكل محافظة
    sales.forEach(sale => {
        const customer = customers.find(c => c.id == sale.customer_id);
        if (customer) {
            const gov = customer.governorate || 'غير محدد';
            if (governorateData[gov]) {
                governorateData[gov].sales++;
                governorateData[gov].totalSales += parseFloat(sale.amount || 0);
            }
        }
    });

    // عرض البيانات
    governorateStats.innerHTML = '';
    
    const sortedGovernorates = Object.entries(governorateData)
        .sort((a, b) => b[1].customers - a[1].customers);

    if (sortedGovernorates.length === 0) {
        governorateStats.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">لا توجد بيانات للمحافظات حتى الآن.</p>';
        return;
    }

    sortedGovernorates.forEach(([gov, data]) => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        card.style.color = 'white';
        card.innerHTML = `
            <h3 style="color: white; margin-bottom: 15px;">📍 ${gov}</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>👥 العملاء:</span>
                    <strong>${data.customers}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>✅ النشطين:</span>
                    <strong>${data.activeCustomers}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>💰 المبيعات:</span>
                    <strong>${data.sales}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <span>💵 الإجمالي:</span>
                    <strong>${data.totalSales.toFixed(2)} د.أ</strong>
                </div>
            </div>
        `;
        governorateStats.appendChild(card);
    });
}

// 📈 تحديث التحليلات المتقدمة - معدل
function updateAdvancedAnalytics() {
    console.log('🔄 تحديث التحليلات المتقدمة...');
    
    // حساب أعلى محافظة مبيعاً
    const salesByGovernorate = {};
    sales.forEach(sale => {
        const customer = customers.find(c => c.id == sale.customer_id);
        if (customer) {
            const gov = customer.governorate || 'غير محدد';
            if (!salesByGovernorate[gov]) {
                salesByGovernorate[gov] = 0;
            }
            salesByGovernorate[gov] += parseFloat(sale.amount || 0);
        }
    });

    const topSalesGov = Object.entries(salesByGovernorate)
        .sort((a, b) => b[1] - a[1])[0];

    if (topSalesGov) {
        document.getElementById('topSalesGovernorate').textContent = topSalesGov[0];
        document.getElementById('topSalesAmount').textContent = `${topSalesGov[1].toFixed(2)} دينار`;
    } else {
        document.getElementById('topSalesGovernorate').textContent = 'لا توجد بيانات';
        document.getElementById('topSalesAmount').textContent = '-';
    }

    // حساب أكثر محافظة عملاء
    const customersByGovernorate = {};
    customers.forEach(customer => {
        const gov = customer.governorate || 'غير محدد';
        customersByGovernorate[gov] = (customersByGovernorate[gov] || 0) + 1;
    });

    const topCustomersGov = Object.entries(customersByGovernorate)
        .sort((a, b) => b[1] - a[1])[0];

    if (topCustomersGov) {
        document.getElementById('topCustomersGovernorate').textContent = topCustomersGov[0];
        document.getElementById('topCustomersCount').textContent = `${topCustomersGov[1]} عميل`;
    } else {
        document.getElementById('topCustomersGovernorate').textContent = 'لا توجد بيانات';
        document.getElementById('topCustomersCount').textContent = '-';
    }

    // حساب متوسط قيمة العميل
    const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    const avgValue = customers.length > 0 ? totalSales / customers.length : 0;
    document.getElementById('avgCustomerValue').textContent = `${avgValue.toFixed(2)} د.أ`;

    // حساب معدل النشاط
    const activeCount = customers.filter(c => c.status === 'active').length;
    const activityRate = customers.length > 0 ? (activeCount / customers.length * 100) : 0;
    document.getElementById('activityRate').textContent = `${activityRate.toFixed(1)}%`;

    console.log('✅ تم تحديث التحليلات المتقدمة');
}

// 🔄 تحديث لوحة التحكم - معدل
function updateDashboard() {
    console.log('🔄 تحديث لوحة التحكم...');
    
    // إجمالي العملاء
    document.getElementById('totalCustomers').textContent = customers.length;
    
    // العملاء النشطين
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    document.getElementById('activeCustomers').textContent = activeCustomers;
    
    // العملاء غير النشطين
    const inactiveCustomers = customers.filter(c => c.status !== 'active').length;
    document.getElementById('inactiveCustomers').textContent = inactiveCustomers;
    
    // إجمالي المبيعات
    const totalSalesAmount = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
    document.getElementById('totalSales').textContent = `${totalSalesAmount.toFixed(2)} دينار`;

    console.log('✅ تم تحديث لوحة التحكم');
}

// 📊 تحديث الرسوم البيانية - معدل
function updateCharts() {
    console.log('🔄 تحديث الرسوم البيانية...');
    
    // تحديث مخطط حالة العملاء
    updateStatusChart();
    
    // تحديث مخطط المحافظات
    updateGovernorateChart();
    
    // تحديث مخطط المبيعات
    updateSalesChart();
    
    // تحديث مخطط المبيعات حسب المحافظة
    updateSalesByGovernorateChart();

    console.log('✅ تم تحديث الرسوم البيانية');
}

// 🎯 دوال مساعدة
function togglePurchases(customerId) {
    const purchasesDiv = document.getElementById(`purchases-${customerId}`);
    const toggleText = document.getElementById(`toggle-text-${customerId}`);
    
    if (purchasesDiv.style.maxHeight === '0px' || purchasesDiv.style.maxHeight === '') {
        purchasesDiv.style.maxHeight = purchasesDiv.scrollHeight + 'px';
        toggleText.textContent = 'إخفاء المشتريات ▲';
    } else {
        purchasesDiv.style.maxHeight = '0px';
        toggleText.textContent = 'عرض المشتريات ▼';
    }
}

function filterCustomers() {
    const search = document.getElementById('customerSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.customer-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(search) ? 'block' : 'none';
    });
}

function sendWhatsApp(phone) {
    if (!phone) {
        showNotification('رقم الهاتف غير متوفر', 'error');
        return;
    }
    
    const message = encodeURIComponent('مرحباً! كيف يمكنني مساعدتك؟');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}
// 📊 مخطط حالة العملاء - جديد
function updateStatusChart() {
    const statusCtx = document.getElementById('statusChart');
    if (!statusCtx) {
        console.log('❌ مخطط الحالة غير موجود');
        return;
    }

    // إحصائيات حالة العملاء
    const statusCounts = {
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status !== 'active').length
    };

    // إنشاء المخطط إذا لم يكن موجوداً
    if (window.statusChartInstance) {
        window.statusChartInstance.destroy();
    }

    window.statusChartInstance = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['نشط', 'غير نشط'],
            datasets: [{
                data: [statusCounts.active, statusCounts.inactive],
                backgroundColor: ['#10b981', '#6b7280'],
                borderWidth: 2,
                borderColor: '#1f2937'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        color: '#f3f4f6',
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'توزيع العملاء حسب الحالة',
                    color: '#f3f4f6',
                    font: {
                        family: 'Cairo, sans-serif',
                        size: 16
                    }
                }
            }
        }
    });
}

// 🗺️ مخطط المحافظات - جديد
function updateGovernorateChart() {
    const govCtx = document.getElementById('governorateChart');
    if (!govCtx) {
        console.log('❌ مخطط المحافظات غير موجود');
        return;
    }

    // تجميع العملاء حسب المحافظة
    const governorateData = {};
    customers.forEach(customer => {
        const gov = customer.governorate || 'غير محدد';
        governorateData[gov] = (governorateData[gov] || 0) + 1;
    });

    const labels = Object.keys(governorateData);
    const data = Object.values(governorateData);

    // إنشاء المخطط
    if (window.govChartInstance) {
        window.govChartInstance.destroy();
    }

    window.govChartInstance = new Chart(govCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'عدد العملاء',
                data: data,
                backgroundColor: '#3b82f6',
                borderColor: '#1d4ed8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'توزيع العملاء حسب المحافظة',
                    color: '#f3f4f6',
                    font: {
                        family: 'Cairo, sans-serif',
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#f3f4f6'
                    },
                    grid: {
                        color: '#374151'
                    }
                },
                x: {
                    ticks: {
                        color: '#f3f4f6'
                    },
                    grid: {
                        color: '#374151'
                    }
                }
            }
        }
    });
}

// 📈 مخطط المبيعات - جديد
function updateSalesChart() {
    const salesCtx = document.getElementById('salesChart');
    if (!salesCtx) {
        console.log('❌ مخطط المبيعات غير موجود');
        return;
    }

    // تجميع المبيعات حسب الشهر
    const monthlySales = {};
    sales.forEach(sale => {
        const date = new Date(sale.sale_date);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlySales[monthYear]) {
            monthlySales[monthYear] = 0;
        }
        monthlySales[monthYear] += parseFloat(sale.amount || 0);
    });

    const labels = Object.keys(monthlySales).sort();
    const data = labels.map(label => monthlySales[label]);

    // إنشاء المخطط
    if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
    }

    window.salesChartInstance = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'المبيعات (دينار)',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6',
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'تطور المبيعات الشهري',
                    color: '#f3f4f6',
                    font: {
                        family: 'Cairo, sans-serif',
                        size: 16
                    }
                },
                legend: {
                    labels: {
                        color: '#f3f4f6',
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#f3f4f6'
                    },
                    grid: {
                        color: '#374151'
                    }
                },
                x: {
                    ticks: {
                        color: '#f3f4f6'
                    },
                    grid: {
                        color: '#374151'
                    }
                }
            }
        }
    });
}

// 💰 مخطط المبيعات حسب المحافظة - جديد
function updateSalesByGovernorateChart() {
    const salesGovCtx = document.getElementById('salesByGovernorateChart');
    if (!salesGovCtx) {
        console.log('❌ مخطط المبيعات حسب المحافظة غير موجود');
        return;
    }

    // تجميع المبيعات حسب المحافظة
    const salesByGovernorate = {};
    sales.forEach(sale => {
        const customer = customers.find(c => c.id == sale.customer_id);
        if (customer) {
            const gov = customer.governorate || 'غير محدد';
            if (!salesByGovernorate[gov]) {
                salesByGovernorate[gov] = 0;
            }
            salesByGovernorate[gov] += parseFloat(sale.amount || 0);
        }
    });

    const labels = Object.keys(salesByGovernorate);
    const data = Object.values(salesByGovernorate);

    // إنشاء المخطط
    if (window.salesGovChartInstance) {
        window.salesGovChartInstance.destroy();
    }

    window.salesGovChartInstance = new Chart(salesGovCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
                ],
                borderWidth: 2,
                borderColor: '#1f2937'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        color: '#f3f4f6',
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'توزيع المبيعات حسب المحافظة',
                    color: '#f3f4f6',
                    font: {
                        family: 'Cairo, sans-serif',
                        size: 16
                    }
                }
            }
        }
    });
}

// جعل الدوال الجديدة متاحة globally
window.updateStatusChart = updateStatusChart;
window.updateGovernorateChart = updateGovernorateChart;
window.updateSalesChart = updateSalesChart;
window.updateSalesByGovernorateChart = updateSalesByGovernorateChart;
// جعل الدوال متاحة globally
window.renderCustomers = renderCustomers;
window.togglePurchases = togglePurchases;
window.filterCustomers = filterCustomers;
window.openAddCustomerModal = openAddCustomerModal;
window.editCustomer = editCustomer;
window.saveCustomer = saveCustomer;
window.deleteCustomer = deleteCustomer;
window.openSaleModal = openSaleModal;
window.saveSale = saveSale;
window.renderSales = renderSales;
window.updateGovernorateAnalysis = updateGovernorateAnalysis;
window.updateAdvancedAnalytics = updateAdvancedAnalytics;
window.updateDashboard = updateDashboard;
window.updateCharts = updateCharts;
window.initializeData = initializeData;
window.sendWhatsApp = sendWhatsApp;

// 🚀 تهيئة البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Customer-and-sales-management.js محمل');
    
    // الانتظار قليلاً لضمان تحميل جميع الملفات
    setTimeout(() => {
        if (typeof getCustomers === 'function' && typeof getSales === 'function') {
            initializeData();
        } else {
            console.error('❌ دوال API غير محملة');
            // إعادة المحاولة بعد ثانية
            setTimeout(() => {
                if (typeof getCustomers === 'function') {
                    initializeData();
                }
            }, 1000);
        }
    }, 500);
});

