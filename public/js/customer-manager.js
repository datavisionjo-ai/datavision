class CustomerManager {
    constructor() {
        this.editingCustomerId = null;
    }

    // عرض العملاء
    renderCustomers() {
        const container = document.getElementById('customersList');
        if (!container) return;

        const customers = dataManager.customers;
        
        if (customers.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        container.innerHTML = customers.map(customer => 
            this.createCustomerCard(customer)
        ).join('');

        console.log(`✅ تم عرض ${customers.length} عميل`);
    }

    createCustomerCard(customer) {
        const purchases = dataManager.getCustomerPurchases(customer.id);
        
        return `
            <div class="customer-card">
                <div class="customer-header">
                    <div class="customer-info">
                        <h3>${customer.name}</h3>
                        <p>📱 ${customer.phone}</p>
                        ${customer.email ? `<p>📧 ${customer.email}</p>` : ''}
                        <p>📍 ${customer.governorate}</p>
                        <p>الحالة: <span class="status ${customer.status}">${customer.status === 'active' ? 'نشط' : 'غير نشط'}</span></p>
                        ${customer.notes ? `<p>📝 ${customer.notes}</p>` : ''}
                    </div>
                </div>

                <div class="purchases-summary">
                    <strong>🛒 ${purchases.count} عملية شراء (${purchases.total.toFixed(2)} دينار)</strong>
                </div>

                <div class="customer-actions">
                    <button class="btn btn-primary" onclick="customerManager.editCustomer('${customer.id}')">
                        ✏️ تعديل
                    </button>
                    <button class="btn btn-success" onclick="customerManager.openSaleModal('${customer.id}')">
                        💰 إضافة بيع
                    </button>
                    <button class="btn btn-whatsapp" onclick="customerManager.sendWhatsApp('${customer.phone}')">
                        📱 واتساب
                    </button>
                    <button class="btn btn-danger" onclick="customerManager.deleteCustomer('${customer.id}')">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <p>لا يوجد عملاء حتى الآن</p>
                <button class="btn btn-primary" onclick="customerManager.openAddCustomerModal()">
                    ➕ إضافة أول عميل
                </button>
            </div>
        `;
    }

    // فتح نافذة إضافة عميل
    openAddCustomerModal() {
        this.editingCustomerId = null;
        document.getElementById('modalTitle').textContent = 'إضافة عميل جديد';
        this.resetCustomerForm();
        document.getElementById('customerModal').classList.add('active');
    }

    // تعديل عميل
    async editCustomer(customerId) {
        const customer = dataManager.customers.find(c => c.id === customerId);
        if (!customer) return;

        this.editingCustomerId = customerId;
        document.getElementById('modalTitle').textContent = 'تعديل بيانات العميل';
        
        // تعبئة النموذج
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerGovernorate').value = customer.governorate || '';
        document.getElementById('customerStatus').value = customer.status;
        document.getElementById('customerNotes').value = customer.notes || '';
        
        document.getElementById('customerModal').classList.add('active');
    }

    resetCustomerForm() {
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerEmail').value = '';
        document.getElementById('customerGovernorate').value = '';
        document.getElementById('customerStatus').value = 'active';
        document.getElementById('customerNotes').value = '';
    }

    // حفظ العميل
    async saveCustomer(e) {
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
            if (this.editingCustomerId) {
                await dataManager.updateCustomer(this.editingCustomerId, customerData);
                showNotification('تم تحديث بيانات العميل بنجاح!', 'success');
            } else {
                await dataManager.addCustomer(customerData);
                showNotification('تم إضافة العميل بنجاح!', 'success');
            }

            // إغلاق النافذة وتحديث البيانات
            document.getElementById('customerModal').classList.remove('active');
            this.renderCustomers();
            dashboardSystem.updateDashboard();

        } catch (error) {
            showNotification('خطأ في حفظ العميل: ' + error.message, 'error');
        }
    }

    // حذف عميل
    async deleteCustomer(customerId) {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

        try {
            await dataManager.deleteCustomer(customerId);
            this.renderCustomers();
            salesManager.renderSales();
            dashboardSystem.updateDashboard();
            showNotification('تم حذف العميل بنجاح!', 'success');
        } catch (error) {
            showNotification('خطأ في حذف العميل: ' + error.message, 'error');
        }
    }

    // إرسال واتساب
    sendWhatsApp(phone) {
        const message = encodeURIComponent('مرحباً! كيف يمكنني مساعدتك؟');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }

    // فتح نافذة إضافة بيع
    openSaleModal(customerId) {
        document.getElementById('saleCustomerId').value = customerId;
        document.getElementById('saleDate').valueAsDate = new Date();
        document.getElementById('saleModal').classList.add('active');
    }
}
