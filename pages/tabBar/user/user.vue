<template>
	<view>
		<!-- 用户信息 -->
		<view class="user-wrap">
			<view class="user">
				<!-- 头像 -->
				<view class="left" @click="toSetting">
					<image v-if="miniType == 'user'" :src="user.headimgurl || logo"></image>
					<image v-else :src="baseImgURL + user.headimgurl"></image>
				</view>
				<!-- 昵称,个性签名 -->
				<view class="right">
					<view class="username flex-middle">
						<view>{{ user.nickname || '用户名' }}</view>
						<view v-if="user.sex == 1"><image src="/static/images/category/man.png" mode="widthFix"></image></view>
						<view v-else><image src="/static/images/category/woman.png" mode="widthFix"></image></view>
					</view>
					<view v-if="isLoginD" class="signature">
						<text v-if="user.member == 1">会员用户</text>
						<text v-else>普通用户</text>
					</view>
					<view v-else class="signature" @click="toLogin">登录</view>
				</view>
				<view v-if="miniType != 'user'" class="msg serve mr20 pr">
					<!-- 客服按钮 -->
					<image src="/static/images/user/serve.png" mode="widthFix"></image>
					<button class="cancat-btn1 pa" type="default" open-type="contact"></button>
				</view>
				<view class="msg" @click="toHref('/pages/user/msg/msg')"><image src="/static/images/user/msg.png" mode="widthFix"></image></view>
			</view>
			<!-- 分类 -->
			<view v-if="miniType == 'user'" class="cate flex-cover flex-middle">
				<view class="box txt-center" @click="toHref('/pages/user/collection/collection')">
					<view class="img"><image src="/static/images/user/collection.png"></image></view>
					<view class="text f28">收藏</view>
				</view>
				<view class="line"></view>
				<view class="box txt-center pr">
					<view class="img"><image src="/static/images/user/serve.png"></image></view>
					<view class="text f28">在线客服</view>
					<button class="cancat-btn2 pa" type="default" open-type="contact"></button>
				</view>
				<view class="line"></view>
				<view class="box txt-center" @click="toHref('/pages/user/coupon/coupon')">
					<view class="img"><image src="/static/images/user/coupon.png"></image></view>
					<view class="text f28">现金卡</view>
				</view>
			</view>
		</view>

		<!-- 钱包 -->
		<view class="VIP" @click="toHref('/pages/user/wallet/wallet')">
			<view class="VIP-left">
				<image src="/static/images/user/wallet.png" mode="widthFix" class="img"></image>
				<view class="title">钱包余额</view>
			</view>
			<view class="tis">{{ user.money || 0 | fixTwo }}</view>
		</view>

		<!-- 工具栏 -->
		<view class="toolbar">
			<template>
				<view v-for="(item, index) in mytoolbarList" :key="index" class="box" :style="'width: ' + mechStyle" @click="toHref(item.href)">
					<image :src="'/static/images/user/tools/' + item.url" mode="aspectFit" class="img"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</template>
		</view>
		
		<!-- <button type="default" @click="clear">	清除缓存</button> -->
		
	</view>
</template>
<script>
import { getUserInfo, getTInfo } from '@/service/user.js'
import { baseImgURL } from '@/service/config'
export default {
	data() {
		return {
			baseImgURL: '',
			mechStyle: '',
			isLoginD: false,
			// 工具栏列表
			mytoolbarList: [
				{
					url: 'wddz@2x.png',
					text: '我的地址',
					href: '/pages/user/address/address'
				},
				{
					url: 'yqyj@2x.png',
					text: '邀请有奖',
					href: '/pages/user/invite/invite'
				},
				{
					url: 'scrz@2x.png',
					text: '商城入驻',
					href: '/pages/user/settled/settled'
				},
				{
					url: 'ptsm@2x.png',
					text: '平台声明',
					href: '/pages/user/statement/statement'
				},
				{
					url: 'yhxy@2x.png',
					text: '用户协议',
					href: '/pages/user/agreement/agreement'
				},
				{
					url: 'cjwt@2x.png',
					text: '常见问题',
					href: '/pages/user/issue/issue'
				},
				{
					url: 'gvwm@2x.png',
					text: '关于我们',
					href: '/pages/user/aboutUS/aboutUS'
				},
				{
					url: 'yjfk@2x.png',
					text: '意见反馈',
					href: '/pages/user/idea/idea'
				}
			],
			
			
			user: {}
		};
	},
	computed: {
		miniType() {
			//小程序端类型
			return this.$store.state.userType;
		},
		logo() {
			return this.$store.state.logo
		}
	},
	created() {
		if(this.miniType != 'user') {
			this.mytoolbarList[0] = {
				url: 'wddz@2x.png',
				text: '法律声明',
				href: '/pages/user/law/law'
			}
			this.mytoolbarList.splice(2, 1);
			this.mytoolbarList.splice(3, 1);
			this.mechStyle = '33.3333%';
		}
		
		this.isLogin();
		this.baseImgURL = baseImgURL;
	},
	methods: {
		clear() {
			//清除
			uni.clearStorage();
			uni.showToast({
				title: '已清除',
				icon: 'success'
			})
		},
		isLogin() {
			//判断是否登录
			//检测登录状态
			let _this = this;
			if(!uni.getStorageSync('token')) {
				_this.isLoginD = false;
				uni.navigateTo({
					url: '/pages/user/login/login'
				})
				return;
			}
			uni.checkSession({
		　　　　success: function(res){
		　　　　　　console.log("处于登录态, sessionId有效");
					//重新获取用户信息，防止余额和用户类型改变
					_this.isLoginD = true;
					if(_this.miniType == 'user') {
						getUserInfo().then(res => {
							// this.$store.commit("setUserInfo", res.data);
							if(res.code === 200) {
								_this.user = res.data;
							}
						})			
					}
					else {
						getTInfo().then(res => {
							if(res.code === 200) {
								let info = res.data
								_this.user = {
									id: info.id,
									nickname: info.name,
									sex: info.sex_data,
									headimgurl: info.image,
									money: info.always
								}
							}
						})
					}
					
					return;
		　　　　},
		　　　　fail: function(res){
		　　　　　　	console.log("需要重新登录, sessionId过期");
					_this.isLoginD = false;
					// 重新登录
		　　　　　　	uni.navigateTo({
						url: '/pages/user/login/login'
					})
		　　　　}
		　　})
		},
		toLogin() {
			uni.navigateTo({
				url: '/pages/user/login/login'
			})
		},
		toHref(href) {
			//页面跳转
			this.$lnavigateTo(href);
		},
		toSetting() {
			if(this.miniType == 'user') {
				console.log('用户端点击头像');				
			}
			else {
				this.$lnavigateTo('/pages/user/setting/setting');
			}
		}
 	},
	filters: {
		fixTwo(num) {
			return Number(num).toFixed(2);
		}
	}
};
</script>
<style lang="scss">
page {
	position: relative;
}
.user-wrap {
	width: 100vw;
	padding-bottom: 76rpx;
	padding-top: 60rpx;
	background: linear-gradient(to right bottom, #fbaaa9, #fed3c9);
}
.user {
	padding: 0 10%;
	display: flex;
	align-items: center;
	.left {
		width: 16vw;
		height: 16vw;
		flex-shrink: 0;
		margin-right: 20rpx;
		border-radius: 100%;
		image {
			width: 16vw;
			height: 16vw;
			border-radius: 100%;
		}
	}
	.right {
		width: 100%;
		.username {
			font-size: 36rpx;
			image {
				width: 30rpx;
				margin-left: 26rpx;
			}
		}
		.signature {
			display: inline-block;
			font-size: 26rpx;
			margin-top: 16rpx;
			border: 1rpx solid #555555;
			color: #555;
			padding: 0 16rpx;
			border-radius: 10rpx;
			line-height: 38rpx;
		}
	}
	.msg {
		flex-shrink: 0;
		width: 5vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.serve {
		width: 6.1vw;
	}
}
.cate {
	padding: 0 16%;
	margin-top: 50rpx;
	.box {
		color: #3d3d3d;
		image {
			width: 52rpx;
			height: 46rpx;
			margin-bottom: 6rpx;
		}
	}
	.line {
		width: 2rpx;
		height: 36rpx;
		background: #1a1a1a;
	}
}
.VIP {
	width: 690rpx;
	height: 160rpx;
	margin: -45rpx auto 0 auto;
	padding: 0 30rpx;
	background: white;
	box-shadow: 0rpx 0rpx 25rpx rgba(0, 0, 0, 0.2);
	border-radius: 15rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	color: #1a1a1a;
	&-left {
		display: flex;
		align-items: center;
		.img {
			flex-shrink: 0;
			width: 60rpx;
			height: 60rpx;
			margin-right: 20rpx;
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
}
.toolbar {
	width: 690rpx;
	margin: 25rpx auto 0 auto;
	padding-top: 25rpx;
	background-color: #fff;
	box-shadow: 0rpx 0rpx 25rpx rgba(0, 0, 0, 0.1);
	border-radius: 15rpx;
	display: flex;
	flex-wrap: wrap;
	.box {
		width: 25%;
		margin-bottom: 30rpx;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.img {
			width: 80rpx;
			height: 80rpx;
			margin: 0 auto;
		}
		.text {
			width: 100%;
			margin-top: 25rpx;
			display: flex;
			justify-content: center;
			font-size: 30rpx;
			font-weight: 500;
			color: #1a1a1a;
		}
	}
}

.cancat-btn1 {
	width: 5vw;
	height: 5vw;
	opacity: 0;
}
.cancat-btn2 {
	width: 120rpx;
	height: 104rpx;
	top: 0;
	opacity: 0;
}
</style>
