document.addEventListener("DOMContentLoaded", () => {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const serviceCards = document.querySelectorAll(".service-card");

    // عناصر المودال
    const serviceModal = document.getElementById("service-modal");
    const closeModalBtn = document.getElementById("close-service-modal");
    const modalTitle = document.getElementById("modal-service-title");
    const modalBody = document.getElementById("modal-service-body");
    const detailButtons = document.querySelectorAll(".btn-details");

    // بيانات تفصيلية للشروط تحاكي الـ API
    const termsData = {
        savings: {
            title: "شروط وضوابط حساب التوفير البلاتيني",
            content: `
                <p>للتمتع بمزايا الحساب البلاتيني والعائد الشهري، تنطبق الشروط التالية:</p>
                <ul>
                    <li>السن القانوني لفتح الحساب 21 عاماً (أو 16 عاماً لولاية طبيعية).</li>
                    <li>بطاقة رقم قومي سارية للمصريين أو جواز سفر ساري للأجانب.</li>
                    <li>احتساب العائد يتم على أدنى رصيد شهري، ويتم إيداعه في اليوم الأول من كل شهر.</li>
                </ul>
            `
        },
        business: {
            title: "المستندات المطلوبة لحساب الشركات",
            content: `
                <p>لفتح حساب جاري للشركات والمؤسسات:</p>
                <ul>
                    <li>سجل تجاري حديث لم يمر عليه أكثر من 3 شهور.</li>
                    <li>بطاقة ضريبية سارية وعقد تأسيس الشركة.</li>
                    <li>تفويض بنكي للأشخاص المعتمدين بالتوقيع مع صورة هوياتهم.</li>
                </ul>
            `
        },
        ipn: {
            title: "حدود وشروط شبكة التحويل اللحظي (IPN)",
            content: `
                <p>قواعد التشغيل المعتمدة من البنك المركزي المصري:</p>
                <ul>
                    <li>الحد الأقصى للمعاملة الواحدة: 70,000 ج.م.</li>
                    <li>الحد اليومي الإجمالي للتحويلات: 120,000 ج.م.</li>
                    <li>المعاملات مشفرة وتتم عبر رقم الهاتف أو معرّف الدفع اللحظي (IPA).</li>
                </ul>
            `
        },
        loans: {
            title: "معايير التمويل والتسهيلات الائتمانية",
            content: `
                <p>شروط الحصول على تمويل شخصي أو سيارة:</p>
                <ul>
                    <li>الحد الأدنى لصافي الدخل الشهري: 5,000 ج.م.</li>
                    <li>مدة خدمة لا تقل عن 6 أشهر في جهة العمل الحالية.</li>
                    <li>سجل ائتماني منتظم وفقاً للاستعلام في شركة I-Score.</li>
                </ul>
            `
        }
    };

    // 1. تصفية الكروت حسب الفئة
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const selectedCategory = btn.getAttribute("data-category");

            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    card.classList.remove("hidden");
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });

    // 2. فتح نافذة الشروط
    detailButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const termKey = btn.getAttribute("data-id");
            const data = termsData[termKey];

            if (data) {
                modalTitle.textContent = data.title;
                modalBody.innerHTML = data.content;
                serviceModal.classList.remove("hidden");
            }
        });
    });

    // 3. إغلاق النافذة
    closeModalBtn.addEventListener("click", () => {
        serviceModal.classList.add("hidden");
    });

    serviceModal.addEventListener("click", (e) => {
        if (e.target === serviceModal) {
            serviceModal.classList.add("hidden");
        }
    });
});