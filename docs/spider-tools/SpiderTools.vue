<template>
	<div id="app">
		<div class="navbar">
			<ul>
				<a v-for="item in toolList" :href="'#'+item.pageId">
					<li @click="selectPanel(item)">{{ item.name }}</li>
				</a>
			</ul>
		</div>
		<div class="panel">
			<div v-show="curPageId === 'url'">
				<PanelUrl />
			</div>
			<div v-show="curPageId === 'base64'">
				<PanelBase64 />
			</div>
			<div v-show="curPageId === 'aaencode'">
				<PanelAaencode />
			</div>
			<div v-show="curPageId === 'jjencode'">
				<PanelJjencode />
			</div>
			<div v-show="curPageId === 'imagesplit'">
				<PanelImagesplit />
			</div>
			
			<div v-show="curPageId === 'md5'" class="md5-panel">
				<!-- MD5 面板 -->
				<h3>MD5</h3>
				<!-- 在这里添加 MD5 相关的功能 -->
			</div>
			<!-- 其他面板 -->
		</div>
	</div>
</template>

<script setup>

import PanelBase64 from './components/PanelBase64.vue'
import PanelUrl from './components/PanelUrl.vue'
import PanelAaencode from './components/PanelAaencode.vue'
import PanelJjencode from './components/PanelJjencode.vue'
import PanelImagesplit from './components/PanelImagesplit.vue'
import { ref ,onMounted } from 'vue'

const curPageId = ref('aaencode')
// 获取 URL 的 hash 部分（即锚点）
onMounted(() => {
  // 客户端特定代码，使用 window 对象
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      curPageId.value = hash
    }
  }
})

const toolList = ref([
	{
		name: 'URL编码解码',
		pageId: 'url'
	},
	{
		name: 'Base64编码解码',
		pageId: 'base64'
	},
	{
		name: 'AAencode编码解码',
		pageId: 'aaencode'
	},
	{
		name: 'JJencode编码解码',
		pageId: 'jjencode'
	},
	{
		name: '图片分割',
		pageId: 'imagesplit'
	},
	{
		name: 'MD5加密',
		pageId: 'md5'
		
	},
	{
		name: 'json格式化',
		pageId: 'json'
	},
	{
		name: 'header格式化',
		pageId: 'header'
	},
	
])

function selectPanel(item) {
	curPageId.value = item.pageId;
}
</script>

<style scoped>

#app {
	margin-top: 20px;
	display: flex;
	width: 90%;
}
a{
	text-decoration: none;
	color: black;
}
ul {
	list-style: none;
}
li{
	padding: 3px 5px;
	background-color: aliceblue;
	transition: all 0.3s ease;
}
li:hover{
	/* cursor: pointer; */
	transform: scale(1.05);
	background-color: aquamarine;
}
.panel {
	margin-left: 20px;
	width: 80%;
}
</style>