document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item > a");

    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default link behavior
            const submenu = this.nextElementSibling;

            // Toggle the submenu display
            if (submenu && submenu.classList.contains("submenu")) {
                submenu.style.display = submenu.style.display === "block" ? "none" : "block";
            }
        });
    });
});