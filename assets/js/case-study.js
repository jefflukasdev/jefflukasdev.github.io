document.addEventListener("DOMContentLoaded", () => {

    const thumbnails = Array.from(
        document.querySelectorAll(".gallery-thumb")
    );

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxVideo = document.getElementById("lightboxVideo");

    const closeButton = document.getElementById("lightboxClose");
    const previousButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    let currentIndex = 0;


    function showMedia(index) {

        if (!thumbnails.length) {
            return;
        }

        currentIndex =
            (index + thumbnails.length) % thumbnails.length;

        const thumbnail = thumbnails[currentIndex];

        const mediaPath = thumbnail.dataset.full;

        if (!mediaPath) {
            return;
        }

        const mediaType =
            thumbnail.dataset.type === "video"
                ? "video"
                : "image";


        /* -------------------------
           VIDEO
        ------------------------- */

        if (mediaType === "video") {

            lightboxImage.hidden = true;
            lightboxImage.src = "";

            lightboxVideo.hidden = false;
            lightboxVideo.src = mediaPath;

            lightboxVideo.load();

        }


        /* -------------------------
           IMAGE
        ------------------------- */

        else {

            lightboxVideo.pause();
            lightboxVideo.removeAttribute("src");
            lightboxVideo.load();
            lightboxVideo.hidden = true;

            const thumbnailImage =
                thumbnail.querySelector("img");

            lightboxImage.hidden = false;
            lightboxImage.src = mediaPath;

            lightboxImage.alt =
                thumbnailImage?.alt ||
                "Portfolio gallery image";

        }

    }


    function openLightbox(index) {

        const mediaPath =
            thumbnails[index]?.dataset.full;

        if (!mediaPath) {
            return;
        }

        showMedia(index);

        lightbox.classList.add("open");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

    }


    function closeLightbox() {

        lightbox.classList.remove("open");

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";

        lightboxVideo?.pause();

    }


    thumbnails.forEach((thumbnail, index) => {

        thumbnail.addEventListener("click", () => {

            openLightbox(index);

        });

    });


    previousButton?.addEventListener("click", () => {

        showMedia(currentIndex - 1);

    });


    nextButton?.addEventListener("click", () => {

        showMedia(currentIndex + 1);

    });


    closeButton?.addEventListener("click", () => {

        closeLightbox();

    });


    lightbox?.addEventListener("click", event => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    document.addEventListener("keydown", event => {

        if (!lightbox?.classList.contains("open")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showMedia(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showMedia(currentIndex + 1);
        }

    });

});