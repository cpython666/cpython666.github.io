<template>
  <div class="home-page">
    <div id="big-bg" :style="{ backgroundImage: `url(${randomImage})` }">

    </div>

    <div id="center-div">
      <div id="small-bg" :class="{ 'rotate-animation': randomImage === 'imgs/bg/small_videos.png' }"
           :style="{ backgroundImage: `url(${randomImage})` }">
        <!-- 背景部分 -->
      </div>
      <div class="content">
        <div style="cursor: pointer" @click="openLink">
          <img id="index-logo" alt="星梦起航，点击跳转～" src="/logo_super.svg">
        </div>
        <div id="box-cursor">
          <span id="box" ref="typingBox"></span>
        </div>
      </div>
    </div>

    <sponsors-links/>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import Typed from 'typed.js';
import SponsorsLinks from "./SponsorsLinks.vue";
// 响应式数据
const randomImage = ref('');
const typingBox = ref(null);
let typed;
const openLink = () => {
  window.location.href = '/';
};
const changeBgHeight = () => {
  const header = document.querySelector('header');
  const bg = document.querySelector('#small-bg');
  const bg1 = document.querySelector('#big-bg');
  if (!bg || !bg1) return;
  const headerHeight = header?.clientHeight || 0;
  bg.style.height = `calc(100vh - ${headerHeight}px)`;
  bg1.style.height = `calc(100vh - ${headerHeight}px)`;
}
// 图片列表
const images = [


  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
  'imgs/bg/small_videos.png',
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

  'imgs/bg/small_1.png',
  'imgs/bg/small_2.png',
  'imgs/bg/small_3.png',
  'imgs/bg/small_4.png',
  'imgs/bg/small_5.png',

];

// 获取随机图片
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// 设置随机背景图片
const setRandomBackgroundImage = () => {
  randomImage.value = getRandomImage();
}
onMounted(
    () => {
      const options = {
        strings: [
          "Driven by dreams, not by profit.^2500",
          '漫漫星程，你我同行~^1000',
          '星梦启航，代码笔记。^1000',
          '让学习少走弯路，让工作得心应手!^1000',
          '我于这喧嚣世界寻得`一方净土`，可我却已成净土所厌的喧嚣。^3000',
          '信息互联，资源无限。^1000',
          "一站式导航，学习新体验。^1000",
          "整合推荐，减少信息差。^1000",
          "发现世界，连接资源。^1000",
          "资源一站通，信息无阻挡。^1000",
          "资源连接，个性化待办。^1000",
        ],
        typeSpeed: 150,
        showCursor: true,
        cursorChar: '_🌟',
        loop: true,
        loopCount: 200
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingBox.value.textContent = options.strings[0].replace(/\^\d+/g, '');
      } else {
        typed = new Typed(typingBox.value, options);
      }

      setRandomBackgroundImage()
      changeBgHeight()
      // 监听窗口大小变化事件
      window.addEventListener('resize', changeBgHeight);
    });
onBeforeUnmount(() => {
  typed?.destroy();
  window.removeEventListener('resize', changeBgHeight);
});
</script>

<style scoped>
.home-page {
  position: relative;
  overflow: hidden;
}

#big-bg {
  height: 100vh;
  width: 100%;
  position: absolute;
  justify-content: center;
  align-items: center;
  /* background-image: url('imgs/bg/small_1.jpg'); */
  /* background-image: url('imgs/bg/small_1.jpg'); */
  /* background-image: url('imgs/bg/1.jpg'); */
  /* background-size: cover; */
  /*background-size: 100 auto;*/
  /* background-size: cover; */
  background-position: center;
  background-repeat: no-repeat;

  color: white;
  filter: blur(5px);
  font-size: 36px;
  z-index: 1;
}

#center-div {
  border-radius: 50px;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
  background-size: contain;
  background-position: center;
  color: white;
  font-size: 36px;
  z-index: 2;
  background-repeat: no-repeat;
}

#small-bg {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50px;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-size: contain;
  background-position: center;
  color: white;
  font-size: 36px;
  z-index: 2;
  background-repeat: no-repeat;
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
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

  0%,
  100% {
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

#index-logo {
  width: 100px;
  margin-top: -100px;
  margin-bottom: 20px;
  transition: all ease 0.5s;
  animation: blinkScale 3s infinite;

}

#index-logo:hover {
  animation: blinkScale 1.5s infinite;
}

#box-cursor {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotate-animation {
  animation: rotate 50s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  #index-logo,
  #index-logo:hover,
  .rotate-animation {
    animation: none;
    transition: none;
  }
}
</style>
