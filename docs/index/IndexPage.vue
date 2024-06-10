<template>
	<div>
		<div id="bg" :style="{ backgroundImage: `url(${randomImage})` }">

		</div>

		<div id="big-bg" :style="{ backgroundImage: `url(${randomImage})` }">
			<div>
			<img id="index-logo" src="/logo.png">
			</div>
			<div id="box-cursor">
				<span id="box"></span>

			</div>

		</div>
	</div>

</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Typed from 'typed.js';
// 响应式数据
const randomImage = ref('');
const changeBgHeight = () => {
	const header = document.querySelector('header');
	const bg = document.querySelector('#big-bg');
	console.log(header.clientHeight)

	const headerHeight = header.clientHeight;
	console.log(headerHeight)
	bg.style.height = `calc(100vh - ${headerHeight}px)`;
	const bg1 = document.querySelector('#bg');
	bg1.style.height = `calc(100vh - ${headerHeight}px)`;


	console.log('背景图片高度', bg.clientHeight)
}
// 图片列表
const images = [
	'imgs/bg/small_1.jpg',
	'imgs/bg/small_4.jpg',
	'imgs/bg/small_5.jpg',
	'imgs/bg/small_6.jpg',
	'imgs/bg/small_7.jpg',
	'imgs/bg/small_8.jpg',
	'imgs/bg/small_9.jpg',
	'imgs/bg/small_10.jpg',
	'imgs/bg/small_11.jpg',
	'imgs/bg/small_12.jpg',
	'imgs/bg/small_13.jpg',
	'imgs/bg/small_14.jpg',
	'imgs/bg/small_15.jpg',
	'imgs/bg/small_16.jpg',
	'imgs/bg/small_17.jpg',
	// 'imgs/bg/small_18.jpg',

	'imgs/bg/small_1.png',
	'imgs/bg/small_2.png',
	'imgs/bg/small_3.png',
	'imgs/bg/small_4.png',
	'imgs/bg/small_5.png',
	
];

// 获取随机图片
const getRandomImage=()=> {
	const randomIndex = Math.floor(Math.random() * images.length);
	return images[randomIndex];
}

// 设置随机背景图片
const setRandomBackgroundImage=()=> {
const a=getRandomImage();
	randomImage.value = a;
	console.log('改变了背景，', randomImage.value)
}
onMounted(
	() => {
		const options = {
			strings: ['漫漫星程，你我同行~^1000', '星梦启航，代码笔记。^1000', '让学习少走弯路，让工作得心应手!^1000', '我于这喧嚣世界寻得`一方净土`，可我却已成净土所厌的喧嚣。^5000',],
			typeSpeed: 150,
			showCursor: true,
			cursorChar: '_🌟',
			loop:true,
			loopCount:2
		};
		new Typed('#box', options);

		setRandomBackgroundImage()
		changeBgHeight()
		// 监听窗口大小变化事件
		window.addEventListener('resize', changeBgHeight);
	});
onBeforeUnmount(() => {
	window.removeEventListener('resize', changeBgHeight);
});
</script>

<style>
/* .vp-doc{
	width:100% !important;
} */
.container {
	padding: 0 !important;
	/* max-width:3000 !important; */
	margin: 0 !important;
}

body::-webkit-scrollbar {
	display: none;
	/* Safari 和 Chrome */
}

* {
	margin: 0;
	padding: 0;
}

#bg {
	height: 100vh;
	width: 100vw;
	position: absolute;
	justify-content: center;
	align-items: center;
	/* background-image: url('imgs/bg/small_1.jpg'); */
	/* background-image: url('imgs/bg/small_1.jpg'); */
	/* background-image: url('imgs/bg/1.jpg'); */
	/* background-size: cover; */
	background-size: 100 auto;
	/* background-size: cover; */
	background-position: center;
	background-repeat: no-repeat;

	color: white;
	filter: blur(5px);
	font-size: 36px;
	z-index: 1;
}

#big-bg {
	border-radius: 50px;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	position: relative;
	justify-content: center;
	align-items: center;
	/* background-image: url('imgs/bg/small_2.png'); */
	/* background-image: url('imgs/bg/small_1.jpg'); */
	/* background-image: url('imgs/bg/1.jpg'); */
	background-size: contain;
	/* background-size: 100% auto; */
	/* background-size: cover; */
	background-position: center;
	color: white;
	font-size: 36px;
	z-index: 2;
	background-repeat: no-repeat;
}


#box {
	position: relative;
	width: auto;
	height: auto;
	border-radius: 20px;
	background: linear-gradient(to right bottom, rgba(162, 158, 158, 0.6), rgba(236, 228, 228, 0.1));
	backdrop-filter: blur(2px);
	box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.2);
	border-top: 1px solid rgba(255, 255, 255, 0.8);
	border-left: 1px solid rgba(255, 255, 255, 0.8);

	height: 55px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 6px 10px;
}

/* 定义闪烁和缩放动画 */
@keyframes blinkScale {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 1));

  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  }
}
#index-logo{
	width: 100px;
	margin-top: -100px;
	margin-bottom: 20px;
	transition: all ease 0.5s;
	animation: blinkScale 3s infinite;

}
#index-logo:hover{
	animation: blinkScale 1.5s infinite;
}
#box-cursor{
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
}
</style>