document.addEventListener("DOMContentLoaded", () => {
    const regForm = document.getElementById("register-form");
    const regSuccessBox = document.getElementById("reg-success-box");
    const regSubmitBtn = document.getElementById("reg-submit-btn");
    const createdUsername = document.getElementById("created-username");

    regForm.addEventListener("submit", (e) => {
        e.preventDefault();

        regSubmitBtn.disabled = true;
        regSubmitBtn.textContent = "جاري إنشاء الحساب وإصدار الآيبان...";

        setTimeout(() => {
            const fullName = document.getElementById("reg-fullname").value.trim();
            const generatedUser = "user_" + Math.floor(1000 + Math.random() * 9000);
            
            createdUsername.textContent = generatedUser;

            regForm.classList.add("hidden");
            regSuccessBox.classList.remove("hidden");
        }, 1200);
    });
});