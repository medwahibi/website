/**
 * Creative Background Effects
 * Image background with parallax, zoom, and overlay effects
 */

class CreativeBackground {
    constructor() {
        this.bgContainer = null;
        this.bgImage = null;
        this.overlay = null;
        this.scrollY = 0;
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        // Create background container
        this.bgContainer = document.createElement('div');
        this.bgContainer.className = 'creative-bg-container';
        this.bgContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            z-index: -2;
        `;
        document.body.prepend(this.bgContainer);

        // Create background image
        this.bgImage = document.createElement('div');
        this.bgImage.className = 'creative-bg-image';
        this.bgImage.style.cssText = `
            position: absolute;
            top: -10%;
            left: -10%;
            width: 120%;
            height: 120%;
            background-image: url('./background.png');
            background-size: cover;
            background-position: center;
            will-change: transform;
            transition: transform 0.1s ease-out;
        `;
        this.bgContainer.appendChild(this.bgImage);

        // Create black overlay with 30% opacity
        this.overlay = document.createElement('div');
        this.overlay.className = 'creative-bg-overlay';
        this.overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
        `;
        this.bgContainer.appendChild(this.overlay);

        // Create animated light rays
        this.createLightRays();

        // Setup event listeners
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.handleMouse(e));

        // Initial render
        this.render();
    }

    createLightRays() {
        const rays = document.createElement('div');
        rays.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                ellipse at top left,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%
            ),
            radial-gradient(
                ellipse at top right,
                rgba(255, 255, 255, 0.05) 0%,
                transparent 40%
            );
            opacity: 0.5;
            pointer-events: none;
        `;
        this.bgContainer.appendChild(rays);
    }

    handleScroll() {
        this.scrollY = window.scrollY;
        this.render();
    }

    handleMouse(e) {
        this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        this.render();
    }

    render() {
        // Parallax scroll effect
        const parallaxY = this.scrollY * 0.5;

        // Mouse parallax effect (subtle)
        const mouseParallaxX = this.mouseX * 20;
        const mouseParallaxY = this.mouseY * 20;

        // Apply transforms (no zoom)
        this.bgImage.style.transform = `
            translateY(${parallaxY}px)
            translateX(${mouseParallaxX}px)
            translateY(${mouseParallaxY}px)
        `;

        requestAnimationFrame(() => this.render());
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CreativeBackground());
} else {
    new CreativeBackground();
}
