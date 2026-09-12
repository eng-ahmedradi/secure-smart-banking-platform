document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("tx-search-input");
    const filterPills = document.querySelectorAll(".pill-filter");
    const txRows = document.querySelectorAll(".tx-row");
    const resultsCount = document.getElementById("results-count");
    const noTxNotice = document.getElementById("no-tx-found");

    // عناصر مودال الإيصال
    const receiptModal = document.getElementById("receipt-modal");
    const closeReceiptModal = document.getElementById("close-receipt-modal");
    const receiptButtons = document.querySelectorAll(".btn-receipt-view");

    const modalRAmount = document.getElementById("modal-r-amount");
    const modalRTitle = document.getElementById("modal-r-title");
    const modalRSub = document.getElementById("modal-r-sub");
    const modalRRef = document.getElementById("modal-r-ref");
    const modalRChannel = document.getElementById("modal-r-channel");
    const modalRDate = document.getElementById("modal-r-date");
    const modalRFee = document.getElementById("modal-r-fee");

    const btnExportPdf = document.getElementById("btn-export-pdf");
    const btnPrintReceipt = document.getElementById("btn-print-receipt");

    let currentTypeFilter = "all";

    // 1. وظيفة الفلترة والبحث المزدوج
    function filterTransactions() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        txRows.forEach(row => {
            const rowType = row.getAttribute("data-type");
            const rowCategory = row.getAttribute("data-category");
            const rowText = row.textContent.toLowerCase();
            const rowRef = row.getAttribute("data-ref").toLowerCase();

            // فحص نوع العملية
            let matchesType = false;
            if (currentTypeFilter === "all") {
                matchesType = true;
            } else if (currentTypeFilter === "in" && rowType === "in") {
                matchesType = true;
            } else if (currentTypeFilter === "out" && rowType === "out") {
                matchesType = true;
            } else if (currentTypeFilter === "card" && rowCategory === "card") {
                matchesType = true;
            } else if (currentTypeFilter === "bills" && rowCategory === "bills") {
                matchesType = true;
            }

            // فحص البحث النصي
            const matchesSearch = rowText.includes(searchTerm) || rowRef.includes(searchTerm);

            if (matchesType && matchesSearch) {
                row.style.display = "";
                visibleCount++;
            } else {
                row.style.display = "none";
            }
        });

        resultsCount.textContent = visibleCount;
        if (visibleCount === 0) {
            noTxNotice.classList.remove("hidden");
        } else {
            noTxNotice.classList.add("hidden");
        }
    }

    // التنقل بين فلاتر الأزرار (Pills)
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            currentTypeFilter = pill.getAttribute("data-filter");
            filterTransactions();
        });
    });

    // البحث اللحظي أثناء الكتابة
    if (searchInput) {
        searchInput.addEventListener("input", filterTransactions);
    }

    // 2. فتح إيصال المعاملة الرقمي
    receiptButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const row = btn.closest(".tx-row");

            modalRAmount.textContent = row.getAttribute("data-amount") + " ج.م";
            modalRTitle.textContent = row.getAttribute("data-title");
            modalRSub.textContent = row.getAttribute("data-sub");
            modalRRef.textContent = row.getAttribute("data-ref");
            modalRChannel.textContent = row.getAttribute("data-channel");
            modalRDate.textContent = row.getAttribute("data-date");
            modalRFee.textContent = row.getAttribute("data-fee");

            receiptModal.classList.remove("hidden");
        });
    });

    closeReceiptModal.addEventListener("click", () => {
        receiptModal.classList.add("hidden");
    });

    receiptModal.addEventListener("click", (e) => {
        if (e.target === receiptModal) {
            receiptModal.classList.add("hidden");
        }
    });

    // 3. تصدير كشف الحساب والطباعة
    if (btnExportPdf) {
        btnExportPdf.addEventListener("click", () => {
            btnExportPdf.textContent = "⏳ جاري إعداد التقرير المصرفي...";
            setTimeout(() => {
                btnExportPdf.textContent = "📥 تحميل كشف الحساب (PDF)";
                alert("تم توليد كشف الحساب المالي المعتمد لسبتمبر 2026 بنجاح وهو جاهز للتنزيل.");
            }, 1000);
        });
    }

    if (btnPrintReceipt) {
        btnPrintReceipt.addEventListener("click", () => {
            window.print();
        });
    }
});