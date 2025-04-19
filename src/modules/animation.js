export class Animation {
    constructor(core, objects, controls) {
        this.core = core;
        this.objects = objects;
        this.controls = controls;
        this.animationFrameId = null;
    }

    start() {
        const animate = () => {
            this.animationFrameId = requestAnimationFrame(animate);
            
            // Update objects
            this.objects.update();
            
            // Update controls
            this.controls.update();
            
            // Render scene
            this.core.render();
        };
        
        animate();
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
} 