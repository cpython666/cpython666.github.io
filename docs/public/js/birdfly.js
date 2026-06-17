(function () {
    const STORAGE_KEY = 'cpython666:disable-birdfly';
    const CHANGE_EVENT = 'cpython666-effects-change';
    let birds = [];
    let animationId = null;

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

        birds.forEach(function (bird) {
            if (bird.parentNode) {
                bird.parentNode.removeChild(bird);
            }
        });
        birds = [];
    }

    function createBirdElement(src) {
        const bird = document.createElement('img');
        bird.src = src;
        bird.style.position = 'fixed';
        bird.style.zIndex = 5;
        bird.style.width = '50px';
        bird.style.height = 'auto';
        bird.dataset.effectName = 'birdfly';
        return bird;
    }

    function initBirdFly() {
        cleanupBirdFly();

        if (getBirdFlyDisabled()) {
            return;
        }

        const birdCount = 5;
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;
        const targetLeft = -50;
        const speed = 1;

        for (let i = 0; i < birdCount; i++) {
            const bird = createBirdElement('/imgs/birdfly.gif');
            birds.push(bird);
            document.body.appendChild(bird);
        }

        const smallBird = createBirdElement('/imgs/bird2.gif');
        smallBird.style.width = '16px';
        birds.push(smallBird);
        document.body.appendChild(smallBird);

        birds.forEach(function (bird, index) {
            if (index <= 2) {
                bird.style.top = `${20 + (index + 1) * 30}px`;
            } else {
                bird.style.top = `${Math.random() * (pageHeight - 50)}px`;
            }
            bird.style.left = `${pageWidth + (index + 1) * 30}px`;
        });

        function animate() {
            if (getBirdFlyDisabled()) {
                cleanupBirdFly();
                return;
            }

            birds.forEach(function (bird) {
                const currentLeft = parseFloat(bird.style.left);

                if (currentLeft <= targetLeft) {
                    bird.style.top = `${Math.random() * (pageHeight - 50)}px`;
                    bird.style.left = `${pageWidth}px`;
                } else {
                    bird.style.left = `${currentLeft - speed}px`;
                }
            });

            animationId = requestAnimationFrame(animate);
        }

        animate();
    }

    function applyBirdFlySetting() {
        if (getBirdFlyDisabled()) {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBirdFly);
    } else {
        initBirdFly();
    }
})();
