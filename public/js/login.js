// profile.js - نظام الملف الشخصي المدمج مع بيانات التسجيل

class ProfileManager {
    constructor() {
        this.userData = this.loadUserData();
        this.initProfile();
    }

    // تحميل بيانات المستخدم من نظام التسجيل
    loadUserData() {
        // أولوية لبيانات المستخدم من نظام التسجيل
        const savedUser = localStorage.getItem('datavision_user');
        const savedProfile = localStorage.getItem('userProfile');
        
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            console.log('👤 تحميل بيانات المستخدم من نظام التسجيل:', userData);
            
            // دمج البيانات مع الملف الشخصي
            const profileData = savedProfile ? JSON.parse(savedProfile) : {};
            
            return {
                ...profileData,
                name: userData.name || profileData.name || '',
                email: userData.email || profileData.email || '',
                joinDate: userData.createdAt || profileData.joinDate || new Date().toLocaleDateString('ar-EG'),
                lastActivity: new Date().toLocaleString('ar-EG'),
                location: profileData.location || {
                    country: '',
                    city: '',
                    region: '',
                    latitude: '',
                    longitude: '',
                    timezone: ''
                },
                stats: profileData.stats || {
                    addedCustomers: 0,
                    totalSales: 0
                },
                // بيانات إضافية من نظام التسجيل
                userId: userData.id || userData._id,
                isVerified: userData.isVerified || false,
                lastLogin: userData.lastLogin || new Date().toISOString(),
                subscription: userData.subscription || 'basic'
            };
        } else if (savedProfile) {
            console.log('👤 تحميل بيانات من الملف الشخصي المحلي');
            return JSON.parse(savedProfile);
        } else {
            console.log('👤 إنشاء بيانات مستخدم جديدة');
            return {
                name: '',
                email: '',
                joinDate: new Date().toLocaleDateString('ar-EG'),
                lastActivity: new Date().toLocaleString('ar-EG'),
                location: {
                    country: '',
                    city: '',
                    region: '',
                    latitude: '',
                    longitude: '',
                    timezone: ''
                },
                stats: {
                    addedCustomers: 0,
                    totalSales: 0
                },
                subscription: 'basic',
                isVerified: false
            };
        }
    }

    // حفظ بيانات المستخدم
    saveUserData() {
        localStorage.setItem('userProfile', JSON.stringify(this.userData));
        
        // أيضاً تحديث بيانات المستخدم في نظام التسجيل
        const currentUser = localStorage.getItem('datavision_user');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            const updatedUser = {
                ...userData,
                name: this.userData.name,
                email: this.userData.email,
                lastActivity: this.userData.lastActivity
            };
            localStorage.setItem('datavision_user', JSON.stringify(updatedUser));
        }
    }

    // تهيئة الصفحة
    initProfile() {
        this.displayUserInfo();
        this.updateStats();
        this.getUserLocation();
        this.setupEventListeners();
        this.setupAuthListeners();
    }

    // عرض معلومات المستخدم
    displayUserInfo() {
        document.getElementById('userName').value = this.userData.name || '';
        document.getElementById('userEmail').value = this.userData.email || '';
        document.getElementById('joinDate').textContent = this.formatDate(this.userData.joinDate);
        document.getElementById('lastActivity').textContent = this.userData.lastActivity;
        
        // عرض حالة الحساب
        this.displayAccountStatus();
        
        // عرض معلومات الموقع إذا كانت متوفرة
        this.displayLocationInfo();
    }

    // عرض حالة الحساب
    displayAccountStatus() {
        const accountStatus = document.getElementById('accountStatus');
        if (!accountStatus) return;

        const statusHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px;">
                <div class="status-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px;">
                    <strong>📧 حالة البريد الإلكتروني</strong>
                    <div style="margin-top: 10px; font-size: 18px;">
                        ${this.userData.isVerified ? '✅ مفعل' : '❌ غير مفعل'}
                    </div>
                    ${!this.userData.isVerified ? `
                    <button onclick="profileManager.verifyEmail()" class="btn btn-sm btn-light" style="margin-top: 10px; font-size: 12px;">
                        تفعيل البريد
                    </button>
                    ` : ''}
                </div>
                
                <div class="status-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px;">
                    <strong>💼 نوع الاشتراك</strong>
                    <div style="margin-top: 10px; font-size: 18px; text-transform: capitalize;">
                        ${this.userData.subscription || 'basic'}
                    </div>
                    <button onclick="profileManager.upgradeSubscription()" class="btn btn-sm btn-light" style="margin-top: 10px; font-size: 12px;">
                        ترقية الاشتراك
                    </button>
                </div>
                
                <div class="status-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 12px;">
                    <strong>🆔 معرف المستخدم</strong>
                    <div style="margin-top: 10px; font-size: 14px; font-family: monospace;">
                        ${this.userData.userId || 'غير متوفر'}
                    </div>
                </div>
                
                <div class="status-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 20px; border-radius: 12px;">
                    <strong>📊 مستوى النشاط</strong>
                    <div style="margin-top: 10px; font-size: 18px;">
                        ${this.getActivityLevel()}
                    </div>
                </div>
            </div>
        `;
        
        accountStatus.innerHTML = statusHTML;
    }

    // الحصول على مستوى النشاط
    getActivityLevel() {
        const customersCount = this.userData.stats.addedCustomers || 0;
        const salesTotal = this.userData.stats.totalSales || 0;
        
        if (salesTotal > 1000 || customersCount > 50) return '🏆 نشط جداً';
        if (salesTotal > 500 || customersCount > 20) return '🚀 نشط';
        if (salesTotal > 100 || customersCount > 10) return '💪 متوسط';
        return '🔰 مبتدئ';
    }

    // عرض معلومات الموقع
    displayLocationInfo() {
        const locationInfo = document.getElementById('locationInfo');
        if (!locationInfo) return;

        if (this.userData.location.country) {
            locationInfo.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                    <div class="location-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-right: 4px solid #007bff;">
                        <strong>🌍 الدولة:</strong>
                        <div>${this.userData.location.country}</div>
                    </div>
                    <div class="location-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-right: 4px solid #28a745;">
                        <strong>🏙️ المدينة:</strong>
                        <div>${this.userData.location.city}</div>
                    </div>
                    <div class="location-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-right: 4px solid #ffc107;">
                        <strong>📍 المنطقة:</strong>
                        <div>${this.userData.location.region}</div>
                    </div>
                    <div class="location-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-right: 4px solid #dc3545;">
                        <strong>⏰ المنطقة الزمنية:</strong>
                        <div>${this.userData.location.timezone}</div>
                    </div>
                </div>
                ${this.userData.location.latitude ? `
                <div style="margin-top: 15px; padding: 15px; background: #e7f3ff; border-radius: 8px; border: 1px solid #b3d9ff;">
                    <strong>🧭 الإحداثيات:</strong>
                    <div>خط العرض: ${this.userData.location.latitude} | خط الطول: ${this.userData.location.longitude}</div>
                </div>
                ` : ''}
            `;
        } else {
            locationInfo.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #6c757d;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🌍</div>
                    <p>جاري الحصول على معلومات الموقع...</p>
                    <button onclick="profileManager.getUserLocation()" class="btn btn-primary" style="margin-top: 10px;">
                        🔄 تحديث الموقع
                    </button>
                </div>
            `;
        }
    }

    // الحصول على موقع المستخدم
    async getUserLocation() {
        const locationInfo = document.getElementById('locationInfo');
        
        if (!navigator.geolocation) {
            this.showNotification('❌ المتصفح لا يدعم خدمة الموقع', 'error');
            return;
        }

        try {
            // عرض رسالة تحميل
            if (locationInfo) {
                locationInfo.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #6c757d;">
                        <div style="font-size: 48px; margin-bottom: 10px;">⏳</div>
                        <p>جاري تحديد موقعك...</p>
                        <div style="font-size: 12px; margin-top: 10px;">يرجى السماح بالوصول إلى الموقع</div>
                    </div>
                `;
            }

            // الحصول على الإحداثيات
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            const { latitude, longitude } = position.coords;
            
            // الحصول على معلومات الموقع من API
            const locationData = await this.reverseGeocode(latitude, longitude);
            
            // تحديث بيانات المستخدم
            this.userData.location = {
                country: locationData.country || 'غير معروف',
                city: locationData.city || locationData.town || locationData.village || 'غير معروف',
                region: locationData.state || locationData.region || 'غير معروف',
                latitude: latitude.toFixed(6),
                longitude: longitude.toFixed(6),
                timezone: this.getTimezone()
            };

            this.userData.lastActivity = new Date().toLocaleString('ar-EG');
            this.saveUserData();
            this.displayLocationInfo();
            
            this.showNotification('✅ تم تحديث معلومات الموقع بنجاح', 'success');
            
        } catch (error) {
            console.error('Error getting location:', error);
            this.handleLocationError(error);
        }
    }

    // reverse geocoding للحصول على اسم الموقع
    async reverseGeocode(lat, lng) {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`);
            const data = await response.json();
            
            return {
                country: data.countryName,
                city: data.city,
                locality: data.locality,
                region: data.principalSubdivision
            };
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            // استخدام خدمة بديلة
            return await this.alternativeGeocode(lat, lng);
        }
    }

    // خدمة بديلة لل reverse geocoding
    async alternativeGeocode(lat, lng) {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`);
            const data = await response.json();
            
            return {
                country: data.address.country,
                city: data.address.city || data.address.town || data.address.village,
                state: data.address.state,
                region: data.address.region
            };
        } catch (error) {
            console.error('Alternative geocoding error:', error);
            return {
                country: 'غير معروف',
                city: 'غير معروف',
                region: 'غير معروف'
            };
        }
    }

    // الحصول على المنطقة الزمنية
    getTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // تحديث الإحصائيات
    updateStats() {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const sales = JSON.parse(localStorage.getItem('sales') || '[]');
        
        this.userData.stats.addedCustomers = customers.length;
        this.userData.stats.totalSales = sales.reduce((total, sale) => total + parseFloat(sale.amount || 0), 0);
        
        document.getElementById('addedCustomers').textContent = this.userData.stats.addedCustomers;
        document.getElementById('userTotalSales').textContent = this.userData.stats.totalSales.toFixed(2) + ' دينار';
        
        this.saveUserData();
    }

    // تحديث الملف الشخصي
    updateProfile() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();

        if (!name) {
            this.showNotification('❌ يرجى إدخال الاسم الكامل', 'error');
            return;
        }

        if (email && !this.isValidEmail(email)) {
            this.showNotification('❌ يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        this.userData.name = name;
        this.userData.email = email;
        this.userData.lastActivity = new Date().toLocaleString('ar-EG');
        
        this.saveUserData();
        this.showNotification('✅ تم تحديث الملف الشخصي بنجاح', 'success');
        
        // تحديث الإحصائيات
        this.updateStats();
    }

    // تغيير كلمة المرور
    async changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('❌ يرجى ملء جميع الحقول', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('❌ كلمة المرور الجديدة غير متطابقة', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
            return;
        }

        try {
            // هنا يمكنك إضافة API call لتغيير كلمة المرور
            const token = localStorage.getItem('datavision_token');
            if (!token) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            // محاكاة تغيير كلمة المرور (استبدل هذا بـ API حقيقي)
            await this.changePasswordAPI(currentPassword, newPassword);
            
            this.showNotification('✅ تم تغيير كلمة المرور بنجاح', 'success');
            
            // مسح الحقول
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            
        } catch (error) {
            this.showNotification('❌ ' + error.message, 'error');
        }
    }

    // محاكاة تغيير كلمة المرور (استبدل بـ API حقيقي)
    async changePasswordAPI(currentPassword, newPassword) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // محاكاة نجاح العملية
                resolve({ success: true });
                // في حالة الفشل: reject(new Error('كلمة المرور الحالية غير صحيحة'));
            }, 1000);
        });
    }

    // تفعيل البريد الإلكتروني
    async verifyEmail() {
        try {
            this.showNotification('📧 جاري إرسال رابط التفعيل...', 'success');
            
            // محاكاة إرسال رابط التفعيل
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('✅ تم إرسال رابط التفعيل إلى بريدك الإلكتروني', 'success');
            
        } catch (error) {
            this.showNotification('❌ فشل في إرسال رابط التفعيل', 'error');
        }
    }

    // ترقية الاشتراك
    async upgradeSubscription() {
        try {
            this.showNotification('🔄 جاري تحويلك لصفحة الترقي...', 'success');
            
            // محاكاة الانتقال لصفحة الدفع
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification('💎 اختر خطة الاشتراك المناسبة لك', 'success');
            
        } catch (error) {
            this.showNotification('❌ فشل في عملية الترقية', 'error');
        }
    }

    // تسجيل الخروج
    logout() {
        // تأثيرات قبل تسجيل الخروج
        this.showNotification('👋 جاري تسجيل الخروج...', 'success');
        
        setTimeout(() => {
            // مسح بيانات التسجيل
            localStorage.removeItem('datavision_token');
            localStorage.removeItem('datavision_user');
            
            // الاحتفاظ ببيانات الملف الشخصي (اختياري)
            // localStorage.removeItem('userProfile');
            
            // التوجيه لصفحة التسجيل
            window.location.href = 'login.html';
        }, 1500);
    }

    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // تحديث الإحصائيات عند تبديل التبويبات
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateStats();
            }
        });

        // تحديث آخر نشاط عند التفاعل مع الصفحة
        document.addEventListener('click', () => {
            this.userData.lastActivity = new Date().toLocaleString('ar-EG');
            this.saveUserData();
        });
    }

    // إعداد مستمعي المصادقة
    setupAuthListeners() {
        // الاستماع لتغييرات حالة المصادقة
        window.addEventListener('storage', (e) => {
            if (e.key === 'datavision_user' || e.key === 'datavision_token') {
                console.log('🔄 تحديث بيانات المستخدم بسبب تغيير في المصادقة');
                this.userData = this.loadUserData();
                this.displayUserInfo();
                this.updateStats();
            }
        });

        // التحقق من صحة التوكن بانتظام
        setInterval(() => {
            this.checkAuthValidity();
        }, 300000); // كل 5 دقائق
    }

    // التحقق من صحة المصادقة
    checkAuthValidity() {
        const token = localStorage.getItem('datavision_token');
        if (!token) {
            this.showNotification('❌ انتهت جلسة العمل، يرجى تسجيل الدخول مرة أخرى', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
    }

    // التحقق من صحة البريد الإلكتروني
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // تنسيق التاريخ
    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    // عرض الإشعارات
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        } else {
            // إنشاء إشعار مؤقت إذا لم يكن موجوداً
            const tempNotification = document.createElement('div');
            tempNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
                color: white;
                border-radius: 8px;
                z-index: 10000;
                font-weight: bold;
            `;
            tempNotification.textContent = message;
            document.body.appendChild(tempNotification);
            
            setTimeout(() => {
                document.body.removeChild(tempNotification);
            }, 5000);
        }
    }

    // تصدير بيانات الملف الشخصي
    exportProfileData() {
        const dataStr = JSON.stringify(this.userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `profile_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('✅ تم تصدير بيانات الملف الشخصي', 'success');
    }
}

// تهيئة مدير الملف الشخصي عند تحميل الصفحة
let profileManager;

document.addEventListener('DOMContentLoaded', function() {
    profileManager = new ProfileManager();
});

// دوال عامة للاستخدام في HTML
function updateProfile() {
    if (profileManager) {
        profileManager.updateProfile();
    }
}

function changePassword() {
    if (profileManager) {
        profileManager.changePassword();
    }
}

function refreshLocation() {
    if (profileManager) {
        profileManager.getUserLocation();
    }
}

function exportProfileData() {
    if (profileManager) {
        profileManager.exportProfileData();
    }
}

function logout() {
    if (profileManager) {
        profileManager.logout();
    }
}
