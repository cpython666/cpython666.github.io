<template>
	<h3>Base64</h3>
	<div>
		<textarea class="custom-textarea" v-model="inputText" placeholder="输入要编码的文本"></textarea>
	</div>
	<div>
		<button @click="encodeURL">编码</button>
	</div>
	<div>
		<textarea readonly>{{ encodedText }}</textarea>
	</div>
</template>

<script setup>
import { ref } from 'vue'
const inputText = ref('');
const encodedText = ref('');
function encodeURL() {
	encodedText.value = encodeURIComponent(inputText.value);
}
</script>

<style scoped>
.custom-textarea {
  width: 300px; /* 设置宽度 */
  height: 200px; /* 设置高度 */
  padding: 10px; /* 设置内边距 */
  resize: none; /* 禁止用户调整大小 */
}
</style>