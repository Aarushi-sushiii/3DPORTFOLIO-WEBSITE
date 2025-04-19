import * as THREE from 'three';

export class Lights {
    constructor(scene) {
        this.scene = scene;
        this.ambientLight = null;
        this.directionalLight = null;
        this.pointLight = null;
    }

    init() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        // Directional light
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(5, 5, 5);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);

        // Point light
        this.pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
        this.pointLight.position.set(2, 3, 4);
        this.scene.add(this.pointLight);
    }

    cleanup() {
        if (this.ambientLight) {
            this.scene.remove(this.ambientLight);
        }
        if (this.directionalLight) {
            this.scene.remove(this.directionalLight);
        }
        if (this.pointLight) {
            this.scene.remove(this.pointLight);
        }
    }
} 