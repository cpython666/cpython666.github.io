<script setup>
import { navigationData } from './data.js';

const scrollToAnchor = (anchor) => {
    const target = document.querySelector(anchor);
    if (target) {
        const navHeight = document.querySelector('header').offsetHeight; // 获取导航栏的高度
        const offset = target.getBoundingClientRect().top - navHeight; // 计算滚动偏移量
        window.scrollTo({ top: offset, behavior: 'smooth' }); // 滚动到目标位置
    }
}

</script>

<template>
	<el-backtop :bottom="100">
		<div style="
        height: 100%;
        width: 100%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      ">
			UP
		</div>
	</el-backtop>
	<div class="page">
		<div class="nav">
			<el-affix :offset="5">
				<el-scrollbar height="100vh" width="100%">
					<el-link type="primary" v-for="(sites, index) in navigationData" :key="index"
						@click="scrollToAnchor('#' + sites.title)" style="width: 100%;">{{ sites.title }}</el-link>
				</el-scrollbar>
			</el-affix>
		</div>
		<div>
			<el-link type="primary" href="https://spiderbox.cn/" target="_blank">资源链接来源于《虫盒》</el-link>
			<WebLink :datalist="navigationData" />
		</div>
	</div>
</template>

<style scoped>
.el-scrollbar {
	overflow: visible !important;
}


.el-link {
	margin-right: 8px;
	text-decoration: none;
}

.el-link .el-icon--right.el-icon {
	vertical-align: text-bottom;
}

.page {
	display: flex;
}
</style>