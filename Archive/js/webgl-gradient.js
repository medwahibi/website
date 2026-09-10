/**
 * Clean WebGL Gradient Background
 * Simple, smooth, no visible lines
 */

class WebGLGradient {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.time = 0;

        // Star particle system
        this.starCanvas = null;
        this.starCtx = null;
        this.stars = [];
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        // Create WebGL canvas for smoke
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -2;
        `;
        document.body.prepend(this.canvas);

        // Create canvas for stars on top
        this.starCanvas = document.createElement('canvas');
        this.starCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
        `;
        document.body.prepend(this.starCanvas);
        this.starCtx = this.starCanvas.getContext('2d');

        // Setup WebGL
        this.gl = this.canvas.getContext('webgl', {
            alpha: false,
            antialias: true
        });

        if (!this.gl) {
            console.warn('WebGL not supported');
            this.canvas.style.background = '#000';
        } else {
            this.createShaders();
        }

        this.resize();
        this.createStars();

        // Mouse tracking
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });

        this.render();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.starCanvas.width = window.innerWidth;
        this.starCanvas.height = window.innerHeight;
        if (this.gl) {
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    createStars() {
        this.stars = [];
        const numStars = 300;

        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.starCanvas.width,
                y: Math.random() * this.starCanvas.height,
                z: Math.random() * 3, // Depth for parallax
                size: Math.random() * 0.5 + 0.5, // Really small: 0.5-1px
                opacity: Math.random() * 0.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.1,
                speedY: (Math.random() - 0.5) * 0.1
            });
        }
    }

    updateStars() {
        const width = this.starCanvas.width;
        const height = this.starCanvas.height;

        this.stars.forEach(star => {
            // Move stars
            star.x += star.speedX;
            star.y += star.speedY;

            // Mouse parallax effect
            const dx = this.mouse.x - width / 2;
            const dy = this.mouse.y - height / 2;
            star.x += dx * 0.00005 * star.z;
            star.y += dy * 0.00005 * star.z;

            // Wrap around
            if (star.x < 0) star.x = width;
            if (star.x > width) star.x = 0;
            if (star.y < 0) star.y = height;
            if (star.y > height) star.y = 0;
        });
    }

    drawStars() {
        const ctx = this.starCtx;
        ctx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height);

        this.stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
    }

    createShaders() {
        const gl = this.gl;

        // Vertex shader
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, `
            attribute vec2 pos;
            void main() {
                gl_Position = vec4(pos, 0.0, 1.0);
            }
        `);
        gl.compileShader(vs);

        // Fragment shader - just smoke, no stars
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;

            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution;
                float t = u_time * 0.001;
                
                // Pure black space
                vec3 color = vec3(0.0);
                
                // Less white clouds
                float cloud = 0.0;
                cloud += noise(uv * 1.5 + vec2(t * 2.0, t * 1.5)) * 1.0;
                cloud += noise(uv * 2.5 - vec2(t * 1.5, t * 2.5)) * 0.5;
                cloud += noise(uv * 0.8 + vec2(t * 1.0, -t * 1.8)) * 0.8;
                
                // Less clouds - higher threshold
                cloud = cloud / 2.3;
                cloud = smoothstep(0.55, 0.75, cloud); // Much less clouds
                
                // Subtle white clouds
                color += vec3(cloud * 0.2); // Reduced from 0.35
                
                gl_FragColor = vec4(color, 1.0);
            }
        `);
        gl.compileShader(fs);

        // Create program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);

        // Setup geometry
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(this.program, 'pos');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        this.u_resolution = gl.getUniformLocation(this.program, 'u_resolution');
        this.u_time = gl.getUniformLocation(this.program, 'u_time');
    }

    render() {
        this.time++;

        // Render WebGL smoke
        if (this.gl && this.program) {
            const gl = this.gl;
            gl.uniform2f(this.u_resolution, this.canvas.width, this.canvas.height);
            gl.uniform1f(this.u_time, this.time);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        // Update and render stars
        this.updateStars();
        this.drawStars();

        requestAnimationFrame(() => this.render());
    }
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WebGLGradient());
} else {
    new WebGLGradient();
}
