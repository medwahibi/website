// Interactive Universe Background
(function () {
    'use strict';

    class UniverseBackground {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.animationFrame = null;
            this.time = 0;

            // Star field
            this.stars = [];
            this.starCount = 300;

            // Mouse tracking
            this.mouse = { x: null, y: null };
            this.mouseRadius = 150;

            // Nebula
            this.nebulaPoints = [];
            this.nebulaCount = 8;

            // Smoke/Fog
            this.smokeParticles = [];
            this.smokeCount = 6;

            this.init();
        }

        init() {
            // Create canvas element
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'universe-background';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                background: #000000;
            `;

            // Insert as first child of body
            document.body.insertBefore(this.canvas, document.body.firstChild);

            this.ctx = this.canvas.getContext('2d');

            // Set canvas size
            this.resize();

            // Initialize universe elements
            this.initStars();
            this.initNebula();
            this.initSmoke();

            // Event listeners
            window.addEventListener('resize', () => {
                this.resize();
                this.initStars();
                this.initNebula();
                this.initSmoke();
            });

            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            document.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
            });

            // Start animation
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        initStars() {
            this.stars = [];
            const { width, height } = this.canvas;

            for (let i = 0; i < this.starCount; i++) {
                this.stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    baseX: Math.random() * width,
                    baseY: Math.random() * height,
                    size: Math.random() * 2.5,
                    brightness: Math.random(),
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    layer: Math.random() // For parallax effect
                });
            }
        }

        initNebula() {
            this.nebulaPoints = [];
            const { width, height } = this.canvas;

            for (let i = 0; i < this.nebulaCount; i++) {
                this.nebulaPoints.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 300 + 200,
                    color: this.getNebulaColor(),
                    speed: Math.random() * 0.3 + 0.1,
                    angle: Math.random() * Math.PI * 2
                });
            }
        }

        getNebulaColor() {
            const colors = [
                'rgba(30, 20, 60, 0.15)',   // Deep purple
                'rgba(20, 30, 70, 0.15)',   // Deep blue
                'rgba(60, 20, 50, 0.15)',   // Magenta
                'rgba(10, 40, 60, 0.15)',   // Teal
                'rgba(40, 10, 40, 0.15)'    // Dark violet
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        initSmoke() {
            this.smokeParticles = [];
            const { width, height } = this.canvas;

            for (let i = 0; i < this.smokeCount; i++) {
                this.smokeParticles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 400 + 300,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.07 + 0.08
                });
            }
        }

        updateStars() {
            if (this.mouse.x === null || this.mouse.y === null) return;

            const { width, height } = this.canvas;

            this.stars.forEach(star => {
                // Parallax effect based on mouse position
                const parallaxStrength = star.layer * 20;
                const dx = (this.mouse.x - width / 2) / width;
                const dy = (this.mouse.y - height / 2) / height;

                star.x = star.baseX + dx * parallaxStrength;
                star.y = star.baseY + dy * parallaxStrength;

                // Twinkle effect
                star.brightness = Math.sin(this.time * star.twinkleSpeed) * 0.5 + 0.5;
            });
        }

        updateNebula() {
            this.nebulaPoints.forEach(nebula => {
                nebula.angle += nebula.speed * 0.001;
                nebula.x += Math.cos(nebula.angle) * 0.2;
                nebula.y += Math.sin(nebula.angle) * 0.2;

                // Wrap around screen
                if (nebula.x < -nebula.radius) nebula.x = this.canvas.width + nebula.radius;
                if (nebula.x > this.canvas.width + nebula.radius) nebula.x = -nebula.radius;
                if (nebula.y < -nebula.radius) nebula.y = this.canvas.height + nebula.radius;
                if (nebula.y > this.canvas.height + nebula.radius) nebula.y = -nebula.radius;
            });
        }

        updateSmoke() {
            const { width, height } = this.canvas;

            this.smokeParticles.forEach(smoke => {
                smoke.x += smoke.speedX;
                smoke.y += smoke.speedY;

                // Wrap around screen
                if (smoke.x < -smoke.radius) smoke.x = width + smoke.radius;
                if (smoke.x > width + smoke.radius) smoke.x = -smoke.radius;
                if (smoke.y < -smoke.radius) smoke.y = height + smoke.radius;
                if (smoke.y > height + smoke.radius) smoke.y = -smoke.radius;
            });
        }

        drawNebula() {
            this.nebulaPoints.forEach(nebula => {
                const gradient = this.ctx.createRadialGradient(
                    nebula.x, nebula.y, 0,
                    nebula.x, nebula.y, nebula.radius
                );

                gradient.addColorStop(0, nebula.color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            });
        }

        drawSmoke() {
            this.smokeParticles.forEach(smoke => {
                const gradient = this.ctx.createRadialGradient(
                    smoke.x, smoke.y, 0,
                    smoke.x, smoke.y, smoke.radius
                );

                // Much more subtle gradient to avoid visible lines
                const baseOpacity = smoke.opacity * 0.3; // Reduced by 70%
                gradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity})`);
                gradient.addColorStop(0.3, `rgba(255, 255, 255, ${baseOpacity * 0.4})`);
                gradient.addColorStop(0.6, `rgba(255, 255, 255, ${baseOpacity * 0.1})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            });
        }

        drawStars() {
            this.stars.forEach(star => {
                // Draw star with twinkle
                const alpha = star.brightness * 0.9;
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = '#ffffff';

                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();

                // Add glow for larger stars
                if (star.size > 1.5) {
                    this.ctx.globalAlpha = alpha * 0.3;
                    this.ctx.beginPath();
                    this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });

            this.ctx.globalAlpha = 1;
        }

        drawConstellations() {
            if (this.mouse.x === null || this.mouse.y === null) return;

            // Find stars near mouse
            const nearbyStars = this.stars.filter(star => {
                const dx = star.x - this.mouse.x;
                const dy = star.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < this.mouseRadius;
            });

            // Draw constellation lines between nearby stars
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.lineWidth = 1;

            nearbyStars.forEach((star, i) => {
                nearbyStars.slice(i + 1).forEach(otherStar => {
                    const dx = star.x - otherStar.x;
                    const dy = star.y - otherStar.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        const opacity = (1 - distance / 120) * 0.3;
                        this.ctx.globalAlpha = opacity;

                        this.ctx.beginPath();
                        this.ctx.moveTo(star.x, star.y);
                        this.ctx.lineTo(otherStar.x, otherStar.y);
                        this.ctx.stroke();
                    }
                });

                // Draw line from star to mouse
                const dx = star.x - this.mouse.x;
                const dy = star.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouseRadius) {
                    const opacity = (1 - distance / this.mouseRadius) * 0.2;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = 'rgba(200, 200, 255, 0.3)';

                    this.ctx.beginPath();
                    this.ctx.moveTo(star.x, star.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            });

            this.ctx.globalAlpha = 1;

            // Draw mouse cursor glow
            if (nearbyStars.length > 0) {
                const gradient = this.ctx.createRadialGradient(
                    this.mouse.x, this.mouse.y, 0,
                    this.mouse.x, this.mouse.y, 50
                );

                gradient.addColorStop(0, 'rgba(200, 200, 255, 0.1)');
                gradient.addColorStop(1, 'rgba(200, 200, 255, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(this.mouse.x, this.mouse.y, 50, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        render() {
            // Clear canvas
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Render layers
            this.drawNebula();
            // this.drawSmoke(); // Disabled - causing visible lines
            this.drawStars();
            // this.drawConstellations(); // Disabled - removed transparent lines
        }

        animate() {
            this.time++;

            this.updateNebula();
            this.updateSmoke();
            this.updateStars();
            this.render();

            this.animationFrame = requestAnimationFrame(() => this.animate());
        }

        destroy() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new UniverseBackground();
        });
    } else {
        new UniverseBackground();
    }
})();
