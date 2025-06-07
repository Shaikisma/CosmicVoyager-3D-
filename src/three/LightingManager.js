import * as THREE from 'three';

export class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = [];
        this.cursorPosition = new THREE.Vector2();
        
        this.createLights();
    }

    createLights() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(this.ambientLight);
        this.lights.push(this.ambientLight);

        // Main directional light
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(5, 5, 5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(this.directionalLight);
        this.lights.push(this.directionalLight);

        // Cursor-following point light
        this.cursorLight = new THREE.PointLight(0xe94560, 2, 10);
        this.cursorLight.position.set(0, 0, 3);
        this.scene.add(this.cursorLight);
        this.lights.push(this.cursorLight);

        // Additional colored lights
        this.accentLight1 = new THREE.PointLight(0x00ff88, 0.5, 8);
        this.accentLight1.position.set(-3, 2, 1);
        this.scene.add(this.accentLight1);
        this.lights.push(this.accentLight1);

        this.accentLight2 = new THREE.PointLight(0x0088ff, 0.5, 8);
        this.accentLight2.position.set(3, -2, 1);
        this.scene.add(this.accentLight2);
        this.lights.push(this.accentLight2);

        // Rim light for dramatic effect
        this.rimLight = new THREE.DirectionalLight(0xe94560, 0.3);
        this.rimLight.position.set(-5, 0, -5);
        this.scene.add(this.rimLight);
        this.lights.push(this.rimLight);
    }

    update(elapsedTime) {
        // Animate accent lights
        this.accentLight1.position.x = Math.sin(elapsedTime * 0.5) * 3;
        this.accentLight1.position.y = Math.cos(elapsedTime * 0.7) * 2 + 1;

        this.accentLight2.position.x = Math.cos(elapsedTime * 0.6) * 3;
        this.accentLight2.position.y = Math.sin(elapsedTime * 0.8) * 2 - 1;

        // Animate light intensities
        this.cursorLight.intensity = 1.5 + Math.sin(elapsedTime * 2) * 0.5;
        this.accentLight1.intensity = 0.3 + Math.sin(elapsedTime * 1.5) * 0.2;
        this.accentLight2.intensity = 0.3 + Math.cos(elapsedTime * 1.8) * 0.2;
    }

    updateCursorPosition(mousePosition) {
        this.cursorPosition.copy(mousePosition);
        
        // Update cursor light position
        this.cursorLight.position.x = mousePosition.x * 5;
        this.cursorLight.position.y = mousePosition.y * 5;
        
        // Update directional light based on cursor position
        this.directionalLight.position.x = 5 + mousePosition.x * 2;
        this.directionalLight.position.y = 5 + mousePosition.y * 2;
    }

    updateScrollProgress(progress) {
        // Adjust lighting based on scroll progress
        this.ambientLight.intensity = 0.3 + progress * 0.2;
        this.directionalLight.intensity = 0.8 - progress * 0.3;
        
        // Change cursor light color based on scroll
        const hue = progress * 0.3; // Shift from red to green
        this.cursorLight.color.setHSL(hue, 0.8, 0.5);
    }

    dispose() {
        this.lights.forEach(light => {
            this.scene.remove(light);
        });
        this.lights = [];
    }
}