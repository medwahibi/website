/**
 * Premium Effects for Black Minimalist Portfolio
 * RGB Glitch + Magnetic Text + Custom Cursor
 */

(function () {
    'use strict';

    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    function init() {
        const glitchTargets = document.querySelectorAll('.glitch-target');
        const headingWrappers = document.querySelectorAll('.heading-outline__wrapper');

        if (glitchTargets.length === 0) return;

        console.log('Found glitch targets:', glitchTargets.length);

        // Add CSS for all effects
        const style = document.createElement('style');
        style.textContent = `
      /* Custom Cursor */
      body {
        cursor: none;
      }

      .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fda228;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease;
        transform: translate(-50%, -50%);
      }

      .custom-cursor-trail {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(253, 162, 40, 0.5);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        transform: translate(-50%, -50%);
      }

      .custom-cursor.hover {
        width: 60px;
        height: 60px;
        background: rgba(253, 162, 40, 0.3);
        border: 2px solid #fda228;
      }

      /* Magnetic Text */
      .glitch-target {
        display: inline-block;
      }

      .magnetic-char {
        display: inline-block;
        transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
        will-change: transform;
      }

      /* RGB Glitch Effect */
      .glitch-text {
        position: relative;
        display: inline-block;
      }

      .glitch-text::before,
      .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        pointer-events: none;
      }

      .glitch-text.active::before {
        animation: glitch-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
        color: #ff0000;
        z-index: -1;
        opacity: 0.8;
      }

      .glitch-text.active::after {
        animation: glitch-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite reverse;
        color: #00ffff;
        z-index: -2;
        opacity: 0.8;
      }

      @keyframes glitch-1 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-3px, 3px); }
        40% { transform: translate(-3px, -3px); }
        60% { transform: translate(3px, 3px); }
        80% { transform: translate(3px, -3px); }
      }

      @keyframes glitch-2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(3px, -3px); }
        40% { transform: translate(3px, 3px); }
        60% { transform: translate(-3px, -3px); }
        80% { transform: translate(-3px, 3px); }
      }
    `;
        document.head.appendChild(style);

        // Create custom cursor
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorTrail = document.createElement('div');
        cursorTrail.className = 'custom-cursor-trail';
        document.body.appendChild(cursorTrail);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate cursor with smooth follow
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            trailX += (mouseX - trailX) * 0.1;
            trailY += (mouseY - trailY) * 0.1;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Process each glitch target
        glitchTargets.forEach(target => {
            const text = target.textContent.trim();
            if (!text) return;

            target.setAttribute('data-text', text);
            target.classList.add('glitch-text');

            // Split text into characters
            const chars = text.split('');
            target.innerHTML = chars.map(char =>
                `<span class="magnetic-char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        });

        // Add effects to heading wrappers
        headingWrappers.forEach(wrapper => {
            // Magnetic effect
            wrapper.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const allChars = wrapper.querySelectorAll('.magnetic-char');

                allChars.forEach((char) => {
                    const charRect = char.getBoundingClientRect();
                    const charX = charRect.left - rect.left + charRect.width / 2;
                    const charY = charRect.top - rect.top + charRect.height / 2;

                    const deltaX = x - charX;
                    const deltaY = y - charY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    if (distance < 150) {
                        const strength = (150 - distance) / 150;
                        const moveX = (deltaX / distance) * strength * 25;
                        const moveY = (deltaY / distance) * strength * 25;

                        char.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.15})`;
                    } else {
                        char.style.transform = 'translate(0, 0) scale(1)';
                    }
                });
            });

            wrapper.addEventListener('mouseleave', () => {
                const allChars = wrapper.querySelectorAll('.magnetic-char');
                allChars.forEach(char => {
                    char.style.transform = 'translate(0, 0) scale(1)';
                });
            });

            // Glitch on hover
            wrapper.addEventListener('mouseenter', () => {
                const target = wrapper.querySelector('.glitch-text');
                if (target) target.classList.add('active');
                cursor.classList.add('hover');
            });

            wrapper.addEventListener('mouseleave', () => {
                const target = wrapper.querySelector('.glitch-text');
                if (target) target.classList.remove('active');
                cursor.classList.remove('hover');
            });
        });

        // Random glitch bursts
        function randomGlitch() {
            const randomTarget = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
            if (randomTarget) {
                randomTarget.classList.add('active');
                setTimeout(() => randomTarget.classList.remove('active'), 150);
            }
            setTimeout(randomGlitch, 5000 + Math.random() * 8000);
        }
        setTimeout(randomGlitch, 6000);

        console.log('Premium effects initialized');
    }

    // Initialize after preloader
    window.addEventListener('load', () => {
        setTimeout(init, 2000);
    });
})();
