// Green Curtain Transition - Content loads during reveal
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    console.log('🎬 Transition script loaded');

    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP is not loaded!');
        return;
    }

    const transition = document.querySelector('.black-curtain_transition');
    const panel = document.querySelector('.colorpanel-left');

    if (!transition || !panel) {
        console.error('❌ Transition elements not found');
        return;
    }

    console.log('✅ Transition elements found');

    // Set initial state
    gsap.set(panel, { y: '100%' });
    transition.style.display = 'none';

    // Function to play the transition (wave rises, then slides away revealing content)
    function playTransitionOut() {
        console.log('🌊 Starting transition animation');

        // Show transition
        transition.style.display = 'block';
        gsap.set(panel, { y: '100%' });

        const tl = gsap.timeline({
            onComplete: () => {
                // CLEANUP: Hide preloader after transition completes
                console.log('✅ Transition complete - hiding preloader');
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.classList.add('hidden');
                }
                transition.style.display = 'none';
                gsap.set(panel, { y: '100%' });
            }
        });

        // PHASE 1: Wave rises from bottom to cover screen (1.5 seconds)
        tl.to(panel, {
            y: '0%',
            duration: 1.5,
            ease: 'power2.inOut',
            onStart: () => console.log('⬆️ Wave rising to cover screen...'),
            onComplete: () => console.log('✅ Screen covered by wave')
        });

        // PHASE 2: Wave slides up and away, revealing content (1.5 seconds)
        tl.to(panel, {
            y: '-100%',
            duration: 1.5,
            ease: 'power2.inOut',
            onStart: () => console.log('⬆️ Wave sliding away, revealing content...'),
            onComplete: () => console.log('✅ Content revealed!')
        });
    }

    // Function for navigation transitions
    function showTransitionAndNavigate(href) {
        console.log('🔗 Navigation to:', href);
        transition.style.display = 'block';
        gsap.set(panel, { y: '100%' });

        gsap.to(panel, {
            y: '-20%',
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                if (href) window.location.href = href;
            }
        });
    }

    // Export function
    window.playPageTransition = playTransitionOut;
    console.log('✅ Transition ready');

    // Navigation links
    const transitionLinks = document.querySelectorAll('a[href$=".html"]');
    transitionLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                e.preventDefault();
                showTransitionAndNavigate(href);
            }
        });
    });
});
