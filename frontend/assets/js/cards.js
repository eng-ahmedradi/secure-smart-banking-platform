document.addEventListener("DOMContentLoaded", () => {
    const cardElement = document.getElementById("interactive-card-element");
    const btnFlipCard = document.getElementById("btn-flip-card");
    const btnReveal = document.getElementById("btn-reveal-details");
    const revealIcon = document.getElementById("reveal-icon");
    const revealText = document.getElementById("reveal-text");

    const displayCardNumber = document.getElementById("display-card-number");
    const displayCardCvv = document.getElementById("display-card-cvv");

    const toggleFreeze = document.getElementById("toggle-freeze");
    const limitSlider = document.getElementById("daily-limit-slider");
    const limitDisplay = document.getElementById("daily-limit-display");
    const btnSaveLimit = document.getElementById("btn-save-limit");

    const realCardNumber = "4490  8120  9934  4490";
    const maskedCardNumber = "•••• •••• •••• 4490";
    const realCvv = "842";
    const maskedCvv = "•••";

    let isRevealed = false;

    // 1. قلب البطاقة ثلاثي الأبعاد (Flip 3D)
    function flipCard() {
        cardElement.classList.toggle("is-flipped");
    }

    if (btnFlipCard) btnFlipCard.addEventListener("click", flipCard);
    if (cardElement) cardElement.addEventListener("click", flipCard);

    // 2. إظهار / إخفاء الأرقام الحساسة (Toggle Sensitive Numbers)
    if (btnReveal) {
        btnReveal.addEventListener("click", (e) => {
            e.stopPropagation();
            isRevealed = !isRevealed;

            if (isRevealed) {
                displayCardNumber.textContent = realCardNumber;
                displayCardCvv.textContent = realCvv;
                revealIcon.textContent = "🙈";
                revealText.textContent = "إخفاء الأرقام";
            } else {
                displayCardNumber.textContent = maskedCardNumber;
                displayCardCvv.textContent = maskedCvv;
                revealIcon.textContent = "👁️";
                revealText.textContent = "إظهار أرقام الكارت";
            }
        });
    }

    // 3. تجميد البطاقة لحظياً
    if (toggleFreeze) {
        toggleFreeze.addEventListener("change", () => {
            if (toggleFreeze.checked) {
                cardElement.style.opacity = "0.45";
                cardElement.style.filter = "grayscale(80%)";
                alert("تم تجميد البطاقة بنجاح! تم إيقاف كافة المعاملات والمشتريات فورياً.");
            } else {
                cardElement.style.opacity = "1";
                cardElement.style.filter = "none";
                alert("تم إلغاء تجميد البطاقة وإعادة تفعيلها للاستخدام الطبيعي.");
            }
        });
    }

    // 4. تحديث مؤشر الحد اليومي أثناء تحريك السلايدر
    if (limitSlider && limitDisplay) {
        limitSlider.addEventListener("input", () => {
            const val = parseInt(limitSlider.value);
            limitDisplay.textContent = val.toLocaleString("en-US") + " ج.م";
        });
    }

    if (btnSaveLimit) {
        btnSaveLimit.addEventListener("click", () => {
            alert(`تم حفظ الحد اليومي الجديد (${limitDisplay.textContent}) وتطبيقه على البطاقة.`);
        });
    }
});