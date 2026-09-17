document.addEventListener("DOMContentLoaded", () => {
    const typeButtons = document.querySelectorAll(".type-btn");
    const loanSumInput = document.getElementById("loan-sum");
    const loanPeriodInput = document.getElementById("loan-period");

    const sumDisplay = document.getElementById("sum-display");
    const periodDisplay = document.getElementById("period-display");
    const minAmountLabel = document.getElementById("min-amount-label");
    const maxAmountLabel = document.getElementById("max-amount-label");
    const maxPeriodLabel = document.getElementById("max-period-label");

    const monthlyOut = document.getElementById("monthly-out");
    const principalOut = document.getElementById("principal-out");
    const interestOut = document.getElementById("interest-out");
    const totalOut = document.getElementById("total-out");

    const ratioPrincipal = document.getElementById("ratio-principal");
    const ratioInterest = document.getElementById("ratio-interest");

    let currentAnnualRate = 0.125; // النسبة الافتراضية 12.5%

    // دالة حركة تصاعد الأرقام الانسيابية (Smooth Number Animation)
    function animateValue(element, start, end, duration) {
        if (start === end) {
            element.textContent = end.toLocaleString("en-US");
            return;
        }
        const range = end - start;
        let current = start;
        const increment = end > start ? Math.ceil(range / (duration / 16)) : Math.floor(range / (duration / 16));
        const stepTime = 16;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString("en-US");
        }, stepTime);
    }

    // وظيفة الحساب وإعادة رسم المخرجات
    function updateCalculations(animate = false) {
        const principal = parseFloat(loanSumInput.value);
        const months = parseInt(loanPeriodInput.value);

        // تحديث شارات العرض بجوار السلايدر
        sumDisplay.textContent = principal.toLocaleString("en-US") + " ج.م";
        const years = (months / 12).toFixed(1);
        periodDisplay.textContent = `${months} شهر (${years} سنة)`;

        // الحساب البنكي
        const totalInterest = Math.round(principal * currentAnnualRate * (months / 12));
        const totalRepay = Math.round(principal + totalInterest);
        const monthly = Math.round(totalRepay / months);

        if (animate) {
            const currentVal = parseInt(monthlyOut.textContent.replace(/,/g, "")) || 0;
            animateValue(monthlyOut, currentVal, monthly, 250);
        } else {
            monthlyOut.textContent = monthly.toLocaleString("en-US");
        }

        principalOut.textContent = principal.toLocaleString("en-US") + " ج.م";
        interestOut.textContent = totalInterest.toLocaleString("en-US") + " ج.م";
        totalOut.textContent = totalRepay.toLocaleString("en-US") + " ج.م";

        // تحديث شريط النسبة
        const principalPct = ((principal / totalRepay) * 100).toFixed(1);
        const interestPct = (100 - principalPct).toFixed(1);
        
        ratioPrincipal.style.width = `${principalPct}%`;
        ratioInterest.style.width = `${interestPct}%`;
    }

    // التنقل بين أنواع القروض (شخصي، سيارات، عقاري)
    typeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            typeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            currentAnnualRate = parseFloat(btn.getAttribute("data-rate"));
            const maxVal = parseInt(btn.getAttribute("data-max"));
            const maxMonths = parseInt(btn.getAttribute("data-months"));

            // تحديث حدود السلايدر حسب نوع القرض
            loanSumInput.max = maxVal;
            maxAmountLabel.textContent = maxVal.toLocaleString("en-US") + " ج.م";

            loanPeriodInput.max = maxMonths;
            const yearsMax = (maxMonths / 12).toFixed(0);
            maxPeriodLabel.textContent = `${maxMonths} شهر (${yearsMax} سنة)`;

            if (parseInt(loanSumInput.value) > maxVal) {
                loanSumInput.value = maxVal;
            }
            if (parseInt(loanPeriodInput.value) > maxMonths) {
                loanPeriodInput.value = maxMonths;
            }

            updateCalculations(true);
        });
    });

    loanSumInput.addEventListener("input", () => updateCalculations(false));
    loanPeriodInput.addEventListener("input", () => updateCalculations(false));

    // التشغيل الأولي مع أنيميشن تصاعدي
    updateCalculations(true);
});