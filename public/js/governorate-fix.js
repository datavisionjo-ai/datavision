// governorate-fix.js - إصلاح تحليل المحافظات
class GovernorateFix {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        // انتظار تحميل النظام الموحد
        await this.waitForSystem();
        this.initialized = true;
        
        console.log('📍 نظام تحليل المحافظات جاهز');
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

    // 🎯 تحديث تحليل المحافظات في لوحة التحكم
    updateGovernorateAnalysis() {
        const container = document.getElementById('governorateStats');
        if (!container) {
            console.error('❌ حاوية المحافظات غير موجودة');
            return;
        }

        const govData = unifiedDataSystem.getGovernorateAnalysis();
        
        if (Object.keys(govData).length === 0) {
            container.innerHTML = '<div class="no-data">لا توجد بيانات للمحافظات</div>';
            return;
        }

        container.innerHTML = Object.entries(govData)
            .sort((a, b) => b[1].customers - a[1].customers)
            .map(([gov, data]) => this.createGovernorateCard(gov, data))
            .join('');

        console.log('✅ تم تحديث تحليل المحافظات');
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

    // 📈 تحديث التحليلات المتقدمة
    updateAdvancedAnalytics() {
        const govData = unifiedDataSystem.getGovernorateAnalysis();
        const stats = unifiedDataSystem.getDashboardStats();

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

        // تحديث الواجهة
        this.updateElement('topSalesGovernorate', topSalesGov[0] || 'لا توجد بيانات');
        this.updateElement('topSalesAmount', topSalesGov[1] ? `${topSalesGov[1].totalSales.toFixed(2)} دينار` : '-');
        
        this.updateElement('topCustomersGovernorate', topCustomersGov[0] || 'لا توجد بيانات');
        this.updateElement('topCustomersCount', topCustomersGov[1] ? `${topCustomersGov[1].customers} عميل` : '-');
        
        this.updateElement('avgCustomerValue', `${avgCustomerValue.toFixed(2)} د.أ`);
        this.updateElement('activityRate', `${activityRate.toFixed(1)}%`);
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) element.textContent = content;
    }

    // 🔄 تحديث كامل للوحة التحكم
    async updateFullDashboard() {
        await this.initialize();
        this.updateGovernorateAnalysis();
        this.updateAdvancedAnalytics();
        console.log('📊 تم تحديث لوحة التحكم بالكامل');
    }
}

// إنشاء النسخة العالمية
window.governorateFix = new GovernorateFix();
