// CSS-Based Moving Smoke Effect (No Gradient Lines!)
(function () {
    'use strict';

    class SmokeEffect {
        constructor() {
            this.container = null;
            this.particles = [];
            this.particleCount = 5;

            this.init();
        }

        init() {
            // Create container for smoke particles
            this.container = document.createElement('div');
            this.container.id = 'smoke-container';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                pointer-events: none;
                overflow: hidden;
            `;

            document.body.insertBefore(this.container, document.body.firstChild);

            // Create smoke particles
            this.createParticles();

            // Start animation
            this.animate();
        }

        createParticles() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            for (let i = 0; i < this.particleCount; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 600 + 500;
                const x = Math.random() * width;
                const y = Math.random() * height;
                const speedX = (Math.random() - 0.5) * 0.3;
                const speedY = (Math.random() - 0.5) * 0.3;
                const opacity = Math.random() * 0.15 + 0.1;

                particle.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, transparent 70%);
                    border-radius: 50%;
                    filter: blur(80px);
                    transform: translate(-50%, -50%);
                    will-change: transform;
                `;

                particle.style.left = x + 'px';
                particle.style.top = y + 'px';

                this.container.appendChild(particle);

                this.particles.push({
                    element: particle,
                    x: x,
                    y: y,
                    speedX: speedX,
                    speedY: speedY,
                    size: size
                });
            }
        }

        animate() {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around screen
                const halfSize = particle.size / 2;
                if (particle.x < -halfSize) particle.x = width + halfSize;
                if (particle.x > width + halfSize) particle.x = -halfSize;
                if (particle.y < -halfSize) particle.y = height + halfSize;
                if (particle.y > height + halfSize) particle.y = -halfSize;

                // Apply position
                particle.element.style.left = particle.x + 'px';
                particle.element.style.top = particle.y + 'px';
            });

            requestAnimationFrame(() => this.animate());
        }

        destroy() {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SmokeEffect();
        });
    } else {
        new SmokeEffect();
    }
})();
