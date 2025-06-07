import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ThreeScene } from './three/ThreeScene.js';
import { ScrollController } from './controllers/ScrollController.js';
import { CursorController } from './controllers/CursorController.js';
import { LoadingManager } from './utils/LoadingManager.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

class App {
    constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        this.loadingManager = new LoadingManager();
        
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            await this.loadingManager.show();

            // Initialize Three.js scene
            this.threeScene = new ThreeScene(this.canvas);
            
            // Initialize controllers
            this.scrollController = new ScrollController(this.threeScene);
            this.cursorController = new CursorController(this.threeScene);

            // Setup event listeners
            this.setupEventListeners();

            // Setup animations
            this.setupAnimations();

            // Hide loading screen after everything is loaded
            setTimeout(() => {
                this.loadingManager.hide();
            }, 2000);

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.loadingManager.hide();
        }
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.threeScene.onWindowResize();
        });

        // Navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = parseInt(link.dataset.section);
                this.scrollToSection(section);
            });
        });

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks2 = document.querySelector('.nav-links');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navLinks2.classList.toggle('active');
            });
        }
    }

    setupAnimations() {
        // Animate content sections
        const sections = document.querySelectorAll('.content-section');
        
        sections.forEach((section, index) => {
            const content = section.querySelector('.section-content');
            
            gsap.fromTo(content.children, 
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Animate gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            gsap.fromTo(item,
                {
                    opacity: 0,
                    scale: 0.8,
                    rotation: 5
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Animate feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    x: index % 2 === 0 ? -50 : 50
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    scrollToSection(sectionIndex) {
        const targetY = sectionIndex * window.innerHeight;
        
        gsap.to(window, {
            duration: 1.5,
            scrollTo: targetY,
            ease: "power2.inOut"
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});