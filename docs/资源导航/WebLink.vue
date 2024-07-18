<template>
  <div class="navigation">
    <div v-for="(category, index) in categories" :key="index" class="category">
      <div class="title-box">
        <div class="h2" :id="category.title">{{ category.title }}</div>
      </div>
      <div class="sites">
        <div v-for="(site, sIndex) in category.items" :key="sIndex" class="site"
             @mouseover="site.showTooltip = true" @mouseleave="site.showTooltip = false">
          <div class="card" :title="site.desc">
            <a :href="site.link" class="site-link" target="_blank">
              <div class="card-head">
                <img :src="site.icon" class="site-icon" :alt="site.title">
                <div class="h4">{{ site.title }}</div>
                <label class="toggle">
                  <input type="checkbox">
                  <span></span>
                </label>
              </div>
              <div>
                <div class="badge badge-info" v-if="site.doc_link" @click="openNewPage(site.doc_link)">
                  文档->
                </div>
                <div class="badge badge-info" v-for="(category, sIndex) in site.categories">
                  {{ category }}
                </div>
              </div>

              <div class="site-info">
                <div class="desc">{{ site.desc }}</div>
              </div>
            </a>
          </div>
          <div v-show="site.showTooltip" class="tooltip">
            <div class="triangle"></div> <!-- 用于显示三角形指示器 -->
            <div class="content">
              {{ site.desc }}
            </div>
          </div>
        </div>
        <div id="ad" v-if="category.title=='站长推荐'" class="flex-grow justify-center w-100"
             style="display: flex; justify-content: center; align-items: center;">
          <el-link type="primary" href="https://www.qg.net/product/proxyip.html?source=star" target="_blank">
            <img style="width: 450px" src="/imgs/ads/green.jpg"/>
          </el-link>
        </div>
<!--        -->
<!--        <el-link v-if="category.title=='站长推荐'" type="primary" href="https://www.qg.net/product/proxyip.html?source=star" target="_blank">-->
<!--          <img style="width: 450px" src="/imgs/ads/green.jpg"/>-->
<!--        </el-link>-->
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from 'vue';
import {ElLink} from "element-plus";

export default {
  components: {ElLink},
  props: {
    datalist: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const categories = reactive(props.datalist.map(item => ({
      ...item,
      showTooltip: false,
    })));
    const openNewPage = (link) => {
      window.open(link, '_blank');
    }
    return {
      categories,
      openNewPage
    };
  }
};
</script>
<style scoped>
#ad {
    transition: transform 0.3s ease; /* 设置动画效果 */
  margin: 10px 0;
}

#ad:hover {
    transform: scale(1.1); /* 放大图片 */
}
.toggle span {
  display: block;
  width: 20px;
  height: 12px;
  border-radius: 99em;
  background-color: #c1c5cd;
  box-shadow: inset 1px 1px 1px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  transition: 0.15s ease;
}

.toggle span:before {
  content: "";
  display: block;
  position: absolute;
  left: 1.5px;
  top: 1.5px;
  height: 9px;
  width: 9px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
  transition: 0.15s ease;
}

.toggle input {
  clip: rect(0 0 0 0);
  -webkit-clip-path: inset(50%);
  clip-path: inset(50%);
  height: 0.5px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 0.5px;
}

.toggle input:checked + span {
  background-color: #434ce8;
}

.toggle input:checked + span:before {
  transform: translateX(calc(100% - 1px));
}

.toggle input:focus + span {
  box-shadow: 0 0 0 2px #ecf3fe;
}

.toggle {
  transform: scale(1.5);
}

.toggle:hover {
  transform: scale(2);
}


.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  margin: 0 0.25em;
  font-size: 50%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.badge-primary {
  color: #fff;
  background-color: #007bff;
}

.badge-info {
  color: #fff;
  background-color: #17a2b8;
}

button {
  padding: 5px 8px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-color: #0056b3;
}

.title-box {
  display: flex;
}

.desc {
  text-indent: 2em;
  width: 100%;
  font-size: 12px;
  line-height: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* 设置显示的行数 */
  -webkit-line-clamp: 2;
}

.tooltip {
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 2px 3px;
  width: 100%;
  border-radius: 1rem;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 三角形指示器样式 */
.triangle {
  position: absolute;
  top: -5px;
  /* 调整三角形位置 */
  left: 50%;
  /* 水平居中 */
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  /* 左边透明 */
  border-right: 10px solid transparent;
  /* 右边透明 */
  border-bottom: 10px solid #333;
  /* 底部为背景色，即三角形 */
}

.content {
  font-size: 12px;
  line-height: 14px;
  padding: 3px 2px;
  /* 调整内容位置，避免与三角形重叠 */
  z-index: 999;
}

img {
  transition: height 0.3s ease-in-out;
}

.card {
  width: 100%;
}

.navigation .h2 {
  font-size: 24px;
  font-weight: 500;

}

.h4 {
  font-size: 15px;
  font-weight: 500;
}

p {
  font-size: 10px;
}

.navigation {
  display: flex;
  flex-direction: column;
}

.category {
  margin-bottom: 5px;
}

.sites {
  display: flex;
  flex-wrap: wrap;
  z-index: -1;
}

.site {
  width: 175px;
  margin: 6px 6px 6px 12px;
  padding: 8px;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem #FFFFFF;
  border-radius: 1rem;

}

.site:hover {
  transform: scale(1.05);

  box-shadow: inset 0.2rem 0.2rem 0.5rem #c8d0e7, inset -0.2rem -0.2rem 0.5rem #FFFFFF;;
}

.site-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.card-head {
  width: 100%;
  display: flex;
  font-size: 14px;
  justify-content: space-around;
  align-items: center;
}

.site-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 2px;
}

.site-info {
  display: flex;
  flex-direction: column;
}

.site-info h4 {
  margin: 0;
}

.site-info p {
  margin: 5px 0;
}
</style>