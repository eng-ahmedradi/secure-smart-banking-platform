// يحوّل عملية واحدة قادمة من GET /api/transactions إلى صف <tr> بنفس شكل data-* attributes
// التي تعتمد عليها filterTransactions() أدناه، حتى لا تحتاج لتغيير منطق الفلترة والبحث.
function transactionToRow(tx) {
    const isIn = tx.direction === "IN";
    const amountFormatted = Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
    const feeFormatted = Number(tx.fee).toLocaleString("en-US", { minimumFractionDigits: 2 });
    const dateFormatted = new Date(tx.createdAt).toLocaleString("ar-EG", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    });

    const tr = document.createElement("tr");
    tr.className = "tx-row";
    tr.dataset.type = isIn ? "in" : "out";
    tr.dataset.category = tx.category;
    tr.dataset.ref = tx.reference;
    tr.dataset.date = dateFormatted;
    tr.dataset.title = tx.title;
    tr.dataset.sub = tx.counterparty || "";
    tr.dataset.amount = (isIn ? "+ " : "- ") + amountFormatted;
    tr.dataset.channel = tx.channel;
    tr.dataset.fee = feeFormatted + " ج.م";

    tr.innerHTML = `
        <td>
            <div class="tx-flex-meta">
                <span class="tx-circle-badge ${isIn ? "in" : "out"}">${isIn ? "↓" : "↑"}</span>
                <div>
                    <strong>${tx.title}</strong>
                    <small>${tx.counterparty || ""}</small>
                </div>
            </div>
        </td>
        <td>${tx.channel}</td>
        <td>${dateFormatted}</td>
        <td class="amount ${isIn ? "in" : "out"}">${isIn ? "+" : "-"} ${amountFormatted} ج.م</td>
        <td><span class="status-pill success">مكتمل</span></td>
        <td><button type="button" class="btn-receipt-view">عرض</button></td>
    `;
    return tr;
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("tx-search-input");
    const filterPills = document.querySelectorAll(".pill-filter");
    const resultsCount = document.getElementById("results-count");
    const noTxNotice = document.getElementById("no-tx-found");
    const tableBody = document.getElementById("tx-table-body");

    // متغيرات تُعاد قراءتها بعد كل تحميل، لأن الصفوف نفسها تُستبدل من الباك إند
    let txRows = document.querySelectorAll(".tx-row");

    // عناصر مودال الإيصال
    const receiptModal = document.getElementById("receipt-modal");
    const closeReceiptModal = document.getElementById("close-receipt-modal");

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

    // 2. فتح إيصال المعاملة الرقمي - تفويض الحدث (event delegation) لأن الصفوف تُحمَّل ديناميكياً
    tableBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-receipt-view");
        if (!btn) return;

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

    // 4. تحميل العمليات الحقيقية من GET /api/transactions وبناء الصفوف
    apiFetch("/transactions?size=50")
        .then((pageResult) => {
            const transactions = pageResult.content || [];
            tableBody.innerHTML = "";
            transactions.forEach(tx => tableBody.appendChild(transactionToRow(tx)));

            // إعادة قراءة الصفوف بعد إضافتها فعلياً للـ DOM، ثم تطبيق الفلترة الحالية
            txRows = document.querySelectorAll(".tx-row");
            filterTransactions();
        })
        .catch(() => {
            noTxNotice.classList.remove("hidden");
        });
});