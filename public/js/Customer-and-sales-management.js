// super-customer-system.js - نظام متكامل ومتطور لإدارة العملاء والمبيعات
class SuperCustomerSystem {
    constructor() {
        this.customers = [];
        this.sales = [];
        this.settings = {
            defaultMessage: 'مرحباً {name}، شكراً لاختيارك Data Vision!'
        };
        this.charts = {};
        this.analysisData = {};
        
        console.log('🚀 نظام العملاء المتطور جاهز للعمل!');
        this.init();
    }

    // 🔧 التهيئة الأساسية
    async init() {
        try {
            console.log('🔄 بدء تهيئة النظام...');
            
            // تحميل البيانات
            await this.loadData();
            
            // تهيئة الواجهة
            this.initUI();
            
            // تحديث جميع المكونات
            this.updateAllComponents();
            
            console.log('✅ النظام جاهز للعمل!');
            
        } catch (error) {
            console.error('❌ خطأ في التهيئة:', error);
            this.showNotification('خطأ في تحميل النظام', 'error');
        }
    }

    // 📊 تحميل البيانات
    async loadData() {
        try {
            console.log('📥 جاري تحميل البيانات...');
            
            if (typeof getCustomers === 'function' && typeof getSales === 'function') {
                // تحميل من API
                [this.customers, this.sales] = await Promise.all([
                    getCustomers(),
                    getSales()
                ]);
                console.log('✅ تم تحميل البيانات من السيرفر');
            } else {
                // تحميل من التخزين المحلي
                this.loadFromLocalStorage();
                console.log('✅ تم تحميل البيانات محلياً');
            }
            
            console.log(`📊 البيانات المحملة: ${this.customers.length} عميل, ${this.sales.length} مبيع`);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            this.loadFromLocalStorage();
        }
    }

    // 💾 التخزين المحلي
    loadFromLocalStorage() {
        try {
            const savedCustomers = localStorage.getItem('super_customers');
            const savedSales = localStorage.getItem('super_sales');
            
            if (savedCustomers) this.customers = JSON.parse(savedCustomers);
            if (savedSales) this.sales = JSON.parse(savedSales);
            
        } catch (error) {
            console.error('❌ خطأ في التخزين المحلي:', error);
            this.customers = [];
            this.sales = [];
        }
    }

    async saveData() {
        try {
            if (typeof addCustomer === 'function') {
                // حفظ في السيرفر
                console.log('💾 حفظ في السيرفر');
            } else {
                // حفظ محلي
                localStorage.setItem('super_customers', JSON.stringify(this.customers));
                localStorage.setItem('super_sales', JSON.stringify(this.sales));
                console.log('💾 حفظ محلي');
            }
        } catch (error) {
            console.error('❌ خطأ في الحفظ:', error);
        }
    }

    // 🎨 تهيئة الواجهة
    initUI() {
        this.setupEventListeners();
        this.initCharts();
        this.setupSearch();
    }

    // 🖱️ إعداد الأحداث
    setupEventListeners() {
        // الأزرار الأساسية
        this.setupButton('openAddCustomer', () => this.openAddCustomerModal());
        this.setupButton('saveCustomer', (e) => this.saveCustomer(e));
        this.setupButton('saveSale', (e) => this.saveSale(e));
        
        // البحث والتصفية
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterCustomers(e.target.value));
        }
    }

    setupButton(id, handler) {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', handler);
    }

    // 🔍 إعداد البحث
    setupSearch() {
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterCustomers(e.target.value);
            });
        }
    }

    // 👥 عرض العملاء - متطور
    async renderCustomers() {
        const container = document.getElementById('customersList');
        if (!container) {
            console.error('❌ حاوية العملاء غير موجودة');
            return;
        }

        if (!this.customers || this.customers.length === 0) {
            container.innerHTML = this.getEmptyState('عملاء', 'addCustomer');
            return;
        }

        container.innerHTML = '';
        
        for (const customer of this.customers) {
            const purchases = this.getCustomerPurchases(customer.id);
            const card = this.createCustomerCard(customer, purchases);
            container.appendChild(card);
        }
    }

    // 🎴 إنشاء بطاقة عميل
    createCustomerCard(customer, purchases) {
        const card = document.createElement('div');
        card.className = `customer-card ${customer.status || 'active'}`;
        card.innerHTML = this.getCustomerCardHTML(customer, purchases);
        return card;
    }

    getCustomerCardHTML(customer, purchases) {
        return `
            <div class="customer-header">
                <div class="customer-main-info">
                    <div class="customer-name">${customer.name || 'عميل بدون اسم'}</div>
                    <div class="customer-details">
                        <div class="detail-item">📱 ${customer.phone || 'لا يوجد رقم'}</div>
                        ${customer.email ? `<div class="detail-item">📧 ${customer.email}</div>` : ''}
                        <div class="detail-item">📍 ${customer.governorate || 'غير محدد'}</div>
                        ${customer.notes ? `<div class="detail-item">📝 ${customer.notes}</div>` : ''}
                    </div>
                </div>
                <span class="customer-status status-${customer.status || 'active'}">
                    ${customer.status === 'active' ? '✓ نشط' : '⚠ غير نشط'}
                </span>
            </div>
            
            ${this.getPurchasesSection(customer.id, purchases)}
            
            <div class="customer-actions">
                <button class="btn btn-primary" onclick="superSystem.editCustomer('${customer.id}')">
                    ✏️ تعديل
                </button>
                <button class="btn btn-success" onclick="superSystem.openSaleModal('${customer.id}')">
                    💰 إضافة بيع
                </button>
                <button class="btn btn-whatsapp" onclick="superSystem.sendWhatsApp('${customer.phone}')">
                    📱 واتساب
                </button>
                <button class="btn btn-danger" onclick="superSystem.deleteCustomer('${customer.id}')">
                    🗑️ حذف
                </button>
            </div>
        `;
    }

    // 💰 قسم المشتريات
    getPurchasesSection(customerId, purchases) {
        if (purchases.count === 0) {
            return '<div class="no-purchases">لا توجد مشتريات بعد</div>';
        }

        return `
            <div class="purchases-section">
                <div class="purchases-header">
                    <strong>💰 سجل المشتريات (${purchases.count})</strong>
                    <strong class="purchases-total">${purchases.total.toFixed(2)} دينار</strong>
                </div>
                <div class="purchases-list" id="purchases-${customerId}">
                    ${purchases.sales.map(sale => this.getPurchaseItem(sale)).join('')}
                </div>
                <button class="toggle-purchases" onclick="superSystem.togglePurchases('${customerId}')">
                    <span id="toggle-text-${customerId}">عرض المشتريات ▼</span>
                </button>
            </div>
        `;
    }

    getPurchaseItem(sale) {
        const saleDate = sale.sale_date || sale.date;
        const saleAmount = parseFloat(sale.amount || 0);
        const saleDesc = sale.description || '';

        return `
            <div class="purchase-item">
                <div class="purchase-info">
                    <div class="purchase-date">
                        📅 ${saleDate ? new Date(saleDate).toLocaleDateString('ar-JO') : 'تاريخ غير محدد'}
                    </div>
                    ${saleDesc ? `<div class="purchase-desc">${saleDesc}</div>` : ''}
                </div>
                <div class="purchase-amount">${saleAmount.toFixed(2)} دينار</div>
            </div>
        `;
    }

    // 🔍 الحصول على مشتريات العميل
    getCustomerPurchases(customerId) {
        const customerSales = this.sales.filter(s => s.customer_id == customerId);
        const totalAmount = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        return {
            sales: customerSales,
            count: customerSales.length,
            total: totalAmount
        };
    }

    // ➕ نافذة إضافة عميل
    openAddCustomerModal() {
        this.editingCustomerId = null;
        this.showModal('customerModal', 'إضافة عميل جديد');
        this.resetCustomerForm();
    }

    // ✏️ تعديل عميل
    editCustomer(id) {
        const customer = this.customers.find(c => c.id == id);
        if (!customer) return;

        this.editingCustomerId = id;
        this.showModal('customerModal', 'تعديل بيانات العميل');
        this.fillCustomerForm(customer);
    }

    showModal(modalId, title) {
        const modal = document.getElementById(modalId);
        const titleElem = document.getElementById('modalTitle');
        
        if (titleElem) titleElem.textContent = title;
        if (modal) modal.classList.add('active');
    }

    resetCustomerForm() {
        this.setFormValues({
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            customerGovernorate: '',
            customerStatus: 'active',
            customerNotes: ''
        });
    }

    fillCustomerForm(customer) {
        this.setFormValues({
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email || '',
            customerGovernorate: customer.governorate || '',
            customerStatus: customer.status,
            customerNotes: customer.notes || ''
        });
    }

    setFormValues(values) {
        Object.keys(values).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = values[key];
        });
    }

    // 💾 حفظ عميل
    async saveCustomer(e) {
        if (e) e.preventDefault();

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
                // تحديث عميل موجود
                await this.updateCustomer(customerData);
                this.showNotification('تم تحديث بيانات العميل بنجاح!', 'success');
            } else {
                // إضافة عميل جديد
                await this.addCustomer(customerData);
                this.showNotification('تم إضافة العميل بنجاح!', 'success');
            }

            await this.saveData();
            await this.updateAllComponents();
            this.closeModal('customerModal');

        } catch (error) {
            console.error('❌ خطأ في حفظ العميل:', error);
            this.showNotification('خطأ في حفظ العميل: ' + error.message, 'error');
        }
    }

    async addCustomer(customerData) {
        if (typeof addCustomer === 'function') {
            const newCustomer = await addCustomer(customerData);
            this.customers.push(newCustomer);
        } else {
            const newCustomer = {
                id: 'c_' + Date.now(),
                ...customerData,
                created_at: new Date().toISOString()
            };
            this.customers.push(newCustomer);
        }
    }

    async updateCustomer(customerData) {
        if (typeof updateCustomer === 'function') {
            await updateCustomer(this.editingCustomerId, customerData);
            const index = this.customers.findIndex(c => c.id == this.editingCustomerId);
            if (index !== -1) {
                this.customers[index] = { ...this.customers[index], ...customerData };
            }
        } else {
            const index = this.customers.findIndex(c => c.id == this.editingCustomerId);
            if (index !== -1) {
                this.customers[index] = { ...this.customers[index], ...customerData };
            }
        }
    }

    // 🗑️ حذف عميل
    async deleteCustomer(id) {
        if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;

        try {
            if (typeof deleteCustomerAPI === 'function') {
                await deleteCustomerAPI(id);
            }
            
            this.customers = this.customers.filter(c => c.id != id);
            this.sales = this.sales.filter(s => s.customer_id != id);
            
            await this.saveData();
            await this.updateAllComponents();
            this.showNotification('تم حذف العميل بنجاح!', 'success');

        } catch (error) {
            console.error('❌ خطأ في حذف العميل:', error);
            this.showNotification('خطأ في حذف العميل: ' + error.message, 'error');
        }
    }

    // 💰 إدارة المبيعات
    openSaleModal(customerId) {
        document.getElementById('saleCustomerId').value = customerId;
        document.getElementById('saleAmount').value = '';
        document.getElementById('saleDate').valueAsDate = new Date();
        document.getElementById('saleDescription').value = '';
        this.showModal('saleModal', 'إضافة عملية بيع');
    }

    async saveSale(e) {
        if (e) e.preventDefault();

        const saleData = {
            customer_id: document.getElementById('saleCustomerId').value,
            amount: document.getElementById('saleAmount').value,
            sale_date: document.getElementById('saleDate').value,
            description: document.getElementById('saleDescription').value
        };

        try {
            if (typeof addSale === 'function') {
                const newSale = await addSale(saleData);
                this.sales.push(newSale);
            } else {
                const newSale = {
                    id: 's_' + Date.now(),
                    ...saleData,
                    created_at: new Date().toISOString()
                };
                this.sales.push(newSale);
            }

            await this.saveData();
            await this.updateAllComponents();
            this.closeModal('saleModal');
            this.showNotification('تم إضافة عملية البيع بنجاح!', 'success');

        } catch (error) {
            console.error('❌ خطأ في إضافة البيع:', error);
            this.showNotification('خطأ في إضافة البيع: ' + error.message, 'error');
        }
    }

    // 📋 عرض المبيعات
    async renderSales() {
        const container = document.getElementById('salesList');
        if (!container) return;

        if (!this.sales || this.sales.length === 0) {
            container.innerHTML = this.getEmptyState('مبيعات', 'addSale');
            return;
        }

        const sortedSales = [...this.sales].sort((a, b) => 
            new Date(b.sale_date) - new Date(a.sale_date)
        );

        container.innerHTML = sortedSales.map(sale => this.createSaleItem(sale)).join('');
    }

    createSaleItem(sale) {
        const customer = this.customers.find(c => c.id == sale.customer_id);
        
        return `
            <div class="sale-item">
                <div class="sale-header">
                    <div>
                        <div class="sale-customer">${customer ? customer.name : 'عميل محذوف'}</div>
                        <div class="sale-date">
                            ${new Date(sale.sale_date).toLocaleDateString('ar-JO', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </div>
                    </div>
                    <div class="sale-amount">${parseFloat(sale.amount || 0).toFixed(2)} دينار</div>
                </div>
                ${sale.description ? `<div class="sale-desc">${sale.description}</div>` : ''}
            </div>
        `;
    }

    // 📊 لوحة التحكم والإحصائيات
    updateDashboard() {
        this.updateBasicStats();
        this.updateGovernorateAnalysis();
        this.updateAdvancedAnalytics();
    }

    updateBasicStats() {
        const stats = {
            totalCustomers: this.customers.length,
            activeCustomers: this.customers.filter(c => c.status === 'active').length,
            inactiveCustomers: this.customers.filter(c => c.status !== 'active').length,
            totalSales: this.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0)
        };

        this.setElementContent('totalCustomers', stats.totalCustomers);
        this.setElementContent('activeCustomers', stats.activeCustomers);
        this.setElementContent('inactiveCustomers', stats.inactiveCustomers);
        this.setElementContent('totalSales', `${stats.totalSales.toFixed(2)} دينار`);
    }

    setElementContent(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }

    // 📍 تحليل المحافظات
    updateGovernorateAnalysis() {
        const container = document.getElementById('governorateStats');
        if (!container) return;

        const govData = this.analyzeGovernorates();
        
        if (Object.keys(govData).length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد بيانات للمحافظات</div>';
            return;
        }

        container.innerHTML = Object.entries(govData)
            .sort((a, b) => b[1].customers - a[1].customers)
            .map(([gov, data]) => this.createGovernorateCard(gov, data))
            .join('');
    }

    analyzeGovernorates() {
        const govData = {};
        
        // تحليل العملاء
        this.customers.forEach(customer => {
            const gov = customer.governorate || 'غير محدد';
            if (!govData[gov]) {
                govData[gov] = { customers: 0, activeCustomers: 0, sales: 0, totalSales: 0 };
            }
            govData[gov].customers++;
            if (customer.status === 'active') {
                govData[gov].activeCustomers++;
            }
        });

        // تحليل المبيعات
        this.sales.forEach(sale => {
            const customer = this.customers.find(c => c.id == sale.customer_id);
            if (customer) {
                const gov = customer.governorate || 'غير محدد';
                if (govData[gov]) {
                    govData[gov].sales++;
                    govData[gov].totalSales += parseFloat(sale.amount || 0);
                }
            }
        });

        return govData;
    }

    createGovernorateCard(gov, data) {
        return `
            <div class="governorate-card">
                <h3>📍 ${gov}</h3>
                <div class="gov-stats">
                    <div class="gov-stat">
                        <span>👥 العملاء:</span>
                        <strong>${data.customers}</strong>
                    </div>
                    <div class="gov-stat">
                        <span>✅ النشطين:</span>
                        <strong>${data.activeCustomers}</strong>
                    </div>
                    <div class="gov-stat">
                        <span>💰 المبيعات:</span>
                        <strong>${data.sales}</strong>
                    </div>
                    <div class="gov-stat total">
                        <span>💵 الإجمالي:</span>
                        <strong>${data.totalSales.toFixed(2)} د.أ</strong>
                    </div>
                </div>
            </div>
        `;
    }

    // 📈 التحليلات المتقدمة
    updateAdvancedAnalytics() {
        const analysis = this.performAdvancedAnalysis();
        
        this.setElementContent('topSalesGovernorate', analysis.topSalesGov.name || 'لا توجد بيانات');
        this.setElementContent('topSalesAmount', analysis.topSalesGov.amount || '-');
        
        this.setElementContent('topCustomersGovernorate', analysis.topCustomersGov.name || 'لا توجد بيانات');
        this.setElementContent('topCustomersCount', analysis.topCustomersGov.count || '-');
        
        this.setElementContent('avgCustomerValue', analysis.avgCustomerValue);
        this.setElementContent('activityRate', analysis.activityRate);
    }

    performAdvancedAnalysis() {
        // أعلى محافظة مبيعاً
        const salesByGov = {};
        this.sales.forEach(sale => {
            const customer = this.customers.find(c => c.id == sale.customer_id);
            if (customer) {
                const gov = customer.governorate || 'غير محدد';
                salesByGov[gov] = (salesByGov[gov] || 0) + parseFloat(sale.amount || 0);
            }
        });

        const topSalesGov = Object.entries(salesByGov)
            .sort((a, b) => b[1] - a[1])[0] || {};

        // أكثر محافظة عملاء
        const customersByGov = {};
        this.customers.forEach(customer => {
            const gov = customer.governorate || 'غير محدد';
            customersByGov[gov] = (customersByGov[gov] || 0) + 1;
        });

        const topCustomersGov = Object.entries(customersByGov)
            .sort((a, b) => b[1] - a[1])[0] || {};

        // متوسط قيمة العميل
        const totalSales = this.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgValue = this.customers.length > 0 ? totalSales / this.customers.length : 0;

        // معدل النشاط
        const activeCount = this.customers.filter(c => c.status === 'active').length;
        const activityRate = this.customers.length > 0 ? (activeCount / this.customers.length * 100) : 0;

        return {
            topSalesGov: { name: topSalesGov[0], amount: topSalesGov[1] ? `${topSalesGov[1].toFixed(2)} دينار` : '-' },
            topCustomersGov: { name: topCustomersGov[0], count: topCustomersGov[1] ? `${topCustomersGov[1]} عميل` : '-' },
            avgCustomerValue: `${avgValue.toFixed(2)} د.أ`,
            activityRate: `${activityRate.toFixed(1)}%`
        };
    }

    // 📈 الرسوم البيانية
    initCharts() {
        // سيتم تطوير هذا الجزء ليعمل مع Chart.js
        console.log('📊 جاهز لتحميل الرسوم البيانية');
    }

    updateCharts() {
        // تحديث الرسوم البيانية إذا كانت موجودة
        if (typeof updateStatusChart === 'function') updateStatusChart();
        if (typeof updateGovernorateChart === 'function') updateGovernorateChart();
        if (typeof updateSalesChart === 'function') updateSalesChart();
    }

    // 🎯 دوال مساعدة
    togglePurchases(customerId) {
        const purchasesDiv = document.getElementById(`purchases-${customerId}`);
        const toggleText = document.getElementById(`toggle-text-${customerId}`);
        
        if (!purchasesDiv || !toggleText) return;

        if (purchasesDiv.style.maxHeight === '0px' || purchasesDiv.style.maxHeight === '') {
            purchasesDiv.style.maxHeight = purchasesDiv.scrollHeight + 'px';
            toggleText.textContent = 'إخفاء المشتريات ▲';
        } else {
            purchasesDiv.style.maxHeight = '0px';
            toggleText.textContent = 'عرض المشتريات ▼';
        }
    }

    filterCustomers(searchTerm) {
        const cards = document.querySelectorAll('.customer-card');
        const term = searchTerm.toLowerCase();
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(term) ? 'block' : 'none';
        });
    }

    sendWhatsApp(phone) {
        if (!phone) {
            this.showNotification('رقم الهاتف غير متوفر', 'error');
            return;
        }
        
        const message = encodeURIComponent('مرحباً! كيف يمكنني مساعدتك؟');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    }

    showNotification(message, type = 'success') {
        // تنفيذ بسيط للإشعارات - يمكن تطويره
        console.log(`🔔 ${type}: ${message}`);
        alert(message); // نسخة بسيطة - يمكن استبدالها بنظام إشعارات متقدم
    }

    getEmptyState(type, action) {
        return `
            <div class="empty-state">
                <p>لا يوجد ${type} حتى الآن</p>
                <button class="btn btn-primary" onclick="superSystem.${action}()">
                    إضافة أول ${type}
                </button>
            </div>
        `;
    }

    // 🔄 تحديث جميع المكونات
    async updateAllComponents() {
        await this.renderCustomers();
        await this.renderSales();
        this.updateDashboard();
        this.updateCharts();
    }
}

// 🌟 إنشاء النظام وجعله متاحاً globally
let superSystem;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل النظام المتطور...');
    superSystem = new SuperCustomerSystem();
    
    // جعل النظام متاحاً globally
    window.superSystem = superSystem;
    
    // جعل الدوال الأساسية متاحة
    window.openAddCustomerModal = () => superSystem.openAddCustomerModal();
    window.editCustomer = (id) => superSystem.editCustomer(id);
    window.saveCustomer = (e) => superSystem.saveCustomer(e);
    window.deleteCustomer = (id) => superSystem.deleteCustomer(id);
    window.openSaleModal = (id) => superSystem.openSaleModal(id);
    window.saveSale = (e) => superSystem.saveSale(e);
    window.togglePurchases = (id) => superSystem.togglePurchases(id);
    window.filterCustomers = () => superSystem.filterCustomers(document.getElementById('customerSearch').value);
    window.sendWhatsApp = (phone) => superSystem.sendWhatsApp(phone);
    window.closeModal = (id) => superSystem.closeModal(id);
});

console.log('✅ نظام العملاء المتطور محمل وجاهز!');
