const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");

function setActiveLink() {
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;

    if (window.scrollY >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 20) {
    currentSectionId = "contact";
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + currentSectionId) {
      link.classList.add("active");
    }
  });
}

document.querySelectorAll(".lightbox-trigger").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close image">×</button>
      <img src="${this.href}" alt="">
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  });
});

window.addEventListener("scroll", setActiveLink);
window.addEventListener("load", setActiveLink);
window.addEventListener("resize", setActiveLink);