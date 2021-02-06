<!-- 服务详情 -->
<template>
	<view class="content">
		<!-- 图片 -->
		<view class="banner">
			<image :src="baseImgURL + info.image"></image>
		</view>
		<!-- 基本信息 -->
		<view class="base w-con flex pt20 bg-white">
			<view class="left">
				<view class="title f36 FB">{{ info.name }}</view>
				<view class="flex-middle">
					<view class="f36 c-E64242 FB">￥{{ info.price }}</view>
					<view class="f26 flex-middle ml30">
						<view class="flex-middle"><image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image></view>
						<view class="flex-middle">{{ info.sj }}分钟</view>
					</view>
					<view class="f26 ml30">已售<text class="c-E64242">{{ info.order_num || 0 }}</text>件</view>
				</view>
			</view>
			<view class="right flex ml-auto">
				<!-- 收藏 -->
				<image @click="changeCollection" v-if="info.collect === 1" src="/static/images/category/collection_1.png" mode=""></image>
				<image @click="changeCollection" v-else src="/static/images/category/collection.png" mode=""></image>
				<!-- 分享 -->
				<view class="share-wrap pr ml30">
					<image @click="share" class="pa" src="/static/images/category/share.png" mode=""></image>
					<button class="share-btn pa" open-type="share" data-id='1234'>分享</button>
				</view>				
			</view>
		</view>
		
		<!-- 部分选择 -->
		<view class="choice">
			<!-- <van-cell is-link title="现金卡" value="暂无现金卡" value-class="cell-right-red"
				link-type="navigateTo" url="/pages/user/coupon/coupon?type=select"/> -->
			<van-cell is-link title="技师" link-type="navigateTo" :url="'/pages/category/serveDetail/mechList/mechList?id='+id">
				<template v-slot:value>
				    <view class="my-cell flex-middle">
						<view class="ml-auto">{{ mech.name }}</view>
						<view class="ml10">
						  <text v-if="mech.sex_data == 2">女</text>	
						  <text v-if="mech.sex_data == 1">男</text>	
						</view>
						<view class="mech-a-b"><image class="mech-a circle ml20" :src="baseImgURL+ mech.image" mode=""></image></view>
					</view>
				 </template>
			</van-cell>
			<van-cell is-link title="预约时间" :value="appointTime" link-type="navigateTo" value-class="cell-right-red" @click.native="isShowTime = true" />
		</view>
		
		<!-- 详情 -->
		<view class="detail bg-white">
			<van-tabs :active="0" color="#FDC6BF" line-width="56" line-height="2"
				animated sticky>
			  <van-tab title="项目描述" >
				  <rich-text :nodes="info.content"></rich-text>
			  </van-tab>
			  <van-tab title="下单须知">
				  <view class="tip">
					  <rich-text :nodes="info.notice"></rich-text>
				  </view>
			  </van-tab>
			  <van-tab title="服务评价">
				  <comment-list :list="info.comment" type="s"></comment-list>
			  </van-tab>
			</van-tabs>
		</view>
		
		
		<!-- 占位 -->
		<view class="blank"></view>
		<!-- 底部 -->
		<view class="footer bg-white flex-middle">
			<text class="f30">价格：</text>
			<text class="c-E64242 f36 FB"> ￥{{ info.price }} </text>
			<view class="btn ml-auto white txt-center f36 border-ra-16" @click="toPlaceOrder">立即预约</view>
		</view>
		
		
		<!-- 选择时间 -->
		<van-popup v-if="isShowTime" custom-class="pre-time f26" show="true" position="bottom" @close="isShowTime = false">
			<view class="sure-btn">
				<view @click="confirmTime">确认</view>
			</view>
			<view class="nav flex txt-center">
				<view v-for="(item, index) in timeNav" :key="index" :class="{concolor: index == timeNavIndex}" @click="timeNavIndex = index">
					<view>{{ item.title }}</view>
					<view>{{ item.data }}</view>
				</view>
			</view>
			<scroll-view class="time-wrap">
				<view class="time">
					<view class="time-title" v-if="timeNav[timeNavIndex].time.morning.length != 0">上午</view>
					<view class="flex-wrap">
						<view class="time-box" v-for="(time, index) in timeNav[timeNavIndex].time.morning" :key="time" 
							 :class="{active: index == timeConMIndex}" @click="timeConMIndex = index; timeConAIndex = -100">
							<text>{{ time }}</text>
						</view>
					</view>
					<view class="time-title">下午</view>
					<view class="flex-wrap">
						<view class="time-box" v-for="(time, index) in timeNav[timeNavIndex].time.afternoon" :key="time"
							:class="{active: index == timeConAIndex}" @click="timeConAIndex = index; timeConMIndex = -100">
							<text>{{ time }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</van-popup>
	</view>
</template>

<script>
	//评价组件
	import commentList from '@/components/commentList/commentList.vue'
	//图片跟地址
	import { baseImgURL } from '@/service/config'
	//网络数据
	import { getServeDetail, changeCollection } from '@/service/category'
	//时间转换
	import { transeTime, getAfterDay } from '@/common/utils'
	// 判断属性
	import { isObjHasNull } from '@/common/utils.js'
	export default {
		components: {
			commentList
		},
		data() {
			return {
				baseImgURL: '',
				id: '',  //服务id
				info: {},  //服务详情
				mech: {},   //选中技师信息
				appointTime: '',  //预约时间
				
				isShowTime: false,  //是否展示时间
				timeNav: [
					{title: '今天'},
					{title: '明天'},
					{title: '后天'}
				],
				timeNavIndex: 0,   //选择时间导航下标
				timeConMIndex: -100,   //选择时间内容下标  上午  为-100表示选择下午
				timeConAIndex: -100,   //选择时间内容下标  下午
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.baseImgURL = baseImgURL;
			
			//初始化预约时间
			this.getTime();
			this.confirmTime();
			
			//网络数据
			this._getData();
		},
		methods: {
			changeCollection() {
				//修改收藏状态
				let data = {
					status: 1,
					product_id: this.id
				}
				changeCollection(data).then(res => {
					if(res.code === 1) {
						//修改成功则修改页面
						this.info.collect = this.info.collect == 1 ? 0 : 1;						
						uni.showToast({
							title: res.msg
						})
						
						//如果是收藏页进入，刷新收藏页
						let pages = getCurrentPages();
						let beforPage = pages[pages.length - 2];
						if(beforPage.route == "pages/user/collection/collection") {
							beforPage.onLoad();
						}
					}
				})
			},
			getTime() {
				//获取时间
				//日期
				this.timeNav[0]['data'] = getAfterDay(0, 'Y-M-D');
				this.timeNav[1]['data'] = getAfterDay(1, 'Y-M-D');
				this.timeNav[2]['data'] = getAfterDay(2, 'Y-M-D');
				//时间
				//整时间
				let morning = ['09: 00', '09: 30', '10: 00', '10: 30', '11: 00', '11: 30', '12: 00', '12: 30'];
				let afternoon = ['13: 00', '13: 30', '14: 00', '14: 30', '15: 00', '15: 30', '16: 00', '16: 30', '17: 00', '17: 30'];
				//计算今天的时间
				let today = getAfterDay(0);
				let tmorning = [];
				let tafternoon = [];
				if(today.hour < 12) {
					//还是上午
					this.timeConMIndex = 0;
					for(let i = Number(today.hour) + 1 ; i < 13 ; i++ ) {
						tmorning.push(i + ': 00');
						tmorning.push(i + ': 30');
					}
					this.timeNav[0]['time'] = {
						morning: tmorning,
						afternoon
					}
				}
				else if(today.hour < 17) {
					//下午
					this.timeConAIndex = 0;
					for(let i = Number(today.hour) + 1 ; i < 18 ; i++ ) {
						tafternoon.push(i + ': 00');
						tafternoon.push(i + ': 30');
					}
					this.timeNav[0]['time'] = {
						morning: tmorning,
						afternoon: tafternoon
					}
				}
				else {
					//超过18点
					this.timeConAIndex = 0;
					tafternoon.push('18: 00');
					this.timeNav[0]['time'] = {
						morning: tmorning,
						afternoon: tafternoon
					}
				}
				//明后天全时间
				this.timeNav[1]['time'] = this.timeNav[2]['time'] = {
					morning,
					afternoon
				}
			},
			confirmTime() {
				//确认选择时间
				if(this.timeConMIndex != -100) {
					//选择了上午
					this.appointTime = this.timeNav[this.timeNavIndex].data + ' ' + this.timeNav[this.timeNavIndex].time.morning[this.timeConMIndex];
				}
				else {
					this.appointTime = this.timeNav[this.timeNavIndex].data + ' ' + this.timeNav[this.timeNavIndex].time.afternoon[this.timeConAIndex];
				}
				this.isShowTime = false;
			},
 			toPlaceOrder() {
				//跳转至下单页
				let _this = this;
				let data = {
					product: this.info,
					mech: this.mech,
					serve: this.appointTime
				}
				if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整选择下单信息',
						icon: 'none'
					})
					return;
				}
				if(this.mech.status == 30) {
					uni.showToast({
						title: '当前技师不可服务',
						icon: 'none'
					})
					return;
				}
				uni.setStorage({
					key: 'placeOrder',
					data: data,
					success() {
						_this.$lnavigateTo('../placeOrder/placeOrder');
					},
					fail() {
						uni.showToast({
							title: '下单失败，请稍后再试',
							icon: 'none'
						})
					}
				})
				
				
			},
			
			_getData() {
				this._getServeDetail();			
			},
			_getServeDetail() {
				//获取详情
				let data = {
					id: this.id
				}
				getServeDetail(data).then(res => {
					this.info = res.data;
					this.info.comment.forEach(item => {
						let time = transeTime(item.createtime * 1000 , 'Y-M-D H:M:S');
						item.createtime = time;
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.banner image {
		width: 100vw;
		height: 60vw;
	}
	.base {
		padding-bottom: 40rpx;
		.left {
			.title {
				margin-bottom: 30rpx;
				max-width: 90%;
			}
			.time-img {
				width: 26rpx;
				margin-right: 8rpx;
			}
		}
		.right {
			image {
				width: 40rpx;
				height: 36rpx;
			}
			.share-wrap {
				width: 40rpx;
				height: 36rpx;
				.share-btn {
					top: 0;
					width: 40rpx;
					height: 36rpx;
					opacity: 0;
				}
			}
		}
	}
	.choice {
		margin-top: 8rpx;
		.cell-right-red {
			color: #E64242 !important;
		}
		.mech-a-b {
			height: 70rpx;
		}
		.mech-a {
			width: 70rpx;
			height: 70rpx;
		}
		.my-cell {
			color: #323233;
		}
	}
	.detail {
		margin-top: 12rpx;
		padding-top: 14rpx;
		min-height: 80vh;
		.tip {
			padding: 30rpx 4%;
		}
	}
	.blank {
		height: 100rpx;
		width: 100vw;
	}
	.footer {
		height: 100rpx;
		width: 100vw;
		position: fixed;
		bottom: 0;
		left: 0;
		border-top: 1rpx solid #f3f3f3;
		padding-left: 4%;
		padding-right: 4%;
		.btn {
			background: linear-gradient(to right bottom, #FBAAA9, #FED3C9);
			width: 210rpx;
			line-height: 60rpx;
		}
	}
	
	
	.pre-time {
		height: 50vh;
		padding-top: 1vh;
		.sure-btn {
			display: flex;
			padding-right: 4%;
			height: 4vh;
			line-height: 4vh;
			&>view {
				margin-left: auto;
			}
		}
		.nav {
			border-top: 1rpx solid #eee;
			border-bottom: 1rpx solid #eee;
			padding: 10rpx 0;
			margin: 10rpx 4%;
			width: 92%;
			height: 7.3vh;
			&>view {
				width: 33.33333%;
			}
		}
		.time-wrap {
			height: 33vh;
			.time {
				&-title {
					padding: 20rpx 4% 10rpx;
				}
				&-box {
					width: 20%;
					margin-top: 10rpx;
					text-align: center;
					text {
						display: inline-block;
						border: 1rpx solid #FBAAA9;
						padding: 4rpx 14rpx;
						border-radius: 50rpx;
					}
				}
				.active {
					text {
						background: #FBAAA9;
						color: white
					}
				}
			}
		}
	}
</style>
