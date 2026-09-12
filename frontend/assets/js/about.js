document.addEventListener("DOMContentLoaded", () => {
    // 1. عدادات الأرقام المتصاعدة ديناميكياً
    const counters = document.querySelectorAll(".stat-num");

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute("data-target"));
        const isDecimal = target % 1 !== 0;
        const duration = 1500;
        const frameRate = 30;
        const totalFrames = Math.round(duration / frameRate);
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const current = target * progress;

            if (frame >= totalFrames) {
                counter.textContent = isDecimal ? target.toFixed(2) : target.toLocaleString("en-US");
                clearInterval(timer);
            } else {
                counter.textContent = isDecimal ? current.toFixed(2) : Math.floor(current).toLocaleString("en-US");
            }
        }, frameRate);
    });

    // 2. البحث اللحظي في شبكة الفروع
    const searchInput = document.getElementById("branch-search");
    const branchCards = document.querySelectorAll(".branch-card");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.trim().toLowerCase();

            branchCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                const area = card.getAttribute("data-area").toLowerCase();

                if (text.includes(term) || area.includes(term)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
});