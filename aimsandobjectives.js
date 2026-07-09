"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.objective-card');
    // Staggered reveal
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100); // 100ms delay per card
    });
});
