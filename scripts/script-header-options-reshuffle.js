

(() => {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector("#mobile-nav-toggle");
    const panel = document.querySelector("#mobile-nav-panel");

    if (!header || !toggle || !panel) return;

    const mobileScreen = window.matchMedia("(max-width: 639px)");
    const hoverDevice = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    let openedByHover = false;
    let pinnedOpen = false;

    function setMenu(open) {
        panel.classList.toggle("is-open", open);

        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute(
            "aria-label",
            open ? "Close main menu" : "Open main menu"
        );

        panel.setAttribute("aria-hidden", String(!open));
        panel.inert = !open;
    }

    // Click: open / close
    toggle.addEventListener("click", () => {
        if (!mobileScreen.matches) return;

        // Hover se open menu ko click karne par open hi rakho.
        if (openedByHover) {
            openedByHover = false;
            pinnedOpen = true;
            return;
        }

        pinnedOpen = !pinnedOpen;
        setMenu(pinnedOpen);
    });

    // Mouse hover: menu open
    toggle.addEventListener("pointerenter", () => {
        if (
            mobileScreen.matches &&
            hoverDevice.matches &&
            !pinnedOpen
        ) {
            openedByHover = true;
            setMenu(true);
        }
    });

    // Header aur dropdown se pointer bahar: hover menu close
    header.addEventListener("pointerleave", () => {
        if (openedByHover && !pinnedOpen) {
            openedByHover = false;
            setMenu(false);
        }
    });

    // Outside click: menu close
    document.addEventListener("pointerdown", (event) => {
        if (!header.contains(event.target)) {
            openedByHover = false;
            pinnedOpen = false;
            setMenu(false);
        }
    });

    // Menu option click: menu close
    panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            openedByHover = false;
            pinnedOpen = false;
            setMenu(false);
        });
    });

    // Escape key: menu close
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            openedByHover = false;
            pinnedOpen = false;
            setMenu(false);
        }
    });

    // Desktop par switch karne par mobile menu close
    window.addEventListener("resize", () => {
        if (!mobileScreen.matches) {
            openedByHover = false;
            pinnedOpen = false;
            setMenu(false);
        }
    });

    setMenu(false);
})();






