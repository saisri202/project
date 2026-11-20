
/* ==========================================
   YEDLAPALLI GREENENERGY
   SCROLL AND INTERACTION ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. SCROLL REVEAL ANIMATIONS

    const revealTargets = document.querySelectorAll(
        [
            ".section-head",
            ".about-grid > *",
            ".product",
            ".process-step",
            ".info-card",
            ".phase",
            ".battery",
            ".job",
            ".impact-grid > *"
        ].join(",")
    );

    if (!reducedMotion && "IntersectionObserver" in window) {

        revealTargets.forEach((element, index) => {
            element.classList.add("reveal");

            // Small stagger between nearby elements
            element.style.setProperty(
                "--reveal-delay",
                `${(index % 4) * 90}ms`
            );
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -45px 0px"
            }
        );

        revealTargets.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealTargets.forEach((element) => {
            element.classList.add("visible");
        });
    }


    // 2. SCROLL PROGRESS BAR

    const progress = document.getElementById("scroll-progress");

    function updateProgress() {

        if (!progress) return;

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        progress.style.width = `${percentage}%`;
    }

    window.addEventListener("scroll", updateProgress, {
        passive: true
    });

    window.addEventListener("resize", updateProgress);

    updateProgress();


    // 3. PRODUCT CARD 3D TILT

    if (!reducedMotion) {

        const productCards = document.querySelectorAll(".product");

        productCards.forEach((card) => {

            card.addEventListener("pointermove", (event) => {

                if (window.innerWidth < 900) return;

                const rect = card.getBoundingClientRect();

                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${-y * 5}deg)
                    rotateY(${x * 5}deg)
                    translateY(-5px)
                `;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }


    // 4. SMOOTH ANCHOR SCROLLING

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

});
