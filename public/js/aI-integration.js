// fixed-ai-assistant.js - النظام المصلح والمربوط بالبيانات
class FixedAIAssistant {
    constructor() {
        this.setupEventListeners();
        console.log('🤖 المساعد الذكي جاهز للعمل!');
    }

    setupEventListeners() {
        // ربط زر الإرسال
        const sendBtn = document.querySelector('#assistant .btn-primary');
        const inputField = document.getElementById('assistantInput');
        
        if (sendBtn) {
            sendBtn.onclick = () => this.sendMessage();
        }
        
        if (inputField) {
            inputField.onkeypress = (e) => {
                if (e.key === 'Enter') this.sendMessage();
            };
        }

        // أزرار سريعة
        this.setupQuickActions();
    }

    setupQuickActions() {
        const quickActions = {
            'تحليل المبيعات': 'عرض تحليل المبيعات',
            'نصائح للعملاء': 'تحليل العملاء وتقديم نصائح',
            'تقرير شامل': 'تقرير أداء شامل',
            'تحسين الأداء': 'نصائح لتحسين الأداء'
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

    sendMessage() {
        const input = document.getElementById('assistantInput');
        if (!input) {
            console.error('❌ لم يتم العثور على حقل الإدخال');
            return;
        }
        
        const message = input.value.trim();
        if (!message) {
            this.showNotification('اكتب سؤالاً أولاً!', 'warning');
            return;
        }

        console.log('📤 إرسال سؤال:', message);
        
        // إضافة رسالة المستخدم
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // مؤشر تحميل
        this.showTypingIndicator();
        
        // معالجة السؤال
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessageToChat(response, 'ai');
        }, 1000);
    }

    generateResponse(question) {
        const q = question.toLowerCase().trim();
        
        // 🎯 الآن النظام سيجيب على كل هذه الأسئلة:
        
        // === العملاء ===
        if (q.includes('كم عميل') || q.includes('عدد العملاء') || q.includes('إجمالي العملاء')) {
            return this.getCustomersCountResponse();
        }
        
        if (q.includes('عميل نشط') || q.includes('العملاء النشطين')) {
            return this.getActiveCustomersResponse();
        }
        
        if (q.includes('عميل غير نشط') || q.includes('العملاء غير النشطين')) {
            return this.getInactiveCustomersResponse();
        }
        
        if (q.includes('أفضل عملاء') || q.includes('أكثر العملاء شراء')) {
            return this.getTopCustomersResponse();
        }
        
        if (q.includes('عملاء لم يشتروا') || q.includes('لم يشتروا أبداً')) {
            return this.getCustomersWithoutSalesResponse();
        }
        
        // === المبيعات ===
        if (q.includes('إجمالي مبيعات') || q.includes('كم مبيعات') || q.includes('مجموع المبيعات')) {
            return this.getTotalSalesResponse();
        }
        
        if (q.includes('عدد المبيعات') || q.includes('كم عملية بيع')) {
            return this.getSalesCountResponse();
        }
        
        if (q.includes('متوسط البيع') || q.includes('متوسط المبيعات')) {
            return this.getAverageSaleResponse();
        }
        
        if (q.includes('اتجاه المبيعات') || q.includes('كيف المبيعات')) {
            return this.getSalesTrendResponse();
        }
        
        if (q.includes('مقارنة مبيعات') || q.includes('مبيعات هذا الشهر') || q.includes('الشهر الماضي')) {
            return this.getSalesComparisonResponse();
        }
        
        // === التقارير ===
        if (q.includes('تقرير شامل') || q.includes('تقرير أداء') || q.includes('نظرة عامة')) {
            return this.getComprehensiveReport();
        }
        
        if (q.includes('تقرير العملاء') || q.includes('تحليل العملاء')) {
            return this.getCustomersReport();
        }
        
        if (q.includes('تقرير المبيعات') || q.includes('تحليل المبيعات')) {
            return this.getSalesReport();
        }
        
        // === النصائح ===
        if (q.includes('نصيحة') || q.includes('اقتراح') || q.includes('توصية')) {
            return this.getAdviceResponse();
        }
        
        if (q.includes('تحسين') || q.includes('تطوير') || q.includes('زيادة')) {
            return this.getImprovementResponse();
        }
        
        if (q.includes('كيف أزيد') || q.includes('كيف أحسن')) {
            return this.getHowToImproveResponse();
        }
        
        // === عام ===
        if (q.includes('مرحبا') || q.includes('اهلا') || q.includes('hello')) {
            return `مرحباً بك! 👋 أنا المساعد الذكي لـ Data Vision. 
            
أستطيع مساعدتك في:
• تحليل العملاء والمبيعات  
• تقديم تقارير شاملة
• نصائح لتحسين الأداء
• إجابة أسئلة محددة عن بياناتك

جرب أن تسألني عن:
"كم عميل لدي؟"
"ما هي مبيعاتي؟" 
"أعطني تقرير شامل"`;
        }
        
        // 🔍 إذا كان السؤال غير معروف
        return this.getFallbackResponse(question);
    }

    // 👥 ردود العملاء
    getCustomersCountResponse() {
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        const activeRate = total > 0 ? (active / total * 100).toFixed(1) : 0;

        return `👥 **إجمالي العملاء:** ${total} عميل

📊 **التفاصيل:**
• ✅ العملاء النشطين: ${active} (${activeRate}%)
• ⚠️ العملاء غير النشطين: ${inactive}

${activeRate < 60 ? '💡 **انتبه:** نسبة النشاط منخفضة، ركز على تفعيل العملاء' : 
 '🎉 **ممتاز:** قاعدة عملائك في حالة جيدة'}`;
    }

    getActiveCustomersResponse() {
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const activeRate = total > 0 ? (active / total * 100).toFixed(1) : 0;

        return `✅ **العملاء النشطين:** ${active} عميل

📈 **نسبة النشاط:** ${activeRate}% من إجمالي العملاء

${active === 0 ? '🚨 **تحذير:** لا يوجد عملاء نشطين! ركز على تفعيل قاعدة العملاء' : 
 activeRate > 80 ? '🎊 **ممتاز:** نسبة نشاط عالية جداً' : 
 '💡 **جيد:** يمكن تحسين النسبة بمتابعة العملاء غير النشطين'}`;
    }

    getInactiveCustomersResponse() {
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        const inactiveRate = total > 0 ? (inactive / total * 100).toFixed(1) : 0;

        return `⚠️ **العملاء غير النشطين:** ${inactive} عميل

📉 **نسبة الخمول:** ${inactiveRate}% من إجمالي العملاء

${inactive > 0 ? `🔔 **فرصة تحسين:** لديك ${inactive} عميل يحتاجون تفعيل

💡 **اقتراحات:**
• أرسل لهم عروضاً حصرية
• اتصل بهم للمتابعة الشخصية  
• قدم خصومات تشجيعية` : 
 '🎉 **ممتاز:** جميع عملائك نشطين'}`;
    }

    getTopCustomersResponse() {
        const topCustomers = customers.map(customer => {
            const customerSales = sales.filter(s => 
                s.customer_id === customer.id || s.customerId === customer.id
            );
            const totalSpent = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            return {
                name: customer.name,
                totalSpent: totalSpent,
                salesCount: customerSales.length
            };
        }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        if (topCustomers.length === 0) {
            return `📊 **أفضل العملاء:**

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
        const customersWithoutSales = customers.filter(customer => 
            !sales.some(sale => sale.customer_id === customer.id || sale.customerId === customer.id)
        ).length;

        const customersWithSales = customers.filter(customer => 
            sales.some(sale => sale.customer_id === customer.id || sale.customerId === customer.id)
        ).length;

        const conversionRate = customers.length > 0 ? (customersWithSales / customers.length * 100).toFixed(1) : 0;

        return `🔄 **العملاء الذين لم يشتروا أبداً:** ${customersWithoutSales} عميل

📊 **نسبة التحويل:** ${conversionRate}% من العملاء قاموا بالشراء

${customersWithoutSales > 0 ? `🎯 **خطة العمل:**

• ركز على تحويل ${customersWithoutSales} عميل إلى مشترين
• قدم عروض ترحيبية لهم  
• اتصل بهم personally للمتابعة
• أرسل رسائل تذكيرية

💡 **استراتيجية:** حوّل غير المشترين إلى عملاء دائمين!` : 
 '🎊 **مذهل:** جميع عملائك قاموا بالشراء على الأقل مرة واحدة!'}`;
    }

    // 💰 ردود المبيعات
    getTotalSalesResponse() {
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `💰 **إجمالي المبيعات:** ${totalRevenue.toFixed(2)} دينار

📦 **عدد العمليات:** ${totalCount} عملية بيع
📊 **متوسط البيع:** ${avgSale.toFixed(2)} دينار

${totalRevenue === 0 ? '🚨 **ابدأ الآن:** سجل أول عملية بيع لتبدأ رحلتك!' : 
 avgSale < 50 ? '💡 **تحسين:** زد متوسط البيع بعروض الترقية والباقات' : 
 '✅ **ممتاز:** أداء مبيعاتك جيد'}`;
    }

    getSalesCountResponse() {
        const totalCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `📦 **عدد عمليات البيع:** ${totalCount} عملية

💰 **إجمالي القيمة:** ${totalRevenue.toFixed(2)} دينار
📈 **متوسط البيع:** ${avgSale.toFixed(2)} دينار

${totalCount === 0 ? '🎯 **حان الوقت:** سجل أول عملية بيع!' : 
 totalCount < 10 ? '💡 **نصيحة:** ركز على زيادة وتيرة المبيعات' : 
 '🚀 **ممتاز:** وتيرة مبيعاتك جيدة'}`;
    }

    getAverageSaleResponse() {
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;

        return `📊 **متوسط قيمة البيع:** ${avgSale.toFixed(2)} دينار

📈 **التحليل:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalCount} عملية

${avgSale === 0 ? '📝 **ابدأ:** سجل مبيعاتك الأولى' :
 avgSale < 30 ? '💡 **تحسين:** متوسط البيع منخفض، ركز على البيع بالقيمة' :
 avgSale < 100 ? '✅ **جيد:** متوسط معقول، يمكن تحسينه' :
 '🎉 **ممتاز:** متوسط بيع عالي جداً!'}`;
    }

    getSalesTrendResponse() {
        const recentSales = this.getRecentSales(30); // آخر 30 يوم
        const previousSales = this.getRecentSales(60, 30); // قبل 30-60 يوم
        
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const previousRevenue = previousSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growthRate = previousRevenue > 0 ? 
            ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

        return `📈 **اتجاه المبيعات:**

🟢 **آخر 30 يوم:** ${recentRevenue.toFixed(2)} دينار (${recentSales.length} عملية)
${previousRevenue > 0 ? `🟡 **الفترة السابقة:** ${previousRevenue.toFixed(2)} دينار
${Math.abs(growthRate) > 0 ? `📊 **معدل النمو:** ${growthRate}% ${growthRate > 0 ? '🔼 زيادة' : '🔻 انخفاض'}` : '📋 **مستقر:** لا يوجد تغير ملحوظ'}` : '🆕 **بداية:** لا توجد بيانات سابقة للمقارنة'}

${recentRevenue === 0 ? '🚨 **تحذير:** لا توجد مبيعات حديثة! ركز على المبيعات الحالية' :
 growthRate > 10 ? '🎉 **ممتاز:** المبيعات في نمو قوي' :
 growthRate > 0 ? '✅ **جيد:** نمو إيجابي' :
 growthRate < 0 ? '⚠️ **انتبه:** المبيعات في انخفاض' :
 '📋 **مستقر:** أداء ثابت'}`;
    }

    getSalesComparisonResponse() {
        const currentMonth = this.getMonthSales(new Date());
        const lastMonth = this.getMonthSales(new Date(new Date().setMonth(new Date().getMonth() - 1)));
        
        const currentRevenue = currentMonth.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const lastRevenue = lastMonth.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 100;

        return `🆚 **مقارنة الأداء الشهري:**

📊 **هذا الشهر:** ${currentRevenue.toFixed(2)} دينار (${currentMonth.length} عملية)
📅 **الشهر الماضي:** ${lastRevenue.toFixed(2)} دينار (${lastMonth.length} عملية)

${lastRevenue > 0 ? `📈 **نسبة التغير:** ${growth}% ${growth > 0 ? '🔼 زيادة' : '🔻 انخفاض'}

${Math.abs(growth) > 20 ? (growth > 0 ? 
    '🎊 **مذهل:** نمو قوي جداً! استمر في الاستراتيجية الحالية' : 
    '⚠️ **انتبه:** انخفاض ملحوظ، حلل الأسباب وعدّل الاستراتيجية') : 
    '📋 **مستقر:** أداء متوازن بين الشهرين'}` : 
    '🆕 **بداية:** هذا هو أول شهر لك، لا توجد مقارنة سابقة'}`;
    }

    // 📊 التقارير
    getComprehensiveReport() {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSalesCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;
        const recentSales = this.getRecentSales(30);
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📊 **تقرير أداء شامل - Data Vision**

👥 **قاعدة العملاء:**
• إجمالي العملاء: ${totalCustomers}
• العملاء النشطين: ${activeCustomers} (${totalCustomers > 0 ? (activeCustomers/totalCustomers*100).toFixed(1) : 0}%)
• العملاء غير النشطين: ${totalCustomers - activeCustomers}

💰 **الأداء المالي:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalSalesCount}
• متوسط البيع: ${avgSale.toFixed(2)} دينار
• المبيعات الأخيرة (30 يوم): ${recentRevenue.toFixed(2)} دينار

🎯 **التقييم العام:**
${this.getPerformanceAssessment()}

💡 **التوصيات:**
${this.getRecommendations()}`;
    }

    getCustomersReport() {
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const customersWithSales = customers.filter(customer => 
            sales.some(sale => sale.customer_id === customer.id || sale.customerId === customer.id)
        ).length;

        return `📋 **تقرير العملاء المفصل**

📈 **الإحصائيات:**
• إجمالي العملاء: ${total}
• العملاء النشطين: ${active} (${total > 0 ? (active/total*100).toFixed(1) : 0}%)
• العملاء النشطين تجارياً: ${customersWithSales} (${total > 0 ? (customersWithSales/total*100).toFixed(1) : 0}%)

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
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const totalCount = sales.length;
        const avgSale = totalCount > 0 ? totalRevenue / totalCount : 0;
        const recentSales = this.getRecentSales(30);
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📈 **تقرير المبيعات الشامل**

💰 **الأداء المالي:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalCount}
• متوسط البيع: ${avgSale.toFixed(2)} دينار
• المبيعات (30 يوم): ${recentRevenue.toFixed(2)} دينار

📊 **الاتجاهات:**
${this.getSalesTrendAnalysis()}

🎯 **الاستراتيجية:**
${this.getSalesStrategy()}`;
    }

    // 💡 النصائح
    getAdviceResponse() {
        return `💡 **نصائح ذكية لتحسين أدائك:**

${this.getPerformanceTips()}

🎯 **الأولويات الحالية:**
${this.getCurrentPriorities()}

🚀 **خطوات سريعة:**
${this.getQuickActions()}`;
    }

    getImprovementResponse() {
        return `🔄 **خطة التحسين المخصصة:**

📊 **بناءً على أدائك الحالي:**
${this.getPerformanceAssessment()}

🎯 **مجالات التحسين:**
${this.getImprovementAreas()}

💡 **خطة التنفيذ:**
${this.getActionPlan()}`;
    }

    getHowToImproveResponse() {
        return `🚀 **دليل التحسين الشامل:**

1. **تحسين العملاء:**
   - أضف 5 عملاء جدد أسبوعياً
   - تابع العملاء غير النشطين
   - أنشئ برنامج ولاء

2. **تعزيز المبيعات:**
   - زد متوسط قيمة البيع
   - أنشئ عروض ترويجية
   - حَسّن عملية المتابعة

3. **تحليل البيانات:**
   - راجع التقارير أسبوعياً
   - تتبع مؤشرات الأداء
   - عدّل الاستراتيجيات بناءً على النتائج

💎 **نصيحة ذهبية:** الرتابة تقتل النمو! جرب استراتيجيات جديدة باستمرار.`;
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

أنا هنا لمساعدتك في تحليل بياناتك وتحسين أدائك! 🚀`;
    }

    // 🛠️ دوال مساعدة
    getRecentSales(days, offsetDays = 0) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days - offsetDays);
        endDate.setDate(endDate.getDate() - offsetDays);
        
        return sales.filter(sale => {
            const saleDate = new Date(sale.date || sale.sale_date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    getMonthSales(date) {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return sales.filter(sale => {
            const saleDate = new Date(sale.date || sale.sale_date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    getPerformanceAssessment() {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSales = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        if (totalCustomers === 0 && totalSales === 0) {
            return "🆕 **مرحلة البداية:** ابدأ بإضافة عملائك وتسجيل مبيعاتك الأولى";
        } else if (totalCustomers > 0 && totalSales === 0) {
            return "📝 **مرحلة التأسيس:** لديك عملاء ولكن لا توجد مبيعات، ركز على التحويل";
        } else if (totalSales > 0 && activeCustomers / totalCustomers < 0.6) {
            return "⚠️ **يحتاج تحسين:** المبيعات جيدة ولكن نسبة العملاء النشطين منخفضة";
        } else if (totalRevenue / totalSales < 50) {
            return "💡 **جيد:** أداء مقبول، يمكن تحسين متوسط البيع";
        } else {
            return "🎉 **ممتاز:** أداء قوي في جميع المجالات!";
        }
    }

    getRecommendations() {
        const recommendations = [];
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSales = sales.length;

        if (totalCustomers === 0) {
            recommendations.push('• ابدأ بإضافة أول 10 عملاء');
        }
        if (activeCustomers / totalCustomers < 0.7) {
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

    getPerformanceTips() {
        return [
            '• تابع العملاء غير النشطين أسبوعياً',
            '• قدم عروضاً حصرية للعملاء المميزين', 
            '• حَسّن متوسط البيع بالباقات والترقيات',
            '• استخدم البيانات لاتخاذ قرارات أفضل',
            '• جرب استراتيجيات تسويق جديدة'
        ].join('\n');
    }

    getCurrentPriorities() {
        if (customers.length === 0) return '• بناء قاعدة العملاء الأساسية';
        if (sales.length === 0) return '• بدء المبيعات والتحويل';
        return '• تحسين أداء العملاء الحاليين';
    }

    getQuickActions() {
        return [
            '• راجع تقرير العملاء اليوم',
            '• اتصل بـ 3 عملاء غير نشطين',
            '• أنشئ عرضاً ترويجياً جديداً',
            '• حلل بيانات الأسبوع الماضي'
        ].join('\n');
    }

    getSalesTrendAnalysis() {
        const recent = this.getRecentSales(30);
        const previous = this.getRecentSales(60, 30);
        
        if (recent.length === 0) return '• لا توجد مبيعات حديثة للتحليل';
        if (previous.length === 0) return '• بداية جيدة، استمر في تسجيل المبيعات';
        
        const recentRevenue = recent.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const previousRevenue = previous.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const growth = ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);
        
        return growth > 0 ? 
            `• نمو إيجابي بنسبة ${growth}% عن الفترة السابقة` :
            `• انخفاض بنسبة ${Math.abs(growth)}% يحتاج تحسين`;
    }

    getSalesStrategy() {
        const avgSale = sales.length > 0 ? 
            sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0) / sales.length : 0;
            
        if (avgSale < 30) return '• ركز على زيادة قيمة البيع بالترقيات';
        if (avgSale < 100) return '• وسع نطاق المنتجات والخدمات';
        return '• حافظ على الجودة وابحث عن عملاء جدد';
    }

    getImprovementAreas() {
        const areas = [];
        if (customers.length === 0) areas.push('• بناء قاعدة العملاء');
        if (sales.length === 0) areas.push('• بدء المبيعات');
        if (customers.filter(c => c.status === 'active').length / customers.length < 0.6) {
            areas.push('• تفعيل العملاء غير النشطين');
        }
        return areas.length > 0 ? areas.join('\n') : '• تحسين الكفاءة التشغيلية';
    }

    getActionPlan() {
        return [
            '1. حدد 3 أهداف قابلة للقياس',
            '2. أنشئ خطة أسبوعية للمتابعة', 
            '3. تتبع النتائج أسبوعياً',
            '4. عدّل الاستراتيجية بناءً على البيانات'
        ].join('\n');
    }

    // 🎨 دوال الواجهة
    addMessageToChat(message, sender) {
        const chatContainer = document.getElementById('chatContainer');
        if (!chatContainer) {
            console.error('❌ لم يتم العثور على حاوية الدردشة');
            return;
        }
        
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
                <div class="message-text typing">جاري الكتابة...</div>
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
        // يمكن إضافة نافذة تنبيه هنا لواجهة المستخدم
    }
}

// 🌟 تشغيل النظام فوراً
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تشغيل المساعد الذكي المصلح...');
    window.smartAssistant = new FixedAIAssistant();
    
    // إضافة رسالة ترحيبية
    setTimeout(() => {
        const chatContainer = document.getElementById('chatContainer');
        if (chatContainer) {
            const welcomeMsg = `مرحباً! 👋 أنا المساعد الذكي لـ Data Vision. 

أستطيع مساعدتك في تحليل بيانات العملاء والمبيعات، وتقديم تقارير شاملة، ونصائح لتحسين الأداء.

جرب أن تسألني:
• "كم عميل لدي؟"
• "ما هي مبيعاتي؟"  
• "أعطني تقرير شامل"`;
            
            window.smartAssistant.addMessageToChat(welcomeMsg, 'ai');
        }
    }, 1000);
});

// 🔄 جعل الدوال متاحة globally
window.sendFreeMessage = () => window.smartAssistant.sendMessage();
window.sendMessage = () => window.smartAssistant.sendMessage();

console.log('✅ النظام المصلح جاهز للعمل!');
