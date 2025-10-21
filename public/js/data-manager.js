class DataManager {
    constructor() {
        this.customers = [];
        this.sales = [];
        this.settings = {};
        this.isLoaded = false;
    }

    async loadData() {
        try {
            // محاولة التحميل من السيرفر
            if (authSystem.isLoggedIn()) {
                await this.loadFromServer();
            } else {
                await this.loadFromLocalStorage();
            }
            
            this.isLoaded = true;
            console.log('✅ تم تحميل البيانات:', {
                customers: this.customers.length,
                sales: this.sales.length
            });
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            await this.loadFromLocalStorage();
        }
    }

    async loadFromServer() {
        try {
            const [customersRes, salesRes] = await Promise.all([
                fetch('/api/customers', {
                    headers: { 'Authorization': `Bearer ${authSystem.token}` }
                }),
                fetch('/api/sales', {
                    headers: { 'Authorization': `Bearer ${authSystem.token}` }
                })
            ]);

            const customersData = await customersRes.json();
            const salesData = await salesRes.json();

            this.customers = customersData.success ? customersData.customers : [];
            this.sales = salesData.success ? salesData.sales : [];
            
        } catch (error) {
            throw new Error('فشل تحميل البيانات من السيرفر');
        }
    }

    async loadFromLocalStorage() {
        try {
            const savedCustomers = localStorage.getItem('datavision_customers');
            const savedSales = localStorage.getItem('datavision_sales');
            
            this.customers = savedCustomers ? JSON.parse(savedCustomers) : [];
            this.sales = savedSales ? JSON.parse(savedSales) : [];
            
        } catch (error) {
            this.customers = [];
            this.sales = [];
        }
    }

    async saveData() {
        try {
            // حفظ محلي دائماً
            localStorage.setItem('datavision_customers', JSON.stringify(this.customers));
            localStorage.setItem('datavision_sales', JSON.stringify(this.sales));
            
            // إذا كان مسجل دخول، حاول الحفظ في السيرفر
            if (authSystem.isLoggedIn()) {
                await this.saveToServer();
            }
            
        } catch (error) {
            console.error('❌ خطأ في حفظ البيانات:', error);
        }
    }

    async saveToServer() {
        // سيتم تطوير هذا لاحقاً
        console.log('💾 حفظ في السيرفر');
    }

    // إضافة عميل جديد
    async addCustomer(customerData) {
        const newCustomer = {
            id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email || '',
            governorate: customerData.governorate || 'غير محدد',
            status: customerData.status || 'active',
            notes: customerData.notes || '',
            createdAt: new Date().toISOString(),
            lastContact: new Date().toISOString().split('T')[0]
        };

        this.customers.push(newCustomer);
        await this.saveData();
        return newCustomer;
    }

    // إضافة عملية بيع
    async addSale(saleData) {
        const newSale = {
            id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            customer_id: saleData.customer_id,
            amount: parseFloat(saleData.amount),
            sale_date: saleData.sale_date,
            description: saleData.description || '',
            createdAt: new Date().toISOString()
        };

        this.sales.push(newSale);
        await this.saveData();
        return newSale;
    }

    // حذف عميل
    async deleteCustomer(customerId) {
        this.customers = this.customers.filter(c => c.id !== customerId);
        this.sales = this.sales.filter(s => s.customer_id !== customerId);
        await this.saveData();
    }

    // تحديث عميل
    async updateCustomer(customerId, customerData) {
        const index = this.customers.findIndex(c => c.id === customerId);
        if (index !== -1) {
            this.customers[index] = { ...this.customers[index], ...customerData };
            await this.saveData();
            return this.customers[index];
        }
        throw new Error('العميل غير موجود');
    }

    // الحصول على مشتريات العميل
    getCustomerPurchases(customerId) {
        const customerSales = this.sales.filter(s => s.customer_id === customerId);
        const totalAmount = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
        
        return {
            sales: customerSales,
            count: customerSales.length,
            total: totalAmount
        };
    }
}
