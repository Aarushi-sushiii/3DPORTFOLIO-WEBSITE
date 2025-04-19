import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Controls {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;
        this.controls = null;
    }

    init() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.1;
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }
    }

    cleanup() {
        if (this.controls) {
            this.controls.dispose();
        }
    }
} 