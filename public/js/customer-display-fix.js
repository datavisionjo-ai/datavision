// customer-display-fix.js - إصلاح عرض العملاء والمبيعات
class CustomerDisplayFix {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        await this.waitForSystem();
        this.initialized = true;
        console.log('👥 نظام عرض العملاء جاهز');
    }

    async waitForSystem() {
        return new Promise((resolve) => {
            const checkSystem = () => {
                if (window.unifiedDataSystem && window.unifiedDataSystem.isInitialized) {
                    resolve();
                } else {
                    setTimeout(checkSystem, 100);
                }
            };
            checkSystem();
        });
    }

    // 👥 عرض العملاء
    async renderCustomers() {
        await this.initialize();
        
        const container = document.getElementById('customersList');
        if (!container) {
            console.error('❌ حاوية العملاء غير موجودة');
            return;
        }

        const customers = unifiedDataSystem.customers;
        
        if (!customers || customers.length === 0) {
            container.innerHTML = this.getEmptyState('عملاء');
            return;
        }

        container.innerHTML = customers.map(customer => 
            this.createCustomerCard(customer)
        ).join('');

        console.log(`✅ تم عرض ${customers.length} عميل`);
    }

    createCustomerCard(customer) {
        const purchases = unifiedDataSystem.getCustomerPurchases(customer.id);
        
        return `
            <div class="customer-card">
                <div class="customer-header">
                    <h3>${customer.name}</h3>
                    <span class="status ${customer.status}">
                        ${customer.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                </div>
                
                <div class="customer-details">
                    <p>📱 ${customer.phone}</p>
                    ${customer.email ? `<p>📧 ${customer.email}</p>` : ''}
                    <p>📍 ${customer.governorate}</p>
                    ${customer.notes ? `<p>📝 ${customer.notes}</p>` : ''}
                </div>

                <div class="purchases-info">
                    <strong>المشتريات: ${purchases.count} عملية (${purchases.total.toFixed(2)} دينار)</strong>
                </div>

                <div class="customer-actions">
                    <button class="btn btn-primary" onclick="customerDisplayFix.editCustomer('${customer.id}')">
                        ✏️ تعديل
                    </button>
                    <button class="btn btn-success" onclick="customerDisplayFix.openSaleModal('${customer.id}')">
                        💰 إضافة بيع
                    </button>
                    <button class="btn btn-whatsapp" onclick="customerDisplayFix.sendWhatsApp('${customer.phone}')">
                        📱 واتساب
                    </button>
                    <button class="btn btn-danger" onclick="customerDisplayFix.deleteCustomer('${customer.id}')">
                        🗑️ حذف
                    </button>
                </div>
            </div>
        `;
    }

    // 💰 عرض المبيعات
    async renderSales() {
        await this.initialize();
        
        const container = document.getElementById('salesList');
        if (!container) return;

        const sales = unifiedDataSystem.sales;
        
        if (!sales || sales.length === 0) {
            container.innerHTML = this.getEmptyState('مبيعات');
            return;
        }

        const sortedSales = [...sales].sort((a, b) => 
            new Date(b.sale_date) - new Date(a.sale_date)
        );

        container.innerHTML = sortedSales.map(sale => 
            this.createSaleItem(sale)
        ).join('');

        console.log(`✅ تم عرض ${sales.length} عملية بيع`);
    }

    createSaleItem(sale) {
        const customer = unifiedDataSystem.customers.find(c => c.id === sale.customer_id);
        
        return `
            <div class="sale-item">
                <div class="sale-header">
                    <div>
                        <div class="sale-customer">${customer ? customer.name : 'عميل محذوف'}</div>
                        <div class="sale-date">
                            ${new Date(sale.sale_date).toLocaleDateString('ar-JO')}
                        </div>
                    </div>
                    <div class="sale-amount">${parseFloat(sale.amount).toFixed(2)} دينار</div>
                </div>
                ${sale.description ? `<div class="sale-desc">${sale.description}</div>` : ''}
            </div>
        `;
    }

    getEmptyState(type) {
        return `
            <div class="empty-state">
                <p>لا يوجد ${type} حتى الآن</p>
                <button class="btn btn-primary" onclick="openAddCustomerModal()">
                    إضافة أول ${type}
                </button>
            </div>
        `;
    }

    // 🛠️ دوال المساعدة
    async editCustomer(id) {
        const customer = unifiedDataSystem.customers.find(c => c.id === id);
        if (!customer) return;

        // تعبئة النموذج
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('customerGovernorate').value = customer.governorate || '';
        document.getElementById('customerStatus').value = customer.status;
        document.getElementById('customerNotes').value = customer.notes || '';
        
        // فتح النافذة
        document.getElementById('customerModal').classList.add('active');
        
        // حفظ معرف العميل للتعديل
        this.editingCustomerId = id;
    }

    async deleteCustomer(id) {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
        
        await unifiedDataSystem.deleteCustomer(id);
        await this.renderCustomers();
        await this.renderSales();
        governorateFix.updateFullDashboard();
        
        showNotification('تم حذف العميل بنجاح', 'success');
    }

    sendWhatsApp(phone) {
        const message = encodeURIComponent('مرحباً! كيف يمكنني مساعدتك؟');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }

    openSaleModal(customerId) {
        document.getElementById('saleCustomerId').value = customerId;
        document.getElementById('saleModal').classList.add('active');
    }
}

// إنشاء النسخة العالمية
window.customerDisplayFix = new CustomerDisplayFix();
