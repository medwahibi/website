
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    if (cursorDot) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });
        document.querySelectorAll('a, button, .nav-tab, .footer-btn, .client-logo').forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
        });
    }

    // 2. Audio Effects
    const hoverAudio = new Audio('./Images needed for home page/button hover.mp3');
    hoverAudio.volume = 0.2;
    const clickAudio = new Audio('./Images needed for home page/button click.mp3');
    clickAudio.volume = 0.4;
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => { hoverAudio.currentTime = 0; hoverAudio.play().catch(()=>{}); });
        el.addEventListener('click', () => { clickAudio.currentTime = 0; clickAudio.play().catch(()=>{}); });
    });

    // 3. Page Transition Curtain
    const transitionCurtain = document.querySelector('.transition-curtain');
    if (transitionCurtain) {
        document.querySelectorAll('a').forEach(anchor => {
            if (anchor.getAttribute('href') && !anchor.getAttribute('href').startsWith('#') && !anchor.getAttribute('href').startsWith('mailto:') && anchor.getAttribute('target') !== '_blank') {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    transitionCurtain.classList.add('active');
                    setTimeout(() => { window.location.href = anchor.getAttribute('href'); }, 400);
                });
            }
        });
    }

    // 4. Mobile Menu Logic (GSAP)
    const menuBtn = document.getElementById('mobileMenuBtn');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    let menuTl;
    
    if (menuBtn && menuOverlay && typeof gsap !== 'undefined') {
        function openMenu() {
            menuBtn.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            menuOverlay.classList.add('open');
            
            if (menuTl) menuTl.kill();
            menuTl = gsap.timeline();

            gsap.set('.menu-flower', { opacity: 0, y: -20, scale: 0.8 });
            gsap.set('.menu-connecting-line', { scaleY: 0, opacity: 0 });
            gsap.set('.mobile-menu-link', { opacity: 0, x: -30 });
            gsap.set('.mobile-menu-sheet', { opacity: 0, y: 50 });
            gsap.set('.mobile-menu-sheet .description', { opacity: 0, y: 10 });
            gsap.set('.mobile-menu-btn-dark, .mobile-menu-btn-lime', { opacity: 0, scale: 0.9 });
            gsap.set('.mobile-menu-socials a', { opacity: 0, y: 10 });

            menuTl.to('.menu-flower', { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.2 })
                  .to('.menu-connecting-line', { scaleY: 1, opacity: 1, duration: 0.6, ease: 'power3.inOut' }, "-=0.3")
                  .to('.mobile-menu-link', { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, "-=0.4")
                  .to('.mobile-menu-sheet', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.3")
                  .to('.mobile-menu-sheet .description', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, "-=0.3")
                  .to('.mobile-menu-btn-dark, .mobile-menu-btn-lime', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.2)' }, "-=0.2")
                  .to('.mobile-menu-socials a', { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, "-=0.2");
        }

        function closeMenu() {
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuOverlay.classList.remove('open');
        }

        menuBtn.addEventListener('click', () => {
            menuBtn.classList.contains('open') ? closeMenu() : openMenu();
        });
        
        menuOverlay.querySelectorAll('.mobile-menu-link, .mobile-menu-btn-dark, .mobile-menu-btn-lime').forEach(link => {
            link.addEventListener('click', () => {
                transitionCurtain.classList.add('active');
                setTimeout(() => { window.location.href = link.getAttribute('href'); }, 400);
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        
        menuOverlay.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
        menuOverlay.addEventListener('wheel', (e) => { e.preventDefault(); }, { passive: false });
    }
});
