document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const errorAlert = document.getElementById("error-alert");
    const rememberMeCheckbox = document.getElementById("remember-id");
    const submitBtn = document.getElementById("submit-btn");

    // 1. استرجاع اسم المستخدم المحفوظ لو كان مختار "تذكر المعرّف" سابقاً
    const savedUsername = localStorage.getItem("savedBankUser");
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    }

    // 2. زر إظهار / إخفاء كلمة المرور
    togglePasswordBtn.addEventListener("click", () => {
        const currentType = passwordInput.getAttribute("type");
        if (currentType === "password") {
            passwordInput.setAttribute("type", "text");
            togglePasswordBtn.textContent = "🙈";
        } else {
            passwordInput.setAttribute("type", "password");
            togglePasswordBtn.textContent = "👁️";
        }
    });

    // 3. معالجة إرسال النموذج (Submit)
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // إخفاء رسالة الخطأ لو كانت ظاهرة
        errorAlert.classList.add("hidden");

        // تغيير حالة الزر أثناء التحقق (محاكاة انتظار استجابة السيرفر)
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">جاري التحقق الآمن...</span>';

        setTimeout(() => {
            // محاكاة بيانات صحيحة للاختبار مؤقتاً لحين ربط الباك إند
            // تقدر تستخدم اسم المستخدم: admin وكلمة المرور: 123456
            if (username === "admin" && password === "123456") {
                
                // حفظ حالة "تذكر المعرّف فقط" في localStorage
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("savedBankUser", username);
                } else {
                    localStorage.removeItem("savedBankUser");
                }

                // محاكاة استلام Token مشفر من السيرفر وحفظه في sessionStorage
                // (sessionStorage تنتهي صلاحيتها بمجرد غلق المتصفح لزيادة الأمان في البنوك)
                const mockToken = "secure_jwt_token_" + Math.random().toString(36).substring(2);
                sessionStorage.setItem("bankAuthToken", mockToken);
                sessionStorage.setItem("currentUser", username);

                // التوجيه إلى الداشبورد
                window.location.href = "dashboard.html";

            } else {
                // بيانات خاطئة
                errorAlert.textContent = "بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم وكلمة المرور.";
                errorAlert.classList.remove("hidden");

                // استرجاع الزر لشكله الطبيعي
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-text">دخول آمن</span>';
            }
        }, 1000); // تأخير زمني لمدة ثانية واحدة لمحاكاة الاتصال بالسيرفر
    });
});