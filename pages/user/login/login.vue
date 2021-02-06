<template>
	<view class="content">
		<image class="logo" :src="logo"></image>
		<view class="name">{{ name }}</view>
		<view v-if="isAuth" class="btn" @click="login">
			微信登录
		</view>
		<button v-else class="btn" type="default" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">微信登录</button>
	</view>
</template>

<script>
	import { 
		login, 
		getUserInfo, 
		technician_register,
		member_share,
		technician_share
	} from '@/service/user.js'
	export default {
		data() {
			return {
				isAuth: false,  //是否授权
				UserInfo: {},  //用户信息
  			}
		},
		computed: {
			userType() {
				return this.$store.state.userType;
			},
			name() {
				return this.$store.state.name;
			},
			logo() {
				return this.$store.state.logo;
			}
		},
		methods: {
			isAuthority() {
				//是否授权
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						console.log('已授权');
						_this.isAuth = true;
					},
					fail: function(err) {
						console.log('未授权');
						_this.isAuth = false;
					}
				})
				
				//通过授权显示不一样的按钮
			},
			bindGetUserInfo(e) {
				let info = e.detail.userInfo;
				if (info) {
					//用户按了允许授权按钮
						console.log('已授权');
						this.login();
				} else {
					//用户按了拒绝按钮
				}
			},
			login() {
				//微信登录获取code值
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log('再次调用获取信息接口');
								let data = {
									code: loginRes.code,
									iv: infoRes.iv,
									encryptedData: infoRes.encryptedData
								};
								
								//用户端登录
								if(_this.userType === 'user') {
									login(data).then(res => {
										if(res.code == 200) {
											uni.showToast({
												title: '已登录'
											})
											let isFirstLogin = uni.getStorageSync('token') ? false : true;
											uni.setStorageSync('userType', 'user');
											uni.setStorageSync('token', res.data.token);
											// if(isFirstLogin) {
												//第一次登录
												console.log('没有存储token值');
												
												if(uni.getStorageSync('inviteId')) {
													//如果有邀请人
													console.log('有邀请人');
													member_share({token: uni.getStorageSync('inviteId')}).then(res => {
														console.log(res);
													})
												}
											// }
											_this._getUserInfo().then(infoOk => {
												//刷新上一个页面
												let pages = getCurrentPages();
												let beforePage = pages[pages.length - 2];
												if(beforePage.route === 'pages/tabBar/switch/switch') {
													//从tabBar页面进入
													let active = beforePage.$vm.active;
													uni.reLaunch({
														url: '/pages/tabBar/switch/switch?active=' + active
													})
												}
												else {
													uni.navigateBack();
												}
											
											});
										}
										else {
											uni.showToast({
												title: res.msg,
												icon: 'none'
											})
										}
									})
								}
								else {
									//技师端登录
									technician_register(data).then(res => {
										uni.setStorageSync('userType', 'mechanic');
										uni.setStorageSync('token', res.data.token);
										uni.navigateTo({
											url: '/pages/index/login/login'
										})
										if(uni.getStorageSync('inviteId')) {
											//如果有邀请人
											console.log('有邀请人');
											technician_share({token: uni.getStorageSync('inviteId')}).then(res => {
												console.log(res);
											})
										}
									})
								}
							}
						})
						
						// uni.navigateBack({
						// 	delta: 1
						// })
					},
				})
			},
			_getUserInfo() {
				return new Promise((resolve, reject) => {
					getUserInfo().then(res => {
						// this.$store.commit("setUserInfo", res.data);
						if(res.code === 200) {
							uni.setStorageSync('userInfo', res.data);
							resolve();
						}
					})
				})
			}
		},
		onLoad() {
			this.isAuthority();
		}
	}
</script>

<style>
	page{
		background-color: white;	
	}
	.content {
		text-align: center;
	}
	.logo {
		width: 20vw;
		height: 20vw;
		border-radius: 50%;
		margin-top: 14vh;
	}
	.name {
		font-size: 36upx;
		margin-top: 20upx;
		color: #FBAAA9;
	}
	.btn {
		background-color: #FBAAA9 !important;
		color: white !important;
		font-size: 32upx !important;
		margin: 10vh auto;
		text-align: center;
		line-height: 90upx;
		width: 80vw;
		border-radius: 90upx;
		border: none;
	}
</style>
