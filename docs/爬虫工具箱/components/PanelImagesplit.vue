<template>
	<div>
	  <div id="controls">
		<h1>图像分割-动画帧分割</h1>
		<input type="file" @change="onImageChange" accept="image/*" ref="imageInput">
		<div>
		  <label for="rows">Rows:</label>
		  <input type="number" v-model="rows" min="1">
		  <label for="columns">Columns:</label>
		  <input type="number" v-model="columns" min="1">
		</div>
		<button @click="splitAndDownload">分割并且下载</button>
	  </div>
	  <div id="preview" ref="preview">
		<img :src="imageSrc" ref="imgPreview" alt="Preview Image">
		<canvas ref="overlay"></canvas>
	  </div>
	  <canvas ref="canvas" style="display: none;"></canvas>
	</div>
  </template>
  
  <script>
  import JSZip from 'jszip';
  
  export default {
	data() {
	  return {
		imageSrc: null,
		rows: 2,
		columns: 2
	  };
	},
	methods: {
	  onImageChange(event) {
		const fileInput = event.target;
		if (!fileInput.files.length) return;
  
		const file = fileInput.files[0];
		const img = new Image();
		img.src = URL.createObjectURL(file);
		this.imageSrc = img.src;
		img.onload = () => {
		  this.$nextTick(() => {
			this.updateCanvasSize();
			this.updatePreview();
		  });
		};
	  },
	  updateCanvasSize() {
		const imgPreview = this.$refs.imgPreview;
		const overlay = this.$refs.overlay;
		overlay.style.position = 'absolute';
		overlay.style.width = `${imgPreview.clientWidth}px`;
		overlay.style.height = `${imgPreview.clientHeight}px`;
		overlay.width = imgPreview.clientWidth;
		overlay.height = imgPreview.clientHeight;
		overlay.style.top = `${imgPreview.offsetTop}px`;
		overlay.style.left = `${imgPreview.offsetLeft}px`;
	  },
	  updatePreview() {
		if (!this.imageSrc) return;
		const rows = parseInt(this.rows);
		const columns = parseInt(this.columns);
		const img = new Image();
		img.src = this.imageSrc;
		img.onload = () => {
		  const imgPreview = this.$refs.imgPreview;
		  const pieceWidth = imgPreview.clientWidth / columns;
		  const pieceHeight = imgPreview.clientHeight / rows;
		  const overlay = this.$refs.overlay;
		  const overlayCtx = overlay.getContext('2d');
		  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
		  overlayCtx.strokeStyle = 'red';
		  overlayCtx.lineWidth = 1;
  
		  // Draw horizontal lines
		  for (let r = 1; r < rows; r++) {
			overlayCtx.beginPath();
			overlayCtx.moveTo(0, r * pieceHeight);
			overlayCtx.lineTo(imgPreview.clientWidth, r * pieceHeight);
			overlayCtx.stroke();
		  }
  
		  // Draw vertical lines
		  for (let c = 1; c < columns; c++) {
			overlayCtx.beginPath();
			overlayCtx.moveTo(c * pieceWidth, 0);
			overlayCtx.lineTo(c * pieceWidth, imgPreview.clientHeight);
			overlayCtx.stroke();
		  }
		};
	  },
	  splitAndDownload() {
		const fileInput = this.$refs.imageInput;
		const rows = parseInt(this.rows);
		const columns = parseInt(this.columns);
		if (!fileInput.files.length) {
		  alert('Please select an image first.');
		  return;
		}
		const file = fileInput.files[0];
		const img = new Image();
		img.src = URL.createObjectURL(file);
		img.onload = () => {
		  const canvas = this.$refs.canvas;
		  const ctx = canvas.getContext('2d');
		  const pieceWidth = img.width / columns;
		  const pieceHeight = img.height / rows;
		  canvas.width = pieceWidth;
		  canvas.height = pieceHeight;
		  const zip = new JSZip();
		  let completed = 0;
		  for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
			  ctx.clearRect(0, 0, canvas.width, canvas.height);
			  ctx.drawImage(img, c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
			  canvas.toBlob(blob => {
				zip.file(`piece_${r}_${c}.png`, blob);
				completed++;
				if (completed === rows * columns) {
				  zip.generateAsync({ type: 'blob' }).then(content => {
					const link = document.createElement('a');
					link.href = URL.createObjectURL(content);
					link.download = 'pieces.zip';
					link.click();
				  });
				}
			  });
			}
		  }
		};
	  }
	},
	watch: {
	  rows: 'updatePreview',
	  columns: 'updatePreview'
	}
  };
  </script>
  
  <style scoped>
  body {
	display: flex;
	flex-direction: column;
	align-items: center;
  }
  #controls {
	flex: 1;
	margin-bottom: 20px;
  }
  #preview {
	flex: 1;
	position: relative;
  }
  #preview img {
	max-width: 100%;
  }
  #overlay {
	position: absolute;
	pointer-events: none;
	z-index: 10; /* Ensure overlay canvas is above the image */
  }
  input{
	border: 1px solid black;
  }
  button{
	padding: 5px;
	border: 1px solid beige;
	background-color: rgb(87, 87, 233);
	color: white;
  }
  </style>
  