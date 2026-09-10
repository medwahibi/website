// Smooth WebGL Gradient Background (No visible lines!)
// Inspired by Stripe's gradient mesh
(function () {
    'use strict';

    class GradientBackground {
        constructor() {
            this.canvas = null;
            this.gl = null;
            this.program = null;
            this.time = 0;
            this.animationFrame = null;

            this.init();
        }

        init() {
            // Create canvas
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gradient-bg';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
            `;
            document.body.insertBefore(this.canvas, document.body.firstChild);

            // Get WebGL context
            this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

            if (!this.gl) {
                console.warn('WebGL not supported, falling back to black');
                this.canvas.style.background = '#000000';
                return;
            }

            this.resize();
            this.setupShaders();
            window.addEventListener('resize', () => this.resize());
            this.render();
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * dpr;
            this.canvas.height = window.innerHeight * dpr;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
            if (this.gl) {
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        setupShaders() {
            const gl = this.gl;

            // Vertex shader
            const vertexShaderSource = `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `;

            // Fragment shader with smooth gradient
            const fragmentShaderSource = `
                precision mediump float;
                uniform vec2 resolution;
                uniform float time;

                void main() {
                    vec2 uv = gl_FragCoord.xy / resolution;
                    
                    // Create smooth animated gradients
                    float t = time * 0.0003;
                    
                    // Brighter gradient colors for visibility
                    vec3 color1 = vec3(0.08, 0.05, 0.15); // Dark purple
                    vec3 color2 = vec3(0.05, 0.08, 0.20); // Dark blue
                    vec3 color3 = vec3(0.15, 0.05, 0.18); // Brighter purple
                    vec3 color4 = vec3(0.02, 0.02, 0.08); // Very dark
                    
                    // Animated gradient mixing with smoother transitions
                    float mix1 = sin(uv.x * 2.0 + t) * 0.5 + 0.5;
                    float mix2 = cos(uv.y * 2.0 - t * 0.7) * 0.5 + 0.5;
                    float mix3 = sin((uv.x + uv.y) * 1.5 + t * 1.3) * 0.5 + 0.5;
                    
                    vec3 gradient = mix(color1, color2, mix1);
                    gradient = mix(gradient, color3, mix2 * 0.6);
                    gradient = mix(gradient, color4, mix3 * 0.4);
                    
                    gl_FragColor = vec4(gradient, 1.0);
                }
            `;

            // Compile shaders
            const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

            // Create program
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error('Program link failed:', gl.getProgramInfoLog(this.program));
                return;
            }

            gl.useProgram(this.program);

            // Set up geometry (full screen quad)
            const positions = new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                1, 1
            ]);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(this.program, 'position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // Get uniform locations
            this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
            this.timeLocation = gl.getUniformLocation(this.program, 'time');
        }

        compileShader(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }

        render() {
            if (!this.gl || !this.program) return;

            const gl = this.gl;
            this.time++;

            // Set uniforms
            gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
            gl.uniform1f(this.timeLocation, this.time);

            // Draw
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            this.animationFrame = requestAnimationFrame(() => this.render());
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

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new GradientBackground();
        });
    } else {
        new GradientBackground();
    }
})();
