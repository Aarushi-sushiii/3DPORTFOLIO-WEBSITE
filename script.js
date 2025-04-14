// Import Three.js and its modules
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 0.5, 100);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Load Model
const loader = new GLTFLoader();
let model;
loader.load('/cartoon_mushrooms.gltf', function (gltf) {
    model = gltf.scene;
    model.scale.set(10, 10, 10);
    model.position.y = -1;
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(model);
}, undefined, function (error) {
    console.error('Error loading model:', error);
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1;

// Handle Resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Smooth Scrolling
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');

navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        sections[index].scrollIntoView({ behavior: 'smooth' });
    });
});

// Update camera position based on scroll
let currentSection = 0;
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop - window.innerHeight / 2 && 
            scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2) {
            currentSection = index;
            navDots.forEach((dot, i) => {
                dot.style.transform = i === currentSection ? 'scale(1.5)' : 'scale(1)';
                dot.style.opacity = i === currentSection ? '1' : '0.5';
            });
        }
    });
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        model.rotation.y += 0.001;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Loading screen and music setup
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const audio = new Audio('path/to/your/music.mp3');
    audio.loop = true;
    
    // Hide loading screen and play music when everything is loaded
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        audio.play().catch(error => {
            console.log('Auto-play prevented:', error);
        });
    }, 3000); // Adjust timing to match your loading screen animation
});
