document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSection = 0;
    let isScrolling = false;

    // Function to update active section
    function updateActiveSection() {
        const scrollPosition = window.scrollY;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            if (scrollPosition >= sectionTop - window.innerHeight / 2 &&
                scrollPosition < sectionBottom - window.innerHeight / 2) {
                currentSection = index;
                updateNavDots(index);
            }
        });
    }

    // Function to update navigation dots
    function updateNavDots(activeIndex) {
        navDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Add click event listeners to navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (isScrolling) return;
            isScrolling = true;
            
            // Get the target section
            const targetSection = sections[index];
            if (!targetSection) return;
            
            // Calculate the target position
            const targetPosition = targetSection.offsetTop - 20; // 20px offset for better positioning
            
            // Smooth scroll to the target section
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active section and dot
            currentSection = index;
            updateNavDots(currentSection);
            
            // Reset scrolling flag after animation completes
            setTimeout(() => {
                isScrolling = false;
            }, 1000); // Adjust timing based on scroll duration
        });
    });

    // Update active section on scroll
    window.addEventListener('scroll', () => {
        if (isScrolling) return;
        updateActiveSection();
    });

    // Initialize first section as active
    updateNavDots(0);
}); 