document.addEventListener("DOMContentLoaded", () => {

  const thumbnails = Array.from(
    document.querySelectorAll(".gallery-thumb")
  );

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");

  const closeButton = document.getElementById("lightboxClose");
  const previousButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");

  let currentIndex = 0;


  function showImage(index) {

    if (!thumbnails.length) {
      return;
    }

    currentIndex =
      (index + thumbnails.length) % thumbnails.length;

    const thumbnail = thumbnails[currentIndex];

    const imagePath = thumbnail.dataset.full;

    if (!imagePath) {
      return;
    }

    const thumbnailImage =
      thumbnail.querySelector("img");

    lightboxImage.src = imagePath;

    lightboxImage.alt =
      thumbnailImage?.alt || "Portfolio gallery image";

  }


  function openLightbox(index) {

    const imagePath =
      thumbnails[index]?.dataset.full;

    if (!imagePath) {
      return;
    }

    showImage(index);

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

  }


  thumbnails.forEach((thumbnail, index) => {

    thumbnail.addEventListener("click", () => {

      openLightbox(index);

    });

  });


  previousButton?.addEventListener("click", () => {

    showImage(currentIndex - 1);

  });


  nextButton?.addEventListener("click", () => {

    showImage(currentIndex + 1);

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
      showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }

  });

});