<template>
  <div class="section-container">
    <section id="first-section">

      <div id="bg" :style="{ backgroundImage: `url(${randomImage})` }">

      </div>

      <div id="big-bg">
        <div id="bg-overlay" :class="{ 'rotate-animation': randomImage === 'imgs/bg/small_videos.png' }"
             :style="{ backgroundImage: `url(${randomImage})` }">
          <!-- 背景部分 -->
        </div>
        <div class="content">
          <div style="cursor: pointer" @click="openLink">
            <img id="index-logo" alt="星梦起航，点击跳转～" src="/logo.jpg">
          </div>
          <div id="box-cursor">
            <span id="box"></span>
          </div>
        </div>
      </div>
    </section>
    <section>
    </section>

  </div>

</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import Typed from 'typed.js';
// 响应式数据
const randomImage = ref('');
const openLink = () => {
  window.open('http://www.stardream.vip/', '_blank');
};
const changeBgHeight = () => {
  const header = document.querySelector('header');
  const bg = document.querySelector('#bg-overlay');
  console.log(header.clientHeight)

  const headerHeight = header.clientHeight;
  console.log(headerHeight)
  const bg1 = document.querySelector('#bg');
  // bg.style.height = `calc(100vh)`;
  // bg1.style.height = `calc(100vh)`;
  bg.style.height = `calc(100vh - ${headerHeight}px)`;
  bg1.style.height = `calc(100vh - ${headerHeight}px)`;


  console.log('背景图片高度', bg.clientHeight)
}
// 图片列表
const images = [


  'imgs/bg/1.jpeg',
  'imgs/bg/2.jpeg',
  'imgs/bg/3.jpeg',
  'imgs/bg/4.jpeg',

];

// 获取随机图片
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

// 设置随机背景图片
const setRandomBackgroundImage = () => {
  const a = getRandomImage();
  randomImage.value = a;
}
onMounted(
    () => {
      const options = {
        strings: [
          '小欣，今天开心嘛~^2000',
          '小欣，早上好鸭～^2000',
          '勇敢小欣，不怕困难，嘿嘿!^5000',
        ],
        typeSpeed: 150,
        showCursor: true,
        cursorChar: '_🌟',
        loop: true,
        loopCount: 200
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
  /*background-size: 100 auto;*/
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

#bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50px;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
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
  /* 如果有其他样式 */
}

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3; /* 保证文字在最上层 */
  /* 其他文字样式 */
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
</style>