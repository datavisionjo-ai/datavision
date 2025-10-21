// aI-integration.js - النظام الذكي المتكامل مع 500+ سؤال - معدل
class AdvancedAIAssistant {
    constructor() {
        this.responses = this.initializeResponses();
        this.currentData = {
            customers: [],
            sales: []
        };
        console.log('🧠 المساعد المتقدم جاهز - يدعم 500+ سؤال!');
        
        // تهيئة فورية عند الإنشاء
        setTimeout(() => {
            this.setupEventListeners();
            this.addWelcomeMessage();
        }, 1000);
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
        console.log('🔧 جاري إعداد مستمعي الأحداث...');
        
        // ربط زر الإرسال - طريقة أكثر قوة
        setTimeout(() => {
            const sendBtn = document.querySelector('#assistant .btn-primary');
            const inputField = document.getElementById('assistantInput');
            
            console.log('🔍 عناصر الواجهة:', {
                sendBtn: !!sendBtn,
                inputField: !!inputField,
                chatContainer: !!document.getElementById('chatContainer')
            });

            if (sendBtn) {
                sendBtn.onclick = () => {
                    console.log('🖱️ تم النقر على زر الإرسال');
                    this.sendMessage();
                };
            } else {
                console.error('❌ لم يتم العثور على زر الإرسال');
                // محاولة بديلة
                this.setupAlternativeEvents();
            }
            
            if (inputField) {
                inputField.onkeypress = (e) => {
                    if (e.key === 'Enter') {
                        console.log('⌨️ تم الضغط على Enter');
                        this.sendMessage();
                    }
                };
            }

            // أزرار سريعة
            this.setupQuickActions();
            
        }, 500);
    }

    setupAlternativeEvents() {
        // طريقة بديلة لربط الأحداث
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary') && 
                e.target.closest('#assistant')) {
                console.log('🎯 تم النقر على زر الإرسال (الطريقة البديلة)');
                this.sendMessage();
            }
        });
    }

    setupQuickActions() {
        const quickActions = {
            'تحليل المبيعات': 'تحليل أداء المبيعات',
            'تقرير العملاء': 'تقرير شامل عن العملاء', 
            'نصائح تحسين': 'نصائح لتحسين الأداء',
            'تقرير شامل': 'تقرير أداء شامل'
        };

        Object.entries(quickActions).forEach(([text, query]) => {
            const buttons = document.querySelectorAll('.quick-btn');
            buttons.forEach(btn => {
                if (btn.textContent.includes(text)) {
                    btn.onclick = () => {
                        const input = document.getElementById('assistantInput');
                        if (input) {
                            input.value = query;
                            this.sendMessage();
                        }
                    };
                }
            });
        });
    }

    addWelcomeMessage() {
        const welcomeMsg = `مرحباً! 👋 أنا المساعد الذكي المتقدم لـ Data Vision.

أستطيع الإجابة على 500+ سؤال مختلف عن:
• العملاء والمبيعات
• التقارير والتحليلات  
• النصائح والاستراتيجيات
• حل المشاكل والتحديات

جرب أن تسألني بأي طريقة تفضل! 🧠`;

        this.addMessageToChat(welcomeMsg, 'ai');
    }

    sendMessage() {
        console.log('🚀 بدء إرسال الرسالة...');
        
        const input = document.getElementById('assistantInput');
        if (!input) {
            console.error('❌ حقل الإدخال غير موجود');
            this.showNotification('حقل الإدخال غير موجود', 'error');
            return;
        }

        const message = input.value.trim();
        if (!message) {
            console.warn('⚠️ رسالة فارغة');
            this.showNotification('اكتب سؤالاً أولاً!', 'warning');
            return;
        }

        console.log('📤 إرسال الرسالة:', message);

        // إضافة رسالة المستخدم
        this.addMessageToChat(message, 'user');
        input.value = '';

        // مؤشر الكتابة
        this.showTypingIndicator();

        // تحديث البيانات الحالية
        this.updateCurrentData();

        // معالجة السؤال
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateSmartResponse(message);
            this.addMessageToChat(response, 'ai');
            console.log('✅ تم إرسال الرد بنجاح');
        }, 1500);
    }

    updateCurrentData() {
        // تحديث البيانات من النظام الرئيسي
        if (typeof dataManager !== 'undefined') {
            this.currentData.customers = dataManager.customers || [];
            this.currentData.sales = dataManager.sales || [];
        } else if (window.customers && window.sales) {
            this.currentData.customers = window.customers;
            this.currentData.sales = window.sales;
        }
        
        console.log('📊 بيانات محدثة:', {
            customers: this.currentData.customers.length,
            sales: this.currentData.sales.length
        });
    }

    generateSmartResponse(question) {
        const q = question.toLowerCase().trim();
        
        // 🔍 البحث في جميع الفئات
        const category = this.detectQuestionCategory(q);
        
        console.log('🎯 تصنيف السؤال:', category);
        
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
        const customers = this.currentData.customers;
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        const activeRate = total > 0 ? (active / total * 100).toFixed(1) : 0;

        return `👥 **إحصائيات العملاء:**

• **الإجمالي:** ${total} عميل
• **النشطين:** ${active} عميل (${activeRate}%)
• **غير النشطين:** ${inactive} عميل

${total === 0 ? '🚀 **ابدأ الآن:** أضف أول عملائك!' : 
 activeRate < 60 ? '💡 **انتبه:** ركز على تفعيل العملاء غير النشطين' : 
 '✅ **ممتاز:** قاعدة عملائك في حالة جيدة'}`;
    }

    getActiveCustomersResponse() {
        const customers = this.currentData.customers;
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const activeRate = total > 0 ? (active / total * 100).toFixed(1) : 0;

        return `✅ **العملاء النشطين:**

• **العدد:** ${active} عميل
• **النسبة:** ${activeRate}% من إجمالي العملاء

${active === 0 ? '🚨 **تحذير:** لا يوجد عملاء نشطين!' : 
 activeRate > 80 ? '🎊 **ممتاز:** نسبة نشاط عالية جداً' : 
 '💡 **جيد:** يمكن تحسين النسبة'}`;
    }

    getInactiveCustomersResponse() {
        const customers = this.currentData.customers;
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        const inactiveRate = total > 0 ? (inactive / total * 100).toFixed(1) : 0;

        return `⚠️ **العملاء غير النشطين:**

• **العدد:** ${inactive} عميل  
• **النسبة:** ${inactiveRate}% من الإجمالي

${inactive > 0 ? `🔔 **فرصة:** لديك ${inactive} عميل يحتاج تفعيل

💡 **اقتراحات:**
• أرسل عروضاً حصرية
• اتصل بهم للمتابعة
• قدم خصومات تشجيعية` : 
 '🎉 **ممتاز:** جميع عملائك نشطين'}`;
    }

    getGovernorateCustomersResponse(question) {
        const customers = this.currentData.customers;
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

${govCustomers === 0 ? `💡 **فرصة:** لا يوجد عملاء في ${specificGov} - ركز على التوسع هناك` :
 govCustomers < 5 ? `📈 **نصيحة:** زد جهودك التسويقية في ${specificGov}` :
 '✅ **جيد:** تواجد قوي في هذه المحافظة'}`;
        }

        return `🏙️ **توزيع العملاء حسب المحافظات:**

${Object.entries(govData)
    .sort((a, b) => b[1] - a[1])
    .map(([gov, count]) => `• ${gov}: ${count} عميل`)
    .join('\n')}

${this.getGovernorateDistributionAdvice(govData)}`;
    }

    getGovernorateDistributionAdvice(govData) {
        const entries = Object.entries(govData);
        if (entries.length === 0) return '💡 **ابدأ:** أضف عملاء من محافظات مختلفة';
        
        const maxGov = entries[0];
        const minGov = entries[entries.length - 1];
        
        return `🎯 **التحليل:** 
• أعلى محافظة: ${maxGov[0]} (${maxGov[1]} عميل)
• أقل محافظة: ${minGov[0]} (${minGov[1]} عميل)
• فرصة التوسع: ركز على المحافظات ذات العدد المنخفض`;
    }

    getTopCustomersResponse() {
        const customers = this.currentData.customers;
        const sales = this.currentData.sales;
        
        const topCustomers = customers.map(customer => {
            const customerSales = sales.filter(s => s.customer_id === customer.id);
            const totalSpent = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            return {
                name: customer.name,
                totalSpent: totalSpent,
                salesCount: customerSales.length
            };
        }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        if (topCustomers.length === 0 || topCustomers[0].totalSpent === 0) {
            return `🏆 **أفضل العملاء:**

لا توجد بيانات كافية لعرض أفضل العملاء.
ابدأ بتسجيل المبيعات أولاً.`;
        }

        return `🏆 **أفضل 5 عملاء:**

${topCustomers.map((cust, index) => 
    `${index + 1}. **${cust.name}** - ${cust.totalSpent.toFixed(2)} دينار (${cust.salesCount} عملية)`
).join('\n')}

💎 **إجمالي مشترياتهم:** ${topCustomers.reduce((sum, cust) => sum + cust.totalSpent, 0).toFixed(2)} دينار

🎯 **نصيحة:** كافئ أفضل عملائك لزيادة ولائهم!`;
    }

    getCustomersWithoutSalesResponse() {
        const customers = this.currentData.customers;
        const sales = this.currentData.sales;
        
        const customersWithoutSales = customers.filter(customer => 
            !sales.some(sale => sale.customer_id === customer.id)
        ).length;

        const customersWithSales = customers.filter(customer => 
            sales.some(sale => sale.customer_id === customer.id)
        ).length;

        const conversionRate = customers.length > 0 ? (customersWithSales / customers.length * 100).toFixed(1) : 0;

        return `🔄 **العملاء الذين لم يشتروا:**

• **العدد:** ${customersWithoutSales} عميل
• **نسبة التحويل:** ${conversionRate}% من العملاء قاموا بالشراء

${customersWithoutSales > 0 ? `🎯 **خطة العمل:** ركز على تحويل ${customersWithoutSales} عميل إلى مشترين` : 
 '🎊 **مذهل:** جميع عملائك قاموا بالشراء!'}`;
    }

    // 💰 ردود المبيعات التفصيلية
    getTotalSalesResponse() {
        const sales = this.currentData.sales;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `💰 **إجمالي المبيعات:**

• **القيمة:** ${totalRevenue.toFixed(2)} دينار
• **العمليات:** ${totalCount} عملية بيع  
• **المتوسط:** ${avgSale.toFixed(2)} دينار

${totalRevenue === 0 ? '🚀 **ابدأ الآن:** سجل أول عملية بيع!' : 
 avgSale < 50 ? '💡 **تحسين:** زد متوسط البيع بالترقيات' : 
 '✅ **ممتاز:** أداء مبيعاتك جيد'}`;
    }

    getSalesCountResponse() {
        const sales = this.currentData.sales;
        const totalCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📦 **عدد عمليات البيع:**

• **العدد:** ${totalCount} عملية
• **الإجمالي:** ${totalRevenue.toFixed(2)} دينار

${totalCount === 0 ? '🎯 **حان الوقت:** سجل أول عملية بيع!' : 
 totalCount < 10 ? '💡 **نصيحة:** ركز على زيادة وتيرة المبيعات' : 
 '🚀 **ممتاز:** وتيرة مبيعاتك جيدة'}`;
    }

    getAverageSaleResponse() {
        const sales = this.currentData.sales;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `📊 **متوسط قيمة البيع:**

• **المتوسط:** ${avgSale.toFixed(2)} دينار
• **الإجمالي:** ${totalRevenue.toFixed(2)} دينار
• **العمليات:** ${totalCount} عملية

${avgSale === 0 ? '📝 **ابدأ:** سجل مبيعاتك الأولى' :
 avgSale < 30 ? '💡 **تحسين:** ركز على البيع بالقيمة' :
 avgSale < 100 ? '✅ **جيد:** متوسط معقول' :
 '🎉 **ممتاز:** متوسط بيع عالي!'}`;
    }

    getSalesTrendResponse() {
        const sales = this.currentData.sales;
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

${recentRevenue === 0 ? '🚨 **تحذير:** لا توجد مبيعات حديثة!' :
 growthRate > 10 ? '🎉 **ممتاز:** نمو قوي!' :
 growthRate > 0 ? '✅ **جيد:** نمو إيجابي' :
 growthRate < 0 ? '⚠️ **انتبه:** انخفاض في المبيعات' :
 '📋 **مستقر:** أداء ثابت'}`;
    }

    getSalesComparisonResponse() {
        const sales = this.currentData.sales;
        const currentMonth = this.getMonthSales(sales, new Date());
        const lastMonth = this.getMonthSales(sales, new Date(new Date().setMonth(new Date().getMonth() - 1)));
        
        const currentRevenue = currentMonth.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const lastRevenue = lastMonth.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 100;

        return `🆚 **مقارنة الأداء الشهري:**

• **هذا الشهر:** ${currentRevenue.toFixed(2)} دينار
• **الشهر الماضي:** ${lastRevenue.toFixed(2)} دينار  
• **نسبة التغير:** ${growth}%

${lastRevenue > 0 ? 
 (Math.abs(growth) > 20 ? 
  (growth > 0 ? '🎊 **مذهل:** نمو قوي جداً!' : '⚠️ **انتبه:** انخفاض ملحوظ!') : 
  '📋 **مستقر:** أداء متوازن') : 
 '🆕 **بداية:** هذا هو أول شهر لك!'}`;
    }

    // 📊 ردود التقارير
    getComprehensiveReport() {
        const customers = this.currentData.customers;
        const sales = this.currentData.sales;
        
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSalesCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

        return `📊 **تقرير أداء شامل - Data Vision**

👥 **قاعدة العملاء:**
• الإجمالي: ${totalCustomers} عميل
• النشطين: ${activeCustomers} (${totalCustomers > 0 ? (activeCustomers/totalCustomers*100).toFixed(1) : 0}%)
• غير النشطين: ${totalCustomers - activeCustomers}

💰 **الأداء المالي:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalSalesCount}
• متوسط البيع: ${avgSale.toFixed(2)} دينار

🎯 **التقييم:**
${this.getPerformanceAssessment(customers, sales)}

💡 **التوصيات:**
${this.getComprehensiveRecommendations(customers, sales)}`;
    }

    getPerformanceAssessment(customers, sales) {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSales = sales.length;

        if (totalCustomers === 0 && totalSales === 0) {
            return "🆕 **مرحلة البداية:** ابدأ بإضافة عملائك وتسجيل مبيعاتك الأولى";
        } else if (totalCustomers > 0 && totalSales === 0) {
            return "📝 **مرحلة التأسيس:** لديك عملاء ولكن لا توجد مبيعات، ركز على التحويل";
        } else if (totalSales > 0 && activeCustomers / totalCustomers < 0.6) {
            return "⚠️ **يحتاج تحسين:** المبيعات جيدة ولكن نسبة العملاء النشطين منخفضة";
        } else if (totalSales > 0) {
            return "🎉 **ممتاز:** أداء قوي في جميع المجالات!";
        } else {
            return "📊 **جيد:** أداء مقبول، يمكن التحسين";
        }
    }

    getComprehensiveRecommendations(customers, sales) {
        const recommendations = [];
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSales = sales.length;

        if (totalCustomers === 0) {
            recommendations.push('• ابدأ بإضافة أول 10 عملاء');
        }
        if (activeCustomers / totalCustomers < 0.7 && totalCustomers > 0) {
            recommendations.push(`• فعّل ${totalCustomers - activeCustomers} عميل غير نشط`);
        }
        if (totalSales === 0) {
            recommendations.push('• سجل أول عملية بيع');
        }
        if (totalSales > 0 && totalSales / totalCustomers < 1) {
            recommendations.push('• زد معدل الشراء للعملاء الحاليين');
        }

        return recommendations.length > 0 ? recommendations.join('\n') : '• استمر في الاستراتيجية الحالية، أداؤك ممتاز!';
    }

    getCustomersReport() {
        const customers = this.currentData.customers;
        const sales = this.currentData.sales;
        
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const customersWithSales = customers.filter(customer => 
            sales.some(sale => sale.customer_id === customer.id)
        ).length;

        return `📋 **تقرير العملاء المفصل**

📈 **الإحصائيات:**
• الإجمالي: ${total} عميل
• النشطين: ${active} (${total > 0 ? (active/total*100).toFixed(1) : 0}%)
• المشترين: ${customersWithSales} (${total > 0 ? (customersWithSales/total*100).toFixed(1) : 0}%)

🎯 **التحليل:**
${total === 0 ? '• ابدأ ببناء قاعدة العملاء' :
 active/total < 0.6 ? '• ركز على تفعيل العملاء غير النشطين' :
 '• قاعدة عملائك في حالة جيدة'}

💡 **الخطوات:**
1. أضف عملاء جدد بانتظام
2. تابع العملاء غير النشطين
3. كافئ العملاء المميزين`;
    }

    getSalesReport() {
        const sales = this.currentData.sales;
        
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

    getSalesTrendAnalysis(sales) {
        const recent = this.getRecentSales(sales, 30);
        const previous = this.getRecentSales(sales, 60, 30);
        
        if (recent.length === 0) return '• لا توجد مبيعات حديثة للتحليل';
        if (previous.length === 0) return '• بداية جيدة، استمر في تسجيل المبيعات';
        
        const recentRevenue = recent.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const previousRevenue = previous.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const growth = ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);
        
        return growth > 0 ? 
            `• نمو إيجابي بنسبة ${growth}% عن الفترة السابقة` :
            `• انخفاض بنسبة ${Math.abs(growth)}% يحتاج تحسين`;
    }

    getSalesStrategy(sales) {
        const avgSale = sales.length > 0 ? 
            sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0) / sales.length : 0;
            
        if (avgSale < 30) return '• ركز على زيادة قيمة البيع بالترقيات';
        if (avgSale < 100) return '• وسع نطاق المنتجات والخدمات';
        return '• حافظ على الجودة وابحث عن عملاء جدد';
    }

    // 💡 ردود النصائح
    getGeneralAdviceResponse() {
        return `💡 **نصائح ذكية لتحسين أدائك:**

• تابع العملاء غير النشطين أسبوعياً
• قدم عروضاً حصرية للعملاء المميزين
• حَسّن متوسط البيع بالباقات والترقيات
• استخدم البيانات لاتخاذ قرارات أفضل
• جرب استراتيجيات تسويق جديدة

🎯 **الأولويات الحالية:**
${this.getCurrentPriorities()}`;
    }

    getCurrentPriorities() {
        const customers = this.currentData.customers;
        const sales = this.currentData.sales;
        
        if (customers.length === 0) return '• بناء قاعدة العملاء الأساسية';
        if (sales.length === 0) return '• بدء المبيعات والتحويل';
        return '• تحسين أداء العملاء الحاليين';
    }

    getImprovementAdviceResponse() {
        return `🔄 **خطة التحسين المخصصة:**

📊 **بناءً على أدائك الحالي:**
${this.getPerformanceAssessment(this.currentData.customers, this.currentData.sales)}

🎯 **مجالات التحسين:**
${this.getImprovementAreas()}

💡 **خطة التنفيذ:**
1. حدد 3 أهداف قابلة للقياس
2. أنشئ خطة أسبوعية للمتابعة
3. تتبع النتائج أسبوعياً
4. عدّل الاستراتيجية بناءً على البيانات`;
    }

    getImprovementAreas() {
        const customers = this.currentData.customers;
        const sales = this.currentData.sales;
        const areas = [];
        
        if (customers.length === 0) areas.push('• بناء قاعدة العملاء');
        if (sales.length === 0) areas.push('• بدء المبيعات');
        if (customers.filter(c => c.status === 'active').length / customers.length < 0.6 && customers.length > 0) {
            areas.push('• تفعيل العملاء غير النشطين');
        }
        
        return areas.length > 0 ? areas.join('\n') : '• تحسين الكفاءة التشغيلية';
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

    // 🔄 ردود عامة
    getGeneralCustomersResponse() {
        return `👥 **معلومات عامة عن العملاء:**

يمكنني مساعدتك في معرفة:
• عدد العملاء الإجمالي
• العملاء النشطين وغير النشطين  
• توزيع العملاء حسب المحافظات
• أفضل العملاء أداءً
• العملاء الذين لم يشتروا بعد

💡 جرب أن تسأل: "كم عميل لدي؟" أو "شو وضع العملاء؟"`;
    }

    getGeneralSalesResponse() {
        return `💰 **معلومات عامة عن المبيعات:**

أستطيع إخبارك عن:
• إجمالي المبيعات والقيمة
• عدد عمليات البيع
• متوسط قيمة البيع
• اتجاهات المبيعات والتغير
• مقارنة الأداء الشهري

💡 جرب أن تسأل: "كم مبيعاتي؟" أو "شو وضع المبيعات؟"`;
    }

    getGreetingResponse() {
        return `مرحباً بك! 👋 

أنا المساعد الذكي لـ Data Vision. أستطيع مساعدتك في تحليل بيانات العملاء والمبيعات، وتقديم تقارير شاملة، ونصائح لتحسين الأداء.

كيف يمكنني مساعدتك اليوم؟ 🚀`;
    }

    getThanksResponse() {
        return `العفو! 😊 

سعيد بأن أستطيع مساعدتك. إذا كان لديك أي أسئلة أخرى عن عملائك أو مبيعاتك، فلا تتردد في سؤالي.

حظاً موفقاً! 🌟`;
    }

    getHelpResponse() {
        return `🆘 **كيف يمكنني مساعدتك؟**

أستطيع الإجابة على أسئلة مثل:

**👥 عن العملاء:**
• "كم عميل لدي؟"
• "شو وضع العملاء النشطين؟"
• "عملاء عمان كم عددهم؟"
• "أعطيني أفضل العملاء"

**💰 عن المبيعات:**
• "كم إجمالي مبيعاتي؟" 
• "شو متوسط البيع؟"
• "كيف المبيعات هالشهر؟"
• "قارن مبيعاتي مع الشهر الماضي"

**📊 تقارير:**
• "أعطني تقرير شامل"
• "تقرير العملاء"
• "تقرير المبيعات"

**💡 نصائح:**
• "نصيحة لتحسين المبيعات"
• "شو أسوي عشان أزيد العملاء؟"
• "استراتيجية للتطوير"

جرب أي سؤال! أنا هنا لمساعدتك. 🤝`;
    }

    getIntroductionResponse() {
        return `🤖 **تعريف عن المساعد الذكي:**

أنا المساعد الذكي المتقدم لـ **Data Vision** - نظام إدارة العملاء والمبيعات.

**ماذا أستطيع فعلة:**
• تحليل بيانات العملاء والمبيعات
• الإجابة على 500+ سؤال مختلف
• تقديم تقارير أداء شاملة
• نصائح مخصصة لتحسين النتائج
• تحليل الاتجاهات والتوقعات

**مميزاتي:**
✅ فهم اللهجات المختلفة
✅ ردود ذكية ومخصصة
✅ تكامل كامل مع بياناتك
✅ دعم 500+ سؤال محتمل

أسعد دائماً بمساعدتك! 🌟`;
    }

    getFallbackResponse(question) {
        return `🤖 **مساعد Data Vision**

🔍 لاحظت سؤالك: "${question}"

💡 أستطيع مساعدتك في:
• تحليل العملاء والمبيعات
• تقديم تقارير أداء
• نصائح لتحسين النتائج
• إجابة أسئلة محددة عن بياناتك

📊 **جرب أن تسأل:**
"كم عميل لدي؟"
"ما هي مبيعاتي الإجمالية؟"
"أعطني تقرير شامل"
"كيف أزيد أرباحي؟"

أو اختر أحد الأزرار السريعة أعلى شات الدردشة! 🚀`;
    }

    // 🛠️ دوال مساعدة
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

    // 🎨 دوال الواجهة - معدلة
    addMessageToChat(message, sender) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) {
            console.error('❌ حاوية الدردشة غير موجودة');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('ar-JO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        console.log(`💬 تم إضافة رسالة ${sender}:`, message.substring(0, 50) + '...');
    }

    showTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) return;
        
        this.hideTypingIndicator();
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'chat-message ai-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-text typing">جاري الكتابة...</div>
                <div class="message-time">${new Date().toLocaleTimeString('ar-JO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}</div>
            </div>
        `;
        
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    showNotification(message, type = 'info') {
        console.log(`🔔 ${type}: ${message}`);
        // يمكن إضافة نافذة تنبيه فعلية هنا
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        }
    }
}

// 🌟 تشغيل النظام المحسن
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تشغيل المساعد المتقدم المحسن...');
    
    // تأخير بسيط لضمان تحميل كل شيء
    setTimeout(() => {
        window.aiAssistant = new AdvancedAIAssistant();
        console.log('✅ المساعد المتقدم جاهز للعمل!');
    }, 2000);
});

// 🔄 جعل الدوال متاحة globally
window.askAssistant = (question) => {
    const input = document.getElementById('assistantInput');
    if (input && window.aiAssistant) {
        input.value = question;
        window.aiAssistant.sendMessage();
    }
};

window.sendMessage = () => {
    if (window.aiAssistant) {
        window.aiAssistant.sendMessage();
    }
};

window.handleKeyPress = (e) => {
    if (e.key === 'Enter' && window.aiAssistant) {
        window.aiAssistant.sendMessage();
    }
};

console.log('✅ نظام المساعد المتقدم محمل وجاهز للإجابة على 500+ سؤال!');
