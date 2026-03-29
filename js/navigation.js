// ====================================
// Scroll-based Navigation
// Intersection Observer for reveals + nav dots
// ====================================

import { throttle } from './utils.js';

export class Navigation {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.currentSection = 'hero';

        this.initObserver();
        this.initNavDots();
        this.initRevealObserver();
        this.initMetricCounters();
    }

    initObserver() {
        const options = {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.updateNavDots(entry.target.id);
                }
            });
        }, options);

        this.sections.forEach((section) => observer.observe(section));
    }

    initNavDots() {
        this.navDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const sectionId = dot.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    updateNavDots(activeId) {
        this.navDots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.section === activeId);
        });
    }

    initRevealObserver() {
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Don't unobserve — keep it
                }
            });
        }, revealOptions);

        document.querySelectorAll('.reveal').forEach((el) => {
            revealObserver.observe(el);
        });
    }

    initMetricCounters() {
        const metricOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.animateCounters(entry.target);
                    metricObserver.unobserve(entry.target);
                }
            });
        }, metricOptions);

        document.querySelectorAll('.metrics-row').forEach((el) => {
            metricObserver.observe(el);
        });
    }

    animateCounters(container) {
        const cards = container.querySelectorAll('.metric-card__value[data-target]');
        cards.forEach((card) => {
            const target = parseFloat(card.dataset.target);
            const suffix = card.dataset.suffix || '';
            const decimals = parseInt(card.dataset.decimals) || 0;
            const duration = 2000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out quart
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = target * eased;

                card.textContent = current.toFixed(decimals) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    card.textContent = target.toFixed(decimals) + suffix;
                }
            };

            requestAnimationFrame(animate);
        });
    }
}
