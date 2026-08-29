"use strict";
// About-page reveal effects.
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) {
        return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("motion-ready");
    const revealAll = () => elements.forEach((element) => element.classList.add("is-visible"));
    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealAll();
        return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
        });
    }, { root: null, rootMargin: "0px 0px -50px 0px", threshold: 0.12 });
    elements.forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
        observer.observe(element);
    });
});
