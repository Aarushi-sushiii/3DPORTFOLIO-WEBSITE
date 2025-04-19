import * as THREE from '../../node_modules/three';

export class Core {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    }

    init() {
        // Scene setup
        this.scene.background = new THREE.Color(0xffffff);

        // Listen for dark mode changes
        window.addEventListener('darkModeChange', (event) => {
            const isDark = event.detail.isDark;
            this.scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
        });

        // Camera setup
        this.camera.position.set(0, 2, 5);

        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    cleanup() {
        window.removeEventListener('resize', () => this.onWindowResize());
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
} 