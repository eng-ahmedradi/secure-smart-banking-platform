document.addEventListener("DOMContentLoaded", () => {
    const stepVerify = document.getElementById("step-verify");
    const stepOtp = document.getElementById("step-otp");
    const stepReset = document.getElementById("step-reset");
    const stepSuccess = document.getElementById("step-success");

    const verifyForm = document.getElementById("verify-identity-form");
    const otpForm = document.getElementById("otp-form");
    const resetForm = document.getElementById("reset-pwd-form");
    const otpInputs = document.querySelectorAll(".recovery-otp");

    // تنقل خانات OTP
    otpInputs.forEach((input, i) => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.value && i < otpInputs.length - 1) otpInputs[i + 1].focus();
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !e.target.value && i > 0) otpInputs[i - 1].focus();
        });
    });

    // 1. فحص الهوية
    verifyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        stepVerify.classList.add("hidden");
        stepOtp.classList.remove("hidden");
        setTimeout(() => otpInputs[0].focus(), 100);
    });

    // 2. التحقق من الـ OTP
    otpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        stepOtp.classList.add("hidden");
        stepReset.classList.remove("hidden");
    });

    // 3. تغيير كلمة المرور
    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const p1 = document.getElementById("new-password").value;
        const p2 = document.getElementById("confirm-new-password").value;

        if (p1 !== p2) {
            alert("كلمتا المرور غير متطابقتين!");
            return;
        }

        stepReset.classList.add("hidden");
        stepSuccess.classList.remove("hidden");
    });
});