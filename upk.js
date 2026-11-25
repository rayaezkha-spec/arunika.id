document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const zoomLevel = lightbox?.querySelector(".zoom-level");
    const zoomInButton = lightbox?.querySelector(".zoom-in");
    const zoomOutButton = lightbox?.querySelector(".zoom-out");
    const zoomResetButton = lightbox?.querySelector(".zoom-reset");
    const fullscreenButton = lightbox?.querySelector(".zoom-fullscreen");
    const closeButton = lightbox?.querySelector(".lightbox-close");
    let zoom = 1;

    if (lightbox && lightboxImage) {
        const updateZoom = () => {
            lightboxImage.style.transform = `scale(${zoom})`;
            zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
        };

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
            zoom = 1;
            updateZoom();
        };

        document.querySelectorAll(".zoom-trigger").forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const sourceImage = trigger.querySelector("img");
                if (!sourceImage) return;

                zoom = 1;
                lightboxImage.src = sourceImage.src;
                lightboxImage.alt = sourceImage.alt;
                updateZoom();
                lightbox.classList.add("active");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
            });
        });

        zoomInButton?.addEventListener("click", () => {
            zoom = Math.min(3, zoom + 0.25);
            updateZoom();
        });

        zoomOutButton?.addEventListener("click", () => {
            zoom = Math.max(0.5, zoom - 0.25);
            updateZoom();
        });

        zoomResetButton?.addEventListener("click", () => {
            zoom = 1;
            updateZoom();
        });

        fullscreenButton?.addEventListener("click", async () => {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                } else {
                    await lightbox.requestFullscreen();
                }
            } catch (error) {
                console.error("Browser tidak dapat membuka layar penuh:", error);
            }
        });

        document.addEventListener("fullscreenchange", () => {
            if (!fullscreenButton) return;
            const isFullscreen = document.fullscreenElement === lightbox;
            fullscreenButton.textContent = isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh";
            fullscreenButton.setAttribute(
                "aria-label",
                isFullscreen ? "Keluar dari layar penuh" : "Buka layar penuh"
            );
        });

        closeButton?.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });

        lightboxImage.addEventListener("dblclick", () => {
            zoom = zoom === 1 ? 1.75 : 1;
            updateZoom();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    const track = document.getElementById("testimonialTrack");
    const prevBtn = document.getElementById("prevReview");
    const nextBtn = document.getElementById("nextReview");

    if (!track || !prevBtn || !nextBtn) return;

    let currentReview = 0;

    function updateSlider() {
        const cards = track.querySelectorAll(".testimonial-card");

        const visibleCards = window.innerWidth <= 768 ? 1 : 3;

        const maxIndex = Math.max(
            0,
            cards.length - visibleCards
        );

        currentReview = Math.max(
            0,
            Math.min(currentReview, maxIndex)
        );

        const card = cards[0];
        const gap = parseFloat(getComputedStyle(track).gap) || 0;

        const cardWidth = card.getBoundingClientRect().width;

        const distance = (cardWidth + gap) * currentReview;

        track.style.transform = `translateX(-${distance}px)`;

        prevBtn.disabled = currentReview === 0;
        nextBtn.disabled = currentReview === maxIndex;
    }

    nextBtn.addEventListener("click", () => {
        currentReview++;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        currentReview--;
        updateSlider();
    });

    window.addEventListener("resize", updateSlider);

    updateSlider();

});
