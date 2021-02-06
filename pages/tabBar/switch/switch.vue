<!-- 此页面作自定义tabBar切换，防止真机切换时闪烁 -->
<!-- 把tabBar页面作组件使用 -->
<template>
	<view class="content">
		<view v-if="active === 0">
			<home ref="home"></home>
		</view>
		<view v-if="active === 1 && userType === 'user'">
			<category ref="category"></category>
		</view>
		<view v-if="active === 2 && userType === 'user' || (active === 1 && userType === 'mechanic')">
			<bill></bill>
		</view>
		<view v-if="(active === 3 && userType === 'user') || (active === 2 && userType === 'mechanic')">
			<user></user>
		</view>

		<!-- 技师端不展示订单页 -->
		<van-tabbar :active="active" active-color="#646566" @change="onChange">
			<van-tabbar-item>
				<image slot="icon" src="/static/images/tabBar/home.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" src="/static/images/tabBar/home-on.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				首页
			</van-tabbar-item>
			<!-- 技师端隐藏产品页 -->
			<van-tabbar-item v-if="userType === 'user'">
				<image slot="icon" src="/static/images/tabBar/category.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" src="/static/images/tabBar/category-on.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				产品
			</van-tabbar-item>
			<van-tabbar-item>
				<image slot="icon" src="/static/images/tabBar/bill.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" src="/static/images/tabBar/bill-on.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				订单
			</van-tabbar-item>
			<van-tabbar-item>
				<image slot="icon" src="/static/images/tabBar/user.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" src="/static/images/tabBar/user-on.png" mode="aspectFit" style="width: 30px; height: 18px;" />
				我的
			</van-tabbar-item>
		</van-tabbar>
	</view>
</template>

<script>
	import home from '@/pages/tabBar/home/home'
	import category from '@/pages/tabBar/category/category'
	import bill from '@/pages/tabBar/bill/bill'
	import user from '@/pages/tabBar/user/user'
	//获取位置信息
	import { getGPSLocation, getCity, getCityInfo } from '@/common/getLocation.js'
	import { getTInfo, updateInfo } from '@/service/user.js'
	
	//引入仓库方法名
	import { SETGPS, SETCITY, SETCHOOSECITY, SETISFIRST } from '@/store/mutations-type.js'
	export default {
		data() {
			return {
				active: 0,
				
				windowHeight: 0,  //可用窗口高度
			}
		},
		computed: {
			userType() {
				//用户类型
				return this.$store.state.userType;
			}
		},
		onLoad(options) {
			let _this = this;
			//获取显示页面组件，需要转换为Number类型，默认String则不显示
			this.active = Number(options.active);
			//初始化导航标题
			this.changeNavTitle(this.active);
			//隐藏左上角返回首页按钮
			// uni.hideHomeButton();
			
			//获取位置信息
			//仅第一次进入时运行此方法,不打印可能不运行，哈哈哈(谨慎去掉打印)
			console.log(this.$store.state.isFirst);
			if(this.$store.state.isFirst) {
				this.getLocation();				
			}
		},
		methods: {
			onChange(event) {
				//动态修改选中的tabbarItem
				this.active = event.detail;
				//修改导航标题
				this.changeNavTitle(this.active);
			},
			changeNavTitle(e) {
				//动态改变导航标题
				switch (e) {
					case 0:
						uni.setNavigationBarTitle({
							title: '首页'
						});
						break;
					case 1:
						if (this.userType === 'user') {
							uni.setNavigationBarTitle({
								title: '产品'
							});
						} else {
							uni.setNavigationBarTitle({
								title: '订单'
							});
						}
						break;
					case 2:
						if (this.userType === 'user') {
							uni.setNavigationBarTitle({
								title: '订单'
							});
						} else {
							uni.setNavigationBarTitle({
								title: '我的'
							});
						}
						break;
					case 3:
						uni.setNavigationBarTitle({
							title: '我的'
						});
						break;
				}
			},
			getLocation() {
				console.log('获取位置信息');
				//技师端获取位置,用户端定位
				if(this.$store.state.userType === 'user') {
					getGPSLocation().then(gps => {
						if(gps) {
							this.$store.commit(SETGPS, gps);
							getCity(gps).then(res => {
								let city = res.result.ad_info.province + '/' + res.result.ad_info.city;
								getCityInfo(city).then(info => {
									this.$store.commit(SETCITY, info);
									this.$store.commit(SETCHOOSECITY, info);
									this.$store.commit(SETISFIRST, false);
									console.log(this.$refs.home);
									if(this.$refs.home)
										this.$refs.home._getData();
									if(this.$refs.category)
										this.$refs.category._getData();
								})
							})
						}
					});
				}
				else {
					//先获取地区展示信息
					
					//是否切换
					let _this = this;
					getGPSLocation().then(gps => {
						if(gps) {
							getCity(gps).then(res => {								
								let city = res.result.ad_info.province + '/' + res.result.ad_info.city;								
								this.$store.commit(SETGPS, gps);								
								
								getTInfo().then(uinfo => {
									let area = uinfo.data.city_name;
									if(area != city) {
										uni.showModal({
											title: '提示',
											content: '检测到您当前的位置在' + res.result.ad_info.city + '，是否切换到当前城市？',
											success: function (is) {
												if (is.confirm) {
													console.log('技师端点击确定切换城市');
													
													//技师端修改服务地区为定位城市
													getCityInfo(city).then(info => {
														//修改服务地区
														updateInfo({ city_id: info.id }).then(res => {
															if(res.code == 200) {
																_this.$store.commit(SETCITY, info);
																_this.$store.commit(SETCHOOSECITY, info);
																_this.$refs.home._getData();
																uni.showToast({
																	title: '已修改'
																})
															}
															else {
																uni.showToast({
																	title: res.msg,
																	icon: 'none'
																})
															}
														})												
													})											
													
												} else if (is.cancel) {
													//技师端保留服务地区
													getCityInfo(area).then(info => {
														_this.$store.commit(SETCITY, info);
														_this.$store.commit(SETCHOOSECITY, info);
														_this.$refs.home._getData();
													})												
												}
											},
											complete() {
												//修改状态，登录之后只提示一次
												_this.$store.commit(SETISFIRST, false);
											}
										});
									}
									else {
										getCityInfo(area).then(info => {
											_this.$store.commit(SETCITY, info);
											_this.$store.commit(SETCHOOSECITY, info);
											_this.$refs.home._getData();
										})
									}
									
								})
							})
						}
					});
					
				}
			}
		},
		components: {
			home,
			category,
			bill,
			user
		}
	}
</script>

<style>
	page {
		padding-bottom: 80rpx;
	}
</style>
