document.addEventListener("DOMContentLoaded", () => {
    // تحديد الصفحة النشطة في الـ Navbar بناءً على رابط الصفحة الحالي
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".main-nav a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});