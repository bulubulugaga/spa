<!-- 消息详情 -->
<template>
	<view class="content w-con">
		<view class="detail f28">
			{{ msg.content }}
		</view>
		<view class="detail-img flex-wrap">
			<image v-for="item in images" :key="item" :src="baseImgURL + item"></image>
		</view>
		<view class="f26 1a1a1a mt6 flex-cover">
			<view class="flex">
				<view class="flex-middle">
					<image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image>
				</view>
				<view class="flex-middle">
					{{ msg.createtime }}
				</view>
			</view>
			<view class="f26">
				反馈结果：
				<text v-if="msg.status == 10">处理中</text>
				<text v-if="msg.status == 20">已处理</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseImgURL } from '@/service/config'
	export default {
		data() {
			return {
				msg: {},
				images: '',
				baseImgURL
			}
		},
		onLoad() {
			this.baseImgURL = baseImgURL;
			uni.getStorage({
				key:'idea',
				success: (e) => {
					this.msg = e.data;
					this.images = e.data.images.split(',');
				}
			})
		}
	}
</script>

<style>
	page {
		background: white;
	}
	.content {
		border-top: 1rpx solid #f9f9f9;
		padding-top: 20rpx;
	}
	.detail-img {
		margin: 40rpx 0;
	}
	.detail-img image {
		width: 150rpx;
		height: 150rpx;
		margin: 0 20rpx 20rpx 0;
	}
	.time-img {
		width: 26rpx;
		margin-right: 14rpx;
	}
</style>
