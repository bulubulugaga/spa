<!-- 订单详情 -->
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
					<text class="tel">{{ order.mobile || '' }}</text>
				</view>
				<view class="ad">
					{{ order.region || '' }} {{ order.detail || '' }}
				</view>
			</view>
		</view>
		
		<!-- 技师 -->
		<view class="mech flex-middle mt20 border-ra-16 bg-white" @click="toMech(order.mech)">
			<view><image :src="baseImgURL + mech.image" mode=""></image></view>
			<view>{{ mech.name }}</view>
			<view class="ml-auto" @click.stop="concatM()"><van-icon class="f48" name="phone-circle-o" /></view>
		</view>
		
		<!-- 服务信息 -->
		<view class="goods border-ra-16">
			<view class="info">
				<view>
					<image :src="baseImgURL + serve.image" mode="widthFix"></image>
				</view>
				<view class="good">
					<view class="name">{{ serve.name || '' }}</view>
					<view class="time">时长：{{ serve.sj }}分钟</view>
					<view class="price">
						￥{{ serve.price || 0 | fixTwo }} * {{ order.num || 0 }}
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
			<view class="list"v-if="order.endtime">
				完成时间：&emsp;{{order.endtime}}
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
			<block v-if="order.status == 10">
				<view @click.stop="payBillP()">支付</view>
				<view @click.stop="cancelBillP()">取消订单</view>		
			</block>
			<view v-if="order.status == 20" @click.stop="cancelBillP()">取消订单</view>
			<view v-if="order.status == 40" @click.stop="toComment()">评价</view>
		</view>
		<!-- 占位 -->
		<view class="blank"></view>
		
		
		<popup class="cancel-bill" v-if="isCancel" :v-show="true" @sure="sureCancel" @close="this.isCancel = false" btn="确认">
			<template v-slot:popupTip>
				<textarea type="text" v-model="reason" placeholder="请输入取消订单原因" ></textarea>
			</template>
		</popup>
	</view>
</template>

<script>
	//网络api
	import { baseImgURL } from '@/service/config.js'
	import { getBillDetail, cancelBill, payBill } from '@/service/bill.js'
	import { getServeDetail, getMechDetail } from '@/service/category.js'
	import { getAboutUs } from '@/service/user.js'
	//时间转换
	import { transeTime } from '@/common/utils.js'
	//弹窗组件
	import popup from "@/components/popup/popup.vue"
	//支付
	import { pay } from '@/service/pay.js'
	export default {
		components: {
			popup
		},
		data() {
			return {
				id: '',
				index: 0,
				baseImgURL: '',
				order: {},  //订单信息
				serve: {}, //服务信息
				mech: {},  //技师信息
				phone: '',  //客服电话
				sum_price: '',  //总价
				
				isCancel: false,  //是否显示输入理由
				reason: '',   //理由
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.index = options.index;
			this.baseImgURL = baseImgURL;
			this._getData();
		},
		methods: {
			toMech(id) {
				//技师详情
				uni.navigateTo({
					url: '/pages/category/mechDetail/mechDetail?id=' + id
				})
			},
			concatM() {
				//拨打电话
				uni.makePhoneCall({
				    phoneNumber: this.phone
				});
			},
			cancelBillP() {
				//取消订单
				this.isCancel = true;
			},
			payBillP() {
				//支付订单
				payBill({id:this.id}).then(res1 => {
					pay(res1.data.payRes).then(res => {
						console.log('支付成功');
					})
				})
			},
			sureCancel(e) {
				if(!this.reason) {
					uni.showToast({
						title: '请输入取消订单理由',
						icon: 'none'
					});
					return;
				}
				let data = {
					id: this.id,
					cancel: this.reason
				}
				cancelBill(data).then(res => {
					if(res.code === 200) {
						uni.showToast({
							title: '已取消'
						})
						this.isCancel = false;
						let pages = getCurrentPages();
						let page = pages[pages.length - 1];
						page.onLoad({id: this.id});
					}
					else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			toComment() {
				uni.navigateTo({
					url: '/pages/bill/comment/comment?id=' + this.id
				})
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
				getBillDetail(data).then(res => {
					this.order = res.data;
					this.order.createtime = transeTime(this.order.createtime * 1000, 'Y-M-D H:M:S');
					this.order.updatetiem = transeTime(this.order.updatetiem * 1000, 'Y-M-D H:M:S');
					if(this.order.endtime)
						this.order.endtime = transeTime(this.order.endtime * 1000, 'Y-M-D H:M:S');
					
					this._getServeDetail(this.order);
					this._getMechDetail(this.order);
				})
			},
			_getServeDetail(data) {
				//技师信息
				getServeDetail({id: data.product_id}).then(res => {
					this.serve = res.data;
					this.sum_price = this.serve.price * data.num;
				})
			},
			_getMechDetail(data) {
				//技师信息
				getMechDetail({id: data.tec_id}).then(res => {
					this.mech = res.data.technician;
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
