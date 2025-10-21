// js/import-export.js

// تصدير البيانات بصيغة JSON
function exportData() {
    try {
        const data = {
            customers: JSON.parse(localStorage.getItem('customers')) || [],
            sales: JSON.parse(localStorage.getItem('sales')) || [],
            settings: JSON.parse(localStorage.getItem('settings')) || {},
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `data_vision_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('✅ تم تصدير البيانات بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تصدير البيانات:', error);
        showNotification('❌ فشل في تصدير البيانات', 'error');
    }
}

// استيراد البيانات من ملف JSON
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // التحقق من صحة البيانات
            if (!data.customers || !data.sales) {
                throw new Error('صيغة الملف غير صحيحة');
            }

            // حفظ البيانات في localStorage
            localStorage.setItem('customers', JSON.stringify(data.customers));
            localStorage.setItem('sales', JSON.stringify(data.sales));
            if (data.settings) {
                localStorage.setItem('settings', JSON.stringify(data.settings));
            }

            showNotification('✅ تم استيراد البيانات بنجاح', 'success');
            
            // تحديث الواجهة
            setTimeout(() => {
                location.reload();
            }, 1000);

        } catch (error) {
            console.error('خطأ في استيراد البيانات:', error);
            showNotification('❌ فشل في استيراد البيانات: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    
    // إعادة تعيين قيمة الإدخال للسماح بتحميل نفس الملف مرة أخرى
    event.target.value = '';
}

// تصدير البيانات بصيغة Excel
function exportToExcel() {
    try {
        const customers = JSON.parse(localStorage.getItem('customers')) || [];
        const sales = JSON.parse(localStorage.getItem('sales')) || [];

        // إنشاء مصنف Excel
        const wb = XLSX.utils.book_new();

        // ورقة العملاء
        const customersData = customers.map(customer => ({
            'الاسم': customer.name,
            'الهاتف': customer.phone,
            'البريد الإلكتروني': customer.email || '',
            'المحافظة': customer.governorate,
            'الحالة': customer.status === 'active' ? 'نشط' : 'غير نشط',
            'ملاحظات': customer.notes || '',
            'تاريخ الإضافة': new Date(customer.createdAt).toLocaleDateString('ar-EG')
        }));

        const customersWS = XLSX.utils.json_to_sheet(customersData);
        XLSX.utils.book_append_sheet(wb, customersWS, 'العملاء');

        // ورقة المبيعات
        const salesData = sales.map(sale => {
            const customer = customers.find(c => c.id === sale.customerId);
            return {
                'اسم العميل': customer ? customer.name : 'غير معروف',
                'المبلغ (دينار)': sale.amount,
                'التاريخ': new Date(sale.date).toLocaleDateString('ar-EG'),
                'الوصف': sale.description || '',
                'معرف العملية': sale.id
            };
        });

        const salesWS = XLSX.utils.json_to_sheet(salesData);
        XLSX.utils.book_append_sheet(wb, salesWS, 'المبيعات');

        // ورقة الإحصائيات
        const statsData = [
            {'الإحصائية': 'إجمالي العملاء', 'القيمة': customers.length},
            {'الإحصائية': 'العملاء النشطين', 'القيمة': customers.filter(c => c.status === 'active').length},
            {'الإحصائية': 'العملاء غير النشطين', 'القيمة': customers.filter(c => c.status === 'inactive').length},
            {'الإحصائية': 'إجمالي المبيعات', 'القيمة': sales.reduce((sum, sale) => sum + sale.amount, 0) + ' دينار'},
            {'الإحصائية': 'متوسط قيمة البيع', 'القيمة': (sales.reduce((sum, sale) => sum + sale.amount, 0) / sales.length || 0).toFixed(2) + ' دينار'}
        ];

        const statsWS = XLSX.utils.json_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, statsWS, 'الإحصائيات');

        // حفظ الملف
        const fileName = `data_vision_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        showNotification('✅ تم تصدير البيانات إلى Excel بنجاح', 'success');
    } catch (error) {
        console.error('خطأ في تصدير Excel:', error);
        showNotification('❌ فشل في تصدير البيانات إلى Excel', 'error');
    }
}

// استيراد البيانات من ملف Excel
function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            let importedCustomers = [];
            let importedSales = [];

            // استيراد العملاء
            if (workbook.Sheets['العملاء']) {
                const customersData = XLSX.utils.sheet_to_json(workbook.Sheets['العملاء']);
                importedCustomers = customersData.map(customer => ({
                    id: generateId(),
                    name: customer['الاسم'] || '',
                    phone: customer['الهاتف'] || '',
                    email: customer['البريد الإلكتروني'] || '',
                    governorate: customer['المحافظة'] || '',
                    status: customer['الحالة'] === 'نشط' ? 'active' : 'inactive',
                    notes: customer['ملاحظات'] || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }));
            }

            // استيراد المبيعات
            if (workbook.Sheets['المبيعات']) {
                const salesData = XLSX.utils.sheet_to_json(workbook.Sheets['المبيعات']);
                const existingCustomers = JSON.parse(localStorage.getItem('customers')) || [];
                
                importedSales = salesData.map(sale => {
                    // البحث عن العميل المطابق
                    const customer = existingCustomers.find(c => 
                        c.name === sale['اسم العميل']
                    ) || importedCustomers.find(c => 
                        c.name === sale['اسم العميل']
                    );

                    return {
                        id: generateId(),
                        customerId: customer ? customer.id : null,
                        amount: parseFloat(sale['المبلغ (دينار)']) || 0,
                        date: new Date(sale['التاريخ']).toISOString() || new Date().toISOString(),
                        description: sale['الوصف'] || '',
                        createdAt: new Date().toISOString()
                    };
                }).filter(sale => sale.customerId !== null); // استبعاد المبيعات بدون عملاء
            }

            // دمج البيانات مع البيانات الحالية
            const existingCustomers = JSON.parse(localStorage.getItem('customers')) || [];
            const existingSales = JSON.parse(localStorage.getItem('sales')) || [];

            const mergedCustomers = [...existingCustomers, ...importedCustomers];
            const mergedSales = [...existingSales, ...importedSales];

            // حفظ البيانات المدمجة
            localStorage.setItem('customers', JSON.stringify(mergedCustomers));
            localStorage.setItem('sales', JSON.stringify(mergedSales));

            showNotification('✅ تم استيراد البيانات من Excel بنجاح', 'success');
            
            // تحديث الواجهة
            setTimeout(() => {
                location.reload();
            }, 1000);

        } catch (error) {
            console.error('خطأ في استيراد Excel:', error);
            showNotification('❌ فشل في استيراد البيانات من Excel', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
    
    // إعادة تعيين قيمة الإدخال
    event.target.value = '';
}

// دالة مساعدة لإنشاء معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// دالة إظهار الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
