// aI-integration.js - مساعد ذكي حقيقي لتحليل البيانات
class SmartDataAssistant {
    constructor() {
        this.apis = [
            {
                name: "OpenRouter",
                url: "https://openrouter.ai/api/v1/chat/completions",
                method: "POST",
                headers: { 
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://datavision.com",
                    "X-Title": "Data Vision AI Assistant"
                },
                body: (msg, context) => JSON.stringify({
                    model: "google/gemini-pro",
                    messages: [
                        {
                            role: "system",
                            content: `أنت مساعد ذكي متخصص في تحليل بيانات الأعمال والتجارة. 
لديك البيانات التالية للتحليل:
${context}

تعليمات:
1. حلل البيانات بدقة ووضوح
2. قدم نصائح عملية قابلة للتطبيق
3. استخدم لغة عربية واضحة وسهلة
4. ركز على تحسين الأداء وزيادة المبيعات
5. قدم أرقام وإحصائيات محددة
6. اقترح خطط عمل عملية`
                        },
                        {
                            role: "user",
                            content: msg
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            }
        ];
    }

    // توليد تقرير تحليلي مفصل عن البيانات
    generateDataAnalysis() {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const inactiveCustomers = totalCustomers - activeCustomers;
        const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = sales.length > 0 ? totalSales / sales.length : 0;
        
        // تحليل المبيعات الأخيرة
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);
        const recentSales = sales.filter(s => {
            const saleDate = new Date(s.sale_date || s.date);
            return saleDate >= last30Days;
        });
        const recentSalesTotal = recentSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        
        // تحليل العملاء
        const customersWithSales = customers.filter(customer => {
            return sales.some(sale => sale.customer_id === customer.id || sale.customerId === customer.id);
        });
        
        // أفضل العملاء
        const topCustomers = customers.map(customer => {
            const customerSales = sales.filter(s => s.customer_id === customer.id || s.customerId === customer.id);
            const totalSpent = customerSales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
            return {
                name: customer.name,
                totalSpent: totalSpent,
                salesCount: customerSales.length
            };
        }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        return {
            summary: {
                totalCustomers,
                activeCustomers,
                inactiveCustomers,
                activeRate: totalCustomers > 0 ? (activeCustomers / totalCustomers * 100).toFixed(1) : 0,
                totalSales: sales.length,
                totalRevenue: totalSales,
                avgSale,
                recentSales: recentSales.length,
                recentRevenue: recentSalesTotal
            },
            analysis: {
                customerHealth: activeCustomers / totalCustomers >= 0.7 ? "جيد" : "يحتاج تحسين",
                salesTrend: recentSalesTotal > (totalSales / 3) ? "تصاعدي" : "ثابت",
                topCustomers,
                customersWithSales: customersWithSales.length,
                salesPerCustomer: customers.length > 0 ? (sales.length / customers.length).toFixed(1) : 0
            }
        };
    }

    // بناء سياق البيانات للذكاء الاصطناعي
    buildDataContext() {
        const analysis = this.generateDataAnalysis();
        
        return `📊 تحليل بيانات Data Vision:

👥 العملاء:
- إجمالي العملاء: ${analysis.summary.totalCustomers}
- العملاء النشطين: ${analysis.summary.activeCustomers} (${analysis.summary.activeRate}%)
- العملاء غير النشطين: ${analysis.summary.inactiveCustomers}

💰 المبيعات:
- إجمالي عمليات البيع: ${analysis.summary.totalSales}
- إجمالي الإيرادات: ${analysis.summary.totalRevenue.toFixed(2)} دينار
- متوسط قيمة البيع: ${analysis.summary.avgSale.toFixed(2)} دينار
- المبيعات الأخيرة (30 يوم): ${analysis.summary.recentSales} عملية (${analysis.summary.recentRevenue.toFixed(2)} دينار)

🎯 مؤشرات الأداء:
- صحة قاعدة العملاء: ${analysis.analysis.customerHealth}
- اتجاه المبيعات: ${analysis.analysis.salesTrend}
- عملاء قاموا بالشراء: ${analysis.analysis.customersWithSales}
- متوسط المبيعات لكل عميل: ${analysis.analysis.salesPerCustomer}

🏆 أفضل 5 عملاء:
${analysis.analysis.topCustomers.map((cust, index) => 
    `${index + 1}. ${cust.name} - ${cust.totalSpent.toFixed(2)} دينار (${cust.salesCount} عملية)`
).join('\n')}`;
    }

    async getAIResponse(userMessage) {
        const dataContext = this.buildDataContext();
        
        for (let api of this.apis) {
            try {
                console.log(`🔄 جرب ${api.name} مع تحليل البيانات...`);
                
                const response = await fetch(api.url, {
                    method: api.method,
                    headers: api.headers,
                    body: api.body(userMessage, dataContext)
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.choices[0]?.message?.content || this.getFallbackResponse(userMessage, dataContext);
                }
            } catch (error) {
                console.log(`❌ ${api.name} فشل:`, error.message);
                continue;
            }
        }
        
        return this.getFallbackResponse(userMessage, dataContext);
    }

    // رد بديل عندما لا يعمل API
    getFallbackResponse(userMessage, dataContext) {
        const analysis = this.generateDataAnalysis();
        
        if (userMessage.includes('مبيعات') || userMessage.includes('ربح') || userMessage.includes('إيرادات')) {
            return `💰 تحليل المبيعات بناءً على بياناتك:

• إجمالي المبيعات: ${analysis.summary.totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${analysis.summary.totalSales}
• متوسط البيع: ${analysis.summary.avgSale.toFixed(2)} دينار
• المبيعات الأخيرة: ${analysis.summary.recentSales} عملية (${analysis.summary.recentRevenue.toFixed(2)} دينار)

💡 توصيات:
${analysis.summary.recentSales === 0 ? '• ركز على زيادة المبيعات الحالية' : 
analysis.summary.avgSale < 50 ? '• اعمل على زيادة متوسط قيمة البيع' :
'• وسع قاعدة عملائك لزيادة المبيعات'}`;

        } else if (userMessage.includes('عملاء') || userMessage.includes('زبائن')) {
            return `👥 تحليل العملاء بناءً على بياناتك:

• إجمالي العملاء: ${analysis.summary.totalCustomers}
• العملاء النشطين: ${analysis.summary.activeCustomers} (${analysis.summary.activeRate}%)
• العملاء غير النشطين: ${analysis.summary.inactiveCustomers}
• عملاء قاموا بالشراء: ${analysis.analysis.customersWithSales}

💡 توصيات:
${analysis.summary.activeRate < 70 ? `• ركز على تفعيل ${analysis.summary.inactiveCustomers} عميل غير نشط` :
'• قاعدة عملائك في حالة جيدة، ركز على الاحتفاظ بهم'}
• نسبة التحويل: ${analysis.analysis.salesPerCustomer} عملية بيع لكل عميل`;

        } else if (userMessage.includes('تحليل') || userMessage.includes('تقرير')) {
            return `📊 التقرير الشامل بناءً على بياناتك:

${dataContext}

🎯 التوصيات الاستراتيجية:
1. ${analysis.summary.activeRate < 70 ? 'تحسين تفاعل العملاء غير النشطين' : 'الاحتفاظ بالعملاء النشطين'}
2. ${analysis.summary.recentSales < 10 ? 'زيادة وتيرة المبيعات' : 'تنويع قنوات البيع'}
3. ${analysis.analysis.topCustomers.length > 0 ? 'مكافأة أفضل العملاء' : 'بناء برنامج ولاء'}`;

        } else {
            return `🤖 مساعد Data Vision الذكي

بناءً على تحليل بياناتك:
• ${analysis.summary.totalCustomers} عميل
• ${analysis.summary.totalSales} عملية بيع 
• ${analysis.summary.totalRevenue.toFixed(2)} دينار إيرادات

💡 اسألني عن:
• "تحليل المبيعات"
• "تقرير العملاء" 
• "نصائح لزيادة الإيرادات"
• "كيف أحسن أدائي؟"

سأحلل بياناتك وأقدم نصائح مخصصة! 🚀`;
        }
    }
}

// الاستخدام
const smartAssistant = new SmartDataAssistant();

// ربط مع واجهتك
async function sendFreeMessage() {
    const input = document.getElementById('assistantInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (!message) return;
    
    // أضف رسالة المستخدم
    addMessageToChat(message, 'user');
    input.value = '';
    
    // مؤشر تحميل
    showTypingIndicator();
    
    try {
        // احصل على الرد الذكي
        const response = await smartAssistant.getAIResponse(message);
        
        // أضف الرد
        hideTypingIndicator();
        addMessageToChat(response, 'ai');
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat("⚠️ عذراً، حدث خطأ في التحليل. جرب سؤالاً آخر.", 'ai');
    }
}

// وظيفة إرسال رسالة (للتوافق مع الكود القديم)
async function sendMessage() {
    await sendFreeMessage();
}

// جعل الدوال متاحة globally
window.sendFreeMessage = sendFreeMessage;
window.sendMessage = sendMessage;
