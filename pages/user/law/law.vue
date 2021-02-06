<!-- 法律声明 -->
<template>
	<view class="content phone">
		<rich-text :nodes="law"></rich-text>
	</view>
</template>

<script>
	import { getLaw } from '@/service/user.js'
	export default {
		data() {
			return {
				law: ``
			}
		},
		onLoad() {
			this._getData();
		},
		methods: {
			//获取网络数据
			_getData() {
				this._getLaw();
			},
			_getLaw() {
				getLaw().then(res => {
					this.law = res.data.content;
				})
			}
		}
	}
</script>

<style>
	page {
		background: white;
	}
	.content {
		padding: 20rpx 4%;
	}
</style>
