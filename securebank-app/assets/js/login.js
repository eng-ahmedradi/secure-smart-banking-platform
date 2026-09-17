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

    // 3. معالجة إرسال النموذج (Submit) - متصل الآن بالباك إند الحقيقي
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        errorAlert.classList.add("hidden");

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">جاري التحقق الآمن...</span>';

        try {
            const res = await fetch(API_BASE_URL + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error((data && data.message) || "بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم وكلمة المرور.");
            }

            // حفظ حالة "تذكر المعرّف فقط" في localStorage
            if (rememberMeCheckbox.checked) {
                localStorage.setItem("savedBankUser", username);
            } else {
                localStorage.removeItem("savedBankUser");
            }

            // حفظ توكن JWT الحقيقي المستلم من السيرفر
            sessionStorage.setItem("bankAuthToken", data.token);
            sessionStorage.setItem("currentUser", data.fullName || data.username);

            window.location.href = "dashboard.html";

        } catch (err) {
            errorAlert.textContent = err.message;
            errorAlert.classList.remove("hidden");

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span class="btn-text">دخول آمن</span>';
        }
    });
});
