<!-- 技师端订单详情 -->
<template>
	<view class="content">
		
		<!-- 预约地址 -->
		<view class="address border-ra-16 mt20">
			<view>
				<image class="img" src="/static/images/placeOrder/dztb@2x.png" mode="widthFix"></image>
			</view>
			<view>
				<view>
					<text>{{ order.name || '' }}</text>
					<!-- <text class="tel">{{ order.mobile || '' }}</text> -->
				</view>
				<view class="ad">
					{{ order.region || '' }} {{ order.detail || '' }}
				</view>
			</view>
		</view>
		
		<!-- 用户 -->
		<view class="mech flex-middle mt20 border-ra-16 bg-white" @click="toMech(order.mech)">
			<view><image :src="order.member_id.headimgurl" mode=""></image></view>
			<view>{{ order.member_id.nickname }}</view>
			<view class="ml-auto" @click.stop="concatM()"><van-icon class="f48" name="phone-circle-o" /></view>
		</view>
		
		<!-- 倒计时 -->
		<view v-if="order.status == 30" class="sTime mt20 border-ra-16 bg-white">
			<van-count-down use-slot :time="time" @change="onChange">
			  <text class="item">{{ toDouble(timeData.hours) }}</text><text class="item1">:</text>
			  <text class="item">{{ toDouble(timeData.minutes) }}</text><text class="item1">:</text>
			  <text class="item">{{ toDouble(timeData.seconds) }}</text>
			</van-count-down>
		</view>
		
		<!-- 服务信息 -->
		<view class="goods border-ra-16">
			<view class="info">
				<view>
					<image :src="baseImgURL + order.product_id.image" mode="widthFix"></image>
				</view>
				<view class="good">
					<view class="name">{{ order.product_id.name || '' }}</view>
					<view class="time">时长：{{ order.product_id.sj }}分钟</view>
					<view class="price">
						￥{{ order.product_id.price || 0 }} * {{ order.num || 0 }}
					</view>
				</view>
			</view>
			<view class="list">
				<view>备注：{{ order.remark || '无备注信息' }}</view>
			</view>
			<view class="list">
				<view>商品总价</view>
				<view>￥{{ sum_price || 0 |fixTwo }}</view>
			</view>
			<view class="list gray">
				<view>现金卡抵扣</view>
				<view>￥{{ order.cash || 0 | fixTwo }}</view>
			</view>
			<view class="list">
				<view>实付款</view>
				<view class="payment">￥{{ order.money || 0 | fixTwo}}</view>
			</view>
			<view class="list gray">
				<view>支付方式</view>
				<view>
				{{order.type == 1 ? '微信支付' : '账户余额支付'}}
				</view>
			</view>
		</view>
		
		<!-- 订单信息 -->
		<view class="order-info border-ra-16">
			<view class="title">
				订单信息
			</view>
			<view class="list">
				订单编号：&emsp;{{order.order_sn || ''}}
			</view>
			<view class="list" v-if="order.createtime">
				下单时间：&emsp;{{order.createtime}}
			</view>
			<view class="list"v-if="order.updatetiem">
				支付时间：&emsp;{{order.updatetiem}}
			</view>
			<view class="list"v-if="order.begintime">
				服务时间：&emsp;{{order.begintime}}
			</view>
		</view>
		
		<!-- 评价: 考虑到技师和服务评价不一样 -->
		<!-- <view class="order-info border-ra-16">
			<view class="title">
				评价信息
			</view>
			<view class="list">
				<van-rate :value="order.comment.star" readonly size="24" color="#FDC6BF" /> {{ order.comment.star }}
			</view>
			<view class="list gray f26">
				{{ order.comment.time }}
			</view>
			<view class="list mt20">
				{{ order.comment.content }}
			</view>
		</view> -->
		
		<!-- 底部按钮 -->
		<view class="btns">
			<view v-if="order.status == 20" @click.stop="beginServe()">开始服务</view> 
			<view v-if="order.status == 30" @click.stop="endServe()">结束服务</view> 
		</view>
		<!-- 占位 -->
		<view class="blank"></view>
	
	</view>
</template>

<script>
	//网络api
	import { baseImgURL } from '@/service/config.js'
	import { getBillDetailT, begin, end } from '@/service/bill.js'
	import { getAboutUs } from '@/service/user.js'
	//时间转换
	import { transeTime } from '@/common/utils.js'
	
	export default {
		data() {
			return {
				id: '',
				baseImgURL: '',
				order: {},  //订单信息
				serve: {}, //服务信息
				mech: {},  //技师信息
				phone: '',  //客服电话
				sum_price: '',  //总价
				
				isCancel: false,  //是否显示输入理由
				reason: '',   //理由
				
				
				time:  30 * 60 * 60 * 1000,
				timeData: {}
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.baseImgURL = baseImgURL;
			this._getData();
		},
		methods: {
			onChange(e) {
			    this.timeData = e.detail;
			 },
			concatM() {
				//拨打电话
				uni.makePhoneCall({
				    phoneNumber: this.phone
				});
			},
			beginServe() {
				//开始服务
				let _this = this;
				uni.showModal({
					title: '确认开始服务吗？',
					success() {
						begin({id: _this.id}).then(res => {
							if(res.code == 200) {
								uni.showToast({
									title: '已开始'
								})
								setTimeout(() => {
									let pages = getCurrentPages();
									let page = pages[pages.length - 1];
									page.onLoad({id: _this.id});
								}, 1200)
							}
							else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								})
							}
						})
					},
					fail() {
						//取消
					}
				})
			},
			endServe() {
				let _this = this;
				// if(this.time > 0) {
				// 	uni.showToast({
				// 		title: '不能结束服务',
				// 		icon: 'none'
				// 	})
				// 	return;
				// }
				end({id: this.id}).then(res => {
					if(res.code == 200) {
						uni.showToast({
							title: '订单已完成'
						})
						setTimeout(() => {
							let pages = getCurrentPages();
							let page = pages[pages.length - 1];
							page.onLoad({id: _this.id});
						}, 1200)							
					}
					else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			toDouble(m){
				//缺0补位
				return m < 10 ? '0' + m : m + '';
			},
			
			
			//网络请求
			_getData() {
				this._getOrderDetail();
				this._getAboutUs();
			},
			_getOrderDetail() {
				let data = {
					id: this.id
				}
				getBillDetailT(data).then(res => {
					this.order = res.data;
					this.sum_price = this.order.product_id.price * this.order.num;					
					this.order.createtime = transeTime(this.order.createtime * 1000, 'Y-M-D H:M:S');
					this.order.updatetiem = transeTime(this.order.updatetiem * 1000, 'Y-M-D H:M:S');										
															
					
					if(this.order.status == 30) {
						//开始时间
						let time1 = this.order.begintime;  
						// 订单应服务时间
						let orderTime = this.order.product_id.sj * this.order.num * 60000 ;				
						// 倒计时
						let time2 = orderTime - (new Date().getTime() - time1 * 1000);
						this.time = time2;
					}
					
					if(this.order.begintime)
						this.order.begintime = transeTime(this.order.begintime * 1000, 'Y-M-D H:M:S');
					
					
					
				})
			},
			_getAboutUs() {
				//获取客服电话
				getAboutUs().then(res => {
					this.phone = res.data.phone;
				})
			}
		},
		filters: {
			fixTwo(num) {
				return Number(num).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	page{
		font-size: 28rpx;
	}
	.address {
		background: #fff;
		width: 92%;
		margin-left: 4%;
		padding: 40rpx 4%;
		display: flex;
		align-items: center;
		.img {
			width: 80rpx;
			margin-right: 20rpx;
		}
		.tel {
			margin-left: 20rpx;
			display: inline-block;
			color: #AAAAAA;
		}
		.ad {
			margin-top: 10rpx;
		}
	}
	.mech {
		width: 92%;
		margin-left: 4%;
		padding: 20rpx 4%;
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100rpx;
			margin-right: 20rpx;
		}
	}
	.sTime {
		width: 92%;
		margin-left: 4%;
		padding: 20rpx 4%;
		.item {
			display: inline-block;
			background: #FDC6BF;
			color: white;
			font-size: 36rpx;
			width: 80rpx;
			line-height: 50rpx;
			text-align: center;
			border-radius: 16rpx;
			margin-left: 20rpx;
		}
		.item1 {
			color: #FDC6BF;
			font-size: 30rpx;
			margin-left: 10rpx;
		}
	}
	.goods {
		background: #fff;
		width: 92%;
		margin-left: 4%;
		margin-top: 20rpx;
		padding: 40rpx 4% 50rpx;
		.gray {
			color: #AAAAAA;
		}
		.info {
			display: flex;
			margin-bottom: 50rpx;
			image {
				width: 200rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
			}
			.good {
				position: relative;
				flex: 1;
				.name {
					margin-top: 14rpx;
				}
				.time {
					color: #AAAAAA;
					margin-top: 4rpx;
					font-size: 24rpx;
				}
				.price {
					position: absolute;
					bottom: 10rpx;
				}
			}
		}
		.list {
			display: flex;
			justify-content: space-between;
			margin-top: 14rpx;
			.payment {
				color: red;
				font-size: 34rpx;
			}
		}
	}
	.order-info {
		width: 92%;
		margin-left: 4%;
		margin-top: 20rpx;
		padding: 40rpx 4%;
		background-color: #fff;
		.title {
			font-size: 34rpx;
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #f9f9f9;
		}
		.list {
			margin-top: 14rpx;
		}
	}
	.btns{
		position: fixed;
		width: 100vw;
		bottom: 0;
		left: 0;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: #fff;
		view{
			min-width: 120rpx;
			height: 50rpx;
			padding: 0 20rpx;
			border-radius: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			margin-right: 20rpx;
			border: solid 1rpx #ccc;
			color: #666;
		}
	}
	.blank {
		height: 120rpx;
	}
	
	.cancel-bill{
		textarea {
			background: #f9f9f9;
			margin-left: -20rpx;
			width: 110%;
			margin-top: -36rpx;
			padding: 10rpx 20rpx;
			text-align: left;
		}
	}
</style>
