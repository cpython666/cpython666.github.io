(function () {
    const STORAGE_KEY = 'cpython666:disable-fireworks';
    const CHANGE_EVENT = 'cpython666-effects-change';
    let canvasEl = null;
    let clickHandler = null;
    let resizeHandler = null;
    let render = null;

    function getFireworksDisabled() {
        try {
            return localStorage.getItem(STORAGE_KEY) === '1';
        } catch (error) {
            return false;
        }
    }

    function cleanupFirework() {
        if (clickHandler) {
            document.removeEventListener('mousedown', clickHandler, false);
            clickHandler = null;
        }

        if (resizeHandler) {
            window.removeEventListener('resize', resizeHandler, false);
            resizeHandler = null;
        }

        if (render && typeof render.pause === 'function') {
            render.pause();
        }
        render = null;

        if (canvasEl && canvasEl.parentNode) {
            canvasEl.parentNode.removeChild(canvasEl);
        }
        canvasEl = null;
    }

    function initfirework() {
        cleanupFirework();

        if (getFireworksDisabled() || typeof anime === 'undefined') {
            return;
        }

        const activeCanvas = document.createElement('canvas');
        activeCanvas.className = 'fireworks';
        activeCanvas.style = 'position:fixed;left:0;top:0;z-index:99999999;pointer-events:none;';
        document.body.appendChild(activeCanvas);
        canvasEl = activeCanvas;

        const ctx = activeCanvas.getContext('2d');
        const numberOfParticules = 30;
        const tap = 'mousedown';
        const colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
        let pointerX = 0;
        let pointerY = 0;

        function updateCoords(e) {
            const point = e.touches ? e.touches[0] : e;
            pointerX = point.clientX - activeCanvas.getBoundingClientRect().left;
            pointerY = point.clientY - activeCanvas.getBoundingClientRect().top;
        }

        function setParticuleDirection(e) {
            var t = anime.random(0, 360) * Math.PI / 180,
                a = anime.random(50, 180),
                n = [-1, 1][anime.random(0, 1)] * a;
            return {
                x: e.x + n * Math.cos(t),
                y: e.y + n * Math.sin(t)
            };
        }

        function createParticule(e, t) {
            var a = {};
            a.x = e;
            a.y = t;
            a.color = colors[anime.random(0, colors.length - 1)];
            a.radius = anime.random(16, 32);
            a.endPos = setParticuleDirection(a);
            a.draw = function () {
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true);
                ctx.fillStyle = a.color;
                ctx.fill();
            };
            return a;
        }

        function createCircle(e, t) {
            var a = {};
            a.x = e;
            a.y = t;
            a.color = '#F00';
            a.radius = .1;
            a.alpha = .5;
            a.lineWidth = 6;
            a.draw = function () {
                ctx.globalAlpha = a.alpha;
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true);
                ctx.lineWidth = a.lineWidth;
                ctx.strokeStyle = a.color;
                ctx.stroke();
                ctx.globalAlpha = 1;
            };
            return a;
        }

        function renderParticule(e) {
            for (var t = 0; t < e.animatables.length; t++) {
                e.animatables[t].target.draw();
            }
        }

        function animateParticules(e, t) {
            for (var a = createCircle(e, t), n = [], i = 0; i < numberOfParticules; i++) {
                n.push(createParticule(e, t));
            }
            anime.timeline().add({
                targets: n,
                x: function (e) {
                    return e.endPos.x;
                },
                y: function (e) {
                    return e.endPos.y;
                },
                radius: .1,
                duration: anime.random(1200, 1800),
                easing: 'easeOutExpo',
                update: renderParticule
            }).add({
                targets: a,
                radius: anime.random(80, 160),
                lineWidth: 0,
                alpha: {
                    value: 0,
                    easing: 'linear',
                    duration: anime.random(600, 800)
                },
                duration: anime.random(1200, 1800),
                easing: 'easeOutExpo',
                update: renderParticule,
                offset: 0
            });
        }

        function debounce(fn, delay) {
            var timer;
            return function () {
                var context = this;
                var args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        }

        const setCanvasSize = debounce(function () {
            activeCanvas.width = 2 * window.innerWidth;
            activeCanvas.height = 2 * window.innerHeight;
            activeCanvas.style.width = window.innerWidth + 'px';
            activeCanvas.style.height = window.innerHeight + 'px';
            activeCanvas.getContext('2d').scale(2, 2);
        }, 500);

        render = anime({
            duration: Infinity,
            update: function () {
                ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
            }
        });

        clickHandler = function (e) {
            if (
                getFireworksDisabled() ||
                e.target.id === 'sidebar' ||
                e.target.id === 'toggle-sidebar' ||
                e.target.nodeName === 'A' ||
                e.target.nodeName === 'IMG'
            ) {
                return;
            }

            render.play();
            updateCoords(e);
            animateParticules(pointerX, pointerY);
        };
        resizeHandler = setCanvasSize;

        document.addEventListener(tap, clickHandler, false);
        setCanvasSize();
        window.addEventListener('resize', resizeHandler, false);
    }

    function applyFireworkSetting() {
        if (getFireworksDisabled()) {
            cleanupFirework();
            return;
        }

        if (!canvasEl) {
            initfirework();
        }
    }

    window.CPython666Effects = window.CPython666Effects || {};
    window.CPython666Effects.applyFireworkSetting = applyFireworkSetting;
    window.CPython666Effects.isFireworksDisabled = getFireworksDisabled;

    window.addEventListener(CHANGE_EVENT, applyFireworkSetting);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initfirework);
    } else {
        initfirework();
    }
})();
