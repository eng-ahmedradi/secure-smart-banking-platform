document.addEventListener("DOMContentLoaded", () => {
    // 1. فحص قوة كلمة المرور اللحظي (Password Strength Meter)
    const newPwdInput = document.getElementById("new-pwd");
    const meterFill = document.getElementById("meter-fill");
    const meterText = document.getElementById("meter-text");

    if (newPwdInput) {
        newPwdInput.addEventListener("input", () => {
            const val = newPwdInput.value;
            let score = 0;

            if (val.length >= 8) score += 25;
            if (/[A-Z]/.test(val)) score += 25;
            if (/[0-9]/.test(val)) score += 25;
            if (/[^A-Za-z0-9]/.test(val)) score += 25;

            meterFill.style.width = score + "%";

            if (score === 0) {
                meterFill.style.backgroundColor = "#e2e8f0";
                meterText.textContent = "أدخل كلمة المرور";
                meterText.style.color = "var(--text-secondary)";
            } else if (score <= 25) {
                meterFill.style.backgroundColor = "#ef4444";
                meterText.textContent = "ضعيفة جداً";
                meterText.style.color = "#ef4444";
            } else if (score <= 50) {
                meterFill.style.backgroundColor = "#f59e0b";
                meterText.textContent = "متوسطة";
                meterText.style.color = "#f59e0b";
            } else if (score <= 75) {
                meterFill.style.backgroundColor = "#0284c7";
                meterText.textContent = "جيدة";
                meterText.style.color = "#0284c7";
            } else {
                meterFill.style.backgroundColor = "#10b981";
                meterText.textContent = "قوية جداً ومحمية";
                meterText.style.color = "#10b981";
            }
        });
    }

    // 2. تحديث كلمة المرور
    const changePwdForm = document.getElementById("change-pwd-form");
    const pwdAlert = document.getElementById("pwd-alert");

    if (changePwdForm) {
        changePwdForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentPwd = document.getElementById("current-pwd").value;
            const newPwd = document.getElementById("new-pwd").value;
            const confirmPwd = document.getElementById("confirm-pwd").value;

            pwdAlert.className = "sec-alert hidden";

            if (newPwd !== confirmPwd) {
                pwdAlert.textContent = "كلمة المرور الجديدة غير متطابقة!";
                pwdAlert.classList.remove("hidden");
                pwdAlert.classList.add("danger");
                return;
            }

            if (newPwd.length < 8) {
                pwdAlert.textContent = "يجب ألا تقل كلمة المرور عن 8 أحرف.";
                pwdAlert.classList.remove("hidden");
                pwdAlert.classList.add("danger");
                return;
            }

            // محاكاة نجاح التحديث
            pwdAlert.textContent = "تم تحديث كلمة المرور بنجاح وحفظ التغييرات.";
            pwdAlert.classList.remove("hidden");
            pwdAlert.classList.add("success");
            changePwdForm.reset();
            meterFill.style.width = "0%";
            meterText.textContent = "أدخل كلمة المرور";
        });
    }

    // 3. إدارة وإنهاء الجلسات النشطة
    const killButtons = document.querySelectorAll(".btn-kill-single");
    killButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const device = btn.getAttribute("data-device");
            if (confirm(`هل أنت متأكد من إنهاء جلسة (${device})؟`)) {
                btn.closest(".session-item").remove();
            }
        });
    });

    const terminateAllBtn = document.getElementById("btn-terminate-all");
    if (terminateAllBtn) {
        terminateAllBtn.addEventListener("click", () => {
            if (confirm("هل تريد تسجيل الخروج من كافة الأجهزة الأخرى مع إبقاء هذا الجهاز؟")) {
                const sessions = document.querySelectorAll(".session-item:not(.current)");
                sessions.forEach(s => s.remove());
                alert("تم إنهاء كافة الجلسات الأخرى بنجاح.");
            }
        });
    }
});