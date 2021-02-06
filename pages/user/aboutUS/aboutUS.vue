<!-- 关于我们 -->
<template>
	<view class="content">
		<!-- 图片 -->
		<view class="top txt-center">
			<image :src="baseImgURL + info.image" mode=""></image>
		</view>
		<!-- 联系我们 -->
		<view class="contact" @click="phone">
			<van-cell title="联系我们" title-class="f30" is-link :border="false" />
		</view>
		<!-- 公司介绍 -->
		<view class="company">
			<!-- <view class="name f28"> 公司：{{ info.name }} </view> -->
			<view class="intro f28"> 
				<rich-text :nodes="info.company"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	//图片跟地址
	import { baseImgURL } from '@/service/config'
	import { getAboutUs } from '@/service/user.js'
	export default {
		data() {
			return {
				baseImgURL: '',
				info: {}
			}
		},
		onLoad() {
			this.baseImgURL = baseImgURL;
			this._getData();
		},
		methods: {
			phone() {
				//拨打电话
				uni.makePhoneCall({
				    phoneNumber: this.info.phone
				});
			},  
			
			
			//获取网络数据
			_getData() {
				this._getAboutUs();
			},
			_getAboutUs() {
				getAboutUs().then(res => {
					this.info = res.data;
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: white;
	}
	.top {
		padding: 100rpx 0;
		image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 16rpx;
		}
	}
	.contact {
		border-top: 10rpx solid #F9F9F9;
	}
	.company {
		width: 92%;
		margin: 0 auto;
		border-top: 4rpx solid #F9F9F9;
		.name {
			line-height: 80rpx;
		}
		.intro {
			margin-top: 20rpx;
		}
	}
</style>
