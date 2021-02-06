<!-- 公告弹窗 -->
<template>
	<view class="popup" @click="close">
		<view class="popup-con bg-white border-ra-16" @click.stop> 
			<!-- 图片 -->
			<view class="popup-con-img circle">
				<image src="/static/images/home/notice_left.png" mode="widthFix"></image>
			</view>
			
			<view class="popup-con-tip f30">
				{{ content }}
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: {
			content: {
				type: String,
				default: ''
			}
		},
		methods: {
			close() {  //关闭
				this.$emit('close','关闭');  //返回取消函数
			}
		}
	}
</script>

<style>
	.popup {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.4);
		z-index: 9999999;
	}
	.popup-con {
		position: relative;
		width: 596rpx;
		left: 50%; 
		top: 47%; 
		transform: translate(-50%, -50%);
		padding-top: 60rpx;
		padding-bottom: 50rpx;
	}
	.popup-con-img {
		position: absolute;
		width: 126rpx;
		height: 126rpx;
		top: -63rpx;
		left: 5%;
		background: white;
		z-index: 1;
	}
	.popup-con-img image {
		width: 66rpx;
		margin: 30rpx;
	}
	.popup-con-tip {
		width: 100%;
		padding: 0 7%;
		max-height: 58vh;
		overflow: scroll;
		line-height: 46rpx;
	}
</style>
