document.addEventListener('DOMContentLoaded', () => {
    
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.15 
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                entry.target.classList.add('visible');
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

});