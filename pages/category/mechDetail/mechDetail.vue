<!-- 技师详情 -->
<template>
	<view class="content">
		<!-- 头部 -->
		<view class="header">
			<view class="contain bg-white">
				<!-- 基础信息 -->
				<view class="base flex">
					<view class="txt-center mr20">
						<image class="avar circle" :src="baseImgURL + info.image" mode=""></image>
						<view class="type f26 white mt20">
							<text v-if="info.status == 10">可服务</text>
							<text v-else-if="info.status == 20">服务中</text>
							<text v-else>不可服务</text>
						</view>
					</view>
					<view class="ml30">
						<view class="flex-middle mt10">
							<view class="f30 FB">{{ info.name }}</view>
							<view class="sex" v-if="info.sex_data == 2"><image src="/static/images/category/woman.png" mode="widthFix"></image></view>
							<view class="sex" v-else><image src="/static/images/category/man.png" mode="widthFix"></image></view>
						</view>
						<view class="f26 mt20">
							<van-rate class="mr10" :value="info.star || 5" readonly size="28" color="#FDC6BF" /> {{ info.star || 5 }}
						</view>
						<view class="flex f24 mt20">
							<view class="flex-middle">已接{{ info.order_num }}单</view>
							<view class="flex-middle ml30"><image class="dis-img" src="/static/images/home/adder.png" mode="widthFix"></image></view>
							<view class="flex-middle">{{ info.dis || 0 | fixTwo }}km</view>
						</view>
					</view>
					<view class="share ml-auto f28">
						<view class="mt10">
							关注 
							<image @click="changeCollection" v-if="collect !== 1" src="/static/images/category/collection_mech.png" mode=""></image>
							<image @click="changeCollection" v-else src="/static/images/category/collection_mech_1.png" mode=""></image>
						</view>
						<view class="mt30 flex">
							<view>分享</view>
							<view class="pr">
								<image class="pa" src="/static/images/category/share_mech.png" mode=""></image>
								<button class="share-btn pa" open-type="share" data-id='1234'>分享</button>
							</view>
						</view>
					</view>
				</view>
				<!-- 个人介绍 -->
				<view class="intro f28">
					{{ info.introduce }}
				</view>
			</view>
		</view>
		
		<!-- 其他基本信息 -->
		<view class="body-info">
			<van-cell title="性别" title-class="f30" :value="info.sex_data == '2' ? '女' : '男'" value-class="cell-right"/>
			<van-cell title="年龄" title-class="f30" :value="info.age + '岁'" value-class="cell-right"/>
			<van-cell title="身高" title-class="f30" :value="info.stature + 'cm'" value-class="cell-right"/>
			<van-cell title="体重" title-class="f30" :value="info.weight + 'kg'" value-class="cell-right"/>
		</view>
		
		<!-- 选择时间 -->
		<view class="body-info">
			<van-cell is-link title="预约时间" :value="appointTime" link-type="navigateTo" value-class="cell-right-red" @click.native="isShowTime = true" />
		</view>
		
		<!-- 服务和评价 -->
		<view class="blank bg-white"></view>
		<view class="detail">
			<van-tabs :active="0" color="#FDC6BF" line-width="56" line-height="2"
				animated sticky>
			  <van-tab title="提供服务" >
				  <view class="serve flex bg-white border-ra-16" v-for="(item, index) in serves" :key="item.id">
				  	<view>
				  		<image class="serve-img border-ra-16" :src="baseImgURL + item.image"></image>
				  	</view>
				  	<view class="right">
				  		<view class="ellipsis f30 mt10">{{item.name}}</view>
				  		<view class="f36 c-E64242 mt6 FB">￥{{item.price}}</view>
				  		<view class="f26 1a1a1a mt6 flex-middle">
				  			<view class="flex-middle">
				  				<image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image>
				  			</view>
				  			<view class="flex-middle">
				  				{{item.sj}}分钟
				  			</view>
				  		</view>
				  		<view class="bottom f26 1a1a1a mt10 flex-middle">
				  			<view>已售{{item.amount || 0}}件</view>
				  			<view v-if="item.num == 0" class="btn ml-auto white txt-center" @click="addNum(item, index)">预约</view>
				  			<van-stepper v-else @change="changeNum($event, item, index)" class="ml-auto" :value="item.num" min="0" max="10" disable-input plus-class='plus-class' minus-class='minus-class' input-class='input-class'/>
				  		</view>
				  	</view>
				  </view>
			  </van-tab>
			  <van-tab title="用户评价">
				  <comment-list :list="comment" type="m"></comment-list>
			   </van-tab>
			</van-tabs>
		</view>
		
		<!-- 占位 -->
		<view class="f-blank"></view>
		<!-- 底部 -->
		<view class="footer bg-white flex-middle">
			<text class="f30">价格：</text>
			<text class="c-E64242 f36 FB"> ￥{{ sumPrice | fixTwo }} </text>
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
	//评论组件
	import commentList from '@/components/commentList/commentList.vue'
	//图片跟地址
	import { baseImgURL } from '@/service/config'
	//网络数据
	import { getMechDetail, getServeDetail, changeCollection } from '@/service/category'
	//时间转换
	import { transeTime, getAfterDay } from '@/common/utils'
	import { getGPSLocation, space } from '@/common/getLocation.js'
	export default {
		components: {
			commentList
		},
		data() {
			return {
				id: '',  //技师id
				baseImgURL: '',
				
				info: {},  //详情
				comment: [],  //评价
				collect: 0, //是否收藏
				serves: [],  //可选服务
				chooseServe: [],
				chooseSIndex: -100,  //选择服务的下标,初始化不能为0
				
				sumPrice: '0'  ,//总价
				
				
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
			
			this._getData();
		},
		methods: {
			changeCollection() {
				//修改收藏状态
				let data = {
					status: 2,
					technician_id: this.id
				}
				changeCollection(data).then(res => {
					if(res.code === 1) {
						//修改成功则修改页面
						this.collect = this.collect == 1 ? 0 : 1;
						uni.showToast({
							title: res.msg
						})
						
						//如果是收藏页进入，刷新收藏页，改为技师列表展示
						let pages = getCurrentPages();
						let beforPage = pages[pages.length - 2];
						if(beforPage.route == "pages/user/collection/collection") {
							beforPage.onLoad();
							beforPage.$vm.activeTab = 1;
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
			addNum(item, index) {
				//点击预约
				let row = item;
				row.num = 1;
				this.$set(this.serves, index, row);
				
				//限制为只能选择1个服务，则先清除已选服务
				//将之前服务的下标存起来(放在最后)，选择数量改为1个				
				this.chooseServe = [];
				if(this.chooseSIndex != -100) {
					//第一次选择不需修改
					this.serves[this.chooseSIndex].num = 0;
				}
				
				//加入已选服务列表 计算价格
				this.chooseServe.push(this.serves[index]);
				this.sumPrice = this.serves[index].price;
				
				//存下标
				this.chooseSIndex = index;
			},
			changeNum(e, item, index) {
				//步进器值改变时
				if(e.detail == 0) {
					//预约数量减为0时
					let row = item;
					row.num = 0;
					this.$set(this.serves, index, row);
					//移出已选服务列表
					// this.chooseServe.pop(……)
					this.chooseServe = [];
					this.sumPrice = 0;
					
					//下标一定要改，否则再次点击不生效
					this.chooseSIndex = -100;
				}
				else {
					this.$set(this.chooseServe[0], 'num', e.detail);
					this.sumPrice = this.serves[index].price * e.detail;
				}
			},
			toPlaceOrder() {
				//跳转至下单页
				let _this = this;
				if(this.info.status == 30) {
					uni.showToast({
						title: '当前技师不可服务',
						icon: 'none'
					})
					return;
				}
				if(this.chooseServe.length == 0) {
					uni.showToast({
						title: '请选择服务项目',
						icon: 'none'
					})
				}
				else {
					let data = {
						product: this.chooseServe[0],
						mech: this.info,
						serve: this.appointTime
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
				}
			},
			
			
			
			_getData() {
				//获取数据
				this._getMechDetail();
				// this._getInfo();
			},
			_getMechDetail() {
				//技师详情
				let data = {
					id: this.id
				}
				getMechDetail(data).then(res => {
					this.info = res.data.technician;
					this.comment = res.data.comment;
					this.collect = res.data.collect;
					getGPSLocation().then(res=> {
						let a = space(this.info.latitude,this.info.longitude,res.latitude,res.longitude);
						this.$set(this.info, 'dis', a);
					})
					if(this.comment) {
						this.comment.forEach(item => {
							let time = transeTime(item.createtime * 1000 , 'Y-M-D H:M:S');
							item.createtime = time;
						})
					}
					
					//获取服务
					if(this.info.product_ids) {
						let s = this.info.product_ids.split(',');
						this._getServe(s);
					}
				})
			},
			_getServe(s) {
				//获取服务
				s.forEach(item => {
					getServeDetail({id: item}).then(res => {
						this.$set(res.data, 'num', 0);
						this.serves.push(res.data);
					})
				})
			}
		},
		filters: {
			fixTwo(num) {
				//保留两位小数
				return Number(num).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	.header {
		padding: 40rpx 60rpx;
		background: linear-gradient(to bottom, #FED3C9, #FBAAA9);
		.contain {
			padding: 30rpx 40rpx;
			.base {
				.avar {
					width: 100rpx;
					height: 100rpx;
				}
				.type {
					line-height: 36rpx;
					background: linear-gradient(to bottom, #FED3C9, #FBAAA9);
					border-radius: 10rpx;
				}
				.sex {
					image {
						width: 28rpx;
						margin-left: 20rpx;
					}
				}
				.dis-img {
					width: 16rpx;
					margin-right: 4rpx;
				}
				.share {
					image {
						width: 50rpx;
						height: 50rpx;
						margin-left: 10rpx;
						vertical-align: middle;
					}
					.share-btn {
						width: 50rpx;
						height: 50rpx;
						margin-left: 10rpx;
						opacity: 0;
					}
				}
			}
			.intro {
				margin-top: 30rpx;
				padding-top: 20rpx;
				border-top: 2rpx solid #EDEDED;
			}
		}
	}
	.body-info {
		.cell-right {
			color: black;
			font-size: 30rpx;
		}
	}
	.blank {
		margin-top: 12rpx;
		padding-top: 14rpx;
	}
	.detail {
		min-height: 80vh;
		.serve {
			padding: 26rpx 20rpx;
			width: 92%;
			margin: 20rpx auto 0;
		}
		.serve-img {
			width: 202rpx;
			height: 202rpx;
			margin-right: 30rpx;
		}
		.right {
			width: calc(100% - 232rpx);
		}
		.ellipsis {
			width: 100%;
			margin-top: 16rpx;
		}
		.time-img {
			width: 26rpx;
			margin-right: 14rpx;
		}
		.bottom {
			height: 44rpx;
		}
		.btn {
			width: 124rpx;
			line-height: 44rpx;
			background: linear-gradient(to right bottom, #FED2C8, #FBABA9);
			border-radius: 8rpx;
		}
		.plus-class{
			width: 32rpx;
			height: 32rpx;
			background: #FDC6BF;
			border-radius: 50%;
			color: #FFFFFF;
		}
		.minus-class{
			width: 32rpx;
			height: 32rpx;
			border: 1rpx solid #ACAAA8;
			background-color: #FFFFFF;
			border-radius: 50%;
			color: #FDC6BF;
		}
		.input-class{
			background-color: #FFFFFF;
			width: 40rpx;
			color: black;
		}
	}
	.f-blank {
		height: 120rpx;
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
	
	.cell-right-red {
		color: #E64242 !important;
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
