document.addEventListener("DOMContentLoaded", () => {
    // 1. التقليب التلقائي للصور كل 4 ثوانٍ
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".p-dot");
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");

    let currentSlide = 0;
    let slideTimer = null;
    const intervalDuration = 4000; // 4 ثوانٍ بين كل صورة والتانية

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function advanceSlide() {
        showSlide(currentSlide + 1);
    }

    function retreatSlide() {
        showSlide(currentSlide - 1);
    }

    // بدء التقليب التلقائي فور فتح الصفحة
    function startAutoCycle() {
        if (slideTimer) clearInterval(slideTimer);
        slideTimer = setInterval(advanceSlide, intervalDuration);
    }

    if (slides.length > 0) {
        // عند الضغط اليدوي على الأسهم، بنقلب ونعيد ضبط العداد
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                advanceSlide();
                startAutoCycle();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                retreatSlide();
                startAutoCycle();
            });
        }

        // عند الضغط على النقط السفلية
        dots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                const targetIdx = parseInt(e.target.getAttribute("data-index"));
                showSlide(targetIdx);
                startAutoCycle();
            });
        });

        // تشغيل التايمر مباشرة
        startAutoCycle();
    }

    // 2. تفعيل تأثير الهيدر الزجاجي عند التمرير لأسفل
    const header = document.querySelector(".site-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 3. تحديث أسعار العملات في شريط التيكر
    const usdRate = document.getElementById("usd-rate");
    const eurRate = document.getElementById("eur-rate");

    function updateRates() {
        if (usdRate && eurRate) {
            const usdBase = 48.30;
            const delta = (Math.random() * 0.04 - 0.02);
            const currentUsd = (usdBase + delta).toFixed(2);
            const currentUsdSell = (parseFloat(currentUsd) + 0.15).toFixed(2);

            usdRate.textContent = `${currentUsd} شراء / ${currentUsdSell} بيع`;
        }
    }
    setInterval(updateRates, 10000);
});