<!-- 首页，用于选择技师端或用户端 -->
<template>
	<view class="content">
		<view class="header pr txt-center">
			<image class="bg pa" src="../../static/images/index/bg.png" mode="widthFix"></image>
			<image class="circle" :src="logo"></image>
			<view class="txt f36 1a1a1a">{{name}}</view>
		</view>
		<view class="w-con flex-cover">
			<view class="user pr">
				<image class="pa" src="@/static/images/index/user.png" mode="widthFix"></image>
				<view class="txt">用户端</view>
				<view @tap="toUser" class="index-btn btn1 bg-white border-ra-16 auto f28">立即进入</view>
			</view>
			<view class="mechanic pr">
				<image class="pa" src="@/static/images/index/mechanic.png" mode="widthFix"></image>
				<view class="txt">技师端</view>
				<view @tap="toMechanic" class="index-btn btn2 bg-white border-ra-16 auto f28">立即进入</view>
			</view>
		</view>
	</view>
</template>

<script>
	import{ SETUSERTYPE, SETISFIRST } from '@/store/mutations-type.js'
	export default {
		data() {
			return {
				logo: '',
				name: '小程序',
			}
		},
		onLoad(options) {
			this.logo = this.$store.state.logo;
			this.name = this.$store.state.name;
			
			//设置第一次进入主页面为true
			this.$store.commit(SETISFIRST, true);
			
			if(options.id) {
				uni.setStorageSync('inviteId', options.id);
			}
		},
		methods: {
			toUser() {
				//用户端
				this.$store.commit(SETUSERTYPE, 'user');
				if(uni.getStorageSync('userType') === 'mechanic') {
					//之前登录的是技师端，清空本地缓存
					uni.clearStorageSync();
				}
				uni.reLaunch({
					url: '../tabBar/switch/switch?active=0'
				})
			},
			toMechanic() {
				//技师端
				this.$store.commit(SETUSERTYPE, 'mechanic');
				if(uni.getStorageSync('userType') === 'user') {
					//之前登录的是用户端，清空本地缓存
					uni.clearStorageSync();
				}
				this.$lnavigateTo('./login/login');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.header {
		height: 610rpx;
		.bg {
			width: 100vw;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.circle {
			width: 170rpx;
			height: 170rpx;
			margin-top: 178rpx;
		}
		.txt {
			margin-top: 46rpx;
		}
	}
	.w-con {
		margin-top: 216rpx;
		.user, .mechanic {
			width: 298rpx;
			image {
				width: 298rpx;
				z-index: -1;
			}
			.txt {
				color: white;
				padding-left: 140rpx;
				margin-top: 54upx;
			}
			.index-btn {
				width: 150rpx;
				line-height: 46rpx;
				margin-top: 30rpx;
				text-align: center;
			}
			.btn1 {
				color: #FDC6BF;
			}
			.btn2 {
				color: #CC9AF2;
			}
		}
	}
</style>
