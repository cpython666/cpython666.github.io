<template>
	<div>
		<h3>{{ panelTitle }}</h3>
		<div class="input-container">
			<textarea v-model="inputText" class="tool-textarea" rows="6" placeholder="请输入要编码/解码的内容"></textarea>
		</div>
		<div class="output-container">
			<div>
				<div class="hint">编码后的文字</div>
				<textarea v-model="encodedText" class="tool-textarea output" rows="8" placeholder="编码后的文字"></textarea>
			</div>
			<div>
				<div class="hint">解码后的文字</div>
				<textarea v-model="decodedText" class="tool-textarea output" rows="8" placeholder="解码后的文字"></textarea>
			</div>

		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';

const panelTitle = ref('URL 编码解码');
const inputText = ref('alert("您好啊，我是Python斗罗~")');
const encodedText = ref('');
const decodedText = ref('');

// 监听 inputText 的变化，实时更新编码和解码的结果
watch(inputText, () => {
	encodeURL();
	decodeURL();
});

function encodeURL() {
	encodedText.value = encodeURIComponent(inputText.value);
}
encodeURL()

function decodeURL() {
	decodedText.value = decodeURIComponent(inputText.value);
}
</script>

<style scoped>
.input-container {
	margin-bottom: 20px;
}

.tool-textarea {
	box-sizing: border-box;
	width: 100%;
	padding: 8px;
	color: var(--vp-c-text-1);
	background: var(--vp-c-bg);
	border: 1px solid var(--vp-c-divider);
	border-radius: 6px;
}

.output-container {
	display: flex;
}
.output-container>div{
	width: 100%;
}
.output {
	width: 100%;
}

.hint {
	color: #666;
	font-size: 14px;
	margin-top: 5px;
}
</style>
