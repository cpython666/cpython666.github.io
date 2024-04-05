<template>
	<div>
	  <h3>{{ panelTitle }}</h3>
	  <div class="input-container">
		<el-input
		  v-model="inputText"
		  class="input"
		  type="textarea"
		  placeholder="请输入要编码/解码的文字"
		/>
	  </div>
	  <div class="output-container">
		<div>
			<div class="hint">编码后的文字</div>

			<el-input
		  v-model="encodedText"
		  class="output"
		  :autosize="{ minRows: 6, maxRows: 10 }"
		  type="textarea"
		  placeholder="编码后的文字"
		/>
		</div>
<div>
	<div class="hint">解码后的文字</div>
	<el-input
		  v-model="decodedText"
		  class="output"
		  :autosize="{ minRows: 6, maxRows: 10 }"
		  type="textarea"
		  placeholder="解码后的文字"
		/>
</div>

	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const panelTitle = ref('URL 编码解码');
  const inputText = ref('');
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
  
  function decodeURL() {
	decodedText.value = decodeURIComponent(inputText.value);
  }
  </script>
  
  <style scoped>
  .input-container {
	margin-bottom: 20px;
  }
  
  .input {
	width: 100%;
  }
  
  .output-container {
	display: flex;
  }
  
  .output {
	flex: 1;
	margin-left: 10px;
  }
  
  .hint {
	color: #666;
	font-size: 14px;
	margin-top: 5px;
  }
  </style>
  