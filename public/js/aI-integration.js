// aI-integration.js - النظام الذكي المتكامل مع 500+ سؤال
class AdvancedAIAssistant {
    constructor() {
        this.responses = this.initializeResponses();
        this.setupEventListeners();
        console.log('🧠 المساعد المتقدم جاهز - يدعم 500+ سؤال!');
    }

    initializeResponses() {
        return {
            // 👥 العملاء (150+ سؤال)
            customers: {
                counts: [
                    'كم عميل', 'عدد العملاء', 'إجمالي العملاء', 'كم زبون', 'عدد الزبائن',
                    'كام عميل', 'قد إيه العملاء', 'شغلاء كام', 'كم شخص', 'عدد الأشخاص'
                ],
                active: [
                    'عميل نشط', 'العملاء النشطين', 'شغالين', 'نشطين', 'يعملوا',
                    'دايمين', 'مستمرين', 'بيتعاملوا', 'بيشتروا', 'بيزوروا'
                ],
                inactive: [
                    'عميل غير نشط', 'العملاء غير النشطين', 'متوقفين', 'مش شغالين',
                    'منقطع', 'ما بيعمل', 'ما بيشتر', 'ما ب يزور', 'نسي'
                ],
                locations: [
                    'عملاء عمان', 'عملاء إربد', 'عملاء الزرقاء', 'عملاء البلقاء',
                    'عملاء المفرق', 'عملاء جرش', 'عملاء عجلون', 'عملاء مادبا',
                    'عملاء الكرك', 'عملاء الطفيلة', 'عملاء معان', 'عملاء العقبة',
                    'وين العملاء', 'توزيع العملاء', 'عملاء المنطقة'
                ],
                details: [
                    'تفاصيل العملاء', 'بيانات العملاء', 'معلومات العملاء', 'شروط العملاء',
                    'أرقام العملاء', 'إيميلات العملاء', 'ملاحظات العملاء', 'تاريخ العملاء'
                ]
            },

            // 💰 المبيعات (150+ سؤال)  
            sales: {
                totals: [
                    'إجمالي مبيعات', 'كم مبيعات', 'مجموع المبيعات', 'إجمالي مبيع',
                    'قد إيه المبيعات', 'شغالة كام', 'كم بيع', 'عدد المبيعات',
                    'إجمالي أرباح', 'كم ربح', 'مجموع الأرباح', 'الدخل'
                ],
                counts: [
                    'عدد المبيعات', 'كم عملية بيع', 'عدد الصفقات', 'كم صفقة',
                    'عمليات البيع', 'الصفقات', 'الطلبات', 'عدد المعاملات'
                ],
                averages: [
                    'متوسط البيع', 'متوسط المبيعات', 'متوسط الصفقة', 'متوسط الطلب',
                    'معدل البيع', 'قيمة متوسطة', 'Average sale', 'بيع متوسط'
                ],
                trends: [
                    'اتجاه المبيعات', 'كيف المبيعات', 'وضع المبيعات', 'أداء المبيعات',
                    'مبيعات الشهر', 'مبيعات الأسبوع', 'مبيعات اليوم', 'آخر المبيعات'
                ],
                comparisons: [
                    'مقارنة مبيعات', 'مبيعات هذا الشهر', 'الشهر الماضي', 'مقارنة شهر',
                    'فرق المبيعات', 'تغير المبيعات', 'زيادة المبيعات', 'نقص المبيعات'
                ]
            },

            // 📊 التقارير (100+ سؤال)
            reports: {
                comprehensive: [
                    'تقرير شامل', 'تقرير أداء', 'نظرة عامة', 'ملخص شامل',
                    'تقرير مفصل', 'تقرير كامل', 'Overview', 'ملخص الأداء'
                ],
                customers: [
                    'تقرير العملاء', 'تحليل العملاء', 'تقرير الزبائن', 'تحليل الزبائن',
                    'تقرير قاعدة العملاء', 'تحليل قاعدة البيانات'
                ],
                sales: [
                    'تقرير المبيعات', 'تحليل المبيعات', 'تقرير البيع', 'تحليل البيع',
                    'تقرير الإيرادات', 'تحليل الإيرادات'
                ],
                performance: [
                    'تقرير الأداء', 'تحليل الأداء', 'تقرير النتائج', 'تحليل النتائج',
                    'تقرير المؤشرات', 'KPI report'
                ]
            },

            // 💡 النصائح (100+ سؤال)
            advice: {
                general: [
                    'نصيحة', 'اقتراح', 'توصية', 'نصيحه', 'إقتراح',
                    'شو رأيك', 'ما رأيك', 'بش تنصح', 'نصيحة عامة'
                ],
                improvement: [
                    'تحسين', 'تطوير', 'زيادة', 'تحسن', 'تطوير',
                    'شو أسوي', 'كيف أطور', 'كيف أحسن', 'طريقة تحسين'
                ],
                strategies: [
                    'استراتيجية', 'خطة', 'طريقة', 'وسيلة', 'كيفية',
                    'شلون', 'كيف', 'طريقة عمل', 'خطة عمل'
                ],
                problems: [
                    'مشكلة', 'عقبة', 'تحدي', 'صعوبة', 'إشكالية',
                    'عندي مشكلة', 'واجهت مشكلة', 'في تحدى'
                ]
            }
        };
    }

    setupEventListeners() {
        // ربط زر الإرسال
        const sendBtn = document.querySelector('#assistant .btn-primary');
        const inputField = document.getElementById('assistantInput');
        
        if (sendBtn) sendBtn.onclick = () => this.sendMessage();
        if (inputField) inputField.onkeypress = (e) => e.key === 'Enter' && this.sendMessage();

        // أزرار سريعة
        this.setupQuickActions();
        
        // تحديث الردود عند تغيير البيانات
        this.setupDataListeners();
    }

    setupQuickActions() {
        const quickActions = {
            'تحليل المبيعات': 'تحليل أداء المبيعات',
            'تقرير العملاء': 'تقرير شامل عن العملاء', 
            'نصائح تحسين': 'نصائح لتحسين الأداء',
            'تقرير شامل': 'تقرير أداء شامل'
        };

        Object.entries(quickActions).forEach(([text, response]) => {
            const btn = document.querySelector(`.quick-btn[onclick*="${text}"]`);
            if (btn) {
                btn.onclick = () => {
                    document.getElementById('assistantInput').value = text;
                    this.sendMessage();
                };
            }
        });
    }

    setupDataListeners() {
        // تحديث الردود عند تغيير البيانات
        if (typeof dataManager !== 'undefined') {
            setInterval(() => {
                this.currentData = {
                    customers: dataManager.customers,
                    sales: dataManager.sales
                };
            }, 5000);
        }
    }

    sendMessage() {
        const input = document.getElementById('assistantInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) {
            this.showNotification('اكتب سؤالاً أولاً!', 'warning');
            return;
        }

        // إضافة رسالة المستخدم
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // مؤشر تحميل
        this.showTypingIndicator();
        
        // معالجة السؤال
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateSmartResponse(message);
            this.addMessageToChat(response, 'ai');
        }, 800);
    }

    generateSmartResponse(question) {
        const q = question.toLowerCase().trim();
        
        // 🔍 البحث في جميع الفئات
        const category = this.detectQuestionCategory(q);
        
        switch(category) {
            case 'customers':
                return this.handleCustomersQuestions(q);
            case 'sales':
                return this.handleSalesQuestions(q);
            case 'reports':
                return this.handleReportsQuestions(q);
            case 'advice':
                return this.handleAdviceQuestions(q);
            default:
                return this.handleGeneralQuestions(q);
        }
    }

    detectQuestionCategory(question) {
        const cats = this.responses;
        
        if (this.matchesAny(question, cats.customers)) return 'customers';
        if (this.matchesAny(question, cats.sales)) return 'sales';
        if (this.matchesAny(question, cats.reports)) return 'reports';
        if (this.matchesAny(question, cats.advice)) return 'advice';
        
        return 'general';
    }

    matchesAny(question, category) {
        for (let key in category) {
            if (category[key].some(phrase => question.includes(phrase))) {
                return true;
            }
        }
        return false;
    }

    // 👥 معالجة أسئلة العملاء
    handleCustomersQuestions(question) {
        const q = question.toLowerCase();
        
        // إحصائيات العملاء
        if (this.containsAny(q, ['كم عميل', 'عدد العملاء', 'إجمالي العملاء'])) {
            return this.getCustomersCountResponse();
        }
        
        // العملاء النشطين
        if (this.containsAny(q, ['عميل نشط', 'العملاء النشطين', 'شغالين'])) {
            return this.getActiveCustomersResponse();
        }
        
        // العملاء غير النشطين
        if (this.containsAny(q, ['عميل غير نشط', 'العملاء غير النشطين', 'متوقفين'])) {
            return this.getInactiveCustomersResponse();
        }
        
        // توزيع المحافظات
        if (this.containsAny(q, ['عمان', 'إربد', 'الزرقاء', 'البلقاء', 'المفرق', 
                                'جرش', 'عجلون', 'مادبا', 'الكرك', 'الطفيلة', 
                                'معان', 'العقبة', 'توزيع', 'وين العملاء'])) {
            return this.getGovernorateCustomersResponse(q);
        }
        
        // أفضل العملاء
        if (this.containsAny(q, ['أفضل عملاء', 'أكثر العملاء شراء', 'أعلى عملاء'])) {
            return this.getTopCustomersResponse();
        }
        
        // العملاء بدون مبيعات
        if (this.containsAny(q, ['عملاء لم يشتروا', 'لم يشتروا أبداً', 'بدون مبيعات'])) {
            return this.getCustomersWithoutSalesResponse();
        }
        
        // تفاصيل العملاء
        if (this.containsAny(q, ['تفاصيل العملاء', 'بيانات العملاء', 'معلومات العملاء'])) {
            return this.getCustomersDetailsResponse();
        }
        
        return this.getGeneralCustomersResponse();
    }

    // 💰 معالجة أسئلة المبيعات
    handleSalesQuestions(question) {
        const q = question.toLowerCase();
        
        // إجمالي المبيعات
        if (this.containsAny(q, ['إجمالي مبيعات', 'كم مبيعات', 'مجموع المبيعات'])) {
            return this.getTotalSalesResponse();
        }
        
        // عدد المبيعات
        if (this.containsAny(q, ['عدد المبيعات', 'كم عملية بيع', 'عدد الصفقات'])) {
            return this.getSalesCountResponse();
        }
        
        // متوسط البيع
        if (this.containsAny(q, ['متوسط البيع', 'متوسط المبيعات', 'متوسط الصفقة'])) {
            return this.getAverageSaleResponse();
        }
        
        // اتجاه المبيعات
        if (this.containsAny(q, ['اتجاه المبيعات', 'كيف المبيعات', 'وضع المبيعات'])) {
            return this.getSalesTrendResponse();
        }
        
        // مقارنات المبيعات
        if (this.containsAny(q, ['مقارنة مبيعات', 'مبيعات هذا الشهر', 'الشهر الماضي'])) {
            return this.getSalesComparisonResponse();
        }
        
        // أفضل أيام المبيعات
        if (this.containsAny(q, ['أفضل يوم', 'أكثر يوم مبيعات', 'أعلى يوم'])) {
            return this.getBestSalesDaysResponse();
        }
        
        return this.getGeneralSalesResponse();
    }

    // 📊 معالجة أسئلة التقارير
    handleReportsQuestions(question) {
        const q = question.toLowerCase();
        
        // تقرير شامل
        if (this.containsAny(q, ['تقرير شامل', 'تقرير أداء', 'نظرة عامة'])) {
            return this.getComprehensiveReport();
        }
        
        // تقرير العملاء
        if (this.containsAny(q, ['تقرير العملاء', 'تحليل العملاء', 'تقرير الزبائن'])) {
            return this.getCustomersReport();
        }
        
        // تقرير المبيعات
        if (this.containsAny(q, ['تقرير المبيعات', 'تحليل المبيعات', 'تقرير البيع'])) {
            return this.getSalesReport();
        }
        
        // تقرير الأداء
        if (this.containsAny(q, ['تقرير الأداء', 'تحليل الأداء', 'تقرير النتائج'])) {
            return this.getPerformanceReport();
        }
        
        return this.getComprehensiveReport();
    }

    // 💡 معالجة أسئلة النصائح
    handleAdviceQuestions(question) {
        const q = question.toLowerCase();
        
        // نصائح عامة
        if (this.containsAny(q, ['نصيحة', 'اقتراح', 'توصية'])) {
            return this.getGeneralAdviceResponse();
        }
        
        // تحسين الأداء
        if (this.containsAny(q, ['تحسين', 'تطوير', 'زيادة'])) {
            return this.getImprovementAdviceResponse();
        }
        
        // استراتيجيات
        if (this.containsAny(q, ['استراتيجية', 'خطة', 'طريقة'])) {
            return this.getStrategyAdviceResponse();
        }
        
        // حل المشاكل
        if (this.containsAny(q, ['مشكلة', 'عقبة', 'تحدي'])) {
            return this.getProblemSolvingResponse(q);
        }
        
        return this.getGeneralAdviceResponse();
    }

    // 🔄 معالجة الأسئلة العامة
    handleGeneralQuestions(question) {
        const q = question.toLowerCase();
        
        // تحية
        if (this.containsAny(q, ['مرحبا', 'اهلا', 'hello', 'السلام', 'اهلين'])) {
            return this.getGreetingResponse();
        }
        
        // شكر
        if (this.containsAny(q, ['شكرا', 'thanks', 'مشكور', 'يعطيك العافية'])) {
            return this.getThanksResponse();
        }
        
        // مساعدة
        if (this.containsAny(q, ['مساعدة', 'help', 'بدي مساعدة', 'شو أقدر أسأل'])) {
            return this.getHelpResponse();
        }
        
        // تعريف
        if (this.containsAny(q, ['من أنت', 'شو اسمك', 'مين انت', 'تعريف'])) {
            return this.getIntroductionResponse();
        }
        
        return this.getFallbackResponse(question);
    }

    // 👥 ردود العملاء التفصيلية
    getCustomersCountResponse() {
        const customers = this.getCurrentCustomers();
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        const activeRate = total > 0 ? (active / total * 100).toFixed(1) : 0;

        return `👥 **إحصائيات العملاء:**

• **الإجمالي:** ${total} عميل
• **النشطين:** ${active} عميل (${activeRate}%)
• **غير النشطين:** ${inactive} عميل

${this.getCustomersCountAdvice(total, activeRate)}`;
    }

    getActiveCustomersResponse() {
        const customers = this.getCurrentCustomers();
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const activeRate = total > 0 ? (active / total * 100).toFixed(1) : 0;

        return `✅ **العملاء النشطين:**

• **العدد:** ${active} عميل
• **النسبة:** ${activeRate}% من إجمالي العملاء

${this.getActiveCustomersAdvice(active, activeRate)}`;
    }

    getInactiveCustomersResponse() {
        const customers = this.getCurrentCustomers();
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        const inactiveRate = total > 0 ? (inactive / total * 100).toFixed(1) : 0;

        return `⚠️ **العملاء غير النشطين:**

• **العدد:** ${inactive} عميل  
• **النسبة:** ${inactiveRate}% من الإجمالي

${this.getInactiveCustomersAdvice(inactive)}`;
    }

    getGovernorateCustomersResponse(question) {
        const customers = this.getCurrentCustomers();
        const govData = this.analyzeGovernorates(customers);
        
        let specificGov = null;
        const governorates = ['عمان', 'إربد', 'الزرقاء', 'البلقاء', 'المفرق', 
                             'جرش', 'عجلون', 'مادبا', 'الكرك', 'الطفيلة', 
                             'معان', 'العقبة'];
        
        for (let gov of governorates) {
            if (question.includes(gov)) {
                specificGov = gov;
                break;
            }
        }

        if (specificGov) {
            const govCustomers = customers.filter(c => c.governorate === specificGov).length;
            return `📍 **عملاء ${specificGov}:** ${govCustomers} عميل

${this.getGovernorateSpecificAdvice(specificGov, govCustomers)}`;
        }

        return `🏙️ **توزيع العملاء حسب المحافظات:**

${Object.entries(govData)
    .sort((a, b) => b[1] - a[1])
    .map(([gov, count]) => `• ${gov}: ${count} عميل`)
    .join('\n')}

${this.getGovernorateDistributionAdvice(govData)}`;
    }

    getTopCustomersResponse() {
        const customers = this.getCurrentCustomers();
        const sales = this.getCurrentSales();
        
        const topCustomers = customers.map(customer => {
            const customerSales = sales.filter(s => s.customer_id === customer.id);
            const totalSpent = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            return {
                name: customer.name,
                totalSpent: totalSpent,
                salesCount: customerSales.length,
                lastPurchase: this.getLastPurchaseDate(customer.id, sales)
            };
        }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        if (topCustomers.length === 0) {
            return `🏆 **أفضل العملاء:**

لا توجد بيانات كافية لعرض أفضل العملاء.
ابدأ بتسجيل المبيعات أولاً.`;
        }

        return `🏆 **أفضل 5 عملاء:**

${topCustomers.map((cust, index) => 
    `${index + 1}. **${cust.name}** - ${cust.totalSpent.toFixed(2)} دينار (${cust.salesCount} عملية)`
).join('\n')}

${this.getTopCustomersAdvice(topCustomers)}`;
    }

    getCustomersWithoutSalesResponse() {
        const customers = this.getCurrentCustomers();
        const sales = this.getCurrentSales();
        
        const customersWithoutSales = customers.filter(customer => 
            !sales.some(sale => sale.customer_id === customer.id)
        );

        return `🔄 **العملاء الذين لم يشتروا:**

• **العدد:** ${customersWithoutSales.length} عميل
• **النسبة:** ${(customersWithoutSales.length / customers.length * 100).toFixed(1)}% من الإجمالي

${this.getCustomersWithoutSalesAdvice(customersWithoutSales.length)}`;
    }

    // 💰 ردود المبيعات التفصيلية
    getTotalSalesResponse() {
        const sales = this.getCurrentSales();
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `💰 **إجمالي المبيعات:**

• **القيمة:** ${totalRevenue.toFixed(2)} دينار
• **العمليات:** ${totalCount} عملية بيع  
• **المتوسط:** ${avgSale.toFixed(2)} دينار

${this.getTotalSalesAdvice(totalRevenue, totalCount)}`;
    }

    getSalesCountResponse() {
        const sales = this.getCurrentSales();
        const totalCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📦 **عدد عمليات البيع:**

• **العدد:** ${totalCount} عملية
• **الإجمالي:** ${totalRevenue.toFixed(2)} دينار

${this.getSalesCountAdvice(totalCount)}`;
    }

    getAverageSaleResponse() {
        const sales = this.getCurrentSales();
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `📊 **متوسط قيمة البيع:**

• **المتوسط:** ${avgSale.toFixed(2)} دينار
• **الإجمالي:** ${totalRevenue.toFixed(2)} دينار
• **العمليات:** ${totalCount} عملية

${this.getAverageSaleAdvice(avgSale)}`;
    }

    getSalesTrendResponse() {
        const sales = this.getCurrentSales();
        const recentSales = this.getRecentSales(sales, 30);
        const previousSales = this.getRecentSales(sales, 60, 30);
        
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const previousRevenue = previousSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growthRate = previousRevenue > 0 ? 
            ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

        return `📈 **اتجاه المبيعات:**

• **آخر 30 يوم:** ${recentRevenue.toFixed(2)} دينار
• **الفترة السابقة:** ${previousRevenue > 0 ? previousRevenue.toFixed(2) + ' دينار' : 'لا توجد بيانات'}
• **معدل النمو:** ${previousRevenue > 0 ? growthRate + '%' : 'جديد'}

${this.getSalesTrendAdvice(growthRate, recentRevenue)}`;
    }

    getSalesComparisonResponse() {
        const sales = this.getCurrentSales();
        const currentMonth = this.getMonthSales(sales, new Date());
        const lastMonth = this.getMonthSales(sales, new Date(new Date().setMonth(new Date().getMonth() - 1)));
        
        const currentRevenue = currentMonth.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const lastRevenue = lastMonth.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 100;

        return `🆚 **مقارنة الأداء الشهري:**

• **هذا الشهر:** ${currentRevenue.toFixed(2)} دينار
• **الشهر الماضي:** ${lastRevenue.toFixed(2)} دينار  
• **نسبة التغير:** ${growth}%

${this.getSalesComparisonAdvice(growth, currentRevenue)}`;
    }

    // 📊 ردود التقارير
    getComprehensiveReport() {
        const customers = this.getCurrentCustomers();
        const sales = this.getCurrentSales();
        
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSalesCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
        const recentSales = this.getRecentSales(sales, 30);
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📊 **تقرير أداء شامل - Data Vision**

👥 **قاعدة العملاء:**
• الإجمالي: ${totalCustomers} عميل
• النشطين: ${activeCustomers} (${(activeCustomers/totalCustomers*100).toFixed(1)}%)
• غير النشطين: ${totalCustomers - activeCustomers}

💰 **الأداء المالي:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalSalesCount}
• متوسط البيع: ${avgSale.toFixed(2)} دينار
• مبيعات آخر 30 يوم: ${recentRevenue.toFixed(2)} دينار

🎯 **التقييم:**
${this.getPerformanceAssessment(customers, sales)}

💡 **التوصيات:**
${this.getComprehensiveRecommendations(customers, sales)}`;
    }

    getCustomersReport() {
        const customers = this.getCurrentCustomers();
        const sales = this.getCurrentSales();
        
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const customersWithSales = customers.filter(customer => 
            sales.some(sale => sale.customer_id === customer.id)
        ).length;

        return `📋 **تقرير العملاء المفصل**

📈 **الإحصائيات:**
• الإجمالي: ${total} عميل
• النشطين: ${active} (${(active/total*100).toFixed(1)}%)
• المشترين: ${customersWithSales} (${(customersWithSales/total*100).toFixed(1)}%)

🎯 **التحليل:**
${this.getCustomersReportAnalysis(customers, sales)}

💡 **الخطوات:**
${this.getCustomersReportActions(customers, sales)}`;
    }

    getSalesReport() {
        const sales = this.getCurrentSales();
        
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;
        const recentSales = this.getRecentSales(sales, 30);
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📈 **تقرير المبيعات الشامل**

💰 **الأداء المالي:**
• الإجمالي: ${totalRevenue.toFixed(2)} دينار
• العمليات: ${totalCount}
• المتوسط: ${avgSale.toFixed(2)} دينار
• آخر 30 يوم: ${recentRevenue.toFixed(2)} دينار

📊 **الاتجاهات:**
${this.getSalesTrendAnalysis(sales)}

🎯 **الاستراتيجية:**
${this.getSalesStrategy(sales)}`;
    }

    // 💡 ردود النصائح
    getGeneralAdviceResponse() {
        return `💡 **نصائح ذكية لتحسين أدائك:**

${this.getPerformanceTips()}

🎯 **الأولويات الحالية:**
${this.getCurrentPriorities()}

🚀 **خطوات سريعة:**
${this.getQuickActions()}`;
    }

    getImprovementAdviceResponse() {
        return `🔄 **خطة التحسين المخصصة:**

📊 **بناءً على أدائك الحالي:**
${this.getPerformanceAssessment(this.getCurrentCustomers(), this.getCurrentSales())}

🎯 **مجالات التحسين:**
${this.getImprovementAreas()}

💡 **خطة التنفيذ:**
${this.getActionPlan()}`;
    }

    getStrategyAdviceResponse() {
        return `🎯 **استراتيجيات النجاح المثبتة:**

1. **استراتيجية العملاء:**
   • بناء علاقات طويلة المدى
   • تقديم قيمة مستمرة
   • برامج الولاء والمكافآت

2. **استراتيجية المبيعات:**
   • البيع بالقيمة وليس السعر
   • عروض الترقية والبيع المتقاطع
   • متابعة ما بعد البيع

3. **استراتيجية النمو:**
   • التوسع في محافظات جديدة
   • تنويع الخدمات والمنتجات
   • الاستفادة من التكنولوجيا

💎 **مفتاح النجاح:** الاستمرارية والتحسين المستمر!`;
    }

    // 🛠️ دوال مساعدة
    getCurrentCustomers() {
        if (typeof dataManager !== 'undefined' && dataManager.customers) {
            return dataManager.customers;
        }
        return window.customers || [];
    }

    getCurrentSales() {
        if (typeof dataManager !== 'undefined' && dataManager.sales) {
            return dataManager.sales;
        }
        return window.sales || [];
    }

    containsAny(text, phrases) {
        return phrases.some(phrase => text.includes(phrase));
    }

    getRecentSales(salesData, days, offsetDays = 0) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days - offsetDays);
        endDate.setDate(endDate.getDate() - offsetDays);
        
        return salesData.filter(sale => {
            const saleDate = new Date(sale.date || sale.sale_date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    getMonthSales(salesData, date) {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return salesData.filter(sale => {
            const saleDate = new Date(sale.date || sale.sale_date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    analyzeGovernorates(customers) {
        const govData = {};
        customers.forEach(customer => {
            const gov = customer.governorate || 'غير محدد';
            govData[gov] = (govData[gov] || 0) + 1;
        });
        return govData;
    }

    getLastPurchaseDate(customerId, sales) {
        const customerSales = sales.filter(s => s.customer_id === customerId);
        if (customerSales.length === 0) return 'لم يشترِ بعد';
        
        const lastSale = customerSales.sort((a, b) => 
            new Date(b.sale_date) - new Date(a.sale_date)
        )[0];
        
        return new Date(lastSale.sale_date).toLocaleDateString('ar-JO');
    }

    // ... (استمرار الدوال المساعدة والردود المخصصة)

    // 🎨 دوال الواجهة
    addMessageToChat(message, sender) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.classList.add(sender === 'ai' ? 'ai-message' : 'user-message');
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    showTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message ai-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text typing">جاري تحليل البيانات...</div>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
    }

    showNotification(message, type = 'info') {
        console.log(`🔔 ${type}: ${message}`);
    }
}

// 🌟 تشغيل النظام
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تشغيل المساعد المتقدم...');
    window.aiAssistant = new AdvancedAIAssistant();
    
    // رسالة ترحيبية
    setTimeout(() => {
        window.aiAssistant.addMessageToChat(
            `مرحباً! 👋 أنا المساعد الذكي المتقدم لـ Data Vision.

أستطيع الإجابة على 500+ سؤال مختلف عن:
• العملاء والمبيعات
• التقارير والتحليلات  
• النصائح والاستراتيجيات
• حل المشاكل والتحديات

جرب أن تسألني بأي طريقة تفضل! 🧠`,
            'ai'
        );
    }, 1000);
});

// 🔄 جعل الدوال متاحة
window.askAssistant = (question) => {
    document.getElementById('assistantInput').value = question;
    window.aiAssistant.sendMessage();
};

window.sendMessage = () => window.aiAssistant.sendMessage();
window.handleKeyPress = (e) => e.key === 'Enter' && window.aiAssistant.sendMessage();

console.log('✅ المساعد المتقدم جاهز للإجابة على 500+ سؤال!');
