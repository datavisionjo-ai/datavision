// enhanced-ai-assistant.js - النظام المحسن لفهم الأخطاء الإملائية
class EnhancedAIAssistant {
    constructor() {
        this.spellCorrections = this.createSpellCorrections();
        this.setupEventListeners();
    }

    // 🎯 قاعدة بيانات التصحيحات الإملائية
    createSpellCorrections() {
        return {
            // العملاء
            'عملاء': ['عملاء', 'عملا', 'عما', 'عملاه', 'عملااء'],
            'زبائن': ['زبائن', 'زباين', 'زبين', 'زابئن', 'زبائين'],
            'نشطين': ['نشطين', 'نشطيين', 'نشطيين', 'نشطن', 'نشطين'],
            'نشط': ['نشط', 'نشطط', 'نشتط', 'نشطط'],
            
            // المبيعات
            'مبيعات': ['مبيعات', 'مبيعات', 'مبيعاته', 'مبيعاتي', 'مبيعاث'],
            'ربح': ['ربح', 'ربحح', 'ربحه', 'ربحى', 'ربح'],
            'ايرادات': ['ايرادات', 'إيرادات', 'ايرادت', 'ايراداث', 'ايراددات'],
            'دينار': ['دينار', 'دينارر', 'دينار', 'ديناار', 'دينار'],
            
            // الأسئلة الشائعة
            'كم': ['كم', 'كام', 'كمم', 'كلم', 'كعم'],
            'عدد': ['عدد', 'عددد', 'اعدد', 'عد', 'ععد'],
            'ما هو': ['ما هو', 'ماهو', 'ماةو', 'ماهوو', 'ماهو'],
            'كيف': ['كيف', 'كيفف', 'كيفة', 'كيف', 'كيف'],
            
            // التقارير
            'تقرير': ['تقرير', 'تقريرر', 'تقارير', 'تقرير', 'تقرير'],
            'تحليل': ['تحليل', 'تحلييل', 'تحلييل', 'تحليل', 'تحليل'],
            'نصيحة': ['نصيحة', 'نصيحه', 'نصييحة', 'نصيححة', 'نصيحة'],
            
            // الأفعال
            'أعطيني': ['أعطيني', 'اعطيني', 'عطيني', 'أعطيني', 'اعطيني'],
            'أريد': ['أريد', 'اريد', 'أرييد', 'اريد', 'أريد'],
            'عرض': ['عرض', 'عرضض', 'عرد', 'عرض', 'عرض']
        };
    }

    // 🔧 تحسين دالة معالجة السؤال لفهم الأخطاء
    generateResponse(question) {
        const correctedQuestion = this.correctSpelling(question);
        const q = correctedQuestion.toLowerCase().trim();
        
        console.log('🔍 السؤال الأصلي:', question);
        console.log('✅ السؤال المصحح:', correctedQuestion);
        
        // الآن نعالج السؤال المصحح
        return this.processCorrectedQuestion(q, question);
    }

    // 🛠️ تصحيح الأخطاء الإملائية
    correctSpelling(question) {
        let corrected = question;
        
        // تصحيح الكلمات الشائعة
        Object.entries(this.spellCorrections).forEach(([correct, wrongVariations]) => {
            wrongVariations.forEach(wrong => {
                const regex = new RegExp(wrong, 'gi');
                corrected = corrected.replace(regex, correct);
            });
        });

        // تصحيحات إضافية للنمط
        corrected = corrected
            .replace(/ة\s/gi, 'ه ') // تحويل التاء المربوطة في نهاية الكلمة
            .replace(/ى\b/gi, 'ي')  // تحويل الألف المقصورة إلى ياء
            .replace(/ئ\b/gi, 'ي')  // تحويل الياء المنقوطة
            .replace(/إ/gi, 'ا')    //统一همزة
            .replace(/أ/gi, 'ا')    //统一همزة
            .replace(/آ/gi, 'ا');   //统一همزة

        return corrected;
    }

    // 🎯 معالجة السؤال المصحح
    processCorrectedQuestion(correctedQuestion, originalQuestion) {
        const q = correctedQuestion;

        // 🎪 الآن النظام سيفهم كل هذه الأخطاء ويجاوب عليها:

        // === العملاء بأخطاء إملائية ===
        if (this.fuzzyMatch(q, ['كم عميل', 'كام عميل', 'كم عملا', 'عدد العملاء', 'عدد عملا'])) {
            return this.getCustomersCountResponse();
        }
        
        if (this.fuzzyMatch(q, ['عميل نشط', 'عملا نشط', 'عما نشط', 'العملاء النشطين', 'العملاء النشطيين'])) {
            return this.getActiveCustomersResponse();
        }
        
        if (this.fuzzyMatch(q, ['عميل غير نشط', 'عملا مش نشط', 'العملاء المش نشطين', 'العملاء الغير نشطين'])) {
            return this.getInactiveCustomersResponse();
        }
        
        if (this.fuzzyMatch(q, ['افضل عملاء', 'احسن عملاء', 'اكثر العملاء شراء', 'اكتر العملاء شرا'])) {
            return this.getTopCustomersResponse();
        }
        
        // === المبيعات بأخطاء إملائية ===
        if (this.fuzzyMatch(q, ['مبيعات', 'مبيعاث', 'مبيعاتي', 'ايرادات', 'ربح'])) {
            if (q.includes('كم') || q.includes('مجموع') || q.includes('إجمالي')) {
                return this.getTotalSalesResponse();
            }
        }
        
        if (this.fuzzyMatch(q, ['عدد المبيعات', 'كام عملية بيع', 'كم عملية بيع', 'عدد عمليات البيع'])) {
            return this.getSalesCountResponse();
        }
        
        if (this.fuzzyMatch(q, ['متوسط البيع', 'متوسط بيع', 'متوسط المبيعات', 'متوى البيع'])) {
            return this.getAverageSaleResponse();
        }
        
        // === التقارير بأخطاء إملائية ===
        if (this.fuzzyMatch(q, ['تقرير شامل', 'تقرير شامِل', 'تقرير', 'تقارير', 'تحليل شامل'])) {
            return this.getComprehensiveReport();
        }
        
        if (this.fuzzyMatch(q, ['تقرير العملاء', 'تحليل العملاء', 'تقرير عمال', 'تحليل عمال'])) {
            return this.getCustomersReport();
        }
        
        if (this.fuzzyMatch(q, ['تقرير المبيعات', 'تحليل المبيعات', 'تقرير مبيعاث', 'تحليل مبيعاث'])) {
            return this.getSalesReport();
        }
        
        // === النصائح بأخطاء إملائية ===
        if (this.fuzzyMatch(q, ['نصيحة', 'نصيحه', 'نصايح', 'اقتراح', 'توصية'])) {
            return this.getAdviceResponse();
        }
        
        if (this.fuzzyMatch(q, ['تحسين', 'تطوير', 'تطوير', 'زيادة', 'تحسينات'])) {
            return this.getImprovementResponse();
        }
        
        // === أسئلة متنوعة بأخطاء ===
        if (this.fuzzyMatch(q, ['كيف ازيد', 'كيف ازيد', 'كيفة ازيد', 'كيف ازود'])) {
            return this.getHowToImproveResponse();
        }
        
        if (this.fuzzyMatch(q, ['شو وضعي', 'شو احصائياتي', 'شو ارقامي', 'وين انا'])) {
            return this.getComprehensiveReport();
        }
        
        if (this.fuzzyMatch(q, ['بدي', 'ابغي', 'عايز', 'اريد', 'نبي'])) {
            return this.getDesireResponse(q);
        }

        // 🔍 إذا كان السؤال غير معروف حتى بعد التصحيح
        return this.getSmartFallbackResponse(originalQuestion, correctedQuestion);
    }

    // 🎪 مطابقة ضبابية لفهم الأسئلة المشابهة
    fuzzyMatch(text, patterns) {
        return patterns.some(pattern => {
            const similarity = this.calculateSimilarity(text, pattern);
            return similarity > 0.7; // 70% تشابه
        });
    }

    // 📊 حساب التشابه بين النصوص
    calculateSimilarity(text1, text2) {
        const words1 = text1.split(' ');
        const words2 = text2.split(' ');
        
        const commonWords = words1.filter(word => 
            words2.some(w2 => this.wordsSimilar(word, w2))
        );
        
        return commonWords.length / Math.max(words1.length, words2.length);
    }

    // 🔄 مقارنة كلمات متشابهة
    wordsSimilar(word1, word2) {
        if (word1 === word2) return true;
        
        // كلمات متشابهة صوتياً
        const similarWords = {
            'كم': ['كام', 'كلم', 'كمم'],
            'عميل': ['عملا', 'عما', 'عميل'],
            'مبيعات': ['مبيعاث', 'مبيعات', 'مبيعاتي'],
            'نصيحة': ['نصيحه', 'نصييحة', 'نصيححة']
        };
        
        for (const [correct, variations] of Object.entries(similarWords)) {
            if (variations.includes(word1) && variations.includes(word2)) {
                return true;
            }
        }
        
        return false;
    }

    // 🎭 ردود خاصة للرغبات
    getDesireResponse(question) {
        if (question.includes('بدي') || question.includes('ابغي') || question.includes('اريد')) {
            if (question.includes('تقرير') || question.includes('تحليل')) {
                return this.getComprehensiveReport();
            }
            if (question.includes('نصيحة') || question.includes('اقتراح')) {
                return this.getAdviceResponse();
            }
            if (question.includes('مبيعات') || question.includes('ارباح')) {
                return this.getTotalSalesResponse();
            }
            if (question.includes('عملاء') || question.includes('زبائن')) {
                return this.getCustomersCountResponse();
            }
        }
        
        return `🤔 **لاحظت أنك تريد شيئاً محدداً!**

💡 يمكنني مساعدتك في:
• إعطائك تقارير شاملة
• تحليل بيانات العملاء والمبيعات  
• تقديم نصائح لتحسين الأداء

🎯 **جرب أن تطلب:**
"بدي تقرير شامل"
"ابغي تحليل المبيعات"
"اريد نصيحة لزيادة المبيعات"`;
    }

    // 🎪 رد ذكي عندما لا يتعرف على السؤال
    getSmartFallbackResponse(originalQuestion, correctedQuestion) {
        return `🤖 **مساعد Data Vision الذكي**

🔍 **فهمت أنك تسأل عن:** "${originalQuestion}"
✅ **بعد التصحيح:** "${correctedQuestion}"

💡 **أستطيع مساعدتك في:**

👥 **الأسئلة عن العملاء:**
• "كم عميل عندي؟" 
• "شو عدد العملاء النشطين؟"
• "بدي أعرف أحسن العملاء"

💰 **الأسئلة عن المبيعات:**
• "شو إجمالي مبيعاتي؟"
• "كم عملية بيع سويت؟"
• "شو متوسط البيع؟"

📊 **التقارير:**
• "بدي تقرير شامل"
• "اعطيني تحليل الأداء"
• "شو وضعي الحالي؟"

💎 **نصيحة:** جرب واحدة من هذه الأسئلة وسأعطيك إجابة مفصلة! 🚀`;
    }

    // 👥 باقي الدوال تبقى كما هي مع تحسينات بسيطة
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

    getComprehensiveReport() {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'active').length;
        const totalSalesCount = sales.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
        const avgSale = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0;

        return `📊 **تقرير أداء شامل - Data Vision**

👥 **قاعدة العملاء:**
• إجمالي العملاء: ${totalCustomers}
• العملاء النشطين: ${activeCustomers} (${totalCustomers > 0 ? (activeCustomers/totalCustomers*100).toFixed(1) : 0}%)
• العملاء غير النشطين: ${totalCustomers - activeCustomers}

💰 **الأداء المالي:**
• إجمالي المبيعات: ${totalRevenue.toFixed(2)} دينار
• عدد العمليات: ${totalSalesCount}
• متوسط البيع: ${avgSale.toFixed(2)} دينار

🎯 **التقييم العام:**
${this.getPerformanceAssessment()}

💡 **التوصيات:**
${this.getRecommendations()}`;
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

        return recommendations.length > 0 ? recommendations.join('\n') : '• استمر في الاستراتيجية الحالية، أداؤك ممتاز!';
    }

    // ... باقي الدوال بنفس الطريقة

    // 🎯 إعداد النظام
    setupEventListeners() {
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
    }

    sendMessage() {
        const input = document.getElementById('assistantInput');
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;

        this.addMessageToChat(message, 'user');
        input.value = '';
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessageToChat(response, 'ai');
        }, 1000);
    }

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
}

// 🚀 تشغيل النظام المحسن
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تشغيل المساعد الذكي المحسن لفهم الأخطاء...');
    window.smartAssistant = new EnhancedAIAssistant();
    
    // رسالة ترحيبية
    setTimeout(() => {
        const welcomeMsg = `مرحباً! 👋 أنا المساعد الذكي المحسن

🎯 **الميزة الجديدة:** أفهم الأخطاء الإملائية!

جرب أن تكتب بأي طريقة:
• "كم عميل عندي؟" 
• "كام عميل عندي؟"
• "شو عدد العمال؟"
• "بدي تقرير شامل"

سأفهم قصده وأعطيك إجابة صحيحة! 🚀`;
        
        window.smartAssistant.addMessageToChat(welcomeMsg, 'ai');
    }, 1000);
});

// 🔄 جعل الدوال متاحة
window.sendFreeMessage = () => window.smartAssistant.sendMessage();
window.sendMessage = () => window.smartAssistant.sendMessage();
