document.addEventListener('DOMContentLoaded', () => {
    buildLetterTitle();
    buildSubtitleWords();
    initScrollAnimations();
    initHeroParallax();
});

function buildLetterTitle(): void {
    const title = document.querySelector<HTMLElement>('[data-letter-title]');

    if (!title) {
        return;
    }

    const text = title.dataset.letterTitle || title.textContent || '';
    title.setAttribute('aria-label', text);
    title.textContent = '';

    Array.from(text).forEach((character, index) => {
        const letter = document.createElement('span');
        const isSpace = character === ' ';

        letter.className = isSpace ? 'hero-letter hero-space' : 'hero-letter';
        letter.textContent = isSpace ? '\u00A0' : character;
        letter.style.setProperty('--letter-index', index.toString());
        letter.setAttribute('aria-hidden', 'true');

        title.appendChild(letter);
    });
}

function buildSubtitleWords(): void {
    const subtitle = document.querySelector<HTMLElement>('[data-split-text]');

    if (!subtitle) {
        return;
    }

    const text = subtitle.dataset.splitText || subtitle.textContent || '';
    const words = text.trim().split(/\s+/);

    subtitle.setAttribute('aria-label', text);
    subtitle.textContent = '';

    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'subtitle-word';
        wordSpan.textContent = word;
        wordSpan.style.setProperty('--word-index', index.toString());
        wordSpan.setAttribute('aria-hidden', 'true');

        subtitle.appendChild(wordSpan);

        if (index < words.length - 1) {
            subtitle.appendChild(document.createTextNode(' '));
        }
    });
}

function initScrollAnimations(): void {
    const animatedElements = document.querySelectorAll<HTMLElement>('.slide-in-left, .slide-in-right, .slide-up, .pop-in, .scroll-reveal');

    if (!animatedElements.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach((element) => element.classList.add('active-slide'));
        return;
    }

    const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px 0px -70px 0px',
        threshold: 0.16
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-slide');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((element) => scrollObserver.observe(element));
}

function initHeroParallax(): void {
    const hero = document.querySelector<HTMLElement>('.admissions-hero');

    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    hero.addEventListener('pointermove', (event: PointerEvent) => {
        const rect = hero.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
        const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);

        hero.style.setProperty('--hero-x', x);
        hero.style.setProperty('--hero-y', y);
    });

    hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--hero-x', '0');
        hero.style.setProperty('--hero-y', '0');
    });
}
