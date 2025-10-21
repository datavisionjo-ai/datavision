class SalesManager {
    // عرض المبيعات
    renderSales() {
        const container = document.getElementById('salesList');
        if (!container) return;

        const sales = dataManager.sales;
        
        if (sales.length === 0) {
            container.innerHTML = this.getEmptyState();
            return;
        }

        // ترتيب المبيعات من الأحدث إلى الأقدم
        const sortedSales = [...sales].sort((a, b) => 
            new Date(b.sale_date) - new Date(a.sale_date)
        );

        container.innerHTML = sortedSales.map(sale => 
            this.createSaleItem(sale)
        ).join('');

        console.log(`✅ تم عرض ${sales.length} عملية بيع`);
    }

    createSaleItem(sale) {
        const customer = dataManager.customers.find(c => c.id === sale.customer_id);
        
        return `
            <div class="sale-item">
                <div class="sale-header">
                    <div class="sale-info">
                        <div class="sale-customer">👤 ${customer ? customer.name : 'عميل محذوف'}</div>
                        <div class="sale-date">
                            📅 ${new Date(sale.sale_date).toLocaleDateString('ar-JO', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric'
                            })}
                        </div>
                        ${sale.description ? `<div class="sale-desc">📝 ${sale.description}</div>` : ''}
                    </div>
                    <div class="sale-amount">${parseFloat(sale.amount).toFixed(2)} دينار</div>
                </div>
            </div>
        `;
    }

    getEmptyState() {
        return `
            <div class="empty-state">
                <p>لا توجد مبيعات حتى الآن</p>
                <button class="btn btn-primary" onclick="customerManager.openAddCustomerModal()">
                    👥 ابدأ بإضافة عملاء
                </button>
            </div>
        `;
    }

    // حفظ عملية البيع
    async saveSale(e) {
        e.preventDefault();

        const saleData = {
            customer_id: document.getElementById('saleCustomerId').value,
            amount: document.getElementById('saleAmount').value,
            sale_date: document.getElementById('saleDate').value,
            description: document.getElementById('saleDescription').value
        };

        try {
            await dataManager.addSale(saleData);
            
            // إغلاق النافذة وتحديث البيانات
            document.getElementById('saleModal').classList.remove('active');
            this.renderSales();
            customerManager.renderCustomers();
            dashboardSystem.updateDashboard();
            
            showNotification('تم إضافة عملية البيع بنجاح!', 'success');

        } catch (error) {
            showNotification('خطأ في إضافة البيع: ' + error.message, 'error');
        }
    }
}
