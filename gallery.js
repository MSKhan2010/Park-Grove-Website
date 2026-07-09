"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const FIRST_IMAGE_NUMBER = 3;
    const LAST_IMAGE_NUMBER = 51;

    const TRANSPARENT_PLACEHOLDER =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    const categories = [
        { id: "warmth", label: "Warmth", icon: "fas fa-heart", description: "A warm glimpse from life at Park Grove." },
        { id: "home", label: "Home Life", icon: "fas fa-house-chimney", description: "A homely moment from the Park Grove collection." },
        { id: "community", label: "Community", icon: "fas fa-people-group", description: "A shared moment of comfort, friendship and everyday care." },
        { id: "details", label: "Gentle Details", icon: "fas fa-leaf", description: "A calm detail from the home, styled with soft green elegance." },
        { id: "sparkle", label: "Featured Glow", icon: "fas fa-wand-magic-sparkles", description: "A highlighted moment with a little Park Grove sparkle." }
    ];

    const sizePattern = [
        "feature", "standard", "tall", "standard", "wide", "square", "standard",
        "tall", "standard", "wide", "standard", "square", "feature", "standard",
        "tall", "standard", "wide", "standard", "square", "standard", "tall"
    ];

    const unique = (items) => Array.from(new Set(items));

    const getImagePath = (number) => {
        return new URL(`imgs/facebook ${number}.jpg`, window.location.href).href;
    };

    const galleryImages = Array.from(
        { length: LAST_IMAGE_NUMBER - FIRST_IMAGE_NUMBER + 1 },
        (_, index) => {
            const number = FIRST_IMAGE_NUMBER + index;
            const category = categories[index % categories.length];

            return {
                number,
                src: getImagePath(number),
                category,
                size: sizePattern[index % sizePattern.length],
                title: `Park Grove Moment ${String(number).padStart(2, "0")}`,
                description: category.description
            };
        }
    );

    const galleryGrid = document.querySelector("#galleryGrid");
    const filterButtons = document.querySelectorAll("[data-gallery-filter]");
    const visibleCountElement = document.querySelector("[data-visible-count]");
    const galleryCountElements = document.querySelectorAll("[data-gallery-count]");
    const heroOpenButtons = document.querySelectorAll("[data-gallery-open]");

    const lightbox = document.querySelector("#galleryLightbox");
    const lightboxImage = document.querySelector("#lightboxImage");
    const lightboxKicker = document.querySelector("#lightboxKicker");
    const lightboxTitle = document.querySelector("#lightboxTitle");
    const lightboxDescription = document.querySelector("#lightboxDescription");
    const lightboxCount = document.querySelector("#lightboxCount");

    const closeButtons = document.querySelectorAll("[data-lightbox-close]");
    const previousButton = document.querySelector("[data-lightbox-prev]");
    const nextButton = document.querySelector("[data-lightbox-next]");

    let activeFilter = "all";
    let visibleImages = [...galleryImages];
    let currentLightboxIndex = 0;
    let lastFocusedElement = null;

    const updateGalleryCounts = () => {
        galleryCountElements.forEach((element) => {
            element.textContent = galleryImages.length.toString();
        });

        if (visibleCountElement) {
            visibleCountElement.textContent = visibleImages.length.toString();
        }
    };

    const applyLetterLoop = () => {
        const headings = document.querySelectorAll("[data-gallery-letter-loop]");

        headings.forEach((heading) => {
            const text = heading.textContent.trim();
            if (!text) return;

            heading.setAttribute("aria-label", text);
            heading.textContent = "";

            Array.from(text).forEach((character, index) => {
                const span = document.createElement("span");
                span.setAttribute("aria-hidden", "true");
                span.textContent = character === " " ? "\u00A0" : character;
                span.className = character === " " ? "gallery-space" : "gallery-letter";
                span.style.setProperty("--letter-index", index.toString());
                heading.appendChild(span);
            });
        });
    };

    const setImageState = (host, state) => {
        if (!host) return;
        host.classList.remove("image-loading", "image-loaded", "image-missing");
        host.classList.add(`image-${state}`);
    };

    const loadImage = (img, image, host) => {
        setImageState(host, "loading");

        img.onload = () => {
            setImageState(host, "loaded");
        };

        img.onerror = () => {
            console.warn("Image failed:", image.src);
            img.src = TRANSPARENT_PLACEHOLDER;
            setImageState(host, "missing");
        };

        img.src = image.src;
    };

    const addCardTilt = (card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = (x / rect.width - 0.5) * 7;
            const rotateX = -(y / rect.height - 0.5) * 7;

            card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
            card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--rotate-x", "0deg");
            card.style.setProperty("--rotate-y", "0deg");
        });
    };

    const openLightboxByNumber = (imageNumber) => {
        const image = galleryImages.find((galleryImage) => galleryImage.number === imageNumber);
        if (!image) return;

        openLightbox(image);
    };

    const createGalleryCard = (image, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = `gallery-card ${image.size} image-loading`;
        card.dataset.category = image.category.id;
        card.dataset.imageNumber = image.number.toString();
        card.style.setProperty("--reveal-delay", `${Math.min((index % 12) * 55, 420)}ms`);
        card.setAttribute("aria-label", `Open ${image.title}`);

        const img = document.createElement("img");
        img.alt = `${image.title} from Park Grove gallery`;
        img.loading = index < 8 ? "eager" : "lazy";
        img.decoding = "async";

        const missingNote = document.createElement("span");
        missingNote.className = "gallery-missing-note";
        missingNote.textContent = `Check imgs/facebook ${image.number}.jpg`;

        const overlay = document.createElement("span");
        overlay.className = "gallery-card-overlay";
        overlay.innerHTML = `
            <span class="gallery-card-text">
                <span><i class="${image.category.icon}"></i> ${image.category.label}</span>
                <h3>${image.title}</h3>
                <p>${image.description}</p>
            </span>
            <span class="gallery-open-icon" aria-hidden="true"><i class="fas fa-expand"></i></span>
        `;

        card.append(img, missingNote, overlay);

        loadImage(img, image, card);

        card.addEventListener("click", () => {
            openLightboxByNumber(image.number);
        });

        if (!prefersReducedMotion) {
            addCardTilt(card);
        }

        return card;
    };

    const renderGallery = () => {
        if (!galleryGrid) return;

        galleryGrid.textContent = "";

        galleryImages.forEach((image, index) => {
            galleryGrid.appendChild(createGalleryCard(image, index));
        });
    };

    const revealOnScroll = () => {
        const revealElements = document.querySelectorAll(".gallery-reveal, .gallery-card");

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealElements.forEach((element) => element.classList.add("gallery-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("gallery-visible");
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                root: null,
                rootMargin: "0px 0px -70px 0px",
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => observer.observe(element));
    };

    const setActiveFilter = (filter) => {
        activeFilter = filter;

        visibleImages =
            filter === "all"
                ? [...galleryImages]
                : galleryImages.filter((image) => image.category.id === filter);

        filterButtons.forEach((button) => {
            const isActive = button.dataset.galleryFilter === filter;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", isActive.toString());
        });

        document.querySelectorAll(".gallery-card").forEach((card) => {
            const shouldShow = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("is-filter-hidden", !shouldShow);
        });

        updateGalleryCounts();
    };

    const connectFilters = () => {
        filterButtons.forEach((button) => {
            const filter = button.dataset.galleryFilter;
            if (!filter) return;

            button.addEventListener("click", () => {
                setActiveFilter(filter);
            });
        });
    };

    const setLightboxImage = (image) => {
        if (!lightboxImage || !lightboxKicker || !lightboxTitle || !lightboxDescription || !lightboxCount) return;

        const visiblePosition =
            Math.max(visibleImages.findIndex((visibleImage) => visibleImage.number === image.number), 0) + 1;

        const lightboxImageWrap = lightboxImage.closest(".lightbox-image-wrap");

        lightboxImage.alt = `${image.title} from Park Grove gallery`;
        lightboxKicker.textContent = `${image.category.label} | Park Grove Gallery`;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
        lightboxCount.textContent = `Image ${visiblePosition} of ${visibleImages.length}`;

        loadImage(lightboxImage, image, lightboxImageWrap);
    };

    function openLightbox(image) {
        if (!lightbox) return;

        const visibleIndex = visibleImages.findIndex((visibleImage) => visibleImage.number === image.number);
        currentLightboxIndex = visibleIndex >= 0 ? visibleIndex : 0;

        lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        setLightboxImage(visibleImages[currentLightboxIndex] || image);

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
    }

    const closeLightbox = () => {
        if (!lightbox) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    const showLightboxImage = (direction) => {
        if (!visibleImages.length) return;

        currentLightboxIndex =
            (currentLightboxIndex + direction + visibleImages.length) % visibleImages.length;

        setLightboxImage(visibleImages[currentLightboxIndex]);
    };

    const hydrateHeroImages = () => {
        heroOpenButtons.forEach((button) => {
            const imageNumber = Number(button.dataset.galleryOpen);
            if (!Number.isFinite(imageNumber)) return;

            const image = galleryImages.find((galleryImage) => galleryImage.number === imageNumber);
            const img = button.querySelector("img");

            if (!image || !img) return;

            loadImage(img, image, button);

            button.addEventListener("click", () => {
                openLightboxByNumber(imageNumber);
            });
        });
    };

    const connectLightbox = () => {
        closeButtons.forEach((button) => {
            button.addEventListener("click", closeLightbox);
        });

        if (previousButton) {
            previousButton.addEventListener("click", () => showLightboxImage(-1));
        }

        if (nextButton) {
            nextButton.addEventListener("click", () => showLightboxImage(1));
        }

        document.addEventListener("keydown", (event) => {
            if (!lightbox || !lightbox.classList.contains("is-open")) return;

            if (event.key === "Escape") closeLightbox();
            if (event.key === "ArrowLeft") showLightboxImage(-1);
            if (event.key === "ArrowRight") showLightboxImage(1);
        });
    };

    const enhanceInternalScroll = () => {
        const exploreLink = document.querySelector('a[href="#galleryGrid"]');
        const grid = document.querySelector("#galleryGrid");

        if (!exploreLink || !grid) return;

        exploreLink.addEventListener("click", (event) => {
            event.preventDefault();

            grid.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    };

    renderGallery();
    applyLetterLoop();
    hydrateHeroImages();
    connectFilters();
    connectLightbox();
    updateGalleryCounts();
    revealOnScroll();
    enhanceInternalScroll();
});
