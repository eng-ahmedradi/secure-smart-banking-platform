document.addEventListener("DOMContentLoaded", () => {
    const regForm = document.getElementById("register-form");
    const regSuccessBox = document.getElementById("reg-success-box");
    const regSubmitBtn = document.getElementById("reg-submit-btn");
    const createdUsername = document.getElementById("created-username");
    const createdIban = document.getElementById("created-iban");
    const regErrorAlert = document.getElementById("reg-error-alert"); // قد لا يكون موجوداً في الصفحة الحالية

    regForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        regSubmitBtn.disabled = true;
        regSubmitBtn.textContent = "جاري إنشاء الحساب وإصدار الآيبان...";

        const fullName = document.getElementById("reg-fullname").value.trim();
        const phone = document.getElementById("reg-phone").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        // الباك إند يحتاج اسم مستخدم منفصل، ولا يوجد حقل له في النموذج الحالي، فنولّده تلقائياً
        const generatedUser = "user_" + Math.floor(1000 + Math.random() * 9000);

        try {
            const res = await fetch(API_BASE_URL + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username: generatedUser, password, email, phone })
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error((data && data.message) || "تعذر إنشاء الحساب، يرجى المحاولة مرة أخرى.");
            }

            // حفظ التوكن مباشرة (تسجيل دخول تلقائي بعد التسجيل)
            sessionStorage.setItem("bankAuthToken", data.token);
            sessionStorage.setItem("currentUser", data.fullName || data.username);

            // جلب رقم الـ IBAN الخاص بالحساب المُنشأ حديثاً لعرضه في شاشة النجاح
            let iban = "—";
            try {
                const accountsRes = await fetch(API_BASE_URL + "/accounts", {
                    headers: { "Authorization": "Bearer " + data.token }
                });
                const accounts = await accountsRes.json();
                if (accounts && accounts.length > 0) iban = accounts[0].iban;
            } catch (err) { /* عرض الشاشة حتى لو فشل جلب الـ IBAN */ }

            createdUsername.textContent = data.username;
            if (createdIban) createdIban.textContent = iban;

            regForm.classList.add("hidden");
            regSuccessBox.classList.remove("hidden");

        } catch (err) {
            if (regErrorAlert) {
                regErrorAlert.textContent = err.message;
                regErrorAlert.classList.remove("hidden");
            } else {
                alert(err.message);
            }
            regSubmitBtn.disabled = false;
            regSubmitBtn.textContent = "إنشاء الحساب";
        }
    });
});
