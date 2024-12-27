<template>
	<div>
		<h3>{{ panelTitle }}</h3>
		<div class="input-container">
			<el-input v-model="inputText" style="width: 100%" :rows="6" type="textarea" placeholder="请输入要编码/解码的内容" />
		</div>
		<div class="output-container">
			<div>
				<div class="hint">编码后的文字</div>
				<el-input v-model="encodedText" class="output" style="width: 100%" :rows="8" type="textarea"
					placeholder="编码后的文字" />
			</div>
			<div>
				<div class="hint">解码后的文字</div>
				<el-input v-model="decodedText" class="output" style="width: 100%" :rows="8" type="textarea"
					placeholder="解码后的文字" />
			</div>

		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {ElInput} from 'element-plus'

const panelTitle = ref('Base64 编码解码');
const inputText = ref('alert("您好啊，我是Python斗罗~")');
const encodedText = ref('');
const decodedText = ref('');

// 监听 inputText 的变化，实时更新编码和解码的结果
watch(inputText, () => {
	encodeURL();
	decodeURL();
});

function encodeURL() {
	encodedText.value = btoa(unescape(encodeURIComponent(inputText.value)));
	// encodedText.value = encodeURIComponent(inputText.value);
}
encodeURL()

function decodeURL() {
	try {
        decodedText.value = decodeURIComponent(escape(atob(inputText.value)));
    } catch (e) {
        decodedText.value  = '解码错误: 输入不是有效的 Base64';
    }
	// decodedText.value = decodeURIComponent(inputText.value);

}
</script>

<style scoped>
.input-container {
	margin-bottom: 20px;
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