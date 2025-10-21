// charts-fix.js - إصلاح كامل للرسوم البيانية
class ChartsFix {
    constructor() {
        this.charts = {};
        this.initialized = false;
        console.log('📊 نظام الرسوم البيانية جاهز للإصلاح');
    }

    async initialize() {
        if (this.initialized) return;
        
        // انتظار تحميل البيانات
        await this.waitForData();
        
        this.initCharts();
        this.initialized = true;
        console.log('✅ تم تهيئة الرسوم البيانية');
    }

    async waitForData() {
        return new Promise((resolve) => {
            const checkData = () => {
                const hasData = this.getDataManager() && 
                              this.getDataManager().customers && 
                              this.getDataManager().sales;
                if (hasData) {
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }

    getDataManager() {
        if (typeof dataManager !== 'undefined') return dataManager;
        if (window.dataManager) return window.dataManager;
        return null;
    }

    initCharts() {
        this.initStatusChart();
        this.initSalesChart();
        this.initGovernorateChart();
        this.initSalesByGovernorateChart();
    }

    // 📊 مخطط توزيع حالة العملاء
    initStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) {
            console.error('❌ لم يتم العثور على statusChart');
            return;
        }

        const dataManager = this.getDataManager();
        if (!dataManager) return;

        const customers = dataManager.customers || [];
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = customers.length - active;

        // تدمير المخطط القديم إذا كان موجوداً
        if (this.charts.statusChart) {
            this.charts.statusChart.destroy();
        }

        this.charts.statusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['نشط', 'غير نشط'],
                datasets: [{
                    data: [active, inactive],
                    backgroundColor: [
                        '#10B981', // أخضر للنشط
                        '#EF4444'  // أحمر لغير النشط
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true,
                        labels: {
                            font: {
                                family: 'Arial, sans-serif',
                                size: 14
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} عميل (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });

        console.log('✅ تم إنشاء مخطط حالة العملاء:', { active, inactive });
    }

    // 📈 مخطط مبيعات آخر 7 أيام
    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) {
            console.error('❌ لم يتم العثور على salesChart');
            return;
        }

        const dataManager = this.getDataManager();
        if (!dataManager) return;

        const salesData = this.getLast7DaysSales(dataManager.sales || []);

        // تدمير المخطط القديم إذا كان موجوداً
        if (this.charts.salesChart) {
            this.charts.salesChart.destroy();
        }

        this.charts.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [{
                    label: 'المبيعات (دينار)',
                    data: salesData.values,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                return `المبيعات: ${context.parsed.y} دينار`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + ' د.أ';
                            },
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });

        console.log('✅ تم إنشاء مخطط المبيعات:', salesData);
    }

    // 🗺️ مخطط توزيع العملاء حسب المحافظات
    initGovernorateChart() {
        const ctx = document.getElementById('governorateChart');
        if (!ctx) {
            console.error('❌ لم يتم العثور على governorateChart');
            return;
        }

        const dataManager = this.getDataManager();
        if (!dataManager) return;

        const govData = this.analyzeGovernorates(dataManager.customers || []);

        // تدمير المخطط القديم إذا كان موجوداً
        if (this.charts.governorateChart) {
            this.charts.governorateChart.destroy();
        }

        this.charts.governorateChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: govData.labels,
                datasets: [{
                    label: 'عدد العملاء',
                    data: govData.values,
                    backgroundColor: [
                        '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B',
                        '#10B981', '#EF4444', '#3B82F6', '#F97316',
                        '#06B6D4', '#84CC16', '#A855F7', '#64748B'
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        rtl: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            precision: 0,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });

        console.log('✅ تم إنشاء مخطط المحافظات:', govData);
    }

    // 💰 مخطط المبيعات حسب المحافظات
    initSalesByGovernorateChart() {
        const ctx = document.getElementById('salesByGovernorateChart');
        if (!ctx) {
            console.error('❌ لم يتم العثور على salesByGovernorateChart');
            return;
        }

        const dataManager = this.getDataManager();
        if (!dataManager) return;

        const salesByGov = this.analyzeSalesByGovernorate(
            dataManager.customers || [], 
            dataManager.sales || []
        );

        // تدمير المخطط القديم إذا كان موجوداً
        if (this.charts.salesByGovernorateChart) {
            this.charts.salesByGovernorateChart.destroy();
        }

        this.charts.salesByGovernorateChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: salesByGov.labels,
                datasets: [{
                    data: salesByGov.values,
                    backgroundColor: [
                        '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B',
                        '#10B981', '#EF4444', '#3B82F6', '#F97316',
                        '#06B6D4', '#84CC16', '#A855F7', '#64748B'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true,
                        labels: {
                            font: {
                                size: 12
                            },
                            color: '#374151'
                        }
                    },
                    tooltip: {
                        rtl: true,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} دينار (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        console.log('✅ تم إنشاء مخطط مبيعات المحافظات:', salesByGov);
    }

    // 🛠️ دوال مساعدة للبيانات
    getLast7DaysSales(sales) {
        const days = [];
        const salesByDay = {};
        
        // إنشاء آخر 7 أيام
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days.push(dateStr);
            salesByDay[dateStr] = 0;
        }

        // حساب المبيعات لكل يوم
        sales.forEach(sale => {
            const saleDate = sale.sale_date || sale.date;
            if (salesByDay.hasOwnProperty(saleDate)) {
                salesByDay[saleDate] += parseFloat(sale.amount || 0);
            }
        });

        // تنسيق التسميات بالعربية
        const labels = days.map(dateStr => {
            const date = new Date(dateStr);
            const dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
            const dayName = dayNames[date.getDay()];
            return `${dayName}\n${date.getDate()}/${date.getMonth() + 1}`;
        });

        const values = days.map(day => salesByDay[day]);

        return { labels, values };
    }

    analyzeGovernorates(customers) {
        const govData = {};
        
        customers.forEach(customer => {
            const gov = customer.governorate || 'غير محدد';
            govData[gov] = (govData[gov] || 0) + 1;
        });

        // تحويل إلى مصفوفات للرسم البياني
        const entries = Object.entries(govData).sort((a, b) => b[1] - a[1]);
        
        return {
            labels: entries.map(([gov]) => gov),
            values: entries.map(([, count]) => count)
        };
    }

    analyzeSalesByGovernorate(customers, sales) {
        const salesByGov = {};
        
        sales.forEach(sale => {
            const customer = customers.find(c => c.id === sale.customer_id);
            if (customer) {
                const gov = customer.governorate || 'غير محدد';
                salesByGov[gov] = (salesByGov[gov] || 0) + parseFloat(sale.amount || 0);
            }
        });

        // تحويل إلى مصفوفات للرسم البياني
        const entries = Object.entries(salesByGov).sort((a, b) => b[1] - a[1]);
        
        return {
            labels: entries.map(([gov]) => gov),
            values: entries.map(([, amount]) => amount)
        };
    }

    // 🔄 تحديث جميع المخططات
    updateAllCharts() {
        if (!this.initialized) {
            this.initialize();
            return;
        }

        console.log('🔄 تحديث جميع المخططات...');
        
        this.initStatusChart();
        this.initSalesChart();
        this.initGovernorateChart();
        this.initSalesByGovernorateChart();
        
        console.log('✅ تم تحديث جميع المخططات');
    }

    // 📱 تحديث عند تبديل التبويب
    refreshOnTabSwitch() {
        const originalSwitchTab = window.switchTab;
        window.switchTab = function(tabName) {
            // تنفيذ الوظيفة الأصلية
            if (originalSwitchTab) {
                originalSwitchTab(tabName);
            }
            
            // إذا كان تبويب Dashboard، قم بتحديث المخططات
            if (tabName === 'dashboard' && window.chartsFix) {
                setTimeout(() => {
                    window.chartsFix.updateAllCharts();
                }, 500);
            }
        };
    }
}

// 🌟 التهيئة والتشغيل
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل نظام الرسوم البيانية...');
    
    // إنشاء النظام
    window.chartsFix = new ChartsFix();
    
    // التهيئة بعد تحميل البيانات
    setTimeout(() => {
        window.chartsFix.initialize();
        window.chartsFix.refreshOnTabSwitch();
    }, 3000);
    
    // تحديث المخططات عند تغيير البيانات
    setInterval(() => {
        if (window.chartsFix && window.chartsFix.initialized) {
            window.chartsFix.updateAllCharts();
        }
    }, 10000); // تحديث كل 10 ثواني
});

// 🔧 دوال مساعدة للاستخدام المباشر
window.updateCharts = function() {
    if (window.chartsFix) {
        window.chartsFix.updateAllCharts();
    }
};

window.refreshCharts = function() {
    if (window.chartsFix) {
        window.chartsFix.updateAllCharts();
    }
};

console.log('✅ نظام إصلاح الرسوم البيانية جاهز!');
