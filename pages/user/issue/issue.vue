<!-- 常见问题 -->
<template>
	<view class="content">
		<van-collapse accordion :value="active" @change="changeActive">
		  <van-collapse-item custom-class="f28" content-class="f28" v-for="(item, index) in issue" :key="index"
			:title="item.title" :name="index + 1">
		    <rich-text :nodes="item.content"></rich-text>
		  </van-collapse-item>
		</van-collapse>
	</view>
</template>

<script>
	import { getIssue } from '@/service/user.js'
	export default {
		data() {
			return {
				active: 1, //从0开始会出现bug
				issue: []
			}
		},
		onLoad(e) {
			this._getData();
		},
		methods: {
			changeActive(e) {
				this.active = e.detail;
			},
			
			//获取网络数据
			_getData() {
				this._getIssue();
			},
			_getIssue() {
				getIssue().then(res => {
					this.issue = res.data;
				})
			}
		}
	}
</script>

<style>
	.f28 {
		font-size: 28rpx !important;
	}
</style>
