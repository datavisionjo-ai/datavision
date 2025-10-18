// Customer-and-sales-management.js - معدل كامل
function renderCustomers() {
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

    customers.forEach(customer => {
        if (!customer) return;
        
        const purchases = getCustomerPurchases(customer.id);
        
        const card = document.createElement('div');
        card.className = `customer-card ${customer.status || 'active'}`;
        card.innerHTML = `
            <div class="customer-header">
                <div>
                    <div class="customer-name">${customer.name || 'عميل بدون اسم'}</div>
                    <div class="customer-info">
                        <div>📱 ${customer.phone || 'لا يوجد رقم'}</div>
                        ${customer.email ? `<div>📧 ${customer.email}</div>` : ''}
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
                        const saleDate = sale.date || sale.sale_date;
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
                <button class="btn btn-whatsapp" onclick="sendWhatsApp('${customer.id}')" style="padding: 8px 16px; font-size: 14px;">📱 واتساب</button>
                <button class="btn btn-danger" onclick="deleteCustomer('${customer.id}')" style="padding: 8px 16px; font-size: 14px;">🗑️ حذف</button>
            </div>
        `;
        container.appendChild(card);
    });
}

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

function openAddCustomerModal() {
    editingCustomerId = null;
    document.getElementById('modalTitle').textContent = 'إضافة عميل جديد';
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerEmail').value = '';
    document.getElementById('customerStatus').value = 'active';
    document.getElementById('customerNotes').value = '';
    document.getElementById('customerModal').classList.add('active');
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    editingCustomerId = id;
    document.getElementById('modalTitle').textContent = 'تعديل بيانات العميل';
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerStatus').value = customer.status;
    document.getElementById('customerNotes').value = customer.notes || '';
    document.getElementById('customerModal').classList.add('active');
}

function saveCustomer(e) {
    e.preventDefault();

    const customer = {
        id: editingCustomerId || 'c_' + Date.now(),
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        email: document.getElementById('customerEmail').value,
        status: document.getElementById('customerStatus').value,
        notes: document.getElementById('customerNotes').value,
        createdAt: new Date().toISOString()
    };

    if (editingCustomerId) {
        const index = customers.findIndex(c => c.id === editingCustomerId);
        customers[index] = { ...customers[index], ...customer };
        showNotification('تم تحديث بيانات العميل بنجاح!', 'success');
    } else {
        customers.push(customer);
        showNotification('تم إضافة العميل بنجاح!', 'success');
    }

    saveData();
    renderCustomers();
    updateDashboard();
    updateCharts();
    closeModal('customerModal');
}

function deleteCustomer(id) {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

    customers = customers.filter(c => c.id !== id);
    sales = sales.filter(s => s.customerId !== id);
    
    saveData();
    renderCustomers();
    renderSales();
    updateDashboard();
    updateCharts();
    showNotification('تم حذف العميل بنجاح!', 'success');
}

function openSaleModal(customerId) {
    document.getElementById('saleCustomerId').value = customerId;
    document.getElementById('saleAmount').value = '';
    document.getElementById('saleDate').valueAsDate = new Date();
    document.getElementById('saleDescription').value = '';
    document.getElementById('saleModal').classList.add('active');
}

function saveSale(e) {
    e.preventDefault();

    const sale = {
        id: 's_' + Date.now(),
        customerId: document.getElementById('saleCustomerId').value,
        amount: document.getElementById('saleAmount').value,
        date: document.getElementById('saleDate').value,
        description: document.getElementById('saleDescription').value,
        createdAt: new Date().toISOString()
    };

    sales.push(sale);
    saveData();
    renderSales();
    renderCustomers();
    updateDashboard();
    updateCharts();
    closeModal('saleModal');
    showNotification('تم إضافة عملية البيع بنجاح!', 'success');
}

function renderSales() {
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

    const sortedSales = [...sales].sort((a, b) => new Date(b.date || b.sale_date) - new Date(a.date || a.sale_date));

    sortedSales.forEach(sale => {
        if (!sale) return;
        
        const customer = customers.find(c => c.id === (sale.customerId || sale.customer_id));
        const item = document.createElement('div');
        item.className = 'sale-item';
        item.innerHTML = `
            <div class="sale-header">
                <div>
                    <div style="font-weight: bold; color: var(--dark); margin-bottom: 5px;">
                        ${customer ? customer.name : 'عميل محذوف'}
                    </div>
                    <div class="sale-date">${new Date(sale.date || sale.sale_date).toLocaleDateString('ar-JO', { 
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

function getCustomerPurchases(customerId) {
    if (!sales || !Array.isArray(sales)) {
        return { sales: [], count: 0, total: 0 };
    }
    
    const customerSales = sales.filter(s => {
        if (!s) return false;
        return s.customer_id === customerId || s.customerId === customerId;
    });
    
    const totalAmount = customerSales.reduce((sum, sale) => {
        return sum + parseFloat(sale.amount || 0);
    }, 0);
    
    return {
        sales: customerSales,
        count: customerSales.length,
        total: totalAmount
    };
}

function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendFreeMessage();
    }
}

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
window.addMessageToChat = addMessageToChat;
window.handleKeyPress = handleKeyPress;
