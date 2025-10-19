// db_init.js - كود تهيئة قاعدة البيانات معدل
const { Pool } = require('pg');
require('dotenv').config();

// إعداد الاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// كود SQL لإنشاء الجداول فقط
const initSQL = `
-- حذف الجداول إذا كانت موجودة (للتطوير فقط)
DROP TABLE IF EXISTS user_activities CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    position VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_by INTEGER REFERENCES users(id),
    last_login TIMESTAMP,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول العملاء
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(255) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المبيعات
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول سجل النشاطات
CREATE TABLE user_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- إنشاء indexes للأداء
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_timestamp ON user_activities(timestamp);

SELECT '✅ تم إنشاء الجداول بنجاح' as message;
`;

// دالة تهيئة قاعدة البيانات
async function initializeDatabase() {
    let client;
    try {
        console.log('🚀 بدء تهيئة قاعدة البيانات...');
        
        // الاتصال بقاعدة البيانات
        client = await pool.connect();
        console.log('✅ تم الاتصال بقاعدة البيانات');
        
        // تنفيذ كود SQL
        console.log('📝 جاري إنشاء الجداول...');
        const result = await client.query(initSQL);
        console.log(result.rows[0].message);
        
        console.log('🎉 تم تهيئة قاعدة البيانات بنجاح!');
        console.log('📋 الجداول التي تم إنشاؤها:');
        console.log('   👥 users - جدول المستخدمين');
        console.log('   👨‍💼 customers - جدول العملاء'); 
        console.log('   💰 sales - جدول المبيعات');
        console.log('   📊 user_activities - جدول النشاطات');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة قاعدة البيانات:', error.message);
        console.error('🔍 تفاصيل الخطأ:', error);
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
        console.log('\n✅ تم إنهاء الاتصال بقاعدة البيانات');
    }
}

// تشغيل التهيئة
initializeDatabase();
