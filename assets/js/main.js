/* ============================================
   AuraCV - Main JavaScript
   Version: 1.0.0
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {


    // ---- Navigation (Desktop + Mobile) ----
    const mainContent = document.getElementById('mainContent');
    const sections = document.querySelectorAll('[data-section]');
    const navBtns = document.querySelectorAll('[data-nav]');

    function setActive(id) {
        navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.nav === id);
        });
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.querySelector(`[data-section="${btn.dataset.nav}"]`);
            if (target && mainContent) {
                mainContent.scrollTo({top: target.offsetTop, behavior: 'smooth'});
            }
        });
    });

    if (mainContent) {
        mainContent.addEventListener('scroll', () => {
            const scrollTop = mainContent.scrollTop + 100;
            let current = 'home';
            sections.forEach(sec => {
                if (sec.offsetTop <= scrollTop) current = sec.dataset.section;
            });
            setActive(current);
        }, {passive: true});
    }

    // ---- Mobile Sidebar ----
    const menuBtn = document.getElementById('menuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarMobile = document.getElementById('sidebarMobile');
    const closeSidebar = document.getElementById('closeSidebar');

    function openSidebar() {
        sidebarOverlay.classList.add('open');
        sidebarMobile.classList.add('open');
    }

    function closeSidebarFn() {
        sidebarOverlay.classList.remove('open');
        sidebarMobile.classList.remove('open');
    }

    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFn);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebarFn);

    // ---- Skill Bar Animation (Intersection Observer) ----
    const skillBars = document.querySelectorAll('.skill__fill');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.level + '%';
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.3});

    skillBars.forEach(bar => observer.observe(bar));

    // ============================================
    // CASE STUDY MODALS
    // ============================================
    async function loadCaseStudies() {

        const modalContainer =
            document.getElementById('caseStudyModals');

        if (!modalContainer) return;

        try {

            const response =
                await fetch('case-studies/modals.html');

            if (!response.ok) {
                throw new Error(
                    `Could not load case studies: ${response.status}`
                );
            }

            modalContainer.innerHTML =
                await response.text();

            initializeCaseModals();
            initializeLightbox();

        } catch (error) {

            console.error(
                'Case study modal loading failed:',
                error
            );

        }
    }

    function initializeCaseModals() {

        const caseOpenButtons =
            document.querySelectorAll('[data-case-open]');

        const caseCloseButtons =
            document.querySelectorAll('[data-case-close]');

        const backdrops =
            document.querySelectorAll('.case-modal__backdrop');


        function openCaseModal(modalId) {

            const modal =
                document.getElementById(modalId);

            if (!modal) return;

            modal.classList.add('open');

            modal.setAttribute(
                'aria-hidden',
                'false'
            );

            // Start every case study at the top
            const modalScroll =
                modal.querySelector('.case-modal__scroll');

            if (modalScroll) {
                modalScroll.scrollTop = 0;
            }
        }

        function closeCaseModal(modal) {

            if (!modal) return;

            modal.classList.remove('open');

            modal.setAttribute(
                'aria-hidden',
                'true'
            );
        }

        caseOpenButtons.forEach(button => {

            button.addEventListener('click', event => {

                event.preventDefault();

                const modalId =
                    button.dataset.caseOpen;

                openCaseModal(modalId);

            });

        });

        caseCloseButtons.forEach(button => {

            button.addEventListener('click', () => {

                const modal =
                    button.closest('.case-modal');

                closeCaseModal(modal);

            });

        });

        backdrops.forEach(backdrop => {

            backdrop.addEventListener('click', () => {

                const modal =
                    backdrop.closest('.case-modal');

                closeCaseModal(modal);

            });

        });

        document.addEventListener('keydown', event => {

            if (event.key !== 'Escape') {
                return;
            }

            const openModal =
                document.querySelector('.case-modal.open');

            if (openModal) {
                closeCaseModal(openModal);
            }

        });
    }

    function initializeLightbox() {

        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const closeButton = document.getElementById('lightboxClose');
        const prevButton = document.getElementById('lightboxPrev');
        const nextButton = document.getElementById('lightboxNext');

        if (!lightbox || !lightboxImage || !closeButton || !prevButton || !nextButton) {
            return;
        }

        let galleryImages = [];
        let currentIndex = 0;

        const thumbnails = document.querySelectorAll('.gallery-thumb img');

        function updateLightboxImage() {
            const image = galleryImages[currentIndex];

            if (!image) return;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
        }

        function openLightbox(clickedImage) {
            const gallery = clickedImage.closest('.case-gallery');

            if (!gallery) return;

            galleryImages = Array.from(
                gallery.querySelectorAll('.gallery-thumb img')
            );

            currentIndex = galleryImages.indexOf(clickedImage);

            updateLightboxImage();

            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');

            lightboxImage.src = '';
            lightboxImage.alt = '';
        }

        function showNextImage() {
            currentIndex =
                (currentIndex + 1) % galleryImages.length;

            updateLightboxImage();
        }

        function showPreviousImage() {
            currentIndex =
                (currentIndex - 1 + galleryImages.length) %
                galleryImages.length;

            updateLightboxImage();
        }

        thumbnails.forEach(image => {
            image.addEventListener('click', () => {
                openLightbox(image);
            });
        });

        closeButton.addEventListener('click', closeLightbox);

        nextButton.addEventListener('click', showNextImage);

        prevButton.addEventListener('click', showPreviousImage);

        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', event => {

            if (!lightbox.classList.contains('open')) {
                return;
            }

            if (event.key === 'ArrowRight') {
                showNextImage();
            }

            if (event.key === 'ArrowLeft') {
                showPreviousImage();
            }

            if (event.key === 'Escape') {
                event.stopImmediatePropagation();
                closeLightbox();
            }

        });
    }

    // Load modal HTML after the main page is ready
    loadCaseStudies();

});
