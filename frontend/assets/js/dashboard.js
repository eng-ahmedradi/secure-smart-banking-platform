document.addEventListener("DOMContentLoaded", () => {
    // 1. عرض اسم المستخدم المسجل
    const currentUser = sessionStorage.getItem("currentUser") || "العميل";
    const userDisplay = document.getElementById("user-display-name");
    if (userDisplay) {
        userDisplay.textContent = currentUser;
    }

    // 2. تفعيل زر تسجيل الخروج
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج بأمان؟")) {
                logoutUser();
            }
        });
    }
    // تفعيل القوائم المنسدلة (الإشعارات والبروفايل)
    const notifBtn = document.getElementById("notif-btn");
    const notifMenu = document.getElementById("notif-menu");
    const profileBtn = document.getElementById("profile-btn");
    const profileMenu = document.getElementById("profile-menu");
    const markReadBtn = document.getElementById("mark-read-btn");
    const unreadDot = document.querySelector(".unread-dot");
    const quickLogoutBtn = document.getElementById("quick-logout-btn");

    if (notifBtn && notifMenu) {
        notifBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notifMenu.classList.toggle("hidden");
            if (profileMenu) profileMenu.classList.add("hidden");
        });
    }

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("hidden");
            if (notifMenu) notifMenu.classList.add("hidden");
        });
    }

    // إغلاق أي قائمة مفتوحة إذا ضغط المستخدم في أي مكان خارجها
    document.addEventListener("click", () => {
        if (notifMenu) notifMenu.classList.add("hidden");
        if (profileMenu) profileMenu.classList.add("hidden");
    });

    // منع غلق القائمة إذا كان الضغط داخل محتواها
    if (notifMenu) notifMenu.addEventListener("click", (e) => e.stopPropagation());
    if (profileMenu) profileMenu.addEventListener("click", (e) => e.stopPropagation());

    // تحديد الكل كمقروء
    if (markReadBtn) {
        markReadBtn.addEventListener("click", () => {
            document.querySelectorAll(".notif-item.unread").forEach(el => el.classList.remove("unread"));
            if (unreadDot) unreadDot.style.display = "none";
        });
    }

    // تسجيل الخروج السريع من القائمة المنسدلة
    if (quickLogoutBtn) {
        quickLogoutBtn.addEventListener("click", () => logoutUser());
    }
});