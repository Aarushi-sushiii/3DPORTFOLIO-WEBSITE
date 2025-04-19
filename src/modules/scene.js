import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Listen for dark mode changes
    window.addEventListener('darkModeChange', (event) => {
        const isDark = event.detail.isDark;
        scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
    });

    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export function setupLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
}

export function createTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(2, 0.6, 200, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 70,
        specular: 0xff0000,
        emissive: 0x330000
    });
    return new THREE.Mesh(geometry, material);
}

export function createControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.1;
    return controls;
}

export function setupResizeHandler(camera, renderer) {
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);
    return onWindowResize;
} 