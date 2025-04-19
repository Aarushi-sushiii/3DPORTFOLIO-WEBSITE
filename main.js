import { Core } from './src/modules/core.js';
import { Lights } from './src/modules/lights.js';
import { Objects } from './src/modules/objects.js';
import { Controls } from './src/modules/controls.js';
import { Navigation } from './src/modules/navigation.js';
import { Animation } from './src/modules/animation.js';

// Initialize core components
const core = new Core();
const lights = new Lights(core.scene);
const objects = new Objects(core.scene);
const controls = new Controls(core.camera, core.renderer);
const navigation = new Navigation();
const animation = new Animation(core, objects, controls);

// Initialize everything
function init() {
    core.init();
    lights.init();
    objects.init();
    controls.init();
    navigation.init();
    
    // Start animation
    animation.start();
}

// Cleanup function
function cleanup() {
    animation.stop();
    controls.cleanup();
    objects.cleanup();
    lights.cleanup();
    core.cleanup();
    navigation.cleanup();
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Initialize everything
    init();
    
    // Hide loading screen
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
});

// Cleanup when window is closed
window.addEventListener('beforeunload', cleanup); 