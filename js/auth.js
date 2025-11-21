// js/auth.js
// 🔐 AUTHENTICATION: ระบบจำลองการตรวจสอบสิทธิ์ผู้ใช้

const USER_KEY = 'cos_user_session';

export const authSystem = {
    // ตรวจสอบว่า Login อยู่หรือไม่
    isLoggedIn() {
        const user = localStorage.getItem(USER_KEY);
        return !!user;
    },

    // ดึงข้อมูลผู้ใช้ปัจจุบัน
    getCurrentUser() {
        const userStr = localStorage.getItem(USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // จำลองการ Login
    login(username, role = 'admin') {
        const mockUser = {
            id: 'u_' + Math.random().toString(36).substr(2, 5),
            name: username || "Guest User",
            role: role,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        return mockUser;
    },

    // Logout
    logout() {
        localStorage.removeItem(USER_KEY);
        window.location.href = '../../index.html'; // กลับไปหน้า Portal
    },

    // ตรวจสอบสิทธิ์ (ใส่ไว้ต้นไฟล์ main.js ของแต่ละระบบ)
    checkAccess() {
        if (!this.isLoggedIn()) {
            // ถ้ายังไม่ Login ให้แจ้งเตือน (ในระบบจริงอาจ Redirect)
            console.warn("User not logged in. Running in Guest/Demo Mode.");
            return false;
        }
        return true;
    }
};