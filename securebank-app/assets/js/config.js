// إعدادات الاتصال بالباك إند (Spring Boot API)
const API_BASE_URL = "/api";

// دالة مساعدة لإرسال طلبات مصادقة موحّدة مع التوكن، وتسجيل الخروج تلقائياً لو انتهت صلاحيته
async function apiFetch(path, options = {}) {
    const token = sessionStorage.getItem("bankAuthToken");

    const headers = Object.assign(
        { "Content-Type": "application/json" },
        options.headers || {},
        token ? { "Authorization": "Bearer " + token } : {}
    );

    const res = await fetch(API_BASE_URL + path, Object.assign({}, options, { headers }));

    if (res.status === 401 || res.status === 403) {
        // التوكن غير صالح أو منتهي الصلاحية
        sessionStorage.removeItem("bankAuthToken");
        sessionStorage.removeItem("currentUser");
        window.location.href = "login.html";
        return Promise.reject(new Error("Unauthorized"));
    }

    let body = null;
    try { body = await res.json(); } catch (e) { /* لا يوجد محتوى JSON (استجابة فارغة) */ }

    if (!res.ok) {
        const message = (body && body.message) || "حدث خطأ غير متوقع، حاول مرة أخرى.";
        throw new Error(message);
    }

    return body;
}
