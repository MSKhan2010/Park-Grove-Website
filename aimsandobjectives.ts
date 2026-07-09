document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.objective-card');
    
    // Staggered reveal
    cards.forEach((card, index) => {
        (card as HTMLElement).style.opacity = '0';
        (card as HTMLElement).style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            (card as HTMLElement).style.transition = 'all 0.6s ease';
            (card as HTMLElement).style.opacity = '1';
            (card as HTMLElement).style.transform = 'translateY(0)';
        }, index * 100); // 100ms delay per card
    });
});