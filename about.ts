// about.ts

document.addEventListener('DOMContentLoaded', () => {
    
    // Select all elements that need the fade transition
    const fadeElements = document.querySelectorAll('.fade-scroll');

    // Setup the Intersection Observer
    const observerOptions = {
        root: null, 
        rootMargin: '-50px 0px -50px 0px', // Creates a slight buffer zone at the top and bottom of the screen
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target as HTMLElement;
            
            if (entry.isIntersecting) {
                // When scrolling into view, show it
                el.classList.add('in-view');
                el.classList.remove('out-view-top');
            } else {
                // When scrolling out of view, determine if it went up or down
                if (entry.boundingClientRect.top < 0) {
                    // Element scrolled up past the top of the viewport
                    el.classList.remove('in-view');
                    el.classList.add('out-view-top');
                } else {
                    // Element scrolled down past the bottom of the viewport
                    el.classList.remove('in-view');
                    el.classList.remove('out-view-top');
                }
            }
        });
    }, observerOptions);

    // Attach observer to elements
    fadeElements.forEach(el => {
        scrollObserver.observe(el);
    });
});