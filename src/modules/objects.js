import * as THREE from '../../node_modules/three';

export class Objects {
    constructor(scene) {
        this.scene = scene;
        this.torusKnot = null;
    }

    init() {
        // Create 3D Object
        const geometry = new THREE.TorusKnotGeometry(2, 0.6, 200, 32);
        const material = new THREE.MeshPhongMaterial({
            color: 0x0000ff,
            shininess: 70,
            specular: 0x0000ff,
            emissive: 0x000033
        });
        this.torusKnot = new THREE.Mesh(geometry, material);
        this.scene.add(this.torusKnot);
    }

    update() {
        if (this.torusKnot) {
            this.torusKnot.rotation.x += 0.001;
            this.torusKnot.rotation.y += 0.002;
            this.torusKnot.rotation.z += 0.001;
        }
    }

    cleanup() {
        if (this.torusKnot) {
            this.scene.remove(this.torusKnot);
            this.torusKnot.geometry.dispose();
            this.torusKnot.material.dispose();
        }
    }
} 