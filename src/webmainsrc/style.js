document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll(".fade-in, .slide-in");
    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transition = "all 1s ease-in-out";
    });

    function revealOnScroll() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
});

// <!--8a1 - Nguyen Binh MInh-->