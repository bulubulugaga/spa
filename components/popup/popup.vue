<!-- 弹窗 -->
<template>
	<view class="popup" @click="close">
		<view class="popup-con bg-white border-ra-16" @click.stop> 
			<!-- 图片 -->
			<view class="popup-con-img circle">
				<image src="/static/images/index/logo.png" mode="widthFix"></image>
			</view>
			
			<!-- 预留插槽(放输入框或者提示信息) -->
			<view class="popup-con-tip txt-center f30">
				<!-- 插槽名带横线可能没有作用 -->
				<slot name="popupTip">完美心愿</slot>
			</view>
			
			<!-- 按钮 -->
			<view class="popup-btn white border-ra-16 txt-center f36" @click="sure">
				{{btn}}
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
			btn: {
				type: String,
				default: '确认'
			}
		},
		methods: {
			sure() {  //确认按钮
				this.$emit('sure','确认');
			},
			close() {  //关闭
				this.$emit('close','取消');  //返回取消函数
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
		padding-top: 150rpx;
		padding-bottom: 32rpx;
	}
	.popup-con-img {
		position: absolute;
		width: 126rpx;
		height: 126rpx;
		top: -63rpx;
		left: 50%;
		transform: translateX(-50%);
		background: #FED2C8;
	}
	.popup-con-img image {
		width: 60rpx;
		margin: 33rpx;
	}
	.popup-con-tip {
		width: 438rpx;
		margin: 0 auto;
	}
	.popup-btn {
		line-height: 68rpx;
		width: 530rpx;
		margin: 80rpx auto 0;
		background: linear-gradient(to right bottom, #FED2C8, #FBABA9);
	}
</style>
