import { gsap } from 'gsap';

export class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.loadingText = document.querySelector('.loading-text');
        
        this.loadingMessages = [
            'Initializing 3D Environment...',
            'Loading Geometries...',
            'Setting up Lighting...',
            'Preparing Materials...',
            'Finalizing Scene...',
            'Ready to Explore!'
        ];
        
        this.currentMessageIndex = 0;
    }

    async show() {
        return new Promise((resolve) => {
            // Animate loading messages
            this.animateLoadingMessages();
            
            // Simulate loading progress
            this.animateLoadingProgress(() => {
                resolve();
            });
        });
    }

    animateLoadingMessages() {
        const updateMessage = () => {
            if (this.currentMessageIndex < this.loadingMessages.length) {
                gsap.to(this.loadingText, {
                    duration: 0.3,
                    opacity: 0,
                    y: -10,
                    ease: "power2.out",
                    onComplete: () => {
                        this.loadingText.textContent = this.loadingMessages[this.currentMessageIndex];
                        this.currentMessageIndex++;
                        
                        gsap.to(this.loadingText, {
                            duration: 0.3,
                            opacity: 1,
                            y: 0,
                            ease: "power2.out"
                        });
                        
                        if (this.currentMessageIndex < this.loadingMessages.length) {
                            setTimeout(updateMessage, 800);
                        }
                    }
                });
            }
        };
        
        setTimeout(updateMessage, 500);
    }

    animateLoadingProgress(callback) {
        gsap.to(this.loadingBar, {
            duration: 4,
            width: '100%',
            ease: "power2.inOut",
            onComplete: callback
        });
    }

    hide() {
        gsap.to(this.loadingScreen, {
            duration: 0.8,
            opacity: 0,
            scale: 1.1,
            ease: "power2.inOut",
            onComplete: () => {
                this.loadingScreen.style.display = 'none';
                this.animateContentIn();
            }
        });
    }

    animateContentIn() {
        // Animate navigation
        gsap.fromTo('.navigation', 
            { y: -100, opacity: 0 },
            { 
                duration: 1,
                y: 0,
                opacity: 1,
                ease: "power2.out",
                delay: 0.2
            }
        );

        // Animate first section content
        const firstSection = document.querySelector('.content-section[data-section="0"] .section-content');
        gsap.fromTo(firstSection.children,
            { y: 50, opacity: 0 },
            {
                duration: 1,
                y: 0,
                opacity: 1,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.5
            }
        );

        // Animate cursor light
        const cursorLight = document.getElementById('cursor-light');
        gsap.fromTo(cursorLight,
            { scale: 0, opacity: 0 },
            {
                duration: 0.8,
                scale: 1,
                opacity: 1,
                ease: "back.out(1.7)",
                delay: 1
            }
        );
    }
}