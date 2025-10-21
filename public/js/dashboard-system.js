class DashboardSystem {
    constructor() {
        this.charts = {};
    }

    // تحديث الإحصائيات الأساسية
    updateBasicStats() {
        const stats = this.calculateStats();
        
        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
        document.getElementById('activeCustomers').textContent = stats.activeCustomers;
        document.getElementById('inactiveCustomers').textContent = stats.inactiveCustomers;
        document.getElementById('totalSales').textContent = stats.totalSales.toFixed(2) + ' دينار';
    }

    calculateStats() {
        const totalCustomers = dataManager.customers.length;
        const activeCustomers = dataManager.customers.filter(c => c.status === 'active').length;
        const totalSales = dataManager.sales.reduce((sum, sale) => sum + parseFloat(sale.amount), 0);
        
        return {
            totalCustomers,
            activeCustomers,
            inactiveCustomers: totalCustomers - activeCustomers,
            totalSales
        };
    }

    // تحديث تحليل المحافظات
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
        dataManager.customers.forEach(customer => {
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
        dataManager.sales.forEach(sale => {
            const customer = dataManager.customers.find(c => c.id === sale.customer_id);
            if (customer && customer.governorate) {
                const gov = customer.governorate;
                if (govData[gov]) {
                    govData[gov].sales++;
                    govData[gov].totalSales += parseFloat(sale.amount);
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

    // تحديث التحليلات المتقدمة
    updateAdvancedAnalytics() {
        const analysis = this.performAdvancedAnalysis();
        
        this.updateElement('topSalesGovernorate', analysis.topSalesGov.name);
        this.updateElement('topSalesAmount', analysis.topSalesGov.amount);
        this.updateElement('topCustomersGovernorate', analysis.topCustomersGov.name);
        this.updateElement('topCustomersCount', analysis.topCustomersGov.count);
        this.updateElement('avgCustomerValue', analysis.avgCustomerValue);
        this.updateElement('activityRate', analysis.activityRate);
    }

    performAdvancedAnalysis() {
        const govData = this.analyzeGovernorates();
        const stats = this.calculateStats();

        // أعلى محافظة مبيعاً
        const topSalesGov = Object.entries(govData)
            .sort((a, b) => b[1].totalSales - a[1].totalSales)[0] || [];
        
        // أكثر محافظة عملاء
        const topCustomersGov = Object.entries(govData)
            .sort((a, b) => b[1].customers - a[1].customers)[0] || [];

        // متوسط قيمة العميل
        const avgCustomerValue = stats.totalCustomers > 0 ? 
            stats.totalSales / stats.totalCustomers : 0;

        // معدل النشاط
        const activityRate = stats.totalCustomers > 0 ? 
            (stats.activeCustomers / stats.totalCustomers) * 100 : 0;

        return {
            topSalesGov: {
                name: topSalesGov[0] || 'لا توجد بيانات',
                amount: topSalesGov[1] ? `${topSalesGov[1].totalSales.toFixed(2)} دينار` : '-'
            },
            topCustomersGov: {
                name: topCustomersGov[0] || 'لا توجد بيانات', 
                count: topCustomersGov[1] ? `${topCustomersGov[1].customers} عميل` : '-'
            },
            avgCustomerValue: `${avgCustomerValue.toFixed(2)} د.أ`,
            activityRate: `${activityRate.toFixed(1)}%`
        };
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }

    // تحديث كل شيء في لوحة التحكم
    updateDashboard() {
        this.updateBasicStats();
        this.updateGovernorateAnalysis();
        this.updateAdvancedAnalytics();
        console.log('✅ تم تحديث لوحة التحكم');
    }
}
