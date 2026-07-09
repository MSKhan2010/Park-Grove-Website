// staffing.ts

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const buildLetterLoop = (): void => {
        const headings = document.querySelectorAll<HTMLElement>('[data-letter-loop]');

        headings.forEach((heading) => {
            const text = heading.textContent?.trim() ?? '';
            if (!text) return;

            heading.setAttribute('aria-label', text);
            heading.textContent = '';

            const fragment = document.createDocumentFragment();

            Array.from(text).forEach((character, index) => {
                const span = document.createElement('span');
                span.setAttribute('aria-hidden', 'true');
                span.textContent = character === ' ' ? '\u00A0' : character;
                span.className = character === ' ' ? 'letter-space' : 'letter';
                span.style.setProperty('--letter-index', index.toString());
                fragment.appendChild(span);
            });

            heading.appendChild(fragment);
        });
    };

    const revealOnScroll = (): void => {
        const revealElements = document.querySelectorAll<HTMLElement>('.staff-reveal, .staff-stat, .promise-step');

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealElements.forEach((element) => element.classList.add('staff-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target as HTMLElement;
                    target.classList.add('staff-visible');
                    currentObserver.unobserve(target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.16
        });

        revealElements.forEach((element, index) => {
            element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
            observer.observe(element);
        });
    };

    const animateCounters = (): void => {
        const counters = document.querySelectorAll<HTMLElement>('[data-counter]');

        const setCounterValue = (counter: HTMLElement, value: number): void => {
            const suffix = counter.dataset.suffix ?? '';
            counter.textContent = `${value}${suffix}`;
        };

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            counters.forEach((counter) => {
                setCounterValue(counter, Number(counter.dataset.target ?? 0));
            });
            return;
        }

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const counter = entry.target as HTMLElement;
                const target = Number(counter.dataset.target ?? 0);
                const duration = 1400;
                const startTime = performance.now();

                const update = (currentTime: number): void => {
                    const progress = Math.min((currentTime - startTime) / duration, 1);
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    const value = Math.round(target * easedProgress);
                    setCounterValue(counter, value);

                    if (progress < 1) {
                        window.requestAnimationFrame(update);
                    } else {
                        setCounterValue(counter, target);
                    }
                };

                window.requestAnimationFrame(update);
                observer.unobserve(counter);
            });
        }, {
            threshold: 0.4
        });

        counters.forEach((counter) => {
            setCounterValue(counter, 0);
            counterObserver.observe(counter);
        });
    };

    buildLetterLoop();
    revealOnScroll();
    animateCounters();
});
