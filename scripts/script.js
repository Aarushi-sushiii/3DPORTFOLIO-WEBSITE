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
loader.load('public/cartoon_mushrooms.gltf', function (gltf) {
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

// Smooth Scrolling and Navigation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSection = 0;
    let isScrolling = false;

    // Update active section on scroll
    function updateActiveSection() {
        const scrollPosition = window.pageYOffset;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight / 2 &&
                scrollPosition < sectionTop + sectionHeight - window.innerHeight / 2) {
                currentSection = index;
                updateNavDots(index);
            }
        });
    }

    // Update navigation dots
    function updateNavDots(activeIndex) {
        navDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Handle dot navigation clicks
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isScrolling) {
                isScrolling = true;
                currentSection = index;
                updateNavDots(index);
                
                sections[index].scrollIntoView({
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });

    // Handle scroll events
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            updateActiveSection();
        }
    });

    // Initialize first section as active
    updateNavDots(0);
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
    const audio = new Audio('assets/Space Cadet-yt.savetube.me.mp3');
    audio.loop = true;
    
    // Hide loading screen and play music when everything is loaded
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        audio.play().catch(error => {
            console.log('Auto-play prevented:', error);
        });
    }, 3000); // Adjust timing to match your loading screen animation
});

// Cursor Trail Effect
class CursorTrail {
    constructor() {
        this.circles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.positions = [];
        this.maxCircles = 10;
        this.init();
    }

    init() {
        for (let i = 0; i < this.maxCircles; i++) {
            const circle = document.createElement('div');
            circle.className = 'cursor-circle';
            circle.style.opacity = 1 - (i * 0.1);
            circle.style.transform = `translate(-50%, -50%) scale(${1 - (i * 0.1)})`;
            document.body.appendChild(circle);
            this.circles.push(circle);
            this.positions.push({ x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        this.animate();
    }

    animate() {
        this.positions.unshift({ x: this.mouseX, y: this.mouseY });
        if (this.positions.length > this.maxCircles) {
            this.positions.pop();
        }

        this.circles.forEach((circle, index) => {
            const pos = this.positions[index] || this.positions[this.positions.length - 1];
            circle.style.left = pos.x + 'px';
            circle.style.top = pos.y + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor trail
new CursorTrail();

// Music Controls
const audio = document.getElementById('background-music');
const playPauseBtn = document.getElementById('playPauseBtn');

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = 'Pause Music';
    } else {
        audio.pause();
        playPauseBtn.textContent = 'Play Music';
    }
});

document.getElementById('volumeControl').addEventListener('input', (e) => {
    audio.volume = e.target.value;
});
