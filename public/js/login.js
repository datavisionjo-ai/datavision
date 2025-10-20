// login.js - معدل مع تأثيرات سحرية
const API_BASE_URL = "https://datavision-nilx.onrender.com";
console.log('🔗 API Base URL:', API_BASE_URL);

// تأثيرات سحرية - إنشاء جسيمات متحركة
function createMagicParticles(x, y, color = '#5B2EDE') {
    const container = document.querySelector('.login-container') || document.body;
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'magic-particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 100;
    `;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            animation: magicFloat 1.2s ease-out forwards;
        `;
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        particle.style.setProperty('--angle', angle);
        particle.style.setProperty('--distance', distance);
        
        particlesContainer.appendChild(particle);
    }
    
    container.appendChild(particlesContainer);
    
    setTimeout(() => {
        particlesContainer.remove();
    }, 1200);
}

// تأثير كتابة سحري للنص
function typeWriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// تأثير اهتزاز للحقول عند الخطأ
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// تأثير توهج للحقول عند النجاح
function glowElement(element, color = '#5B2EDE') {
    element.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
    element.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        element.style.boxShadow = '';
        element.style.transform = '';
    }, 1000);
}

// تأثير تحول سحري بين النماذج
function magicalFormTransition(currentForm, nextForm) {
    currentForm.style.animation = 'magicFadeOut 0.6s ease forwards';
    
    setTimeout(() => {
        currentForm.style.display = 'none';
        nextForm.style.display = 'block';
        nextForm.style.animation = 'magicFadeIn 0.6s ease forwards';
        
        // تأثير جسيمات عند التحويل
        const rect = nextForm.getBoundingClientRect();
        createMagicParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#A277FF');
    }, 300);
}

// تأثير تحميل سحري
function showMagicLoading(button) {
    const originalText = button.textContent;
    button.innerHTML = `
        <div class="magic-spinner"></div>
        <span>جاري المعالجة...</span>
    `;
    button.disabled = true;
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// تأثير نجمة متابعة الماوس
function createMouseFollower() {
    const follower = document.createElement('div');
    follower.className = 'magic-mouse-follower';
    follower.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: linear-gradient(45deg, #5B2EDE, #A277FF);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    
    document.body.appendChild(follower);
    
    document.addEventListener('mousemove', (e) => {
        follower.style.left = e.clientX - 4 + 'px';
        follower.style.top = e.clientY - 4 + 'px';
    });
    
    document.addEventListener('click', (e) => {
        // تأثير رipple عند النقر
        createRippleEffect(e.clientX, e.clientY);
    });
}

// تأثير تموجات عند النقر
function createRippleEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #A277FF;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        left: ${x - 10}px;
        top: ${y - 10}px;
        animation: rippleExpand 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// تأثير طباعة نصوص الوصف
function animateDescriptions() {
    const descriptions = document.querySelectorAll('.magic-description');
    descriptions.forEach((desc, index) => {
        setTimeout(() => {
            typeWriterEffect(desc, desc.getAttribute('data-text') || desc.textContent);
        }, index * 800);
    });
}

// تأثير خلفية ديناميكية
function createDynamicBackground() {
    const bg = document.querySelector('.background-effects') || document.createElement('div');
    bg.className = 'background-effects';
    bg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    // إضافة عناصر ديناميكية للخلفية
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        shape.className = 'dynamic-shape';
        shape.style.cssText = `
            position: absolute;
            width: ${40 + Math.random() * 80}px;
            height: ${40 + Math.random() * 80}px;
            background: linear-gradient(45deg, 
                rgba(91, 46, 222, ${0.1 + Math.random() * 0.1}), 
                rgba(162, 119, 255, ${0.1 + Math.random() * 0.1})
            );
            border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
            filter: blur(${10 + Math.random() * 20}px);
            animation: floatBackground ${15 + Math.random() * 20}s infinite ease-in-out;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation-delay: -${Math.random() * 20}s;
        `;
        
        bg.appendChild(shape);
    }
    
    if (!document.querySelector('.background-effects')) {
        document.body.appendChild(bg);
    }
}

// تأثيرات CSS المخصصة
function addMagicStyles() {
    const styles = `
        @keyframes magicFloat {
            0% {
                opacity: 1;
                transform: translate(0, 0) scale(1);
            }
            100% {
                opacity: 0;
                transform: 
                    translate(
                        calc(cos(var(--angle)) * var(--distance) * 1px),
                        calc(sin(var(--angle)) * var(--distance) * 1px)
                    ) scale(0);
            }
        }
        
        @keyframes magicFadeIn {
            0% {
                opacity: 0;
                transform: translateY(30px) scale(0.9);
                filter: blur(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }
        
        @keyframes magicFadeOut {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-30px) scale(0.9);
                filter: blur(10px);
            }
        }
        
        @keyframes rippleExpand {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(8);
                opacity: 0;
            }
        }
        
        @keyframes floatBackground {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            33% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(120deg);
            }
            66% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(240deg);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .magic-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 8px;
        }
        
        .magic-input-focus {
            animation: inputGlow 2s infinite alternate;
        }
        
        @keyframes inputGlow {
            0% {
                box-shadow: 0 0 10px rgba(91, 46, 222, 0.3);
            }
            100% {
                box-shadow: 0 0 20px rgba(91, 46, 222, 0.6), 0 0 30px rgba(162, 119, 255, 0.4);
            }
        }
        
        .success-pulse {
            animation: successPulse 0.6s ease;
        }
        
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .password-strength-animation {
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// تهيئة جميع التأثيرات السحرية
function initializeMagicEffects() {
    addMagicStyles();
    createDynamicBackground();
    createMouseFollower();
    animateDescriptions();
    
    // إضافة تأثيرات للحقول عند التركيز
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.classList.add('magic-input-focus');
            createMagicParticles(
                this.getBoundingClientRect().left,
                this.getBoundingClientRect().bottom,
                '#5B2EDE'
            );
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('magic-input-focus');
        });
    });
    
    // تأثيرات للأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            createMagicParticles(
                this.getBoundingClientRect().left,
                this.getBoundingClientRect().top,
                '#A277FF'
            );
        });
        
        button.addEventListener('click', function(e) {
            createMagicParticles(e.clientX, e.clientY, '#00D4AA');
        });
    });
}

// منع الدخول المزدوج - إذا كان مسجل دخول بالفعل
function preventDoubleLogin() {
    const token = localStorage.getItem('datavision_token');
    const user = localStorage.getItem('datavision_user');
    
    if (token && user) {
        console.log('✅ المستخدم مسجل دخول بالفعل، التوجيه للصفحة الرئيسية');
        
        // تأثير انتقال سحري قبل التوجيه
        document.body.style.animation = 'magicFadeOut 0.8s ease forwards';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    }
}

// دوال API للاتصال بالسيرفر - مع تأثيرات سحرية
async function login(email, password) {
    try {
        console.log('🔐 محاولة تسجيل دخول:', { email });
        
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        console.log('📡 استجابة تسجيل الدخول:', response.status);
        
        const data = await response.json();
        console.log('📊 بيانات الاستجابة:', data);
        
        if (data.success) {
            // تأثير نجاح سحري
            document.querySelector('.login-container')?.classList.add('success-pulse');
            createMagicParticles(window.innerWidth/2, window.innerHeight/2, '#00D4AA');
            
            // حفظ التوكن والمستخدم بنفس المفاتيح التي يستخدمها api-client.js
            localStorage.setItem('datavision_token', data.token);
            localStorage.setItem('datavision_user', JSON.stringify(data.user));
            return data;
        } else {
            throw new Error(data.error || 'فشل تسجيل الدخول');
        }
    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        throw error;
    }
}

async function register(name, email, password) {
    try {
        console.log('📝 محاولة إنشاء حساب:', { name, email });
        
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        console.log('📡 استجابة إنشاء الحساب:', response.status);
        
        const data = await response.json();
        console.log('📊 بيانات الاستجابة:', data);
        
        if (data.success) {
            // تأثير نجاح سحري
            document.querySelector('.login-container')?.classList.add('success-pulse');
            createMagicParticles(window.innerWidth/2, window.innerHeight/2, '#00D4AA');
            
            // حفظ التوكن والمستخدم بنفس المفاتيح التي يستخدمها api-client.js
            localStorage.setItem('datavision_token', data.token);
            localStorage.setItem('datavision_user', JSON.stringify(data.user));
            return data;
        } else {
            throw new Error(data.error || 'فشل إنشاء الحساب');
        }
    } catch (error) {
        console.error('❌ خطأ في إنشاء الحساب:', error);
        throw error;
    }
}

// دوال المساعدة - معدلة مع تأثيرات سحرية
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        const newNotification = document.createElement('div');
        newNotification.id = 'notification';
        newNotification.className = `notification ${type} magic-notification`;
        newNotification.textContent = message;
        newNotification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 20px 25px;
            border-radius: 15px;
            color: white;
            z-index: 10000;
            display: block;
            max-width: 400px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            transform: translateX(100px);
            opacity: 0;
            animation: magicSlideIn 0.5s ease forwards;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        `;
        
        if (type === 'success') {
            newNotification.style.background = 'linear-gradient(135deg, #00D4AA, #00B894)';
        }
        if (type === 'error') {
            newNotification.style.background = 'linear-gradient(135deg, #FF476F, #E63946)';
        }
        
        document.body.appendChild(newNotification);
        
        // تأثير جسيمات للإشعار
        createMagicParticles(
            newNotification.getBoundingClientRect().left + 50,
            newNotification.getBoundingClientRect().top + 25,
            type === 'success' ? '#00D4AA' : '#FF476F'
        );
        
        setTimeout(() => {
            newNotification.style.animation = 'magicSlideOut 0.5s ease forwards';
            setTimeout(() => {
                newNotification.remove();
            }, 500);
        }, 4000);
        return;
    }
}

// إظهار/إخفاء كلمة المرور - مع تأثيرات
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    createMagicParticles(
        button.getBoundingClientRect().left + button.offsetWidth/2,
        button.getBoundingClientRect().top + button.offsetHeight/2,
        '#5B2EDE'
    );
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '🙈';
        glowElement(input, '#00D4AA');
    } else {
        input.type = 'password';
        button.innerHTML = '👁️';
        glowElement(input, '#5B2EDE');
    }
}

// التحقق من قوة كلمة المرور - مع تأثيرات محسنة
function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const strengthLevel = document.getElementById('strengthLevel');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    const hints = {
        length: password.length >= 8,
        number: /\d/.test(password),
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        special: /[^a-zA-Z\d]/.test(password)
    };

    // تحديث التلميحات
    updateHints(hints);

    // حساب القوة
    if (hints.length) strength++;
    if (hints.number) strength++;
    if (hints.upper) strength++;
    if (hints.lower) strength++;
    if (hints.special) strength++;

    // تأثيرات بصرية حسب القوة
    strengthFill.classList.add('password-strength-animation');
    
    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'لم يتم إدخال كلمة مرور';
        if (strengthLevel) strengthLevel.style.display = 'none';
    } else {
        const strengthData = [
            { width: '20%', class: 'very-weak', text: 'ضعيف جداً', color: '#FF476F' },
            { width: '40%', class: 'weak', text: 'ضعيف', color: '#FF8A4C' },
            { width: '60%', class: 'fair', text: 'متوسط', color: '#FFB800' },
            { width: '80%', class: 'strong', text: 'قوي', color: '#00D4AA' },
            { width: '100%', class: 'very-strong', text: 'قوي جداً', color: '#00B894' }
        ];
        
        const level = Math.max(0, Math.min(4, strength - 1));
        const data = strengthData[level];
        
        strengthFill.style.width = data.width;
        strengthFill.className = `strength-fill ${data.class} password-strength-animation`;
        strengthText.textContent = data.text;
        
        if (strengthLevel) {
            strengthLevel.textContent = data.text;
            strengthLevel.className = `strength-level ${data.class}`;
            strengthLevel.style.display = 'inline-block';
        }
        
        // تأثير جسيمات عند تحسن قوة كلمة المرور
        if (strength >= 3) {
            createMagicParticles(
                strengthFill.getBoundingClientRect().left + strengthFill.offsetWidth,
                strengthFill.getBoundingClientRect().top + strengthFill.offsetHeight/2,
                data.color
            );
        }
    }
}

// التبديل بين النماذج - مع تأثيرات سحرية
function showSignupForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm && signupForm) {
        magicalFormTransition(loginForm, signupForm);
    }
}

function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (signupForm && loginForm) {
        magicalFormTransition(signupForm, loginForm);
    }
}

// معالجة تسجيل الدخول - مع تأثيرات سحرية
async function handleLogin(event) {
    event.preventDefault();
    console.log('🟡 بدء تسجيل الدخول...');
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    const button = event.target.querySelector('.btn-primary') || event.target;
    
    if (!email || !password) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        const inputs = document.querySelectorAll('#loginForm input');
        inputs.forEach(input => {
            if (!input.value) shakeElement(input);
        });
        return;
    }

    try {
        const resetLoading = showMagicLoading(button);
        showNotification('جاري تسجيل الدخول...', 'success');
        
        const result = await login(email, password);
        
        if (result.success) {
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
            
            setTimeout(() => {
                document.body.style.animation = 'magicFadeOut 0.8s ease forwards';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            }, 1500);
        }
    } catch (error) {
        console.error('🔴 خطأ في تسجيل الدخول:', error);
        showNotification('خطأ في تسجيل الدخول: ' + error.message, 'error');
        shakeElement(document.querySelector('.login-container'));
    } finally {
        if (event.target.querySelector('.btn-primary')) {
            const resetLoading = showMagicLoading(event.target.querySelector('.btn-primary'));
            setTimeout(resetLoading, 1000);
        }
    }
}

// معالجة إنشاء الحساب - مع تأثيرات سحرية
async function handleSignup(event) {
    event.preventDefault();
    console.log('🟡 بدء إنشاء حساب...');
    
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    const button = event.target.querySelector('.btn-primary') || event.target;
    
    // التحقق من صحة البيانات
    if (!name || !email || !password || !confirmPassword) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        const inputs = document.querySelectorAll('#signupForm input');
        inputs.forEach(input => {
            if (!input.value && input.type !== 'checkbox') shakeElement(input);
        });
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('كلمتا المرور غير متطابقتين', 'error');
        shakeElement(document.getElementById('confirmPassword'));
        return;
    }
    
    if (!agreeTerms) {
        showNotification('يجب الموافقة على الشروط والأحكام', 'error');
        shakeElement(document.getElementById('agreeTerms').parentElement);
        return;
    }
    
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        shakeElement(document.getElementById('signupPassword'));
        return;
    }

    try {
        const resetLoading = showMagicLoading(button);
        showNotification('جاري إنشاء الحساب...', 'success');
        
        const result = await register(name, email, password);
        
        if (result.success) {
            showNotification('تم إنشاء الحساب بنجاح!', 'success');
            
            setTimeout(() => {
                document.body.style.animation = 'magicFadeOut 0.8s ease forwards';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 800);
            }, 1500);
        }
    } catch (error) {
        console.error('🔴 خطأ في إنشاء الحساب:', error);
        showNotification('خطأ في إنشاء الحساب: ' + error.message, 'error');
        shakeElement(document.querySelector('.login-container'));
    } finally {
        if (event.target.querySelector('.btn-primary')) {
            const resetLoading = showMagicLoading(event.target.querySelector('.btn-primary'));
            setTimeout(resetLoading, 1000);
        }
    }
}

// فحص السيرفر عند تحميل الصفحة - مع تأثيرات
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 صفحة Login تم تحميلها');
    
    // تهيئة التأثيرات السحرية
    initializeMagicEffects();
    
    // فحص السيرفر
    checkServerStatus();
    
    // إضافة event listeners
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ تم إضافة event listener لتسجيل الدخول');
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        console.log('✅ تم إضافة event listener لإنشاء الحساب');
    }
    
    // منع الدخول المزدوج
    preventDoubleLogin();
});

// تحديث الـ CSS بإضافات سحرية
const additionalStyles = `
    @keyframes magicSlideIn {
        0% {
            transform: translateX(100px);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes magicSlideOut {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100px);
            opacity: 0;
        }
    }
    
    .magic-notification {
        backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.3);
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);

// جعل الدوال متاحة globally
window.createMagicParticles = createMagicParticles;
window.typeWriterEffect = typeWriterEffect;
window.shakeElement = shakeElement;
window.glowElement = glowElement;
window.magicalFormTransition = magicalFormTransition;
window.showMagicLoading = showMagicLoading;
window.createRippleEffect = createRippleEffect;
window.initializeMagicEffects = initializeMagicEffects;

// الدوال الأصلية
window.showNotification = showNotification;
window.togglePasswordVisibility = togglePasswordVisibility;
window.showPasswordHints = showPasswordHints;
window.hidePasswordHints = hidePasswordHints;
window.checkPasswordStrength = checkPasswordStrength;
window.showSignupForm = showSignupForm;
window.showLoginForm = showLoginForm;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.isValidEmail = isValidEmail;
window.login = login;
window.register = register;
window.checkServerStatus = checkServerStatus;

console.log('✅ login.js مع التأثيرات السحرية تم تحميله بنجاح');
