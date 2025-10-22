// profile.js - نظام الملف الشخصي مع معلومات الموقع

class ProfileManager {
    constructor() {
        this.userData = this.loadUserData();
        this.initProfile();
    }

    // تحميل بيانات المستخدم
    loadUserData() {
        const savedData = localStorage.getItem('userProfile');
        if (savedData) {
            return JSON.parse(savedData);
        } else {
            // بيانات افتراضية
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
                }
            };
        }
    }

    // حفظ بيانات المستخدم
    saveUserData() {
        localStorage.setItem('userProfile', JSON.stringify(this.userData));
    }

    // تهيئة الصفحة
    initProfile() {
        this.displayUserInfo();
        this.updateStats();
        this.getUserLocation();
        this.setupEventListeners();
    }

    // عرض معلومات المستخدم
    displayUserInfo() {
        document.getElementById('userName').value = this.userData.name || '';
        document.getElementById('userEmail').value = this.userData.email || '';
        document.getElementById('joinDate').textContent = this.userData.joinDate;
        document.getElementById('lastActivity').textContent = this.userData.lastActivity;
        
        // عرض معلومات الموقع إذا كانت متوفرة
        this.displayLocationInfo();
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

    // معالجة أخطاء الموقع
    handleLocationError(error) {
        let message = '';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                message = '❌ تم رفض الوصول إلى الموقع. يرجى السماح بالوصول في إعدادات المتصفح.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = '❌ معلومات الموقع غير متوفرة.';
                break;
            case error.TIMEOUT:
                message = '⏰ انتهت مهلة طلب الموقع.';
                break;
            default:
                message = '❌ حدث خطأ غير معروف أثناء الحصول على الموقع.';
        }
        
        this.showNotification(message, 'error');
        
        const locationInfo = document.getElementById('locationInfo');
        if (locationInfo) {
            locationInfo.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #dc3545;">
                    <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
                    <p>${message}</p>
                    <button onclick="profileManager.getUserLocation()" class="btn btn-primary" style="margin-top: 10px;">
                        🔄 إعادة المحاولة
                    </button>
                </div>
            `;
        }
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

        this.userData.name = name;
        this.userData.email = email;
        this.userData.lastActivity = new Date().toLocaleString('ar-EG');
        
        this.saveUserData();
        this.showNotification('✅ تم تحديث الملف الشخصي بنجاح', 'success');
        
        // تحديث الإحصائيات
        this.updateStats();
    }

    // تغيير كلمة المرور
    changePassword() {
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

        // هنا يمكنك إضافة منطق التحقق من كلمة المرور الحالية
        // مع الخادم أو نظام المصادقة

        this.showNotification('✅ تم تغيير كلمة المرور بنجاح', 'success');
        
        // مسح الحقول
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
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

// دالة التحديث العالمية
function updateProfile() {
    if (profileManager) {
        profileManager.updateProfile();
    }
}

// دالة تغيير كلمة المرور العالمية
function changePassword() {
    if (profileManager) {
        profileManager.changePassword();
    }
}

// دالة الحصول على الموقع يدوياً
function refreshLocation() {
    if (profileManager) {
        profileManager.getUserLocation();
    }
}

// دالة تصدير بيانات الملف الشخصي
function exportProfileData() {
    if (profileManager) {
        profileManager.exportProfileData();
    }
}
