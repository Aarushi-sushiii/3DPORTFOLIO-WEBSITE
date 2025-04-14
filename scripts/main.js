import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Listen for dark mode changes
window.addEventListener('darkModeChange', (event) => {
    const isDark = event.detail.isDark;
    scene.background = new THREE.Color(isDark ? 0x000000 : 0xffffff);
});

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

// Create 3D Object
const geometry = new THREE.TorusKnotGeometry(2, 0.6, 200, 32);
const material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100,
    specular: 0xff0000,
    emissive: 0x330000
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 3;
controls.maxDistance = 10;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.1;

// Audio Visualization Setup
let audioContext, audioAnalyser, audioElement, visualizer, audioSource;

function initAudio() {
    try {
        // Clean up existing audio context if it exists
        if (audioContext) {
            audioContext.close();
        }
        
        audioElement = document.getElementById('background-music');
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Disconnect any existing connections
        if (audioSource) {
            audioSource.disconnect();
        }
        
        // Create new audio source
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioAnalyser = audioContext.createAnalyser();
        audioAnalyser.fftSize = 256;
        
        // Connect the audio chain
        audioSource.connect(audioAnalyser);
        audioAnalyser.connect(audioContext.destination);
        
        // Create or update visualizer container
        let container = document.querySelector('.visualizer-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'visualizer-container';
            document.body.appendChild(container);
        }
        
        // Clean up existing visualizer if it exists
        if (visualizer) {
            visualizer.destroy();
        }
        
        // Initialize AudioMotion Analyzer
        visualizer = new AudioMotionAnalyzer(container, {
            source: audioElement,
            height: 150,
            width: window.innerWidth,
            mode: 3,
            fillAlpha: 0.7,
            gradient: 'rainbow',
            lineWidth: 2,
            showBgColor: false,
            showScaleX: false,
            showScaleY: false,
            maxFreq: 16000,
            minFreq: 30,
            smoothing: 0.7,
            speed: 1.5,
            splitMode: false,
            start: true,
            useCanvas: true,
            gradientColors: [
                { pos: 0, color: '#330000' },
                { pos: 0.5, color: '#ff0000' },
                { pos: 1, color: '#ff3333' }
            ]
        });
        
        return true;
    } catch (error) {
        console.error('Audio initialization error:', error);
        return false;
    }
}

// Music Controls Setup
function setupMusicControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeControl = document.getElementById('volumeControl');
    
    playPauseBtn.addEventListener('click', async () => {
        try {
            if (audioContext?.state === 'suspended') {
                await audioContext.resume();
            }
            
            if (!audioContext) {
                const success = initAudio();
                if (!success) return;
            }
            
            if (audioElement.paused) {
                await audioElement.play();
                playPauseBtn.textContent = 'Pause Music';
            } else {
                audioElement.pause();
                playPauseBtn.textContent = 'Play Music';
            }
        } catch (error) {
            console.error('Playback error:', error);
        }
    });
    
    volumeControl.addEventListener('input', (e) => {
        if (audioElement) {
            audioElement.volume = e.target.value;
        }
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (visualizer) {
        visualizer.width = window.innerWidth;
    }
}

window.addEventListener('resize', onWindowResize, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (torusKnot) {
        torusKnot.rotation.x += 0.001;
        torusKnot.rotation.y += 0.002;
        torusKnot.rotation.z += 0.001;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Scroll and Navigation Setup
function setupScrollNavigation() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSectionIndex = 0;
    let isScrolling = false;

    // Create navigation buttons
    const createNavButtons = () => {
        const upButton = document.createElement('button');
        upButton.className = 'nav-button nav-up hidden';
        upButton.innerHTML = '↑';
        document.body.appendChild(upButton);

        const downButton = document.createElement('button');
        downButton.className = 'nav-button nav-down';
        downButton.innerHTML = '↓';
        document.body.appendChild(downButton);

        return { upButton, downButton };
    };

    const { upButton, downButton } = createNavButtons();

    // Function to scroll to a specific section
    const scrollToSection = (index) => {
        if (index < 0 || index >= sections.length || isScrolling) return;
        
        isScrolling = true;
        currentSectionIndex = index;
        
        sections[index].scrollIntoView({ behavior: 'smooth' });
        
        // Update navigation buttons
        upButton.classList.toggle('hidden', index === 0);
        downButton.classList.toggle('hidden', index === sections.length - 1);
        
        // Update nav dots
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.style.transform = i === index ? 'scale(1.5)' : 'scale(1)';
            dot.style.opacity = i === index ? '1' : '0.5';
        });

        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    };

    // Handle mouse wheel events
    const handleWheel = (e) => {
        e.preventDefault();
        if (isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = currentSectionIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < sections.length) {
            scrollToSection(nextIndex);
        }
    };

    // Add click events to nav dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => scrollToSection(index));
    });

    // Add click events to navigation buttons
    upButton.addEventListener('click', () => scrollToSection(currentSectionIndex - 1));
    downButton.addEventListener('click', () => scrollToSection(currentSectionIndex + 1));

    // Add wheel event listener with passive: false to prevent default scrolling
    window.addEventListener('wheel', handleWheel, { passive: false });

    // Handle keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            scrollToSection(currentSectionIndex + direction);
        }
    });

    // Initial scroll to first section and update
    scrollToSection(0);
}

// Initialize everything when the window loads
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Start animation immediately
    animate();
    
    // Initialize scene first
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    // Setup scroll navigation
    setupScrollNavigation();
    
    // Initialize audio after a short delay
    setTimeout(async () => {
        try {
            setupMusicControls();
            // Don't auto-initialize audio - wait for user interaction
        } catch (error) {
            console.error('Setup error:', error);
        }
        
        // Hide loading screen
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1500);
}); 