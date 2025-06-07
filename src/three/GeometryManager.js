import * as THREE from 'three';

export class GeometryManager {
    constructor(scene, materialManager) {
        this.scene = scene;
        this.materialManager = materialManager;
        this.objects = [];
        this.scrollProgress = 0;
        
        this.createGeometry();
    }

    createGeometry() {
        // Create main central image plane
        this.createImagePlane();
        
        // Create floating geometric shapes
        this.createFloatingShapes();
        
        // Create particle system
        this.createParticles();
    }

    createImagePlane() {
        const geometry = new THREE.PlaneGeometry(3, 2, 32, 32);
        const material = this.materialManager.getImageMaterial();
        
        this.imagePlane = new THREE.Mesh(geometry, material);
        this.imagePlane.position.set(0, 0, 0);
        this.scene.add(this.imagePlane);
        this.objects.push(this.imagePlane);

        // Add subtle wave animation to the plane
        const positionAttribute = geometry.attributes.position;
        this.originalPositions = positionAttribute.array.slice();
    }

    createFloatingShapes() {
        const shapes = [
            { geometry: new THREE.IcosahedronGeometry(0.3, 0), position: [-3, 2, -1] },
            { geometry: new THREE.OctahedronGeometry(0.4, 0), position: [3, -1, -2] },
            { geometry: new THREE.TetrahedronGeometry(0.35, 0), position: [-2, -2, 1] },
            { geometry: new THREE.DodecahedronGeometry(0.25, 0), position: [2.5, 1.5, -0.5] },
            { geometry: new THREE.TorusGeometry(0.3, 0.1, 8, 16), position: [-3.5, -1, 0.5] },
            { geometry: new THREE.ConeGeometry(0.2, 0.6, 8), position: [3.2, 2.2, -1.5] }
        ];

        this.floatingShapes = [];

        shapes.forEach((shapeData, index) => {
            const material = this.materialManager.getShapeMaterial(index);
            const mesh = new THREE.Mesh(shapeData.geometry, material);
            
            mesh.position.set(...shapeData.position);
            mesh.userData = {
                originalPosition: new THREE.Vector3(...shapeData.position),
                rotationSpeed: 0.01 + Math.random() * 0.02,
                floatSpeed: 0.5 + Math.random() * 0.5,
                floatAmplitude: 0.1 + Math.random() * 0.2
            };
            
            this.scene.add(mesh);
            this.floatingShapes.push(mesh);
            this.objects.push(mesh);
        });
    }

    createParticles() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Color
            const color = new THREE.Color();
            color.setHSL(0.1 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Size
            sizes[i] = Math.random() * 3 + 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = this.materialManager.getParticleMaterial();
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        this.objects.push(this.particles);
    }

    update(elapsedTime) {
        // Animate image plane with subtle wave effect
        if (this.imagePlane) {
            const geometry = this.imagePlane.geometry;
            const positionAttribute = geometry.attributes.position;
            
            for (let i = 0; i < positionAttribute.count; i++) {
                const x = this.originalPositions[i * 3];
                const y = this.originalPositions[i * 3 + 1];
                
                const wave = Math.sin(x * 2 + elapsedTime * 0.5) * Math.sin(y * 2 + elapsedTime * 0.3) * 0.02;
                positionAttribute.setZ(i, this.originalPositions[i * 3 + 2] + wave);
            }
            
            positionAttribute.needsUpdate = true;
            
            // Rotate image plane slightly
            this.imagePlane.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
            this.imagePlane.rotation.x = Math.cos(elapsedTime * 0.3) * 0.05;
        }

        // Animate floating shapes
        this.floatingShapes.forEach((shape, index) => {
            const userData = shape.userData;
            
            // Rotation
            shape.rotation.x += userData.rotationSpeed;
            shape.rotation.y += userData.rotationSpeed * 0.7;
            shape.rotation.z += userData.rotationSpeed * 0.5;
            
            // Floating animation
            const floatOffset = Math.sin(elapsedTime * userData.floatSpeed + index) * userData.floatAmplitude;
            shape.position.y = userData.originalPosition.y + floatOffset;
            
            // Scroll-based movement
            const scrollOffset = this.scrollProgress * (index % 2 === 0 ? 2 : -2);
            shape.position.x = userData.originalPosition.x + scrollOffset;
        });

        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            
            // Move particles based on scroll
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsedTime + positions[i]) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    updateScrollProgress(progress) {
        this.scrollProgress = progress;
        
        // Update camera position based on scroll
        if (this.scene.userData.camera) {
            this.scene.userData.camera.position.z = 5 - progress * 2;
        }
        
        // Scale and rotate main image plane
        if (this.imagePlane) {
            const scale = 1 + progress * 0.5;
            this.imagePlane.scale.setScalar(scale);
            this.imagePlane.rotation.z = progress * Math.PI * 0.1;
        }
    }

    dispose() {
        this.objects.forEach(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        });
        this.objects = [];
    }
}