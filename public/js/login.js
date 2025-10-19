// login.js - معدل كامل مع دوال API
const API_BASE_URL = https://datavision-nilx.onrender.com;

// دوال API للاتصال بالسيرفر
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            // حفظ التوكن والمستخدم
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } else {
            throw new Error(data.error || 'فشل تسجيل الدخول');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            // حفظ التوكن والمستخدم
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } else {
            throw new Error(data.error || 'فشل إنشاء الحساب');
        }
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
}

// دوال المساعدة
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// إظهار/إخفاء كلمة المرور
function togglePasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// إظهار تلميحات كلمة المرور
function showPasswordHints() {
    const hints = document.getElementById('passwordHints');
    const advanced = document.getElementById('advancedStrength');
    if (hints) hints.classList.add('show');
    if (advanced) advanced.classList.add('show');
}

function hidePasswordHints() {
    setTimeout(() => {
        const hints = document.getElementById('passwordHints');
        const advanced = document.getElementById('advancedStrength');
        if (hints) hints.classList.remove('show');
        if (advanced) advanced.classList.remove('show');
    }, 300);
}

// التحقق من قوة كلمة المرور
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

    // تحديث الواجهة
    strengthFill.className = 'strength-fill changing';
    if (strengthLevel) strengthLevel.style.display = 'inline-block';

    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'لم يتم إدخال كلمة مرور';
        if (strengthLevel) strengthLevel.style.display = 'none';
        if (document.getElementById('signupPassword')) {
            document.getElementById('signupPassword').className = 'password-field';
        }
    } else if (strength <= 1) {
        strengthFill.style.width = '20%';
        strengthFill.className += ' very-weak';
        strengthText.textContent = 'ضعيف جداً';
        if (strengthLevel) {
            strengthLevel.textContent = 'ضعيف جداً';
            strengthLevel.className = 'strength-level very-weak';
        }
        if (document.getElementById('signupPassword')) {
            document.getElementById('signupPassword').className = 'password-field weak-password';
        }
    } else if (strength <= 2) {
        strengthFill.style.width = '40%';
        strengthFill.className += ' weak';
        strengthText.textContent = 'ضعيف';
        if (strengthLevel) {
            strengthLevel.textContent = 'ضعيف';
            strengthLevel.className = 'strength-level weak';
        }
        if (document.getElementById('signupPassword')) {
            document.getElementById('signupPassword').className = 'password-field weak-password';
        }
    } else if (strength === 3) {
        strengthFill.style.width = '60%';
        strengthFill.className += ' fair';
        strengthText.textContent = 'متوسط';
        if (strengthLevel) {
            strengthLevel.textContent = 'متوسط';
            strengthLevel.className = 'strength-level fair';
        }
        if (document.getElementById('signupPassword')) {
            document.getElementById('signupPassword').className = 'password-field';
        }
    } else if (strength === 4) {
        strengthFill.style.width = '80%';
        strengthFill.className += ' strong';
        strengthText.textContent = 'قوي';
        if (strengthLevel) {
            strengthLevel.textContent = 'قوي';
            strengthLevel.className = 'strength-level strong';
        }
        if (document.getElementById('signupPassword')) {
            document.getElementById('signupPassword').className = 'password-field strong-password';
        }
    } else {
        strengthFill.style.width = '100%';
        strengthFill.className += ' very-strong';
        strengthText.textContent = 'قوي جداً';
        if (strengthLevel) {
            strengthLevel.textContent = 'قوي جداً';
            strengthLevel.className = 'strength-level very-strong';
        }
        if (document.getElementById('signupPassword')) {
            document.getElementById('signupPassword').className = 'password-field strong-password';
        }
    }

    // إزالة كلاس الأنيميشن بعد انتهائها
    setTimeout(() => {
        strengthFill.classList.remove('changing');
    }, 500);
}

// تحديث التلميحات والمؤشرات
function updateHints(hints) {
    // تحديث التلميحات النصية
    const elements = ['lengthHint', 'numberHint', 'upperHint', 'lowerHint', 'specialHint'];
    elements.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            const key = Object.keys(hints)[index];
            element.className = hints[key] ? 'hint-item valid' : 'hint-item';
        }
    });

    // تحديث المؤشرات المتقدمة
    const criteria = ['lengthCriteria', 'numberCriteria', 'upperCriteria', 'specialCriteria'];
    criteria.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            const key = Object.keys(hints)[index];
            element.className = hints[key] ? 'criteria-indicator met' : 'criteria-indicator';
        }
    });
}

// التبديل بين النماذج
function showSignupForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
}

function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (signupForm) signupForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
}

// معالجة تسجيل الدخول
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }

    try {
        showNotification('جاري تسجيل الدخول...', 'success');
        
        const result = await login(email, password);
        
        if (result.success) {
            showNotification('تم تسجيل الدخول بنجاح!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    } catch (error) {
        showNotification('خطأ في تسجيل الدخول: ' + error.message, 'error');
    }
}

// معالجة إنشاء الحساب
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    // التحقق من صحة البيانات
    if (!name || !email || !password || !confirmPassword) {
        showNotification('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('كلمتا المرور غير متطابقتين', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }

    try {
        showNotification('جاري إنشاء الحساب...', 'success');
        
        const result = await register(name, email, password);
        
        if (result.success) {
            showNotification('تم إنشاء الحساب بنجاح!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    } catch (error) {
        showNotification('خطأ في إنشاء الحساب: ' + error.message, 'error');
    }
}

// التحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// إضافة تحقق فوري للحقول
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('confirmPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--border)';
            }
        });
    }
    
    if (confirmInput && passwordInput) {
        confirmInput.addEventListener('input', function() {
            const password = passwordInput.value;
            if (this.value && password !== this.value) {
                this.style.borderColor = 'var(--danger)';
            } else {
                this.style.borderColor = 'var(--border)';
            }
        });
    }
});

// فحص اتصال السيرفر
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('✅ السيرفر متصل:', data);
        return true;
    } catch (error) {
        console.error('❌ السيرفر غير متصل:', error);
        showNotification('لا يمكن الاتصال بالسيرفر', 'error');
        return false;
    }
}

// فحص السيرفر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkServerStatus();
});
// جعل الدوال متاحة globally
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

