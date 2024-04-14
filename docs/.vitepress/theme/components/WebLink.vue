<template>
	<div class="navigation">
		<div v-for="(category, index) in categories" :key="index" class="category">
			<div class="title-box">
				<div class="h2" :id="category.title">{{ category.title }}</div>
			</div>
			<div class="sites">
				<div v-for="(site, sIndex) in category.items" :key="sIndex" class="site"
					@mouseover="site.showTooltip = true" @mouseleave="site.showTooltip = false">
					<div class="card" :title="site.desc" @mouseover="showQRCode(site, data)"
						@mouseleave="hideQRCode(site)">
						<a :href="site.type === undefined ? site.link : ''" class="site-link" target="_blank">
							<div class="card-head">
								<img :src="site.icon" class="site-icon" :alt="site.title">
								<div class="h4">{{ site.title }}</div>
							</div>
							<div class="site-info">
								<div class="desc">{{ site.desc }}</div>
							</div>
						</a>
						<div v-show="site.showQR" :class="['qrcode']">
							<img :src="site.qrcode" alt="QR Code">
						</div>
					</div>
					<div v-show="site.showTooltip" class="tooltip">
						<div class="triangle"></div> <!-- 用于显示三角形指示器 -->
						<div class="content">
							{{ site.desc }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive } from 'vue';

export default {
	props: {
		datalist: {
			type: Array,
			required: true
		}
	},
	setup(props) {
		const categories = reactive(props.datalist.map(item => ({
			...item,
			showQR: false,
			showTooltip: false,
		})));
		const showQRCode = (site) => {
			if (site.type === 'qrcode') {
				site.showQR = true;
			}
		}
		const hideQRCode = (site) => {
			site.showQR = false;
		};
		return {
			categories,
			showQRCode,
			hideQRCode,
		};
	}
};
</script>
<style scoped>
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
	text-overflow: ellipsis;
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	/* 设置显示的行数 */
}

.tooltip{
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
	padding-top: 1px;
	/* 调整内容位置，避免与三角形重叠 */
	z-index: 999;
}

.qrcode {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

img {
	transition: height 0.3s ease-in-out;
}

.qrcode img {
	width: 200px;
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
	box-shadow: 0.3rem 0.3rem 0.6rem #c8d0e7, -0.2rem -0.2rem 0.5rem  #FFFFFF;
	border-radius: 1rem;

}

.site:hover {
	transform: scale(1.05);

	box-shadow: inset 0.2rem 0.2rem 0.5rem #c8d0e7, inset -0.2rem -0.2rem 0.5rem  #FFFFFF;;
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