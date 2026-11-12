(function () {
    const STORAGE_KEY = 'cpython666:disable-birdfly';
    const CHANGE_EVENT = 'cpython666-effects-change';
    if (window.CPython666Effects?.applyBirdFlySetting) {
        window.CPython666Effects.applyBirdFlySetting();
        return;
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let birds = [];
    let animationId = null;
    let resizeHandler = null;

    function getBirdFlyDisabled() {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch (error) {
            return false;
        }
    }

    function cleanupBirdFly() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler);
            resizeHandler = null;
        }
        birds.forEach(function (bird) { bird.element.remove(); });
        birds = [];
    }

    function createBirdElement(src) {
        const bird = document.createElement('img');
        bird.src = src;
        bird.style.position = 'fixed';
        bird.style.top = '0';
        bird.style.left = '0';
        bird.style.pointerEvents = 'none';
        bird.style.zIndex = 5;
        bird.style.width = '50px';
        bird.style.height = 'auto';
        bird.dataset.effectName = 'birdfly';
        bird.alt = '';
        return bird;
    }

    function initBirdFly() {
        cleanupBirdFly();

        if (!document.body || getBirdFlyDisabled() || document.hidden || reducedMotion.matches) {
            return;
        }

        const birdCount = 5;
        let pageWidth = window.innerWidth;
        let pageHeight = window.innerHeight;
        const targetLeft = -50;
        const speed = 60;
        let lastTime = null;

        for (let i = 0; i < birdCount; i++) {
            const bird = createBirdElement('/imgs/birdfly.gif');
            birds.push({ element: bird, x: 0, y: 0 });
            document.body.appendChild(bird);
        }

        const smallBird = createBirdElement('/imgs/bird2.gif');
        smallBird.style.width = '16px';
        birds.push({ element: smallBird, x: 0, y: 0 });
        document.body.appendChild(smallBird);

        birds.forEach(function (bird, index) {
            if (index <= 2) {
                bird.y = Math.min(20 + (index + 1) * 30, Math.max(0, pageHeight - 50));
            } else {
                bird.y = Math.random() * Math.max(0, pageHeight - 50);
            }
            bird.x = pageWidth + (index + 1) * 30;
            bird.element.style.transform = `translate3d(${bird.x}px, ${bird.y}px, 0)`;
        });

        resizeHandler = function () {
            pageWidth = window.innerWidth;
            pageHeight = window.innerHeight;
            birds.forEach(function (bird, index) {
                bird.x = Math.min(bird.x, pageWidth + (index + 1) * 30);
                bird.y = Math.min(bird.y, Math.max(0, pageHeight - 50));
            });
        };
        window.addEventListener('resize', resizeHandler);

        function animate(time) {
            const elapsed = lastTime === null ? 0 : Math.min(time - lastTime, 100) / 1000;
            lastTime = time;
            birds.forEach(function (bird) {
                bird.x -= speed * elapsed;
                if (bird.x <= targetLeft) {
                    bird.y = Math.random() * Math.max(0, pageHeight - 50);
                    bird.x = pageWidth;
                }
                bird.element.style.transform = `translate3d(${bird.x}px, ${bird.y}px, 0)`;
            });

            animationId = requestAnimationFrame(animate);
        }

        animationId = requestAnimationFrame(animate);
    }

    function applyBirdFlySetting() {
        if (getBirdFlyDisabled() || document.hidden || reducedMotion.matches) {
            cleanupBirdFly();
            return;
        }

        if (!birds.length && animationId === null) {
            initBirdFly();
        }
    }

    window.CPython666Effects = window.CPython666Effects || {};
    window.CPython666Effects.applyBirdFlySetting = applyBirdFlySetting;
    window.CPython666Effects.isBirdFlyDisabled = getBirdFlyDisabled;

    window.addEventListener(CHANGE_EVENT, applyBirdFlySetting);
    window.addEventListener('storage', applyBirdFlySetting);
    document.addEventListener('visibilitychange', applyBirdFlySetting);
    reducedMotion.addEventListener('change', applyBirdFlySetting);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBirdFlySetting, { once: true });
    } else {
        applyBirdFlySetting();
    }
})();
