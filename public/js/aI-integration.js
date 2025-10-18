// super-ai-assistant.js - النظام الذكي المتكامل
class SuperAIAssistant {
    constructor() {
        this.dataAnalyzer = new DataAnalyzer();
        this.responseGenerator = new ResponseGenerator();
        this.reportEngine = new ReportEngine();
    }

    // 🧠 المحرك الرئيسي للذكاء الاصطناعي
    async processQuestion(question, context) {
        const analysis = this.analyzeQuestion(question);
        const data = this.dataAnalyzer.getRelevantData(analysis.category);
        const answer = this.generateSmartResponse(question, analysis, data, context);
        
        return {
            answer: answer,
            analysis: analysis,
            suggestions: this.getRelatedSuggestions(analysis.category),
            followUp: this.getFollowUpQuestions(analysis.category)
        };
    }

    // 🔍 تحليل السؤال وفهم النية
    analyzeQuestion(question) {
        const q = question.toLowerCase().trim();
        
        return {
            original: question,
            category: this.detectCategory(q),
            intent: this.detectIntent(q),
            urgency: this.detectUrgency(q),
            complexity: this.detectComplexity(q),
            keywords: this.extractKeywords(q)
        };
    }

    // 🎯 كشف فئة السؤال
    detectCategory(question) {
        const categories = {
            // العملاء
            'customers': ['عملاء', 'زبائن', 'عملائ', 'زبون', 'عميل', 'clients', 'customers'],
            'customers_basic': ['كم عميل', 'عدد العملاء', 'إجمالي العملاء', 'كم زبون'],
            'customers_analysis': ['تحليل العملاء', 'شريحة العملاء', 'أنماط العملاء', 'سلوك العملاء'],
            'customers_management': ['إضافة عميل', 'تعديل عميل', 'حذف عميل', 'بحث عن عميل'],
            
            // المبيعات
            'sales': ['مبيعات', 'بيع', 'مبلغ', 'إيرادات', 'ربح', 'sales', 'revenue'],
            'sales_basic': ['إجمالي مبيعات', 'كم بيع', 'عدد المبيعات', 'مجموع المبيعات'],
            'sales_analysis': ['تحليل المبيعات', 'اتجاه المبيعات', 'مقارنة مبيعات', 'أداء المبيعات'],
            'sales_comparison': ['مقارنة', 'الشهر الماضي', 'هذا الشهر', 'نسبة التغير'],
            
            // التقارير
            'reports': ['تقرير', 'تقارير', 'إحصائيات', 'إحصاءات', 'report', 'stats'],
            'reports_comprehensive': ['تقرير شامل', 'نظرة عامة', 'ملخص الأداء', 'نظرة شاملة'],
            'reports_periodic': ['تقرير شهري', 'تقرير أسبوعي', 'هذا الشهر', 'هذا الأسبوع'],
            
            // النصائح
            'advice': ['نصيحة', 'نصائح', 'اقتراح', 'توصية', 'advice', 'suggestion'],
            'improvement': ['تحسين', 'تطوير', 'زيادة', 'تحسين الأداء', 'كيف أزيد'],
            
            // الإعدادات
            'settings': ['إعدادات', 'ضبط', 'تصدير', 'استيراد', 'إدارة', 'settings']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => question.includes(keyword))) {
                return category;
            }
        }
        
        return 'general';
    }

    // 🎭 كشف النية من السؤال
    detectIntent(question) {
        if (question.includes('كم') || question.includes('عدد') || question.includes('كم عدد')) {
            return 'quantity';
        } else if (question.includes('كيف') || question.includes('طريقة') || question.includes('كيفية')) {
            return 'how_to';
        } else if (question.includes('ما هو') || question.includes('ما هي') || question.includes('ماذا')) {
            return 'what_is';
        } else if (question.includes('لماذا') || question.includes('سبب') || question.includes('لماذا')) {
            return 'why';
        } else if (question.includes('متى') || question.includes('وقت') || question.includes('تاريخ')) {
            return 'when';
        } else if (question.includes('أين') || question.includes('مكان') || question.includes('موقع')) {
            return 'where';
        } else if (question.includes('من') || question.includes('أي')) {
            return 'who_which';
        }
        
        return 'general_inquiry';
    }

    // 🧩 توليد رد ذكي مخصص
    generateSmartResponse(question, analysis, data, context) {
        const responseTemplates = {
            // === العملاء ===
            'customers_basic': this.generateCustomersBasicResponse(question, data),
            'customers_analysis': this.generateCustomersAnalysisResponse(question, data),
            'customers_management': this.generateCustomersManagementResponse(question, data),
            
            // === المبيعات ===
            'sales_basic': this.generateSalesBasicResponse(question, data),
            'sales_analysis': this.generateSalesAnalysisResponse(question, data),
            'sales_comparison': this.generateSalesComparisonResponse(question, data),
            
            // === التقارير ===
            'reports_comprehensive': this.generateComprehensiveReport(question, data),
            'reports_periodic': this.generatePeriodicReport(question, data),
            
            // === النصائح ===
            'advice': this.generateAdviceResponse(question, data),
            'improvement': this.generateImprovementResponse(question, data),
            
            // === عام ===
            'general': this.generateGeneralResponse(question, data)
        };

        return responseTemplates[analysis.category] || this.generateGeneralResponse(question, data);
    }

    // 👥 ردود العملاء الأساسية
    generateCustomersBasicResponse(question, data) {
        const totalCustomers = data.customers.length;
        const activeCustomers = data.customers.filter(c => c.status === 'active').length;
        const inactiveCustomers = totalCustomers - activeCustomers;
        const activeRate = totalCustomers > 0 ? (activeCustomers / totalCustomers * 100).toFixed(1) : 0;

        if (question.includes('كم عدد العملاء') || question.includes('إجمالي العملاء')) {
            return `👥 **إجمالي العملاء:** ${totalCustomers} عميل

📊 **التفاصيل:**
• العملاء النشطين: ${activeCustomers} (${activeRate}%)
• العملاء غير النشطين: ${inactiveCustomers}

${activeRate < 60 ? '💡 *انتبه: نسبة النشاط منخفضة، ركز على تفعيل العملاء*' : '✅ *ممتاز! قاعدة عملائك في حالة جيدة*'}`;
        }

        if (question.includes('كم عميل نشط')) {
            return `✅ **العملاء النشطين:** ${activeCustomers} عميل

📈 **نسبة النشاط:** ${activeRate}% من إجمالي العملاء

${activeCustomers === 0 ? '🚨 *لا يوجد عملاء نشطين! ركز على تفعيل قاعدة العملاء*' : 
 activeRate > 80 ? '🎉 *ممتاز! نسبة نشاط عالية جداً*' : 
 '💡 *جيد، يمكن تحسين النسبة بمتابعة العملاء غير النشطين*'}`;
        }

        if (question.includes('كم عميل غير نشط')) {
            return `⚠️ **العملاء غير النشطين:** ${inactiveCustomers} عميل

📉 **نسبة الخمول:** ${(100 - activeRate).toFixed(1)}% من إجمالي العملاء

${inactiveCustomers > 0 ? `🔔 **فرصة تحسين:** لديك ${inactiveCustomers} عميل يحتاجون تفعيل
💡 **اقتراح:** أرسل لهم عروضاً حصرية أو اتصل بهم للمتابعة` : 
 '🎊 **ممتاز! جميع عملائك نشطين**'}`;
        }
    }

    // 📈 ردود تحليل العملاء
    generateCustomersAnalysisResponse(question, data) {
        const customersWithSales = data.customers.filter(customer => 
            data.sales.some(sale => sale.customer_id === customer.id || sale.customerId === customer.id)
        ).length;

        const topCustomers = data.customers.map(customer => {
            const customerSales = data.sales.filter(s => 
                s.customer_id === customer.id || s.customerId === customer.id
            );
            const totalSpent = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            return { name: customer.name, totalSpent, salesCount: customerSales.length };
        }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        if (question.includes('أفضل عملاء') || question.includes('أكثر العملاء شراء')) {
            return `🏆 **أفضل 5 عملاء:**

${topCustomers.map((cust, index) => 
    `${index + 1}. **${cust.name}** - ${cust.totalSpent.toFixed(2)} دينار (${cust.salesCount} عملية)`
).join('\n')}

💎 **إجمالي مشترياتهم:** ${topCustomers.reduce((sum, cust) => sum + cust.totalSpent, 0).toFixed(2)} دينار`;
        }

        if (question.includes('عملاء لم يشتروا') || question.includes('لم يشتروا أبداً')) {
            const customersWithoutSales = data.customers.filter(customer => 
                !data.sales.some(sale => sale.customer_id === customer.id || sale.customerId === customer.id)
            ).length;

            return `🔄 **العملاء الذين لم يشتروا أبداً:** ${customersWithoutSales} عميل

📊 **نسبة التحويل:** ${((customersWithSales / data.customers.length) * 100).toFixed(1)}% من العملاء قاموا بالشراء

${customersWithoutSales > 0 ? `🎯 **خطة العمل:**
• ركز على تحويل ${customersWithoutSales} عميل إلى مشترين
• قدم عروض ترحيبية لهم
• اتصل بهم personally للمتابعة` : 
 '🎊 **مذهل! جميع عملائك قاموا بالشراء على الأقل مرة واحدة**'}`;
        }
    }

    // 💰 ردود المبيعات الأساسية
    generateSalesBasicResponse(question, data) {
        const totalSales = data.sales.length;
        const totalRevenue = data.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

        if (question.includes('إجمالي مبيعات') || question.includes('كم إجمالي المبيعات')) {
            return `💰 **إجمالي المبيعات:** ${totalRevenue.toFixed(2)} دينار

📦 **عدد العمليات:** ${totalSales} عملية بيع
📊 **متوسط البيع:** ${avgSale.toFixed(2)} دينار

${totalRevenue === 0 ? '🚨 *ابدأ بتسجيل مبيعاتك الأولى!*' : 
 avgSale < 50 ? '💡 *يمكنك زيادة متوسط قيمة البيع بعروض الترقية*' : 
 '✅ *أداء مبيعاتك جيد*'}`;
        }

        if (question.includes('كم عدد المبيعات') || question.includes('عدد عمليات البيع')) {
            return `📦 **عدد عمليات البيع:** ${totalSales} عملية

💰 **إجمالي القيمة:** ${totalRevenue.toFixed(2)} دينار
📈 **متوسط البيع:** ${avgSale.toFixed(2)} دينار

${totalSales === 0 ? '🎯 *حان الوقت لتسجيل أول عملية بيع!*' : 
 totalSales < 10 ? '💡 *ركز على زيادة وتيرة المبيعات*' : 
 '🚀 *وتيرة مبيعاتك ممتازة*'}`;
        }
    }

    // 📊 ردود تحليل المبيعات
    generateSalesAnalysisResponse(question, data) {
        const recentSales = this.getRecentSales(data.sales, 30); // آخر 30 يوم
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const previousSales = this.getRecentSales(data.sales, 60, 30); // قبل 30-60 يوم
        const previousRevenue = previousSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growthRate = previousRevenue > 0 ? 
            ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0;

        if (question.includes('اتجاه المبيعات') || question.includes('كيف المبيعات')) {
            return `📈 **اتجاه المبيعات:**

🟢 **آخر 30 يوم:** ${recentRevenue.toFixed(2)} دينار (${recentSales.length} عملية)
${previousRevenue > 0 ? `🟡 **الفترة السابقة:** ${previousRevenue.toFixed(2)} دينار
${Math.abs(growthRate) > 0 ? `📊 **معدل النمو:** ${growthRate}% ${growthRate > 0 ? '🔼' : '🔻'}` : ''}` : ''}

${recentRevenue === 0 ? '🚨 *لا توجد مبيعات حديثة! ركز على المبيعات الحالية*' :
 growthRate > 0 ? '🎉 *المبيعات في تحسن مستمر*' :
 growthRate < 0 ? '⚠️ *المبيعات تحتاج إلى تحسين*' :
 '📋 *المبيعات مستقرة*'}`;
        }
    }

    // 🆚 ردود المقارنات
    generateSalesComparisonResponse(question, data) {
        const currentMonthSales = this.getMonthSales(data.sales, new Date());
        const lastMonthSales = this.getMonthSales(data.sales, new Date(new Date().setMonth(new Date().getMonth() - 1)));
        
        const currentRevenue = currentMonthSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const lastRevenue = lastMonthSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        const growth = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 100;

        if (question.includes('مقارنة') || question.includes('الشهر الماضي')) {
            return `🆚 **مقارنة الأداء:**

📊 **هذا الشهر:** ${currentRevenue.toFixed(2)} دينار (${currentMonthSales.length} عملية)
📅 **الشهر الماضي:** ${lastRevenue.toFixed(2)} دينار (${lastMonthSales.length} عملية)

${lastRevenue > 0 ? `📈 **نسبة التغير:** ${growth}% ${growth > 0 ? '🔼 زيادة' : '🔻 انخفاض'}

${Math.abs(growth) > 20 ? (growth > 0 ? 
    '🎊 *أداء ممتاز! نمو قوي جداً*' : 
    '⚠️ *انخفاض ملحوظ، يحتاج تحليل أسباب*') : 
    '📋 *أداء مستقر*'}` : 
    '🆕 *لا توجد بيانات كافية للمقارنة*'}`;
        }
    }

    // 📋 التقارير الشاملة
    generateComprehensiveReport(question, data) {
        const totalCustomers = data.customers.length;
        const activeCustomers = data.customers.filter(c => c.status === 'active').length;
        const totalSales = data.sales.length;
        const totalRevenue = data.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;
        const recentSales = this.getRecentSales(data.sales, 30);
        const recentRevenue = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);

        return `📊 **تقرير أداء شامل - Data Vision**

👥 **قاعدة العملاء:**
• إجمالي العملاء: ${totalCustomers}
• العملاء النشطين: ${activeCustomers} (${(activeCustomers/totalCustomers*100).toFixed(1)}%)
• العملاء غير النشطين: ${totalCustomers - activeCustomers}

💰 **الأداء المالي:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalSales}
• متوسط البيع: ${avgSale.toFixed(2)} دينار
• المبيعات الأخيرة (30 يوم): ${recentRevenue.toFixed(2)} دينار

🎯 **التقييم العام:**
${this.getPerformanceAssessment(data)}

💡 **التوصيات الاستراتيجية:**
${this.getStrategicRecommendations(data)}`;
    }

    // 💡 النصائح والتحسينات
    generateAdviceResponse(question, data) {
        const assessment = this.getPerformanceAssessment(data);
        
        if (question.includes('نصيحة') || question.includes('اقتراح')) {
            return `💡 **نصائح مخصصة بناءً على أدائك:**

${assessment.recommendations.map(rec => `• ${rec}`).join('\n')}

🎯 **الأولويات:**
${assessment.priorities.map(priority => `• ${priority}`).join('\n')}

🚀 **خطوات التنفيذ:**
${assessment.actionSteps.map(step => `• ${step}`).join('\n')}`;
        }
    }

    // 🔧 ردود عامة
    generateGeneralResponse(question, data) {
        return `🤖 **مساعد Data Vision الذكي**

🔍 لاحظت أنك تسأل عن: "${question}"

💡 يمكنني مساعدتك في:
• تحليل العملاء والمبيعات
• تقديم تقارير شاملة
• نصائح لتحسين الأداء
• إجابة أسئلة محددة عن بياناتك

📊 **نظرة سريعة على أدائك:**
• ${data.customers.length} عميل
• ${data.sales.length} عملية بيع
• ${data.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0).toFixed(2)} دينار إيرادات

🎯 **جرب أن تسأل:**
"كم عميل نشط لدي؟"
"ما هو تحليل المبيعات؟" 
"أعطني تقرير شامل"`;
    }

    // 🛠️ دوال مساعدة
    getRecentSales(sales, days, offsetDays = 0) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days - offsetDays);
        endDate.setDate(endDate.getDate() - offsetDays);
        
        return sales.filter(sale => {
            const saleDate = new Date(sale.date || sale.sale_date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    getMonthSales(sales, date) {
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        return sales.filter(sale => {
            const saleDate = new Date(sale.date || sale.sale_date);
            return saleDate >= startDate && saleDate <= endDate;
        });
    }

    getPerformanceAssessment(data) {
        // تحليل شامل للأداء وإرجاع تقييم
        const totalCustomers = data.customers.length;
        const activeCustomers = data.customers.filter(c => c.status === 'active').length;
        const totalSales = data.sales.length;
        const totalRevenue = data.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        return {
            score: this.calculatePerformanceScore(data),
            status: this.getPerformanceStatus(data),
            recommendations: this.generateRecommendations(data),
            priorities: this.getPriorities(data),
            actionSteps: this.getActionSteps(data)
        };
    }

    calculatePerformanceScore(data) {
        // حساب درجة أداء من 100
        let score = 0;
        
        if (data.customers.length > 0) score += 30;
        if (data.sales.length > 0) score += 40;
        if (data.customers.filter(c => c.status === 'active').length > 0) score += 30;
        
        return Math.min(score, 100);
    }

    getPerformanceStatus(data) {
        const score = this.calculatePerformanceScore(data);
        
        if (score >= 80) return 'ممتاز';
        if (score >= 60) return 'جيد جداً';
        if (score >= 40) return 'جيد';
        if (score >= 20) return 'يحتاج تحسين';
        return 'مبتدئ';
    }

    generateRecommendations(data) {
        const recommendations = [];
        const totalCustomers = data.customers.length;
        const activeCustomers = data.customers.filter(c => c.status === 'active').length;
        const totalSales = data.sales.length;

        if (totalCustomers === 0) {
            recommendations.push('ابدأ بإضافة عملائك الأولين');
        } else if (activeCustomers / totalCustomers < 0.6) {
            recommendations.push(`ركز على تفعيل ${totalCustomers - activeCustomers} عميل غير نشط`);
        }

        if (totalSales === 0) {
            recommendations.push('سجل أول عملية بيع لبدء تحليل الأداء');
        } else if (totalSales < 10) {
            recommendations.push('زد وتيرة المبيعات لتحسين الإيرادات');
        }

        if (totalCustomers > 0 && totalSales > 0) {
            const salesPerCustomer = totalSales / totalCustomers;
            if (salesPerCustomer < 1.5) {
                recommendations.push('حسن معدل تكرار الشراء للعملاء الحاليين');
            }
        }

        return recommendations.length > 0 ? recommendations : ['أداؤك ممتاز! استمر في نفس الاستراتيجية'];
    }

    getPriorities(data) {
        const priorities = [];
        
        if (data.customers.length === 0) {
            priorities.push('بناء قاعدة العملاء');
        } else if (data.sales.length === 0) {
            priorities.push('بدء المبيعات والتسجيل');
        } else {
            priorities.push('تحسين أداء العملاء الحاليين');
            priorities.push('زيادة قيمة المبيعات');
            priorities.push('تحليل البيانات للتحسين المستمر');
        }
        
        return priorities;
    }

    getActionSteps(data) {
        return [
            'راجع تقارير الأداء بانتظام',
            'حدد الأهداف القابلة للقياس',
            'تابع تنفيذ الخطط التحسينية',
            'حلل نتائج التغييرات باستمرار'
        ];
    }

    getStrategicRecommendations(data) {
        const recommendations = [];
        
        if (data.customers.length < 10) {
            recommendations.push('• وسع قاعدة العملاء عبر التسويق المستهدف');
        }
        
        if (data.sales.length > 0) {
            const avgSale = data.sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0) / data.sales.length;
            if (avgSale < 100) {
                recommendations.push('• اعمل على زيادة متوسط قيمة البيع عبر الباقات والعروض');
            }
        }
        
        const activeRate = data.customers.length > 0 ? 
            (data.customers.filter(c => c.status === 'active').length / data.customers.length) : 0;
            
        if (activeRate < 0.7) {
            recommendations.push('• أنشئ برنامج ولاء لتحسين تفاعل العملاء');
        }
        
        return recommendations.length > 0 ? recommendations.join('\n') : '• استمر في الاستراتيجية الحالية مع مراقبة الأداء';
    }

    getRelatedSuggestions(category) {
        const suggestions = {
            'customers_basic': ['تحليل العملاء النشطين', 'عملاء لم يشتروا أبداً', 'أفضل العملاء'],
            'sales_basic': ['اتجاه المبيعات', 'مقارنة المبيعات', 'تحليل الربحية'],
            'reports_comprehensive': ['تقرير العملاء', 'تقرير المبيعات', 'نصائح التحسين'],
            'advice': ['تحليل الأداء', 'استراتيجيات النمو', 'تحسين الربحية']
        };
        
        return suggestions[category] || ['تحليل شامل', 'نصائح تحسين', 'تقارير أداء'];
    }

    getFollowUpQuestions(category) {
        const followUps = {
            'customers_basic': ['كيف أزيد عدد العملاء؟', 'ما هي أفضل طريقة لمتابعة العملاء؟'],
            'sales_basic': ['كيف أزيد حجم المبيعات؟', 'ما هو متوسط البيع المثالي؟'],
            'reports_comprehensive': ['كيف أحسن من هذه النتائج؟', 'ما هي الخطوات التالية؟']
        };
        
        return followUps[category] || ['كيف يمكنني تحسين الأداء؟', 'ما هي الخطوات التالية؟'];
    }
}

// 📊 محلل البيانات
class DataAnalyzer {
    getRelevantData(category) {
        return {
            customers: customers || [],
            sales: sales || [],
            settings: settings || {}
        };
    }
}

// 🎭 مولد الردود
class ResponseGenerator {
    // ... دوال مساعدة للردود المخصصة
}

// 📋 محرك التقارير
class ReportEngine {
    // ... دوال إنشاء التقارير المتقدمة
}

// 🌟 الاستخدام
const superAI = new SuperAIAssistant();

// 🔄 دالة الإرسال المحسنة
async function sendSmartMessage() {
    const input = document.getElementById('assistantInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addMessageToChat(message, 'user');
    input.value = '';
    
    // مؤشر تحميل
    showTypingIndicator();
    
    try {
        // معالجة السؤال بالذكاء الاصطناعي
        const context = {
            user: getCurrentUser(),
            timestamp: new Date(),
            previousQuestions: getChatHistory()
        };
        
        const response = await superAI.processQuestion(message, context);
        
        // إضافة الرد الذكي
        hideTypingIndicator();
        addMessageToChat(response.answer, 'ai');
        
        // إضافة الاقتراحات إن وجدت
        if (response.suggestions && response.suggestions.length > 0) {
            setTimeout(() => {
                addMessageToChat(`💡 **اقتراحات ذات صلة:**\n${response.suggestions.map(s => `• ${s}`).join('\n')}`, 'ai');
            }, 500);
        }
        
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat("⚠️ عذراً، حدث خطأ في المعالجة. جرب صيغة أخرى للسؤال.", 'ai');
    }
}

// 🔄 تحديث الدوال العالمية
window.sendFreeMessage = sendSmartMessage;
window.sendMessage = sendSmartMessage;

console.log('🚀 Super AI Assistant Loaded - Ready for Smart Conversations!');
