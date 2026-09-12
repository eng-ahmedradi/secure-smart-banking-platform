// فحص أمني فوري قبل تحميل باقي عناصر الصفحة
(function checkAuth() {
    const token = sessionStorage.getItem("bankAuthToken");
    if (!token) {
        // لو مفيش توكن مسجل، رجعه لصفحة تسجيل الدخول فوراً
        window.location.href = "login.html";
    }
})();

// وظيفة تسجيل الخروج الآمن
function logoutUser() {
    sessionStorage.removeItem("bankAuthToken");
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
}