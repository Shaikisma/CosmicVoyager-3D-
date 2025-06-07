import * as THREE from 'three';

export class MaterialManager {
    constructor() {
        this.materials = new Map();
        this.textures = new Map();
        
        this.createMaterials();
    }

    createMaterials() {
        // Create image material with holographic effect
        this.createImageMaterial();
        
        // Create shape materials
        this.createShapeMaterials();
        
        // Create particle material
        this.createParticleMaterial();
    }

    createImageMaterial() {
        // Create a canvas texture for the main image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e94560');
        gradient.addColorStop(0.5, '#f27121');
        gradient.addColorStop(1, '#00ff88');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add geometric patterns
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 50 + 20;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
            roughness: 0.3,
            metalness: 0.7,
            emissive: new THREE.Color(0x111111)
        });
        
        this.materials.set('image', material);
    }

    createShapeMaterials() {
        const colors = [
            0xe94560, // Red
            0xf27121, // Orange
            0x00ff88, // Green
            0x0088ff, // Blue
            0x8844ff, // Purple
            0xff4488  // Pink
        ];
        
        colors.forEach((color, index) => {
            const material = new THREE.MeshStandardMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                roughness: 0.2,
                metalness: 0.8,
                emissive: new THREE.Color(color).multiplyScalar(0.1)
            });
            
            this.materials.set(`shape_${index}`, material);
        });
    }

    createParticleMaterial() {
        // Create particle texture
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.PointsMaterial({
            map: texture,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            size: 2,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });
        
        this.materials.set('particles', material);
    }

    getImageMaterial() {
        return this.materials.get('image');
    }

    getShapeMaterial(index) {
        return this.materials.get(`shape_${index % 6}`);
    }

    getParticleMaterial() {
        return this.materials.get('particles');
    }

    dispose() {
        this.materials.forEach(material => {
            if (material.map) material.map.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.metalnessMap) material.metalnessMap.dispose();
            material.dispose();
        });
        
        this.textures.forEach(texture => {
            texture.dispose();
        });
        
        this.materials.clear();
        this.textures.clear();
    }
}