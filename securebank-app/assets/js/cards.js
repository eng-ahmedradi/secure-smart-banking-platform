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

    const maskedCardNumber = "•••• •••• •••• 4490";
    const maskedCvv = "•••";

    let isRevealed = false;
    let currentCardId = null; // يُملأ بعد تحميل بطاقات المستخدم من GET /api/cards

    // 0. تحميل بطاقة المستخدم الحقيقية من الباك إند
    apiFetch("/cards")
        .then((cards) => {
            if (!cards || cards.length === 0) return;
            const card = cards[0]; // الصفحة تعرض بطاقة واحدة فقط حالياً
            currentCardId = card.id;

            displayCardNumber.textContent = card.maskedCardNumber;
            if (toggleFreeze) toggleFreeze.checked = card.frozen;
            if (limitSlider) {
                limitSlider.value = card.dailyLimit;
                if (limitDisplay) limitDisplay.textContent = Number(card.dailyLimit).toLocaleString("en-US") + " ج.م";
            }
            if (card.frozen && cardElement) {
                cardElement.style.opacity = "0.45";
                cardElement.style.filter = "grayscale(80%)";
            }
        })
        .catch(() => { /* فشل تحميل البطاقة - تبقى القيم الافتراضية في الصفحة */ });

    // 1. قلب البطاقة ثلاثي الأبعاد (Flip 3D)
    function flipCard() {
        cardElement.classList.toggle("is-flipped");
    }

    if (btnFlipCard) btnFlipCard.addEventListener("click", flipCard);
    if (cardElement) cardElement.addEventListener("click", flipCard);

    // 2. إظهار / إخفاء الأرقام الحساسة - يستدعي POST /api/cards/{id}/reveal فقط عند أول إظهار
    let revealedNumber = null;
    let revealedCvv = null;

    if (btnReveal) {
        btnReveal.addEventListener("click", async (e) => {
            e.stopPropagation();

            if (!isRevealed && !revealedNumber && currentCardId) {
                try {
                    const data = await apiFetch(`/cards/${currentCardId}/reveal`, { method: "POST" });
                    revealedNumber = data.cardNumber;
                    revealedCvv = data.cvv;
                } catch (err) {
                    alert(err.message);
                    return;
                }
            }

            isRevealed = !isRevealed;

            if (isRevealed) {
                displayCardNumber.textContent = revealedNumber || maskedCardNumber;
                displayCardCvv.textContent = revealedCvv || maskedCvv;
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

    // 3. تجميد البطاقة لحظياً - PATCH /api/cards/{id}/freeze
    if (toggleFreeze) {
        toggleFreeze.addEventListener("change", async () => {
            const frozen = toggleFreeze.checked;

            try {
                if (currentCardId) {
                    await apiFetch(`/cards/${currentCardId}/freeze`, {
                        method: "PATCH",
                        body: JSON.stringify({ frozen })
                    });
                }

                if (frozen) {
                    cardElement.style.opacity = "0.45";
                    cardElement.style.filter = "grayscale(80%)";
                    alert("تم تجميد البطاقة بنجاح! تم إيقاف كافة المعاملات والمشتريات فورياً.");
                } else {
                    cardElement.style.opacity = "1";
                    cardElement.style.filter = "none";
                    alert("تم إلغاء تجميد البطاقة وإعادة تفعيلها للاستخدام الطبيعي.");
                }
            } catch (err) {
                toggleFreeze.checked = !frozen; // التراجع عن التغيير لو فشل الطلب
                alert(err.message);
            }
        });
    }

    // 4. تحديث مؤشر الحد اليومي أثناء تحريك السلايدر (بدون استدعاء الباك إند إلا عند الحفظ)
    if (limitSlider && limitDisplay) {
        limitSlider.addEventListener("input", () => {
            const val = parseInt(limitSlider.value);
            limitDisplay.textContent = val.toLocaleString("en-US") + " ج.م";
        });
    }

    // 5. حفظ الحد اليومي الجديد - PUT /api/cards/{id}/limit
    if (btnSaveLimit) {
        btnSaveLimit.addEventListener("click", async () => {
            const newLimit = parseInt(limitSlider.value);

            try {
                if (currentCardId) {
                    await apiFetch(`/cards/${currentCardId}/limit`, {
                        method: "PUT",
                        body: JSON.stringify({ dailyLimit: newLimit })
                    });
                }
                alert(`تم حفظ الحد اليومي الجديد (${limitDisplay.textContent}) وتطبيقه على البطاقة.`);
            } catch (err) {
                alert(err.message);
            }
        });
    }
});
