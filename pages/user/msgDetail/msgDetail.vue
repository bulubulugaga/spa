<!-- 消息详情 -->
<template>
	<view class="content">
		<!-- <view class="banner">
			<image :src="msg.banner" mode="aspectFill"></image>
		</view> -->
		<view class="title w-con txt-center f36">{{ msg.msg.title }}</view>
		<view class="f26 1a1a1a mt6 flex-MC">
			<view class="flex-middle">
				<image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image>
			</view>
			<view class="flex-middle">
				{{ msg.createtime }}
			</view>
		</view>
		<view class="detail w-con">
			<rich-text :nodes="msg.msg.content"></rich-text>
		</view>
		<view class="share flex-middle f26 gray">
			<view class="ml-auto pr flex-middle">
				分享<van-icon size="30rpx" custom-style="margin-left: 10rpx" name="share" color="gray" />
				<button class="pa" open-type="share"></button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: {
					banner: '/static/images/face.jpg',
					title: '消息标题',
					time: '2020-12-07 15: 00: 00', 
					content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容',
				}
			}
		},
		onLoad() {
			uni.getStorage({
				key:'msg',
				success: (e) => {
					this.msg = e.data;
				}
			})
		}
	}
</script>

<style>
	page {
		background: white;
	}
	.banner image {
		width: 100vw;
		height: 50vw;
	}
	.title {
		line-height: 60rpx;
		margin-top: 30rpx;
	}
	.time-img {
		width: 26rpx;
		margin-right: 14rpx;
	}
	.detail {
		margin-top: 50rpx;
	}
	.share{
		margin-top: 40rpx;
		border-top: 2rpx solid #f9f9f9;
		padding-right: 4%;
		padding-top: 10rpx;
	}
	.share button {
		width: 100rpx;
		height: 40rpx;
		top: 0;
		opacity: 0;
	}
</style>
