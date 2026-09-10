document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error("Three.js is requested but not loaded.");
        return;
    }

    /* ========================
       1. DATA & DOM ELEMENTS
       ======================== */
    const PROJECTS = [
        { title: 'SociaLUXE',        category: 'Social Media Design',    link: './social-media-design.html'  },
        { title: 'OKSA',              category: 'Logo Design',            link: './oksa.html'                  },
        { title: 'Menu Design',       category: 'Menu Design',            link: './menu-design.html'           },
        { title: 'Banners & Flyers',  category: 'Outdoor Advertising',    link: './banners-design.html'        },
        { title: 'Brand Guidelines',  category: 'Brand Identity',         link: './brand-guidelines.html'      },
        { title: 'Illustrations',     category: 'Digital Art',            link: './illustrations.html'         },
        { title: 'Web Design',        category: 'UI / UX',               link: './websites-design.html'       }
    ];
    const TOTAL = PROJECTS.length;

    const slides    = document.querySelectorAll('.gd-stage-slide');
    const thumbs    = document.querySelectorAll('.gd-thumb');
    const counter   = document.getElementById('gd-counter');
    const titleEl   = document.getElementById('gd-title');
    const catEl     = document.getElementById('gd-category');
    const linkEl    = document.getElementById('gd-link');
    const progress  = document.getElementById('gd-progress');
    const prevBtn   = document.getElementById('gd-prev');
    const nextBtn   = document.getElementById('gd-next');
    
    let currentSlide = -1;
    let animating = false;

    /* ========================
       2. THREE.JS SETUP
       ======================== */
    const container = document.getElementById('planet-canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    // Move camera to a good viewing angle
    camera.position.set(0, 80, 250);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none'; // so we can drag the canvas
    container.appendChild(labelRenderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 150;
    controls.maxDistance = 400;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(100, 50, 100);
    scene.add(dirLight);
    
    const fillLight = new THREE.DirectionalLight(0x90b0d0, 0.5);
    fillLight.position.set(-100, -50, -100);
    scene.add(fillLight);

    /* ========================
       3. PROCEDURAL TEXTURE
       ======================== */
    function createJupiterTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base gradient
        const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, "#C9A786");
        grd.addColorStop(0.2, "#D4B99D");
        grd.addColorStop(0.4, "#A17C5B");
        grd.addColorStop(0.5, "#E2CBB0");
        grd.addColorStop(0.7, "#A17C5B");
        grd.addColorStop(1, "#866547");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noisy bands
        for(let i = 0; i < 200; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
            ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 20);
            ctx.fillStyle = `rgba(100, 60, 20, ${Math.random() * 0.05})`;
            ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 15);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return texture;
    }

    /* ========================
       4. CREATING THE PLANET
       ======================== */
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Planet sphere
    const sphereGeo = new THREE.SphereGeometry(40, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
        map: createJupiterTexture(),
        roughness: 0.7,
        metalness: 0.1
    });
    const planet = new THREE.Mesh(sphereGeo, sphereMat);
    planetGroup.add(planet);

    // Planet Rings
    const ringGeo = new THREE.RingGeometry(55, 80, 128);
    // using pos & uv to create striped rings
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0xddcbb1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        wireframe: true // Looks cool and structural
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    planetGroup.add(ring);

    // Minor decorative outer ring
    const outerRingGeo = new THREE.TorusGeometry(95, 0.2, 16, 100);
    const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xc4ff00, transparent: true, opacity: 0.3 });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2;
    planetGroup.add(outerRing);

    // Outer ring 2
    const outerRingGeo2 = new THREE.TorusGeometry(120, 0.1, 16, 100);
    const outerRingMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const outerRing2 = new THREE.Mesh(outerRingGeo2, outerRingMat2);
    outerRing2.rotation.x = Math.PI / 2;
    planetGroup.add(outerRing2);

    // Adding some dust particles around the planet
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 1000;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
        const r = 55 + Math.random() * 50;
        const theta = Math.random() * 2 * Math.PI;
        dustPositions[i*3] = r * Math.cos(theta);
        dustPositions[i*3+1] = (Math.random() - 0.5) * 5; // thin disk
        dustPositions[i*3+2] = r * Math.sin(theta);
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({ color: 0xffeebb, size: 0.5, transparent: true, opacity: 0.6 });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    planetGroup.add(dust);

    /* ========================
       5. CSS2D OBJECTS (THUMBNAILS)
       ======================== */
    // Ensure thumbnails have pointer-events to receive clicks
    const thumbObjects = [];
    const radius = 120; // Orbit distance matches outerRing2

    // We will place them in a rotating group so we can manually rotate the group or rely on camera orbit
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    thumbs.forEach((thumbEl, i) => {
        // Create CSS2D Object
        thumbEl.style.display = 'block'; // Ensure it's not hidden
        thumbEl.style.pointerEvents = 'auto'; // allow clicking

        const cssObject = new THREE.CSS2DObject(thumbEl);
        
        // Calculate angle (evenly spaced)
        const angle = (i / TOTAL) * Math.PI * 2;
        cssObject.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
        
        // Store index for referencing
        cssObject.userData = { index: i, angle: angle };
        thumbObjects.push(cssObject);
        orbitGroup.add(cssObject);
        
        // click event to center this object
        thumbEl.addEventListener('click', () => {
            // Calculate how much we need to rotate the orbitGroup to bring this object to the front (angle = Math.PI/2)
            const targetRotation = Math.PI/2 - angle;
            // Find closest equivalent rotation
            let currentRot = orbitGroup.rotation.y;
            let currentMod = currentRot % (Math.PI*2);
            let diff = targetRotation - currentMod;
            if (diff > Math.PI) diff -= Math.PI*2;
            if (diff < -Math.PI) diff += Math.PI*2;
            
            gsap.to(orbitGroup.rotation, {
                y: currentRot + diff,
                duration: 1.2,
                ease: 'power3.out'
            });
            
            // Also move camera to default height so it's looking at the front nicely
            gsap.to(camera.position, {
                x: 0,
                y: 80,
                z: 250,
                duration: 1.2,
                ease: 'power2.out'
            });
            
            goToSlide(i, true);
        });
    });

    // Tilt the overall system slightly for a cool 3D perspective
    orbitGroup.rotation.x = -0.1;
    planetGroup.rotation.x = 0.1;
    planetGroup.rotation.z = -0.1;

    /* ========================
       6. SLIDE LOGIC / GSAP
       ======================== */
    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function updateProgress(idx) {
        const pct = ((idx + 1) / TOTAL) * 100;
        if (progress) progress.style.width = pct + '%';
    }

    function goToSlide(idx, force = false) {
        if (!force && idx === currentSlide) return;
        if (animating && !force) return;
        animating = true;

        const dir = idx > currentSlide ? 1 : -1;
        
        if (currentSlide >= 0) {
            const outSlide = slides[currentSlide];
            thumbs[currentSlide].classList.remove('active');
            
            gsap.to(outSlide, {
                opacity: 0,
                scale: 0.95,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    outSlide.classList.remove('active');
                    gsap.set(outSlide, { scale: 1 });
                }
            });
        }

        const inSlide = slides[idx];
        thumbs[idx].classList.add('active');
        
        gsap.set(inSlide, { opacity: 0, scale: 1.05 });
        inSlide.classList.add('active');
        gsap.to(inSlide, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            delay: currentSlide >= 0 ? 0.2 : 0,
            onComplete: () => { animating = false; }
        });

        // Animate info text
        const infoEls = [counter, titleEl, catEl, linkEl];
        gsap.fromTo(infoEls, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.3, stagger: 0.05, ease: 'power2.out' });

        const p = PROJECTS[idx];
        counter.textContent = pad(idx + 1) + ' / ' + pad(TOTAL);
        titleEl.textContent = p.title;
        catEl.textContent   = p.category;
        linkEl.href         = p.link;

        updateProgress(idx);
        currentSlide = idx;
    }

    /* ========================
       7. ACTIVE ITEM DETECTION
       ======================== */
    // We want the item that is closest to the camera to be automatically set active IF we are dragging.
    // Instead of using camera distance, since objects are in an orbit, we can find the one with the maximum Z in WORLD space.
    const worldPos = new THREE.Vector3();
    const cameraPos = new THREE.Vector3();

    function updateActiveItem() {
        if (animating) return; // Prevent spamming slide changes when auto-rotating via click
        
        camera.getWorldPosition(cameraPos);
        let closestIdx = -1;
        let minDist = Infinity;

        thumbObjects.forEach((cssObj) => {
            cssObj.getWorldPosition(worldPos);
            const dist = worldPos.distanceTo(cameraPos);
            if (dist < minDist) {
                minDist = dist;
                closestIdx = cssObj.userData.index;
            }
        });

        if (closestIdx !== -1 && closestIdx !== currentSlide) {
            goToSlide(closestIdx);
        }
    }

    /* ========================
       8. ANIMATION LOOP
       ======================== */
    let lastTime = performance.now();
    
    // Auto rotation vars
    let isDragging = false;
    controls.addEventListener('start', () => isDragging = true);
    controls.addEventListener('end', () => isDragging = false);

    function animate() {
        requestAnimationFrame(animate);
        
        const time = performance.now();
        const delta = (time - lastTime) / 1000;
        lastTime = time;

        controls.update();

        // Slowly rotate planet and orbit if not dragging
        if (!isDragging) {
            planetGroup.rotation.y += 0.05 * delta;
            orbitGroup.rotation.y += 0.02 * delta; // Auto orbit
            dust.rotation.y -= 0.01 * delta;
        }

        // Only auto-update active item based on distance if we are actively rotating or letting it auto-rotate, 
        // to keep it dynamic!
        updateActiveItem();

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    
    // Start logic
    animate();
    
    // Small timeout to allow GSAP entrance animations from main html page to finish
    // then initialize the first slide (which is mostly guaranteed to be 0 at initial camera setup)
    setTimeout(() => {
        if (currentSlide === -1) {
            goToSlide(0);
        }
    }, 500);

    /* ========================
       9. RESIZE HANDLER
       ======================== */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ========================
       10. NAVIGATION BUTTONS
       ======================== */
    prevBtn?.addEventListener('click', () => {
        const idx = (currentSlide - 1 + TOTAL) % TOTAL;
        thumbs[idx].click(); // Simulate clicking thumb to rotate nicely
    });
    nextBtn?.addEventListener('click', () => {
        const idx = (currentSlide + 1) % TOTAL;
        thumbs[idx].click();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const idx = (currentSlide + 1) % TOTAL;
            thumbs[idx].click();
        }
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp') {
            const idx = (currentSlide - 1 + TOTAL) % TOTAL;
            thumbs[idx].click();
        }
    });
    
    let wheelCooldown = false;
    container.addEventListener('wheel', (e) => {
        if (wheelCooldown) return;
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 900);
        if (e.deltaY > 0) {
            const idx = (currentSlide + 1) % TOTAL;
            thumbs[idx].click();
        } else {
            const idx = (currentSlide - 1 + TOTAL) % TOTAL;
            thumbs[idx].click();
        }
    }, { passive: true }); // using passive true since we don't preventdefault

});
