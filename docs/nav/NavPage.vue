<script setup>
import { navigationData } from './data.js';

const scrollToCategory = (index) => {
  const category = document.querySelectorAll('.category')[index];
  category.scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
<div class="page">
	<div class="nav">
		<div class="h2" v-for="(sites,index) in navigationData" :key="index" @click="scrollToCategory(index)">{{ sites.title }}</div>
	</div>
	<div>
		<WebLink :datalist="navigationData"/>
	</div>
</div>

</template>

<style>
.h2{
font-size: 16px;
font-weight: 500;
width: 110px;
  }
.page{
	display: flex;

}
.nav{
	width: 150px;

}
.nav h2{
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0px;
	padding:2px 3px;
}
</style>