const hamburger = document.getElementById("#hamburger");
const navMenu = document.querySelector("#nav-menu");
if (ham) {
    hamburger.addEventListener("click", () => {
        navList.classList.toggle("show");
    });
}