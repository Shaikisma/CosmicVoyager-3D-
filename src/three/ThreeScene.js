import * as THREE from 'three';
import { GeometryManager } from './GeometryManager.js';
import { LightingManager } from './LightingManager.js';
import { MaterialManager } from './MaterialManager.js';

export class ThreeScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,
            alpha: true 
        });
        
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.init();
    }

    init() {
        // Configure renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        // Set camera position
        this.camera.position.set(0, 0, 5);

        // Initialize managers
        this.materialManager = new MaterialManager();
        this.geometryManager = new GeometryManager(this.scene, this.materialManager);
        this.lightingManager = new LightingManager(this.scene);

        // Start render loop
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsedTime = this.clock.getElapsedTime();

        // Update geometry animations
        this.geometryManager.update(elapsedTime);

        // Update lighting
        this.lightingManager.update(elapsedTime);

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    updateScrollProgress(progress) {
        this.geometryManager.updateScrollProgress(progress);
        this.lightingManager.updateScrollProgress(progress);
    }

    updateCursorPosition(x, y) {
        this.mouse.x = (x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(y / window.innerHeight) * 2 + 1;
        
        this.lightingManager.updateCursorPosition(this.mouse);
    }

    dispose() {
        // Clean up resources
        this.geometryManager.dispose();
        this.materialManager.dispose();
        this.renderer.dispose();
    }
}