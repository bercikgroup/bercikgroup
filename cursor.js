/* ===========================================================
   Custom cursor — dot + trailing ring
   - Only runs on devices with a precise pointer (skips touch).
   - The dot tracks the pointer exactly; the ring eases behind it.
   - The ring grows over interactive elements and contracts on click.
   =========================================================== */
(function () {
    "use strict";

    // Skip touch / coarse-pointer devices — there is no cursor to replace.
    if (!window.matchMedia ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
    }

    var root = document.documentElement;

    function init() {
        root.classList.add("has-custom-cursor");

        var dot = document.createElement("div");
        dot.className = "cursor-dot is-hidden";
        var ring = document.createElement("div");
        ring.className = "cursor-ring is-hidden";
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mouseX = 0, mouseY = 0;   // latest pointer position
        var ringX = 0, ringY = 0;     // eased ring position
        var visible = false;

        var HOVER_SELECTOR =
            "a, button, input, textarea, select, label, " +
            ".company-card, .news-card, [role='button']";

        function setDot() {
            dot.style.transform =
                "translate(" + mouseX + "px," + mouseY + "px) translate(-50%, -50%)";
        }

        window.addEventListener("mousemove", function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            setDot();
            if (!visible) {
                visible = true;
                ringX = mouseX;   // start the ring on the pointer (no fly-in)
                ringY = mouseY;
            }
            // mousemove only fires while the pointer is over the page,
            // so it's always safe to reveal the cursor here.
            if (dot.classList.contains("is-hidden")) {
                dot.classList.remove("is-hidden");
                ring.classList.remove("is-hidden");
            }
        });

        // Ease the ring toward the pointer every frame.
        function loop() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.transform =
                "translate(" + ringX + "px," + ringY + "px) translate(-50%, -50%)";
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        // Grow the ring over interactive elements.
        document.addEventListener("mouseover", function (e) {
            if (e.target.closest && e.target.closest(HOVER_SELECTOR)) {
                ring.classList.add("is-hover");
            }
        });
        document.addEventListener("mouseout", function (e) {
            var from = e.target.closest && e.target.closest(HOVER_SELECTOR);
            var to = e.relatedTarget && e.relatedTarget.closest &&
                     e.relatedTarget.closest(HOVER_SELECTOR);
            if (from && !to) {
                ring.classList.remove("is-hover");
            }
        });

        // Click feedback.
        document.addEventListener("mousedown", function () {
            ring.classList.add("is-down");
        });
        document.addEventListener("mouseup", function () {
            ring.classList.remove("is-down");
        });

        // Hide when the pointer leaves the window, show on return.
        document.addEventListener("mouseleave", function () {
            dot.classList.add("is-hidden");
            ring.classList.add("is-hidden");
        });
        document.addEventListener("mouseenter", function () {
            if (visible) {
                dot.classList.remove("is-hidden");
                ring.classList.remove("is-hidden");
            }
        });
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener("DOMContentLoaded", init);
    }
})();
