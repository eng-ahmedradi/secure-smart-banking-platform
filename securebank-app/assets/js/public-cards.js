document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const cardBoxes = document.querySelectorAll(".card-product-box");

    // عناصر المودال
    const cardModal = document.getElementById("card-modal");
    const closeCardModal = document.getElementById("close-card-modal");
    const selectedCardName = document.getElementById("selected-card-name");
    const cardRequestForm = document.getElementById("card-request-form");
    const orderButtons = document.querySelectorAll(".btn-order-card");

    // 1. حركة الإمالة واللمعان ثلاثي الأبعاد 3D Tilt Effect
    const tiltContainers = document.querySelectorAll(".tilt-card-container");

    tiltContainers.forEach(container => {
        const card = container.querySelector(".mock-card-visual");
        const shine = container.querySelector(".card-glass-shine");

        container.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

            if (shine) {
                shine.style.transform = `translate(${(x - centerX) * 0.4}px, ${(y - centerY) * 0.4}px)`;
            }
        });

        container.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
            if (shine) {
                shine.style.transform = "translate(0px, 0px)";
            }
        });
    });

    // 2. فلترة البطاقات حسب الفئة
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            cardBoxes.forEach(box => {
                const category = box.getAttribute("data-category");
                if (filter === "all" || category === filter) {
                    box.classList.remove("hidden");
                } else {
                    box.classList.add("hidden");
                }
            });
        });
    });

    // 3. فتح المودال مع ملء اسم البطاقة تلقائياً
    orderButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const cardName = btn.getAttribute("data-card");
            selectedCardName.value = cardName;
            cardModal.classList.remove("hidden");
        });
    });

    // 4. إغلاق المودال
    closeCardModal.addEventListener("click", () => {
        cardModal.classList.add("hidden");
    });

    cardModal.addEventListener("click", (e) => {
        if (e.target === cardModal) {
            cardModal.classList.add("hidden");
        }
    });

    // 5. تأكيد إرسال الطلب
    cardRequestForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const applicant = document.getElementById("applicant-name").value;
        
        alert(`شكراً لك يا ${applicant}! تم استلام طلب إصدار (${selectedCardName.value}) بنجاح.\nسيتواصل معك ممثل خدمة العملاء لتأكيد موعد استلام بطاقتك وتفعيلها.`);
        
        cardModal.classList.add("hidden");
        cardRequestForm.reset();
    });
});