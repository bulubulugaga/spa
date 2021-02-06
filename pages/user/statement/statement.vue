<!-- 平台声明 -->
<template>
	<view class="content phone">
		<rich-text :nodes="statement"></rich-text>
	</view>
</template>

<script>
	import { getStatement } from '@/service/user.js'
	export default {
		data() {
			return {
				statement: ``
			}
		},
		onLoad() {
			this._getData();
		},
		methods: {
			//获取网络数据
			_getData() {
				this._getStatement();
			},
			_getStatement() {
				getStatement().then(res => {
					this.statement = res.data.content;
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
