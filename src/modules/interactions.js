import * as THREE from 'three';

export class InteractionManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectedObject = null;
        this.animationMixer = null;
        this.clock = new THREE.Clock();
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('click', (event) => this.onClick(event));
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.updateIntersections();
    }

    onClick(event) {
        if (this.intersectedObject) {
            // Handle click on intersected object
            this.handleObjectClick(this.intersectedObject);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateIntersections() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            if (this.intersectedObject !== intersects[0].object) {
                if (this.intersectedObject) {
                    this.intersectedObject.material.emissive.setHex(this.intersectedObject.currentHex);
                }
                
                this.intersectedObject = intersects[0].object;
                this.intersectedObject.currentHex = this.intersectedObject.material.emissive.getHex();
                this.intersectedObject.material.emissive.setHex(0xff0000);
            }
        } else {
            if (this.intersectedObject) {
                this.intersectedObject.material.emissive.setHex(this.intersectedObject.currentHex);
            }
            this.intersectedObject = null;
        }
    }

    handleObjectClick(object) {
        // Add animation or interaction logic here
        if (object.userData.animation) {
            this.playAnimation(object);
        }
    }

    playAnimation(object) {
        if (this.animationMixer) {
            this.animationMixer.stopAllAction();
        }
        
        this.animationMixer = new THREE.AnimationMixer(object);
        const action = this.animationMixer.clipAction(object.userData.animation);
        action.play();
    }

    update() {
        if (this.animationMixer) {
            this.animationMixer.update(this.clock.getDelta());
        }
    }

    cleanup() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClick);
        window.removeEventListener('resize', this.onWindowResize);
        
        if (this.animationMixer) {
            this.animationMixer.stopAllAction();
        }
    }
} 