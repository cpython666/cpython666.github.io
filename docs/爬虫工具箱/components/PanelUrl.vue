<template>
	<h3>{{ PanelTitle }}</h3>
	<div class="main">
		<div>
			<textarea class="custom-textarea" v-model="inputText" placeholder="输入要编码的文本"></textarea>
		</div>
		<div class="btnlist">
			<button class="custom-button" @click="encodeURL">编码</button>
			<button class="custom-button" @click="decodeURL">解码</button>
		</div>
		<div>
			<textarea class="custom-textarea ">{{ encodedText }}</textarea>
		</div>
	</div>

</template>

<script setup>
import { ref } from 'vue'
const PanelTitle = ref('Url编码解码');
const inputText = ref('');
const encodedText = ref('');
function encodeURL() {
	encodedText.value = encodeURIComponent(inputText.value);
}
function decodeURL() {
	encodedText.value = decodeURIComponent(inputText.value);
}
</script>

<style scoped>
.btnlist{
	display: flex;
	flex-direction: column;
}
.main{
	display: flex;
	width: 100%;
}
.custom-textarea {
  min-width: 500px; /* 设置宽度 */
  min-height: 50vh; /* 设置高度 */
  padding: 10px; /* 设置内边距 */
  background-color: rgb(211, 247, 225);
}
.custom-button{
	width: 80px;
	padding: 5px 8px;
	background-color: antiquewhite;
	transition: all 0.3s ease;
}
.custom-button:hover{
	background-color: rgb(230, 141, 25);
	transform: scale(1.05);
}
</style>