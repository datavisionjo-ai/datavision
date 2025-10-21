// unified-data-system.js - نظام موحد لإدارة البيانات
class UnifiedDataSystem {
    constructor() {
        this.customers = [];
        this.sales = [];
        this.settings = {};
        this.isInitialized = false;
    }

    // 🔄 التهيئة الموحدة
    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🔄 بدء التهيئة الموحدة للبيانات...');
        
        try {
            // محاولة تحميل من السيرفر أولاً
            if (typeof isLoggedIn === 'function' && isLoggedIn()) {
                await this.loadFromServer();
            } else {
                await this.loadFromLocalStorage();
            }
            
            this.isInitialized = true;
            console.log('✅ التهيئة الموحدة اكتملت:', {
                customers: this.customers.length,
                sales: this.sales.length
            });
            
        } catch (error) {
            console.error('❌ خطأ في التهيئة الموحدة:', error);
            await this.loadFromLocalStorage();
        }
    }

    // 📥 تحميل من السيرفر
    async loadFromServer() {
        try {
            const [customersData, salesData] = await Promise.all([
                getCustomers ? getCustomers() : [],
                getSales ? getSales() : []
            ]);
            
            this.customers = this.standardizeCustomers(customersData);
            this.sales = this.standardizeSales(salesData);
            
        } catch (error) {
            console.error('❌ فشل تحميل من السيرفر:', error);
            throw error;
        }
    }

    // 💾 تحميل من التخزين المحلي
    async loadFromLocalStorage() {
        try {
            const savedCustomers = localStorage.getItem('datavision_customers');
            const savedSales = localStorage.getItem('datavision_sales');
            const savedSettings = localStorage.getItem('datavision_settings');
            
            if (savedCustomers) {
                this.customers = this.standardizeCustomers(JSON.parse(savedCustomers));
            }
            
            if (savedSales) {
                this.sales = this.standardizeSales(JSON.parse(savedSales));
            }
            
            if (savedSettings) {
                this.settings = JSON.parse(savedSettings);
            }
            
        } catch (error) {
            console.error('❌ خطأ في التحميل المحلي:', error);
            this.customers = [];
            this.sales = [];
        }
    }

    // 🏗️ توحيد هيكل العملاء
    standardizeCustomers(customersArray) {
        return customersArray.map(customer => ({
            id: customer.id || `c_${Date.now()}_${Math.random()}`,
            name: customer.name || 'عميل بدون اسم',
            phone: customer.phone || '',
            email: customer.email || '',
            governorate: customer.governorate || customer.city || 'غير محدد',
            status: customer.status || 'active',
            notes: customer.notes || '',
            createdAt: customer.createdAt || customer.created_at || new Date().toISOString(),
            lastContact: customer.lastContact || new Date().toISOString().split('T')[0]
        }));
    }

    // 🏗️ توحيد هيكل المبيعات
    standardizeSales(salesArray) {
        return salesArray.map(sale => ({
            id: sale.id || `s_${Date.now()}_${Math.random()}`,
            customer_id: sale.customer_id || sale.customerId,
            customerId: sale.customerId || sale.customer_id, // نسخة احتياطية
            amount: parseFloat(sale.amount) || 0,
            sale_date: sale.sale_date || sale.date || new Date().toISOString().split('T')[0],
            date: sale.date || sale.sale_date || new Date().toISOString().split('T')[0], // نسخة احتياطية
            description: sale.description || '',
            createdAt: sale.createdAt || sale.created_at || new Date().toISOString()
        })).filter(sale => sale.customer_id && sale.amount > 0);
    }

    // 💾 حفظ البيانات
    async saveData() {
        try {
            // حفظ في السيرفر إذا كان مسجل دخول
            if (typeof isLoggedIn === 'function' && isLoggedIn()) {
                await this.saveToServer();
            }
            
            // حفظ محلي دائماً
            this.saveToLocalStorage();
            
            console.log('💾 البيانات محفوظة بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في الحفظ:', error);
            this.saveToLocalStorage(); // حفظ محلي كنسخة احتياطية
        }
    }

    async saveToServer() {
        // سيتم تنفيذ عمليات الحفظ للسيرفر هنا
        console.log('🌐 حفظ في السيرفر (جاهز للتطوير)');
    }

    saveToLocalStorage() {
        localStorage.setItem('datavision_customers', JSON.stringify(this.customers));
        localStorage.setItem('datavision_sales', JSON.stringify(this.sales));
        localStorage.setItem('datavision_settings', JSON.stringify(this.settings));
    }

    // 👥 إدارة العملاء
    async addCustomer(customerData) {
        const newCustomer = {
            id: `c_${Date.now()}_${Math.random()}`,
            ...customerData,
            createdAt: new Date().toISOString(),
            lastContact: new Date().toISOString().split('T')[0]
        };
        
        this.customers.push(newCustomer);
        await this.saveData();
        return newCustomer;
    }

    async updateCustomer(id, customerData) {
        const index = this.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            this.customers[index] = { ...this.customers[index], ...customerData };
            await this.saveData();
            return this.customers[index];
        }
        throw new Error('العميل غير موجود');
    }

    async deleteCustomer(id) {
        this.customers = this.customers.filter(c => c.id !== id);
        this.sales = this.sales.filter(s => s.customer_id !== id);
        await this.saveData();
    }

    // 💰 إدارة المبيعات
    async addSale(saleData) {
        const newSale = {
            id: `s_${Date.now()}_${Math.random()}`,
            ...saleData,
            createdAt: new Date().toISOString()
        };
        
        this.sales.push(newSale);
        await this.saveData();
        return newSale;
    }

    // 📊 التحليلات
    getGovernorateAnalysis() {
        const govData = {};
        
        // تحليل العملاء حسب المحافظة
        this.customers.forEach(customer => {
            const gov = customer.governorate || 'غير محدد';
            if (!govData[gov]) {
                govData[gov] = {
                    customers: 0,
                    activeCustomers: 0,
                    sales: 0,
                    totalSales: 0
                };
            }
            
            govData[gov].customers++;
            if (customer.status === 'active') {
                govData[gov].activeCustomers++;
            }
        });

        // تحليل المبيعات حسب المحافظة
        this.sales.forEach(sale => {
            const customer = this.customers.find(c => c.id === sale.customer_id);
            if (customer) {
                const gov = customer.governorate || 'غير محدد';
                if (govData[gov]) {
                    govData[gov].sales++;
                    govData[gov].totalSales += parseFloat(sale.amount);
                }
            }
        });

        return govData;
    }

    getCustomerPurchases(customerId) {
        const customerSales = this.sales.filter(s => s.customer_id === customerId);
        const totalAmount = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
        
        return {
            sales: customerSales,
            count: customerSales.length,
            total: totalAmount
        };
    }

    // 📈 الإحصائيات
    getDashboardStats() {
        const totalCustomers = this.customers.length;
        const activeCustomers = this.customers.filter(c => c.status === 'active').length;
        const totalSalesAmount = this.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
        
        return {
            totalCustomers,
            activeCustomers,
            inactiveCustomers: totalCustomers - activeCustomers,
            totalSales: totalSalesAmount,
            salesCount: this.sales.length
        };
    }
}

// إنشاء نسخة عالمية من النظام
window.unifiedDataSystem = new UnifiedDataSystem();
