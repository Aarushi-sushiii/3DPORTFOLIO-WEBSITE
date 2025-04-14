import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Dark background

// Camera Setup
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white global light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffaa00, 2, 10); // Warm light from a specific position
pointLight.position.set(2, 3, 2);
scene.add(pointLight);




// Load Model
const loader = new GLTFLoader();
loader.load('/cartoon_mushrooms.gltf', function (gltf) {  // Note: Public assets are referenced with "/"
    const model = gltf.scene;
    model.scale.set(10, 10, 10);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
