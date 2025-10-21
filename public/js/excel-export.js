// excel-export.js - نظام تصدير Excel متكامل
class ExcelExporter {
    constructor() {
        console.log('📊 نظام تصدير Excel جاهز!');
    }

    // 📤 تصدير جميع البيانات لـ Excel
    exportToExcel() {
        try {
            console.log('🚀 بدء تصدير البيانات لـ Excel...');
            
            const dataManager = this.getDataManager();
            if (!dataManager) {
                throw new Error('لا توجد بيانات للتصدير');
            }

            // إنشاء مصنف Excel جديد
            const wb = XLSX.utils.book_new();

            // 👥 تصدير العملاء
            if (dataManager.customers && dataManager.customers.length > 0) {
                const customersSheet = this.createCustomersSheet(dataManager.customers);
                XLSX.utils.book_append_sheet(wb, customersSheet, 'العملاء');
            }

            // 💰 تصدير المبيعات
            if (dataManager.sales && dataManager.sales.length > 0) {
                const salesSheet = this.createSalesSheet(dataManager.sales, dataManager.customers);
                XLSX.utils.book_append_sheet(wb, salesSheet, 'المبيعات');
            }

            // 📈 تصدير الإحصائيات
            const statsSheet = this.createStatsSheet(dataManager.customers, dataManager.sales);
            XLSX.utils.book_append_sheet(wb, statsSheet, 'الإحصائيات');

            // 📍 تصدير تحليل المحافظات
            const govSheet = this.createGovernorateSheet(dataManager.customers, dataManager.sales);
            XLSX.utils.book_append_sheet(wb, govSheet, 'تحليل المحافظات');

            // 💾 حفظ الملف
            const fileName = `DataVision_Export_${this.getCurrentDate()}.xlsx`;
            XLSX.writeFile(wb, fileName);
            
            console.log('✅ تم تصدير البيانات بنجاح:', fileName);
            this.showNotification(`تم تصدير البيانات بنجاح إلى ${fileName}`, 'success');
            
        } catch (error) {
            console.error('❌ خطأ في التصدير:', error);
            this.showNotification('فشل في تصدير البيانات: ' + error.message, 'error');
        }
    }

    // 👥 إنشاء ورقة العملاء
    createCustomersSheet(customers) {
        const customersData = customers.map(customer => ({
            'المعرف': customer.id,
            'الاسم الكامل': customer.name,
            'رقم الهاتف': customer.phone,
            'البريد الإلكتروني': customer.email || '',
            'المحافظة': customer.governorate || 'غير محدد',
            'الحالة': customer.status === 'active' ? 'نشط' : 'غير نشط',
            'تاريخ الإضافة': this.formatDate(customer.createdAt),
            'آخر تواصل': customer.lastContact ? this.formatDate(customer.lastContact) : '',
            'ملاحظات': customer.notes || ''
        }));

        return XLSX.utils.json_to_sheet(customersData);
    }

    // 💰 إنشاء ورقة المبيعات
    createSalesSheet(sales, customers) {
        const salesData = sales.map(sale => {
            const customer = customers.find(c => c.id === sale.customer_id);
            return {
                'المعرف': sale.id,
                'اسم العميل': customer ? customer.name : 'عميل محذوف',
                'المبلغ (دينار)': parseFloat(sale.amount || 0),
                'تاريخ البيع': this.formatDate(sale.sale_date || sale.date),
                'الوصف': sale.description || '',
                'تاريخ الإضافة': this.formatDate(sale.createdAt)
            };
        });

        return XLSX.utils.json_to_sheet(salesData);
    }

    // 📈 إنشاء ورقة الإحصائيات
    createStatsSheet(customers, sales) {
        const stats = this.calculateStats(customers, sales);
        
        const statsData = [
            ['إحصائيات Data Vision', '', '', ''],
            ['', '', '', ''],
            ['👥 إحصائيات العملاء', '', '', ''],
            ['إجمالي العملاء', stats.totalCustomers],
            ['العملاء النشطين', stats.activeCustomers],
            ['العملاء غير النشطين', stats.inactiveCustomers],
            ['نسبة النشاط', stats.activityRate + '%'],
            ['', '', '', ''],
            ['💰 إحصائيات المبيعات', '', '', ''],
            ['إجمالي المبيعات', stats.totalSales + ' دينار'],
            ['عدد عمليات البيع', stats.salesCount],
            ['متوسط قيمة البيع', stats.avgSale + ' دينار'],
            ['أعلى مبلغ بيع', stats.maxSale + ' دينار'],
            ['أقل مبلغ بيع', stats.minSale + ' دينار'],
            ['', '', '', ''],
            ['📊 التقييم العام', '', '', ''],
            ['التقييم', stats.performanceAssessment],
            ['', '', '', ''],
            ['📅 معلومات التصدير', '', '', ''],
            ['تاريخ التصدير', this.getCurrentDateTime()],
            ['إصدار النظام', '2.0'],
            ['عدد العملاء المصدرين', customers.length],
            ['عدد المبيعات المصدرة', sales.length]
        ];

        return XLSX.utils.aoa_to_sheet(statsData);
    }

    // 📍 إنشاء ورقة تحليل المحافظات
    createGovernorateSheet(customers, sales) {
        const govAnalysis = this.analyzeGovernorates(customers, sales);
        
        const govData = [
            ['تحليل توزيع العملاء والمبيعات حسب المحافظات', '', '', ''],
            ['', '', '', ''],
            ['المحافظة', 'عدد العملاء', 'عدد المبيعات', 'إجمالي المبيعات (دينار)']
        ];

        // إضافة بيانات المحافظات
        govAnalysis.forEach(gov => {
            govData.push([
                gov.name,
                gov.customers,
                gov.sales,
                gov.totalSales.toFixed(2)
            ]);
        });

        // إضافة الإجماليات
        govData.push(['', '', '', '']);
        govData.push(['الإجمالي', 
            govAnalysis.reduce((sum, gov) => sum + gov.customers, 0),
            govAnalysis.reduce((sum, gov) => sum + gov.sales, 0),
            govAnalysis.reduce((sum, gov) => sum + gov.totalSales, 0).toFixed(2)
        ]);

        return XLSX.utils.aoa_to_sheet(govData);
    }

    // 🧮 حساب الإحصائيات
    calculateStats(customers, sales) {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const inactiveCustomers = totalCustomers - activeCustomers;
        const activityRate = totalCustomers > 0 ? (activeCustomers / totalCustomers * 100).toFixed(1) : 0;
        
        const salesAmounts = sales.map(s => parseFloat(s.amount || 0));
        const totalSales = salesAmounts.reduce((sum, amount) => sum + amount, 0);
        const salesCount = sales.length;
        const avgSale = salesCount > 0 ? totalSales / salesCount : 0;
        const maxSale = salesCount > 0 ? Math.max(...salesAmounts) : 0;
        const minSale = salesCount > 0 ? Math.min(...salesAmounts) : 0;

        let performanceAssessment = 'ممتاز';
        if (totalCustomers === 0 && salesCount === 0) {
            performanceAssessment = 'بداية';
        } else if (totalCustomers > 0 && salesCount === 0) {
            performanceAssessment = 'يحتاج تحسين';
        } else if (activityRate < 60) {
            performanceAssessment = 'جيد';
        }

        return {
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            activityRate,
            totalSales,
            salesCount,
            avgSale: avgSale.toFixed(2),
            maxSale: maxSale.toFixed(2),
            minSale: minSale.toFixed(2),
            performanceAssessment
        };
    }

    // 🗺️ تحليل المحافظات
    analyzeGovernorates(customers, sales) {
        const govData = {};
        
        // تحليل العملاء
        customers.forEach(customer => {
            const gov = customer.governorate || 'غير محدد';
            if (!govData[gov]) {
                govData[gov] = { customers: 0, sales: 0, totalSales: 0 };
            }
            govData[gov].customers++;
        });

        // تحليل المبيعات
        sales.forEach(sale => {
            const customer = customers.find(c => c.id === sale.customer_id);
            if (customer) {
                const gov = customer.governorate || 'غير محدد';
                if (govData[gov]) {
                    govData[gov].sales++;
                    govData[gov].totalSales += parseFloat(sale.amount || 0);
                }
            }
        });

        // تحويل للصفيف وترتيب
        return Object.entries(govData)
            .map(([name, data]) => ({
                name,
                customers: data.customers,
                sales: data.sales,
                totalSales: data.totalSales
            }))
            .sort((a, b) => b.customers - a.customers);
    }

    // 🛠️ دوال مساعدة
    getDataManager() {
        if (typeof dataManager !== 'undefined') return dataManager;
        if (window.dataManager) return window.dataManager;
        return null;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-JO');
        } catch (error) {
            return dateString;
        }
    }

    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    getCurrentDateTime() {
        return new Date().toLocaleString('ar-JO');
    }

    showNotification(message, type = 'success') {
        console.log(`🔔 ${type}: ${message}`);
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // 📋 تصدير بتنسيقات مختلفة
    exportCustomersOnly() {
        try {
            const dataManager = this.getDataManager();
            if (!dataManager?.customers?.length) {
                throw new Error('لا توجد عملاء للتصدير');
            }

            const wb = XLSX.utils.book_new();
            const customersSheet = this.createCustomersSheet(dataManager.customers);
            XLSX.utils.book_append_sheet(wb, customersSheet, 'العملاء');
            
            const fileName = `DataVision_Customers_${this.getCurrentDate()}.xlsx`;
            XLSX.writeFile(wb, fileName);
            
            this.showNotification(`تم تصدير ${dataManager.customers.length} عميل بنجاح`, 'success');
        } catch (error) {
            this.showNotification('فشل في تصدير العملاء: ' + error.message, 'error');
        }
    }

    exportSalesOnly() {
        try {
            const dataManager = this.getDataManager();
            if (!dataManager?.sales?.length) {
                throw new Error('لا توجد مبيعات للتصدير');
            }

            const wb = XLSX.utils.book_new();
            const salesSheet = this.createSalesSheet(dataManager.sales, dataManager.customers);
            XLSX.utils.book_append_sheet(wb, salesSheet, 'المبيعات');
            
            const fileName = `DataVision_Sales_${this.getCurrentDate()}.xlsx`;
            XLSX.writeFile(wb, fileName);
            
            this.showNotification(`تم تصدير ${dataManager.sales.length} عملية بيع بنجاح`, 'success');
        } catch (error) {
            this.showNotification('فشل في تصدير المبيعات: ' + error.message, 'error');
        }
    }
}

// 🌟 التهيئة والتشغيل
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تحميل نظام تصدير Excel...');
    window.excelExporter = new ExcelExporter();
});

// 🔧 جعل الدوال متاحة globally
window.exportToExcel = () => {
    if (window.excelExporter) {
        window.excelExporter.exportToExcel();
    }
};

window.exportCustomersExcel = () => {
    if (window.excelExporter) {
        window.excelExporter.exportCustomersOnly();
    }
};

window.exportSalesExcel = () => {
    if (window.excelExporter) {
        window.excelExporter.exportSalesOnly();
    }
};

console.log('✅ نظام تصدير Excel جاهز للاستخدام!');
