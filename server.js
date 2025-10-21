// server.js - كامل ومصحح مع التعديلات المطلوبة
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 10000;

// 🔗 رابط الداتابيس المباشر - معدل
const DATABASE_URL = "postgresql://neondb_owner:npg_bre3UJ8KxmRq@ep-floral-mud-agqi3f05-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// 🔑 مفتاح التوقيع
const JWT_SECRET = "datavision-secret-key-2024";

// 🔗 إعداد الداتابيس - مرة واحدة فقط
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || DATABASE_URL,
    ssl: { 
        rejectUnauthorized: false 
    }
});

// 🔐 Middleware للتحقق من التوكن
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'رمز الدخول مطلوب' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'رمز الدخول غير صالح' });
        }
        req.user = user;
        next();
    });
};

// 🆕 نظام الصلاحيات الجديد - أضف هذا الكود
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'غير مصرح' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'ليس لديك الصلاحية لهذا الإجراء' });
        }
        
        next();
    };
}

// صلاحيات المدير والإدمن
const requireManager = requireRole(['admin', 'manager']);
const requireAdmin = requireRole(['admin']);

// فحص الاتصال بقاعدة البيانات - معدل
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as time');
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
        console.log('🕒 وقت قاعدة البيانات:', result.rows[0].time);
        client.release();
        return true;
    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
        console.error('🔍 تفاصيل الخطأ:', error);
        return false;
    }
}

// 🔧 دالة تهيئة قاعدة البيانات
async function initializeDatabase() {
    try {
        const client = await pool.connect();
        
        // إنشاء جدول المستخدمين
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                position VARCHAR(100),
                status VARCHAR(20) DEFAULT 'active',
                created_by INTEGER REFERENCES users(id),
                last_login TIMESTAMP,
                permissions JSONB,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        
        // إنشاء جدول العملاء
        await client.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                status TEXT DEFAULT 'active',
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // إنشاء جدول المبيعات
        await client.query(`
            CREATE TABLE IF NOT EXISTS sales (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                sale_date DATE NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // إنشاء جدول سجل النشاطات
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_activities (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                details TEXT,
                timestamp TIMESTAMP DEFAULT NOW()
            )
        `);

        // إنشاء indexes للأداء
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
            CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
            CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
            CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
        `);

        client.release();
        console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
    } catch (error) {
        console.error('❌ فشل في تهيئة قاعدة البيانات:', error.message);
    }
}

// 👥 مستخدمين متصلين
const onlineUsers = new Map();

// 🔌 Socket.IO للتواصل المباشر
io.on('connection', (socket) => {
    console.log('🔌 مستخدم متصل:', socket.id);

    socket.on('user_online', (userId) => {
        onlineUsers.set(userId.toString(), socket.id);
        console.log(`👤 المستخدم ${userId} متصل الآن`);
    });

    socket.on('join_dashboard', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`📊 المستخدم ${userId} انضم للوحة التحكم`);
    });

    socket.on('data_updated', (data) => {
        socket.broadcast.emit('refresh_data', data);
    });

    socket.on('disconnect', () => {
        console.log('🔌 مستخدم منقطع:', socket.id);
        for (let [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});

// ⚙️ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 إصلاح CORS الشامل
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// 🛠️ معالجة الأخطاء غير المتوقعة
app.use((error, req, res, next) => {
    console.error('🛑 خطأ غير متوقع:', error);
    res.status(500).json({
        success: false,
        error: 'خطأ داخلي في السيرفر',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// 🏥 فحص الصحة
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'سيرفر Data Vision شغال',
        timestamp: new Date().toISOString()
    });
});

// 🧪 فحص الاتصال بقاعدة البيانات
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as time');
        const usersCount = await pool.query('SELECT COUNT(*) FROM users');
        const customersCount = await pool.query('SELECT COUNT(*) FROM customers');
        const salesCount = await pool.query('SELECT COUNT(*) FROM sales');
        
        res.json({ 
            status: 'working', 
            message: '✅ السيرفر متصل بقاعدة البيانات!',
            database_time: result.rows[0].time,
            users_count: parseInt(usersCount.rows[0].count),
            customers_count: parseInt(customersCount.rows[0].count),
            sales_count: parseInt(salesCount.rows[0].count),
            database: 'Neon PostgreSQL'
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'فشل الاتصال بقاعدة البيانات',
            details: error.message 
        });
    }
});

// 🔐 نظام المصادقة

// تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
    console.log('🔐 محاولة تسجيل دخول:', req.body);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
            });
        }

        // البحث عن المستخدم
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            });
        }

        const user = result.rows[0];
        
        // التحقق من كلمة المرور
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ 
                success: false,
                error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            });
        }

        console.log('✅ تسجيل دخول ناجح:', user.email);

        // تحديث وقت آخر دخول
        await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [user.id]
        );

        // إنشاء توكن
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // إرجاع البيانات بدون كلمة المرور
        const userResponse = { 
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            position: user.position,
            created_at: user.created_at,
            last_login: user.last_login
        };

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح!',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        res.status(500).json({ 
            success: false,
            error: 'خطأ في السيرفر: ' + error.message 
        });
    }
});

// إنشاء حساب جديد - معدل لجعل أول مستخدم admin
app.post('/api/auth/register', async (req, res) => {
    console.log('📝 محاولة تسجيل جديد:', req.body);
    
    let client;
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'جميع الحقول مطلوبة' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false,
                error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' 
            });
        }

        // الحصول على اتصال من الـ pool
        client = await pool.connect();
        
        // التحقق من وجود المستخدم
        const userCheck = await client.query(
            'SELECT id FROM users WHERE email = $1', 
            [email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ 
                success: false,
                error: 'البريد الإلكتروني مسجل مسبقاً' 
            });
        }

        // 🆕 تحديد صلاحية المستخدم - أول مستخدم يكون admin
        const usersCount = await client.query('SELECT COUNT(*) FROM users');
        const isFirstUser = parseInt(usersCount.rows[0].count) === 0;
        const userRole = isFirstUser ? 'admin' : 'user';

        console.log(`🎯 إنشاء مستخدم جديد بصلاحية: ${userRole}`);

        // تشفير كلمة المرور
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // حفظ المستخدم
        const result = await client.query(
            `INSERT INTO users (name, email, password_hash, role, status) 
             VALUES ($1, $2, $3, $4, 'active') 
             RETURNING id, name, email, role, created_at`,
            [name, email, passwordHash, userRole]
        );

        console.log('✅ مستخدم جديد مسجل:', result.rows[0].email, 'بصلاحية:', userRole);

        // إنشاء توكن
        const token = jwt.sign(
            { userId: result.rows[0].id, email: result.rows[0].email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح!',
            user: result.rows[0],
            token
        });

    } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        
        // رسائل خطأ محددة
        let errorMessage = 'خطأ في السيرفر';
        if (error.code === '23505') {
            errorMessage = 'البريد الإلكتروني مسجل مسبقاً';
        } else if (error.code === '23502') {
            errorMessage = 'بيانات ناقصة';
        } else if (error.code === '28P01') {
            errorMessage = 'خطأ في الاتصال بقاعدة البيانات';
        }
        
        res.status(500).json({ 
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        // تحرير الاتصال
        if (client) {
            client.release();
        }
    }
});

// 📊 إحصائيات المستخدم
app.get('/api/user/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const customersCount = await pool.query(
            'SELECT COUNT(*) FROM customers WHERE user_id = $1',
            [userId]
        );

        const salesCount = await pool.query(
            'SELECT COUNT(*) FROM sales WHERE user_id = $1',
            [userId]
        );

        const totalSales = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM sales WHERE user_id = $1',
            [userId]
        );

        const activeCustomers = await pool.query(
            'SELECT COUNT(*) FROM customers WHERE user_id = $1 AND status = $2',
            [userId, 'active']
        );

        res.json({
            success: true,
            stats: {
                totalCustomers: parseInt(customersCount.rows[0].count),
                totalSales: parseInt(salesCount.rows[0].count),
                salesAmount: parseFloat(totalSales.rows[0].total),
                activeCustomers: parseInt(activeCustomers.rows[0].count)
            }
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ 
            success: false,
            error: 'خطأ في جلب الإحصائيات' 
        });
    }
});

// 👤 ملف المستخدم الشخصي
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const userResult = await pool.query(
            'SELECT id, name, email, role, position, created_at, last_login FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        res.json({
            success: true,
            user: userResult.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب بيانات المستخدم' });
    }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, currentPassword, newPassword } = req.body;

        if (newPassword) {
            const userCheck = await pool.query(
                'SELECT password_hash FROM users WHERE id = $1',
                [userId]
            );

            const validPassword = await bcrypt.compare(currentPassword, userCheck.rows[0].password_hash);
            if (!validPassword) {
                return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
            }

            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
            
            await pool.query(
                'UPDATE users SET password_hash = $1 WHERE id = $2',
                [newPasswordHash, userId]
            );
        }

        await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3',
            [name, email, userId]
        );

        res.json({
            success: true,
            message: 'تم تحديث الملف الشخصي بنجاح'
        });

    } catch (error) {
        res.status(500).json({ error: 'خطأ في تحديث الملف الشخصي' });
    }
});

// 🆕 دوال حذف الحساب والنشاطات - أضف هذا الكود
app.delete('/api/user/account', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // حذف جميع بيانات المستخدم
        await pool.query('DELETE FROM sales WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM customers WHERE user_id = $1', [userId]);
        await pool.query('DELETE FROM user_activities WHERE user_id = $1', [userId]);
        
        // حذف المستخدم نفسه
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.json({
            success: true,
            message: 'تم حذف الحساب وجميع البيانات المرتبطة به بنجاح'
        });

    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'خطأ في حذف الحساب' });
    }
});

app.get('/api/user/activities', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const period = req.query.period || '7';

        const activitiesResult = await pool.query(
            `SELECT type, details, timestamp 
             FROM user_activities 
             WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '${period} days'
             ORDER BY timestamp DESC`,
            [userId]
        );

        res.json({
            success: true,
            activities: activitiesResult.rows
        });

    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'خطأ في جلب سجل النشاطات' });
    }
});

// 👥 إدارة الموظفين - معدل باستخدام نظام الصلاحيات الجديد
app.get('/api/users/employees', authenticateToken, requireManager, async (req, res) => {
    try {
        const userId = req.user.userId;

        const employeesResult = await pool.query(
            `SELECT id, name, email, role, position, status, created_at, last_login 
             FROM users 
             WHERE created_by = $1 OR (role IN ('employee', 'viewer') AND created_by IS NOT NULL)
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            employees: employeesResult.rows
        });

    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'خطأ في جلب بيانات الموظفين' });
    }
});

app.post('/api/users/employees', authenticateToken, requireManager, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, password, position, role, permissions } = req.body;

        // التحقق من البيانات
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' });
        }

        // التحقق من وجود البريد الإلكتروني
        const emailCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });
        }

        // تشفير كلمة المرور
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // إضافة الموظف
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role, position, created_by, permissions) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING id, name, email, role, position, created_at`,
            [name, email, passwordHash, role, position, userId, JSON.stringify(permissions || [])]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة الموظف بنجاح',
            employee: result.rows[0]
        });

    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'خطأ في إضافة الموظف' });
    }
});

app.put('/api/users/employees/:id', authenticateToken, requireManager, async (req, res) => {
    try {
        const userId = req.user.userId;
        const employeeId = req.params.id;
        const { name, email, position, role, permissions } = req.body;

        // التحقق من أن المستخدم يملك هذا الموظف
        const employeeCheck = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND created_by = $2',
            [employeeId, userId]
        );

        if (employeeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'الموظف غير موجود أو ليس لديك صلاحية لتعديله' });
        }

        // تحديث بيانات الموظف
        const result = await pool.query(
            `UPDATE users 
             SET name = $1, email = $2, position = $3, role = $4, permissions = $5
             WHERE id = $6 
             RETURNING id, name, email, role, position, created_at`,
            [name, email, position, role, JSON.stringify(permissions || []), employeeId]
        );

        res.json({
            success: true,
            message: 'تم تحديث بيانات الموظف بنجاح',
            employee: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'خطأ في تحديث بيانات الموظف' });
    }
});

app.put('/api/users/employees/:id/status', authenticateToken, requireManager, async (req, res) => {
    try {
        const userId = req.user.userId;
        const employeeId = req.params.id;
        const { status } = req.body;

        // التحقق من أن المستخدم يملك هذا الموظف
        const employeeCheck = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND created_by = $2',
            [employeeId, userId]
        );

        if (employeeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'الموظف غير موجود أو ليس لديك صلاحية لتعديله' });
        }

        // تحديث حالة الموظف
        await pool.query(
            'UPDATE users SET status = $1 WHERE id = $2',
            [status, employeeId]
        );

        res.json({
            success: true,
            message: `تم ${status === 'active' ? 'تفعيل' : 'تعطيل'} الموظف بنجاح`
        });

    } catch (error) {
        console.error('Error toggling employee status:', error);
        res.status(500).json({ error: 'خطأ في تغيير حالة الموظف' });
    }
});

app.delete('/api/users/employees/:id', authenticateToken, requireManager, async (req, res) => {
    try {
        const userId = req.user.userId;
        const employeeId = req.params.id;

        // التحقق من أن المستخدم يملك هذا الموظف
        const employeeCheck = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND created_by = $2',
            [employeeId, userId]
        );

        if (employeeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'الموظف غير موجود أو ليس لديك صلاحية لحذفه' });
        }

        // حذف الموظف
        await pool.query('DELETE FROM users WHERE id = $1', [employeeId]);

        res.json({
            success: true,
            message: 'تم حذف الموظف بنجاح'
        });

    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'خطأ في حذف الموظف' });
    }
});

// 📊 تصدير بيانات المستخدم
app.get('/api/user/export-data', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const customersResult = await pool.query(
            'SELECT * FROM customers WHERE user_id = $1',
            [userId]
        );

        const salesResult = await pool.query(
            'SELECT * FROM sales WHERE user_id = $1',
            [userId]
        );

        const userResult = await pool.query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [userId]
        );

        res.json({
            success: true,
            data: {
                customers: customersResult.rows,
                sales: salesResult.rows,
                user: userResult.rows[0],
                exportDate: new Date().toISOString()
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'خطأ في تصدير البيانات' });
    }
});

// 👥 إدارة العملاء
app.get('/api/customers', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const result = await pool.query(
            `SELECT c.*, 
                    COUNT(s.id) as sales_count,
                    COALESCE(SUM(s.amount), 0) as total_purchases
             FROM customers c
             LEFT JOIN sales s ON c.id = s.customer_id
             WHERE c.user_id = $1
             GROUP BY c.id
             ORDER BY c.created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            customers: result.rows
        });

    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ error: 'خطأ في جلب العملاء' });
    }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, email, status, notes } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: 'الاسم ورقم الهاتف مطلوبان' });
        }

        const result = await pool.query(
            `INSERT INTO customers (user_id, name, phone, email, status, notes) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [userId, name, phone, email, status, notes]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة العميل بنجاح',
            customer: result.rows[0]
        });

    } catch (error) {
        console.error('Add customer error:', error);
        res.status(500).json({ error: 'خطأ في إضافة العميل' });
    }
});

// 💰 إدارة المبيعات
app.get('/api/sales', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const result = await pool.query(
            `SELECT s.*, c.name as customer_name
             FROM sales s
             LEFT JOIN customers c ON s.customer_id = c.id
             WHERE s.user_id = $1
             ORDER BY s.sale_date DESC`,
            [userId]
        );

        res.json({
            success: true,
            sales: result.rows
        });

    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ error: 'خطأ في جلب المبيعات' });
    }
});

app.post('/api/sales', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { customer_id, amount, sale_date, description } = req.body;

        if (!customer_id || !amount || !sale_date) {
            return res.status(400).json({ error: 'العميل والمبلغ والتاريخ مطلوبون' });
        }

        const result = await pool.query(
            `INSERT INTO sales (user_id, customer_id, amount, sale_date, description) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [userId, customer_id, amount, sale_date, description]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة البيع بنجاح',
            sale: result.rows[0]
        });

    } catch (error) {
        console.error('Add sale error:', error);
        res.status(500).json({ error: 'خطأ في إضافة البيع' });
    }
});

// 🌐 تقديم الملفات الثابتة
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/account.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// 🔥 تشغيل التهيئة وفحص الاتصال
initializeDatabase();
testConnection();

// 🔥 تشغيل السيرفر
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Data Vision server running on port ${PORT}`);
    console.log(`🌐 Live at: https://datavision-nilx.onrender.com`);
    console.log(`📊 Connected to: Neon PostgreSQL Database`);
    console.log(`🔌 Socket.IO ready for real-time updates`);
});
