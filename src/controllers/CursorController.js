import { gsap } from 'gsap';

export class CursorController {
    constructor(threeScene) {
        this.threeScene = threeScene;
        this.cursorLight = document.getElementById('cursor-light');
        this.mousePosition = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            this.targetPosition.x = e.clientX;
            this.targetPosition.y = e.clientY;
            
            // Update Three.js scene
            this.threeScene.updateCursorPosition(e.clientX, e.clientY);
        });

        // Mouse enter/leave events for cursor light visibility
        document.addEventListener('mouseenter', () => {
            this.showCursorLight();
        });

        document.addEventListener('mouseleave', () => {
            this.hideCursorLight();
        });

        // Interactive elements hover effects
        this.setupHoverEffects();

        // Start cursor animation loop
        this.animateCursor();
    }

    animateCursor() {
        // Smooth cursor light movement
        this.mousePosition.x += (this.targetPosition.x - this.mousePosition.x) * 0.1;
        this.mousePosition.y += (this.targetPosition.y - this.mousePosition.y) * 0.1;
        
        // Update cursor light position
        this.cursorLight.style.left = `${this.mousePosition.x - 150}px`;
        this.cursorLight.style.top = `${this.mousePosition.y - 150}px`;
        
        requestAnimationFrame(() => this.animateCursor());
    }

    setupHoverEffects() {
        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .feature-card, .contact-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.scaleCursorLight(1.5);
                element.style.transform = 'translateY(-5px)';
            });
            
            element.addEventListener('mouseleave', () => {
                this.scaleCursorLight(1);
                element.style.transform = 'translateY(0)';
            });
        });

        // Special effects for different element types
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    duration: 0.3,
                    scale: 1.05,
                    rotationY: 5,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    duration: 0.3,
                    scale: 1,
                    rotationY: 0,
                    ease: "power2.out"
                });
            });
        });
    }

    showCursorLight() {
        gsap.to(this.cursorLight, {
            duration: 0.3,
            opacity: 1,
            scale: 1,
            ease: "power2.out"
        });
    }

    hideCursorLight() {
        gsap.to(this.cursorLight, {
            duration: 0.3,
            opacity: 0,
            scale: 0.8,
            ease: "power2.out"
        });
    }

    scaleCursorLight(scale) {
        gsap.to(this.cursorLight, {
            duration: 0.3,
            scale: scale,
            ease: "power2.out"
        });
    }

    updateCursorLightColor(color) {
        this.cursorLight.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    }
}