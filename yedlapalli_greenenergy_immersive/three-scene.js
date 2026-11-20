
/* ==========================================
   YEDLAPALLI GREENENERGY
   THREE.JS IMMERSIVE SOLAR EXPERIENCE
========================================== */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


const canvas = document.querySelector("#energy-scene");

if (canvas) {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer;

    try {

        // ==================================
        // 1. SCENE AND CAMERA
        // ==================================

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            42,
            1,
            0.1,
            100
        );

        camera.position.set(0, 5.2, 15.5);
        camera.lookAt(0, 0.5, 0);


        // ==================================
        // 2. RENDERER
        // ==================================

        renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 1.6)
        );

        renderer.outputColorSpace = THREE.SRGBColorSpace;


        // ==================================
        // 3. LIGHTING
        // ==================================

        scene.add(
            new THREE.HemisphereLight(
                0xd8ffe5,
                0x10271d,
                2
            )
        );

        const sunlight = new THREE.DirectionalLight(
            0xd2ff9e,
            3
        );

        sunlight.position.set(-5, 8, 6);
        scene.add(sunlight);


        // ==================================
        // 4. MAIN SOLAR FIELD
        // ==================================

        const solarField = new THREE.Group();
        scene.add(solarField);

        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(35, 26),
            new THREE.MeshStandardMaterial({
                color: 0x0b3025,
                roughness: 0.9,
                metalness: 0.1
            })
        );

        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1.25;

        solarField.add(ground);


        // ==================================
        // 5. SOLAR PANEL MATERIALS
        // ==================================

        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x174b68,
            metalness: 0.7,
            roughness: 0.25,
            side: THREE.DoubleSide
        });

        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x9bb9a5,
            metalness: 0.75,
            roughness: 0.3
        });

        const panels = new THREE.Group();
        solarField.add(panels);

        const panelGeometry = new THREE.BoxGeometry(
            1.42,
            0.07,
            0.88
        );

        const legGeometry = new THREE.BoxGeometry(
            0.055,
            0.55,
            0.055
        );

        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x80c9d0,
            transparent: true,
            opacity: 0.65
        });


        // ==================================
        // 6. BUILD SOLAR PANELS
        // ==================================

        for (let row = 0; row < 4; row++) {

            for (let col = 0; col < 5; col++) {

                const panel = new THREE.Group();

                const surface = new THREE.Mesh(
                    panelGeometry,
                    panelMaterial
                );

                surface.position.y = 0.55;
                panel.add(surface);


                // Vertical grid lines
                for (let x = -0.48; x <= 0.49; x += 0.32) {

                    const geometry = new THREE.BufferGeometry()
                        .setFromPoints([
                            new THREE.Vector3(x, 0.592, -0.4),
                            new THREE.Vector3(x, 0.592, 0.4)
                        ]);

                    panel.add(
                        new THREE.Line(geometry, gridMaterial)
                    );
                }


                // Horizontal grid lines
                for (let z = -0.25; z <= 0.26; z += 0.25) {

                    const geometry = new THREE.BufferGeometry()
                        .setFromPoints([
                            new THREE.Vector3(-0.68, 0.592, z),
                            new THREE.Vector3(0.68, 0.592, z)
                        ]);

                    panel.add(
                        new THREE.Line(geometry, gridMaterial)
                    );
                }


                // Panel support
                const leg = new THREE.Mesh(
                    legGeometry,
                    frameMaterial
                );

                leg.position.set(0, 0.25, 0);
                panel.add(leg);


                panel.position.set(
                    (col - 2) * 1.62,
                    -0.65,
                    (row - 1.5) * 1.35
                );

                panel.rotation.x = -0.23;

                panels.add(panel);
            }
        }


        // ==================================
        // 7. GLOWING SUN
        // ==================================

        const sunGroup = new THREE.Group();

        sunGroup.position.set(4.7, 3.25, -1.2);
        solarField.add(sunGroup);

        const sun = new THREE.Mesh(
            new THREE.SphereGeometry(0.72, 48, 48),
            new THREE.MeshBasicMaterial({
                color: 0xcaff72
            })
        );

        sunGroup.add(sun);


        // Sunlight glow
        const sunGlow = new THREE.PointLight(
            0x9dff75,
            20,
            16
        );

        sunGroup.add(sunGlow);


        // Outer halo
        const halo = new THREE.Mesh(
            new THREE.TorusGeometry(1.02, 0.015, 8, 100),
            new THREE.MeshBasicMaterial({
                color: 0xcaff72,
                transparent: true,
                opacity: 0.8
            })
        );

        halo.rotation.x = 0.9;
        sunGroup.add(halo);


        // ==================================
        // 8. ORBITAL ENERGY RINGS
        // ==================================

        const orbits = [];

        for (let i = 0; i < 3; i++) {

            const orbit = new THREE.Mesh(
                new THREE.TorusGeometry(
                    2.1 + i * 0.48,
                    0.009,
                    6,
                    120
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x8ce9a8,
                    transparent: true,
                    opacity: 0.4
                })
            );

            orbit.rotation.set(
                0.8 + i * 0.16,
                0.2 + i * 0.25,
                0.3
            );

            sunGroup.add(orbit);
            orbits.push(orbit);
        }


        // ==================================
        // 9. FLOATING ENERGY PARTICLES
        // ==================================

        const particleCount = 260;

        const particlePositions = new Float32Array(
            particleCount * 3
        );

        for (let i = 0; i < particleCount; i++) {

            particlePositions[i * 3] =
                (Math.random() - 0.5) * 24;

            particlePositions[i * 3 + 1] =
                Math.random() * 9 - 1;

            particlePositions[i * 3 + 2] =
                (Math.random() - 0.5) * 13 - 2;
        }

        const particleGeometry = new THREE.BufferGeometry();

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3)
        );

        const particles = new THREE.Points(
            particleGeometry,
            new THREE.PointsMaterial({
                color: 0xc8ffb0,
                size: 0.035,
                transparent: true,
                opacity: 0.75,
                sizeAttenuation: true
            })
        );

        scene.add(particles);


        // ==================================
        // 10. MOUSE INTERACTION
        // ==================================

        let pointerX = 0;
        let pointerY = 0;

        function onPointerMove(event) {

            pointerX = (event.clientX / window.innerWidth - 0.5);
            pointerY = (event.clientY / window.innerHeight - 0.5);
        }

        if (!reducedMotion) {

            window.addEventListener(
                "pointermove",
                onPointerMove,
                { passive: true }
            );
        }


        // ==================================
        // 11. RESPONSIVE RESIZING
        // ==================================

        function resizeScene() {

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height, false);
        }

        const resizeObserver = new ResizeObserver(resizeScene);
        resizeObserver.observe(canvas);

        resizeScene();


        // ==================================
        // 12. ANIMATION
        // ==================================

        const clock = new THREE.Clock();

        let animationId = null;
        let isVisible = true;

        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {

                isVisible = entry.isIntersecting;

                if (isVisible && !reducedMotion) {
                    startAnimation();
                } else {
                    stopAnimation();
                }

                if (reducedMotion && isVisible) {
                    renderer.render(scene, camera);
                }
            },
            { threshold: 0 }
        );

        visibilityObserver.observe(canvas);


        function animate() {

            if (!isVisible || document.hidden) {
                animationId = null;
                return;
            }

            animationId = requestAnimationFrame(animate);

            const time = clock.getElapsedTime();


            // Gentle solar panel movement
            panels.rotation.y = Math.sin(time * 0.16) * 0.035;


            // Interactive scene movement
            solarField.rotation.y =
                pointerX * 0.07 + Math.sin(time * 0.12) * 0.02;

            solarField.rotation.x = -pointerY * 0.025;


            // Floating sun
            sunGroup.position.y =
                3.25 + Math.sin(time * 0.8) * 0.09;


            // Energy orbit movement
            orbits.forEach((orbit, index) => {

                orbit.rotation.z =
                    0.3 + time * (0.08 + index * 0.025);
            });


            // Particle movement
            particles.rotation.y = time * 0.012;


            renderer.render(scene, camera);
        }


        function startAnimation() {

            if (
                reducedMotion ||
                document.hidden ||
                !isVisible ||
                animationId !== null
            ) return;

            animationId = requestAnimationFrame(animate);
        }


        function stopAnimation() {

            if (animationId !== null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }


        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {
                stopAnimation();
            } else if (isVisible && !reducedMotion) {
                startAnimation();
            }
        });


        // Initial render
        renderer.render(scene, camera);

        if (!reducedMotion) {
            startAnimation();
        }


    } catch (error) {

        console.error("Three.js scene could not load:", error);

        canvas.style.display = "none";
    }
}
