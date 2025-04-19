export class Navigation {
    constructor() {
        this.sections = null;
        this.navDots = null;
        this.currentSectionIndex = 0;
        this.isScrolling = false;
        this.upButton = null;
        this.downButton = null;
    }

    init() {
        this.sections = document.querySelectorAll('.section');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.createNavButtons();
        this.setupEventListeners();
    }

    createNavButtons() {
        const upButton = document.createElement('button');
        upButton.className = 'nav-button nav-up hidden';
        upButton.innerHTML = '↑';
        document.body.appendChild(upButton);

        const downButton = document.createElement('button');
        downButton.className = 'nav-button nav-down';
        downButton.innerHTML = '↓';
        document.body.appendChild(downButton);

        this.upButton = upButton;
        this.downButton = downButton;
    }

    setupEventListeners() {
        // Add click events to nav dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.scrollToSection(index));
        });

        // Add click events to navigation buttons
        this.upButton.addEventListener('click', () => this.scrollToSection(this.currentSectionIndex - 1));
        this.downButton.addEventListener('click', () => this.scrollToSection(this.currentSectionIndex + 1));

        // Add wheel event listener
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

        // Handle keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const direction = e.key === 'ArrowDown' ? 1 : -1;
                this.scrollToSection(this.currentSectionIndex + direction);
            }
        });
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) return;
        
        this.isScrolling = true;
        this.currentSectionIndex = index;
        
        this.sections[index].scrollIntoView({ behavior: 'smooth' });
        
        // Update navigation buttons
        this.upButton.classList.toggle('hidden', index === 0);
        this.downButton.classList.toggle('hidden', index === this.sections.length - 1);
        
        // Update nav dots
        this.navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
            dot.style.transform = i === index ? 'scale(1.5)' : 'scale(1)';
            dot.style.opacity = i === index ? '1' : '0.5';
        });

        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }

    handleWheel(e) {
        e.preventDefault();
        if (this.isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = this.currentSectionIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < this.sections.length) {
            this.scrollToSection(nextIndex);
        }
    }

    cleanup() {
        window.removeEventListener('wheel', (e) => this.handleWheel(e));
        window.removeEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const direction = e.key === 'ArrowDown' ? 1 : -1;
                this.scrollToSection(this.currentSectionIndex + direction);
            }
        });
        
        if (this.upButton) {
            this.upButton.remove();
        }
        if (this.downButton) {
            this.downButton.remove();
        }
    }
} 