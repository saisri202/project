
/* ==========================================
   YEDLAPALLI GREENENERGY
   WEBSITE INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. AUTOMATIC FOOTER YEAR

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 2. MOBILE NAVIGATION

    const menuButton = document.querySelector(
        "[data-menu-toggle], .menu-toggle, #menu-toggle, #nav-toggle"
    );

    const navigation = document.querySelector(
        "[data-menu], .nav-links, .nav-menu, #nav-menu"
    );

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("open");

            navigation.classList.toggle("active", isOpen);

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });


        // Close menu after selecting a link
        navigation.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                navigation.classList.remove("open", "active");

                menuButton.setAttribute("aria-expanded", "false");
            });
        });


        // Close menu when clicking outside
        document.addEventListener("click", (event) => {

            if (
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                navigation.classList.remove("open", "active");

                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    }


    // 3. ACTIVE NAVIGATION LINK

    const sections = document.querySelectorAll(
        "main section[id], section[id]"
    );

    const navLinks = document.querySelectorAll(
        'nav a[href^="#"]'
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) return;

                    navLinks.forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") ===
                            `#${entry.target.id}`
                        );
                    });
                });
            },
            {
                rootMargin: "-30% 0px -60% 0px"
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    // 4. HEADER SCROLL EFFECT

    const header = document.querySelector(
        ".site-header, header"
    );

    function updateHeader() {

        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 35
        );
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

});
