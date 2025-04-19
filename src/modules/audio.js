import * as THREE from 'three';

export class AudioVisualizer {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.audioElement = null;
        this.isPlaying = false;
        this.audioSource = null;
        this.visualizationMesh = null;
    }

    init() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        // Create visualization mesh
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(bufferLength * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        this.visualizationMesh = new THREE.Line(geometry, material);
        this.scene.add(this.visualizationMesh);
    }

    setupAudioElement(audioElement) {
        this.audioElement = audioElement;
        this.audioSource = this.audioContext.createMediaElementSource(audioElement);
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    togglePlay() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        if (this.isPlaying) {
            this.audioElement.pause();
        } else {
            this.audioElement.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    update() {
        if (!this.analyser || !this.visualizationMesh) return;

        this.analyser.getByteFrequencyData(this.dataArray);
        const positions = this.visualizationMesh.geometry.attributes.position.array;
        
        for (let i = 0; i < this.dataArray.length; i++) {
            const value = this.dataArray[i] / 128.0;
            positions[i * 3] = (i - this.dataArray.length / 2) * 0.1;
            positions[i * 3 + 1] = value;
            positions[i * 3 + 2] = 0;
        }
        
        this.visualizationMesh.geometry.attributes.position.needsUpdate = true;
    }

    cleanup() {
        if (this.audioSource) {
            this.audioSource.disconnect();
        }
        if (this.analyser) {
            this.analyser.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.visualizationMesh) {
            this.scene.remove(this.visualizationMesh);
        }
    }
} 