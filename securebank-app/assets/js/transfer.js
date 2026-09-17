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
    const otpInput = document.getElementById("otp-code");
    const modalConfirmAmount = document.getElementById("modal-confirm-amount");
    const modalConfirmRecipient = document.getElementById("modal-confirm-recipient");
    const btnFinal = document.getElementById("btn-final-transfer");
    const btnTxt = btnFinal.querySelector(".btn-txt");
    const spinner = document.getElementById("transfer-spinner");

    const successModal = document.getElementById("success-modal");
    const btnCloseReceipt = document.getElementById("btn-close-receipt");

    let currentChannel = "internal";
    let pendingTransferId = null; // معرّف التحويل المعلّق، يُملأ بعد استدعاء POST /api/transfers

    // 0. تحميل حسابات المستخدم الحقيقية من الباك إند وملء القائمة المنسدلة
    apiFetch("/accounts")
        .then((accounts) => {
            sourceAccount.innerHTML = "";
            accounts.forEach((acc) => {
                const opt = document.createElement("option");
                opt.value = acc.id; // sourceAccountId الحقيقي المطلوب في POST /api/transfers
                opt.dataset.balance = acc.balance;
                const balanceFormatted = Number(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 });
                opt.textContent = `${acc.accountType === "CHECKING" ? "الحساب الجاري" : "حساب التوفير"} (${balanceFormatted} ج.م) - ${acc.iban}`;
                sourceAccount.appendChild(opt);
            });
            if (accounts.length > 0) {
                availableBalDisplay.textContent = Number(accounts[0].balance).toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
            }
        })
        .catch(() => { /* فشل تحميل الحسابات - القائمة تبقى فارغة */ });

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
        if (!selectedOpt) return;
        const balance = parseFloat(selectedOpt.dataset.balance);
        availableBalDisplay.textContent = balance.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
    });

    // 3. تحديث ملخص العملية لحظياً أثناء الكتابة
    amountInput.addEventListener("input", () => {
        const val = parseFloat(amountInput.value) || 0;
        summaryAmount.textContent = val.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
        summaryTotal.textContent = val.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
        transferError.classList.add("hidden");
    });

    // 4. تقديم الطلب - خطوة 1: POST /api/transfers لإصدار رمز OTP
    transferForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const selectedOpt = sourceAccount.options[sourceAccount.selectedIndex];
        const amount = parseFloat(amountInput.value);

        if (!selectedOpt || !amount || amount <= 0) return;

        try {
            const initResult = await apiFetch("/transfers", {
                method: "POST",
                body: JSON.stringify({
                    sourceAccountId: Number(selectedOpt.value),
                    channel: currentChannel,
                    recipient: recipientInput.value.trim(),
                    amount: amount
                })
            });

            pendingTransferId = initResult.pendingTransferId;

            // ملاحظة: لا يوجد مزود رسائل SMS حقيقي متصل بالباك إند بعد، لذا يعيد الرد
            // رمز OTP التجريبي (demoOtp) مباشرة حتى يمكن اختبار السيناريو كاملاً محلياً.
            if (initResult.demoOtp && otpInput) {
                console.info("Demo OTP (لن يظهر هكذا في بيئة إنتاج حقيقية):", initResult.demoOtp);
            }

            modalConfirmAmount.textContent = amount.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
            modalConfirmRecipient.textContent = recipientInput.value;
            transferError.classList.add("hidden");
            otpModal.classList.remove("hidden");

        } catch (err) {
            transferError.textContent = err.message;
            transferError.classList.remove("hidden");
        }
    });

    closeOtpModal.addEventListener("click", () => {
        otpModal.classList.add("hidden");
    });

    // 5. تأكيد التحويل النهائي - خطوة 2: POST /api/transfers/{id}/confirm برمز الـ OTP
    otpConfirmForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        btnTxt.classList.add("hidden");
        spinner.classList.remove("hidden");
        btnFinal.disabled = true;

        try {
            const otp = otpInput ? otpInput.value.trim() : "";
            const receipt = await apiFetch(`/transfers/${pendingTransferId}/confirm`, {
                method: "POST",
                body: JSON.stringify({ otp })
            });

            otpModal.classList.add("hidden");

            // ملء بيانات الإيصال الحقيقية القادمة من الباك إند
            document.getElementById("receipt-ref").textContent = receipt.reference;
            document.getElementById("receipt-amount").textContent =
                Number(receipt.amount).toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ج.م";
            document.getElementById("receipt-to").textContent = receipt.recipient;
            document.getElementById("receipt-date").textContent = new Date(receipt.date).toLocaleDateString("ar-EG");

            successModal.classList.remove("hidden");
            transferForm.reset();
            summaryAmount.textContent = "0.00 ج.م";
            summaryTotal.textContent = "0.00 ج.م";

        } catch (err) {
            alert(err.message); // مثال: رمز غير صحيح، أو انتهت صلاحية الرمز
        } finally {
            btnTxt.classList.remove("hidden");
            spinner.classList.add("hidden");
            btnFinal.disabled = false;
        }
    });

    btnCloseReceipt.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
});
