/**
 * Combined Effects: RGB Glitch + Magnetic Text + Custom Cursor
 * Premium hover interactions for portfolio
 */

(function () {
  'use strict';

  // Check for touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  function init() {
    // Get ALL text elements - both outline and filled versions
    const allTextElements = document.querySelectorAll('.intro__link, .intro__link-web, .intro__link-photo');
    const portraitImage = document.querySelector('.intro__photo');
    const heroSection = document.querySelector('.section.is--intro');

    if (!heroSection || allTextElements.length === 0) return;

    console.log('Found text elements:', allTextElements.length);

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
      .magnetic-text {
        display: inline-block;
        transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
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
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }

      @keyframes glitch-2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(2px, 2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(-2px, 2px); }
      }

      .glitch-image.active {
        animation: image-glitch 0.2s steps(2, end) infinite;
        filter: contrast(1.2) saturate(1.3);
      }

      @keyframes image-glitch {
        0%, 100% {
          transform: translate(0);
          filter: contrast(1.2) saturate(1.3) hue-rotate(0deg);
        }
        33% {
          transform: translate(2px, -2px);
          filter: contrast(1.3) saturate(1.5) hue-rotate(5deg);
        }
        67% {
          transform: translate(-2px, 2px);
          filter: contrast(1.1) saturate(1.2) hue-rotate(-5deg);
        }
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

    // Setup effects on heading wrappers to avoid pointer-events issues
    const headingWrappers = document.querySelectorAll('.heading-outline__wrapper');
    console.log('Found heading wrappers:', headingWrappers.length);

    headingWrappers.forEach((wrapper, index) => {
      // Get all text links within this wrapper
      const textLinks = wrapper.querySelectorAll('.intro__link, .intro__link-web, .intro__link-photo');
      console.log(`Wrapper ${index} has ${textLinks.length} text elements`);

      // Process each text link
      textLinks.forEach(element => {
        const text = element.textContent.trim();
        if (!text) return;

        element.setAttribute('data-text', text);
        element.classList.add('glitch-text', 'magnetic-text');

        // Split text into characters
        const chars = text.split('');
        element.innerHTML = chars.map(char =>
          `<span class="magnetic-char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
      });

      // Add magnetic effect to the wrapper (handles all text inside)
      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Get all magnetic chars in this wrapper
        const allChars = wrapper.querySelectorAll('.magnetic-char');

        allChars.forEach((char) => {
          const charRect = char.getBoundingClientRect();
          const charX = charRect.left - rect.left + charRect.width / 2;
          const charY = charRect.top - rect.top + charRect.height / 2;

          const deltaX = x - charX;
          const deltaY = y - charY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance < 120) {
            const strength = (120 - distance) / 120;
            const moveX = (deltaX / distance) * strength * 20;
            const moveY = (deltaY / distance) * strength * 20;

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
        const textLinks = wrapper.querySelectorAll('.glitch-text');
        textLinks.forEach(link => link.classList.add('active'));
        cursor.classList.add('hover');
      });

      wrapper.addEventListener('mouseleave', () => {
        const textLinks = wrapper.querySelectorAll('.glitch-text');
        textLinks.forEach(link => link.classList.remove('active'));
        cursor.classList.remove('hover');
      });
    });

    // Portrait glitch effect
    if (portraitImage) {
      portraitImage.classList.add('glitch-image');

      portraitImage.addEventListener('mouseenter', () => {
        portraitImage.classList.add('active');
        cursor.classList.add('hover');
      });

      portraitImage.addEventListener('mouseleave', () => {
        portraitImage.classList.remove('active');
        cursor.classList.remove('hover');
      });
    }

    // Random glitch bursts
    function randomGlitch() {
      const wrappers = document.querySelectorAll('.heading-outline__wrapper');
      if (wrappers.length === 0) return;

      const randomWrapper = wrappers[Math.floor(Math.random() * wrappers.length)];
      const textLinks = randomWrapper.querySelectorAll('.glitch-text');

      textLinks.forEach(link => link.classList.add('active'));
      setTimeout(() => {
        textLinks.forEach(link => link.classList.remove('active'));
      }, 150);

      setTimeout(randomGlitch, 4000 + Math.random() * 6000);
    }
    setTimeout(randomGlitch, 5000);

    console.log('Combined effects initialized: Glitch + Magnetic + Custom Cursor');
  }

  // Initialize after preloader
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 2000));
  } else {
    setTimeout(init, 2000);
  }
})();
