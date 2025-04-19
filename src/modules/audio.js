import AudioMotionAnalyzer from 'audiomotion-analyzer';

export class AudioVisualizer {
    constructor() {
        this.audioContext = null;
        this.audioAnalyser = null;
        this.audioElement = null;
        this.visualizer = null;
        this.audioSource = null;
        this.isVisualizerInitialized = false;
    }

    init() {
        try {
            // Clean up existing audio context if it exists
            if (this.audioContext) {
                this.audioContext.close();
            }
            
            this.audioElement = document.getElementById('background-music');
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Disconnect any existing connections
            if (this.audioSource) {
                this.audioSource.disconnect();
            }
            
            // Create new audio source
            this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
            this.audioAnalyser = this.audioContext.createAnalyser();
            this.audioAnalyser.fftSize = 256;
            
            // Connect the audio chain
            this.audioSource.connect(this.audioAnalyser);
            this.audioAnalyser.connect(this.audioContext.destination);
            
            // Create or update visualizer container
            let container = document.querySelector('.visualizer-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'visualizer-container';
                document.body.insertBefore(container, document.body.firstChild);
            }
            
            // Only initialize visualizer if it hasn't been initialized yet
            if (!this.isVisualizerInitialized) {
                // Clean up existing visualizer if it exists
                if (this.visualizer) {
                    this.visualizer.destroy();
                }
                
                // Initialize AudioMotion Analyzer
                this.visualizer = new AudioMotionAnalyzer(container, {
                    source: this.audioElement,
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
                
                this.isVisualizerInitialized = true;
            }
            
            return true;
        } catch (error) {
            console.error('Audio initialization error:', error);
            return false;
        }
    }

    setupMusicControls() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeControl = document.getElementById('volumeControl');
        
        playPauseBtn.addEventListener('click', async () => {
            try {
                if (this.audioContext?.state === 'suspended') {
                    await this.audioContext.resume();
                }
                
                if (!this.audioContext) {
                    const success = this.init();
                    if (!success) return;
                }
                
                if (this.audioElement.paused) {
                    await this.audioElement.play();
                    playPauseBtn.textContent = 'Pause Music';
                } else {
                    this.audioElement.pause();
                    playPauseBtn.textContent = 'Play Music';
                }
            } catch (error) {
                console.error('Playback error:', error);
            }
        });
        
        volumeControl.addEventListener('input', (e) => {
            if (this.audioElement) {
                this.audioElement.volume = e.target.value;
            }
        });
    }

    cleanup() {
        if (this.audioSource) {
            this.audioSource.disconnect();
        }
        if (this.audioAnalyser) {
            this.audioAnalyser.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.visualizer) {
            this.visualizer.destroy();
        }
    }
} 