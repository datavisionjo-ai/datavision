// aI-integration.js - معدل كامل
class WorkingFreeAI {
    constructor() {
        this.apis = [
            {
                name: "HuggingFace",
                url: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large-arabic",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: (msg) => JSON.stringify({
                    inputs: msg,
                    parameters: { max_length: 150, temperature: 0.7 }
                })
            },
            {
                name: "OpenRouter", 
                url: "https://openrouter.ai/api/v1/chat/completions",
                method: "POST",
                headers: { 
                    "Authorization": "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",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://databuddy.com",
                    "X-Title": "DataBuddy"
                },
                body: (msg) => JSON.stringify({
                    model: "google/gemini-pro",
                    messages: [{ role: "user", content: msg }],
                    max_tokens: 200
                })
            }
        ];
    }

    async getAIResponse(userMessage) {
        for (let api of this.apis) {
            try {
                console.log(`🔄 جرب ${api.name}...`);
                
                const response = await fetch(api.url, {
                    method: api.method,
                    headers: api.headers,
                    body: api.body(userMessage)
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (api.name === "HuggingFace") {
                        return data[0]?.generated_text || "🤖 مرحباً! كيف أساعدك في إدارة عملائك ومبيعاتك اليوم؟";
                    } else if (api.name === "OpenRouter") {
                        return data.choices[0]?.message?.content || "🤖 أهلاً بك في Data Vision! كيف يمكنني مساعدتك في تحليل بياناتك؟";
                    }
                }
            } catch (error) {
                console.log(`❌ ${api.name} فشل:`, error.message);
                continue;
            }
        }
        
        return "🚀 أنا مساعد Data Vision الذكي. يمكنني مساعدتك في تحليل بيانات العملاء والمبيعات، تقديم نصائح لتحسين الأداء، ومساعدتك في إدارة متجرك بشكل أكثر فعالية. 💼";
    }
}

// الاستخدام
const freeAI = new WorkingFreeAI();

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
        // احصل على الرد
        const response = await freeAI.getAIResponse(message);
        
        // أضف الرد
        hideTypingIndicator();
        addMessageToChat(response, 'ai');
    } catch (error) {
        hideTypingIndicator();
        addMessageToChat("⚠️ عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.", 'ai');
    }
}

// وظيفة إرسال رسالة (للتوافق مع الكود القديم)
async function sendMessage() {
    await sendFreeMessage();
}

// جعل الدوال متاحة globally
window.sendFreeMessage = sendFreeMessage;
window.sendMessage = sendMessage;
