document.addEventListener("DOMContentLoaded", () => {
    const channelButtons = document.querySelectorAll(".channel-btn");
    const recipientLabel = document.getElementById("recipient-label");
    const recipientInput = document.getElementById("recipient-input");
    const sourceAccount = document.getElementById("source-account");
    const availableBalDisplay = document.getElementById("available-bal-display");

    const amountInput = document.getElementById("transfer-amount");
    const transferForm = document.getElementById("transfer-form");
    const transferError = document.getElementById("transfer-error");

    const summaryChannel = document.getElementById("summary-channel");
    const summaryAmount = document.getElementById("summary-amount");
    const summaryTotal = document.getElementById("summary-total");

    // عناصر المودال
    const otpModal = document.getElementById("otp-modal");
    const closeOtpModal = document.getElementById("close-otp-modal");
    const otpConfirmForm = document.getElementById("otp-confirm-form");
    const modalConfirmAmount = document.getElementById("modal-confirm-amount");
    const modalConfirmRecipient = document.getElementById("modal-confirm-recipient");
    const btnFinal = document.getElementById("btn-final-transfer");
    const btnTxt = btnFinal.querySelector(".btn-txt");
    const spinner = document.getElementById("transfer-spinner");

    const successModal = document.getElementById("success-modal");
    const btnCloseReceipt = document.getElementById("btn-close-receipt");

    let currentChannel = "internal";

    // 1. التبديل بين قنوات التحويل وتغيير إرشادات الحقل
    channelButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            channelButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentChannel = btn.getAttribute("data-channel");
            recipientInput.value = "";

            if (currentChannel === "internal") {
                recipientLabel.textContent = "رقم حساب المستلم (داخل SecureBank)";
                recipientInput.placeholder = "أدخل رقم الحساب (12-16 رقماً)";
                summaryChannel.textContent = "تحويل داخلي فوري";
            } else if (currentChannel === "ipn") {
                recipientLabel.textContent = "رقم هاتف المستلم أو معرّف الدفع (IPA)";
                recipientInput.placeholder = "مثال: 01xxxxxxxxx أو name@instapay";
                summaryChannel.textContent = "شبكة المدفوعات IPN";
            } else if (currentChannel === "iban") {
                recipientLabel.textContent = "رقم الحساب الدولي الموحد (IBAN)";
                recipientInput.placeholder = "مثال: EG94 0002 xxxx xxxx xxxx";
                summaryChannel.textContent = "تحويل بنكي محلي (IBAN)";
            }
        });
    });

    // 2. تحديث الرصيد المتاح عند تغيير الحساب المصدر
    sourceAccount.addEventListener("change", () => {
        const selectedOpt = sourceAccount.options[sourceAccount.selectedIndex];
        const balance = parseFloat(selectedOpt.getAttribute("data-balance"));
        availableBalDisplay.textContent = balance.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
    });

    // 3. تحديث ملخص العملية لحظياً أثناء الكتابة
    amountInput.addEventListener("input", () => {
        const val = parseFloat(amountInput.value) || 0;
        summaryAmount.textContent = val.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
        summaryTotal.textContent = val.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
        transferError.classList.add("hidden");
    });

    // 4. تقديم الطلب والتحقق المبدئي
    transferForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedOpt = sourceAccount.options[sourceAccount.selectedIndex];
        const currentBalance = parseFloat(selectedOpt.getAttribute("data-balance"));
        const amount = parseFloat(amountInput.value);

        if (!amount || amount <= 0) return;

        if (amount > currentBalance) {
            transferError.classList.remove("hidden");
            return;
        }

        // فتح نافذة التأكيد والـ OTP
        modalConfirmAmount.textContent = amount.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
        modalConfirmRecipient.textContent = recipientInput.value;
        otpModal.classList.remove("hidden");
    });

    closeOtpModal.addEventListener("click", () => {
        otpModal.classList.add("hidden");
    });

    // 5. تأكيد التحويل النهائي برمز OTP
    otpConfirmForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        btnTxt.classList.add("hidden");
        spinner.classList.remove("hidden");
        btnFinal.disabled = true;

        // محاكاة الاتصال بالباك إند (جاهزة لاستبدالها بـ fetch لاحقاً)
        setTimeout(() => {
            btnTxt.classList.remove("hidden");
            spinner.classList.add("hidden");
            btnFinal.disabled = false;
            otpModal.classList.add("hidden");

            // ملء بيانات الإيصال
            document.getElementById("receipt-ref").textContent = "TXN-" + Math.floor(1000000 + Math.random() * 9000000);
            document.getElementById("receipt-amount").textContent = modalConfirmAmount.textContent;
            document.getElementById("receipt-to").textContent = modalConfirmRecipient.textContent;
            document.getElementById("receipt-date").textContent = new Date().toLocaleDateString("ar-EG");

            successModal.classList.remove("hidden");
            transferForm.reset();
            summaryAmount.textContent = "0.00 ج.م";
            summaryTotal.textContent = "0.00 ج.م";
        }, 1200);
    });

    btnCloseReceipt.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
});