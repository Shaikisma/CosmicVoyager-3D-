import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class ScrollController {
    constructor(threeScene) {
        this.threeScene = threeScene;
        this.scrollProgress = 0;
        
        this.init();
    }

    init() {
        // Create scroll trigger for the entire page
        ScrollTrigger.create({
            trigger: '#main-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                this.scrollProgress = self.progress;
                this.threeScene.updateScrollProgress(this.scrollProgress);
                this.updateNavigation();
                this.updateScrollIndicator();
            }
        });

        // Create section-specific animations
        this.createSectionAnimations();
    }

    createSectionAnimations() {
        const sections = document.querySelectorAll('.content-section');
        
        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 50%',
                end: 'bottom 50%',
                onEnter: () => this.setActiveSection(index),
                onEnterBack: () => this.setActiveSection(index)
            });
        });
    }

    setActiveSection(index) {
        // Update navigation active state
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    updateNavigation() {
        // Update navigation background opacity based on scroll
        const nav = document.querySelector('.navigation');
        const opacity = Math.min(this.scrollProgress * 4, 1);
        nav.style.background = `rgba(10, 10, 10, ${0.7 + opacity * 0.3})`;
    }

    updateScrollIndicator() {
        // Hide scroll indicator after scrolling starts
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator && this.scrollProgress > 0.05) {
            scrollIndicator.style.opacity = Math.max(0, 1 - this.scrollProgress * 10);
        }
    }

    getScrollProgress() {
        return this.scrollProgress;
    }

    scrollToSection(sectionIndex) {
        const targetScroll = (sectionIndex / 3) * (document.body.scrollHeight - window.innerHeight);
        
        gsap.to(window, {
            duration: 1.5,
            scrollTo: targetScroll,
            ease: "power2.inOut"
        });
    }
}