function todo() {
	window.location.href='https://space.bilibili.com/1909782963'
}
function checkViewport() {
    // 获取浏览器窗口的内部宽高
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    // 获取文档的视图区域宽高
    var viewportWidth = document.documentElement.clientWidth;
    var viewportHeight = document.documentElement.clientHeight;
	// 定义常见的滚动条宽度范围
    var scrollbarWidthThreshold = 30;
	// console.log('窗口尺寸: ' + windowWidth + 'x' + windowHeight);
	// console.log('视图尺寸: ' + viewportWidth + 'x' + viewportHeight);
    // 比较窗口和视图的宽高
    if (windowWidth - viewportWidth > scrollbarWidthThreshold || windowHeight !== viewportHeight) {
        console.log('控制台已打开');
		todo()
    } else {
        console.log('控制台未打开');
    }
}
// 匿名函数：代码被封装在一个立即执行的匿名函数中，以避免污染全局命名空间。
// debugger;语句：当开发者工具打开并在调试模式下运行时，这条语句会触发一个暂停，从而导致代码执行被延迟。如果开发者工具未打开，这条语句几乎不会影响代码执行时间。
// 性能检测：使用performance.now()来获取代码执行的精确时间。
// 定时检查与事件监听：通过setInterval周期性检查，并在窗口大小变化时重新检查，以应对某些浏览器在开发者工具窗口改变大小时可能影响检测结果的情况。
(function() {
    var devtools = { open: false, orientation: null };
    var threshold = 1000;  // 设置一个时间阈值（单位：毫秒）

    function emitEvent(isOpen, orientation) {
        // 这里可以根据实际需求发出警告或进行日志记录
        console.log('开发者工具' + (isOpen ? '打开' : '关闭') + 
                    (orientation ? ' ' + orientation : ''));
		if(isOpen){
			todo()
		}
    }

    var checkDevTools = function() {
        var start = performance.now();
        debugger;
        var end = performance.now();
        if (end - start > threshold) {  // 当执行时间超过阈值时，认为开发者工具是打开的
            if (!devtools.open || devtools.orientation !== window.orientation) {
                emitEvent(true, window.orientation);
                devtools.open = true;
                devtools.orientation = window.orientation;
            }
        } else {
            if (devtools.open) {
                emitEvent(false, null);
                devtools.open = false;
                devtools.orientation = null;
            }
        }
    };

    // 每秒检查一次
    setInterval(checkDevTools, 1000);

    window.addEventListener('resize', function() {
        checkDevTools();
    });
})();


// 检查视图大小的变化
window.addEventListener('resize', checkViewport);
window.addEventListener('load', checkViewport);
checkViewport()

setInterval(eval('(function() {}["constructor"]("debugger")["call"]("action"));'),1000);
