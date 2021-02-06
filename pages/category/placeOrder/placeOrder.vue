<!-- 预约下单 -->
<template>
	<view class="placeOrder">
		<!-- 选择地址 -->
		<view v-if="!editAddress" class="placeOrder-address" @click="chooseAddress">
			<view class="placeOrder-address-left">
				<image src="/static/images/placeOrder/dztb@2x.png" class="img" mode="aspectFit"></image>
				<view class="address">
					<view class="address-user">
						<view class="address-user-name">{{ address.name }}</view>
						<view class="address-user-tel">{{ address.phone }}</view>
					</view>
					<view class="address-txt mt10">{{ address.region }}  {{ address.detail }}</view>
				</view>
			</view>
			<image class="placeOrder-address-right" src="/static/images/placeOrder/dzxz@2x.png"></image>
		</view>
		<!-- 还没有添加常用地址 -->
		<view v-else class="placeOrder-service">
			<view class="placeOrder-service-row" @click="chooseRegion">
				<image src="/static/images/placeOrder/sj@2x.png" class="img"></image>
				<view class="content content-border">
					<view class="content-title">{{ address.region }}</view>
					<image class="my-last-img" src="/static/images/placeOrder/dzxz@2x.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="placeOrder-service-row">
				<image class="img opacity" src="/static/images/placeOrder/sj@2x.png"></image>
				<view class="content content-border">
					<input class="my-last-input" type="text" v-model="address.detail" placeholder="请输入具体楼号和门牌号" />
				</view>
			</view>
			<view class="placeOrder-service-row">
				<image class="img" src="/static/images/placeOrder/ren@2x.png"></image>
				<view class="content content-border">
					<input class="my-last-input" type="text" v-model="address.name" placeholder="联系人" />
				</view>
			</view>
			<view class="placeOrder-service-row">
				<image class="img" src="/static/images/placeOrder/sj@2x.png"></image>
				<view class="content content-border">
					<input class="my-last-input" type="text" v-model="address.phone" placeholder="联系电话" />
				</view>
			</view>
		</view>
		<!-- 服务 -->
		<view class="placeOrder-service">
			<view class="placeOrder-service-row">
				<image src="/static/images/placeOrder/sj@2x.png" class="img"></image>
				<view class="content content-border">
					<view class="content-title">服务时间</view>
					<view class="content-time">{{ info.serve }}</view>
				</view>
			</view>
			<view class="placeOrder-service-row">
				<image src="/static/images/placeOrder/ren@2x.png" class="img"></image>
				<view class="content">
					<view class="content-title">服务人员</view>
					<view class="content-person">
						<view class="content-person-text">
							{{ info.mech.name + ' '}} 
							<text v-if="info.mech.sex_data == 1">男</text>
							<text v-else>女</text>
						</view>
						<image :src="baseImgURL + info.mech.image" mode="aspectFill" class="content-person-img"></image>
					</view>
				</view>
			</view>
			<view class="placeOrder-service-project">
				<view class="item">
					<image :src="baseImgURL + info.product.image" class="item-img"></image>
					<view class="item-info">
						<view class="item-info-name">{{ info.product.name }}</view>
						<view class="item-info-price">{{ info.product.price }}</view>
					</view>
				</view>
				<van-stepper @change="changeNum" :value="number" min="1" max="10" disable-input 
					plus-class='plus-class' minus-class='minus-class' input-class='input-class'/>
			</view>
		</view>
		<!-- 备注 -->
		<view class="placeOrder-note">
			<view class="placeOrder-note-title">备注</view>
			<textarea class="placeOrder-note-input" v-model="remark"  placeholder="输入备注信息" placeholder-class="placeOrder-note-inputHolder"></textarea>
		</view>
		<!-- 优惠券 -->
		<view class="placeOrder-discount">
			<view @click="chooseCoupon" class="placeOrder-discount-coupon placeOrder-discount-border">
				<view class="title">现金卡</view>
				<view class="chose">
					<view class="chose-detail">{{ cash_tip }}</view>
					<image src="/static/images/placeOrder/dzxz@2x.png" mode="aspectFill" class="chose-arrow"></image>
				</view>
			</view>
			<template v-for="(item,index) in payWay">
				<view :class="['placeOrder-discount-pay',item.type==1?'placeOrder-discount-border':'']" :key="item.type" @click="togglePay(item.type)">
					<view class="left">
						<image :src="'/static/images/placeOrder/'+item.icon" mode="aspectFill" class="left-icon"></image>
						<view class="left-txt">{{item.text}}</view>
					</view>
					<image :src="'/static/images/placeOrder/'+(payDefault==item.type?'qbxz@2x.png':'qbwxz@2x.png')" class="right" mode="aspectFit"></image>
				</view>
			</template>
			
		</view>
		<!-- 按钮组 -->
		<view class="placeOrder-oper">
			<view class="placeOrder-oper-price">
				<view class="name">套餐价格：</view>
				<view class="price">{{ lastPrice | FixTwo }}</view>
			</view>
			<view class="placeOrder-oper-btn" @click="toBill">立即下单</view>
		</view>
	</view>
</template>

<script>
//图片跟地址
import { baseImgURL } from '@/service/config'
// 判断属性
import { isPhone } from '@/common/utils.js'
//下单
import { order } from '@/service/category.js'
//获取地址
import { getAddress } from '@/service/user.js'
//支付
import { pay } from '@/service/pay.js'
export default {
	components:{
	},
	data() {
		return {
			baseImgURL: '',
			editAddress: true,  //是否显示编辑地址
			address: {
				name: '',
				phone: '',
				region: '请选择地区',
				detail: ''
			},  //地址信息
			info: {},  //订单信息
			number: 1,  //下单数量
			remark: '', //备注
			payWay:[
				{
					text:'微信支付',
					icon:'wx@2x.png',
					type:1
				},{
					text:'钱包支付',
					icon:'qbzf@2x.png',
					type:2
				}
			],
			payDefault:1,
			lastPrice: 0,
			state_cash: 0,  //是否使用现金卡
			cash_tip: '暂未使用现金卡',
			cash: 0  //现金卡抵用金额
		};
	},
	computed: {
		cash_ye() {
			//现金卡余额
			let info = uni.getStorageSync('userInfo');
			return info.cash_balance;
		}
	},
	watch: {
		number(e) {
			this.lastPrice = this.info.product.price * e;
		},
		cash_tip(e) {
			if(this.state_cash) {
				//如果使用现金卡，计算抵扣金额
				let cash1 = this.lastPrice * 0.1;
				if(this.cash_ye < cash1) {
					//现金卡余额小于应抵扣金额
					this.cash = Number(this.cash_ye).toFixed(2);
					this.lastPrice = this.lastPrice - this.cash;
				}
				else {
					this.cash = Number(cash1).toFixed(2);
					this.lastPrice = this.lastPrice - this.cash;
				}
			}
		}
	},
	onLoad() {
		this.baseImgURL = baseImgURL;
		this.getInfo();
		this._getData();
	},
	methods: {
		getInfo() {
			//获取订单信息
			uni.getStorage({
				key: 'placeOrder',
				success: (e) => {
					this.info = e.data,
					this.lastPrice = e.data.product.price
				}
			})
		},
		chooseAddress() {
			//选择地址
			uni.navigateTo({
				url: '/pages/user/address/address'
			})
		},
		chooseRegion() {
			//选择地区
			//选择地区
			let _this = this;
			uni.chooseLocation({
				success: function(res) {
					_this.address.region = res.address + res.name;
					
					// _this.ader.la = res.latitude;
					// _this.ader.lo = res.longitude;
				},
				fail: function() {
					//打开地图失败
					uni.getSetting({
						success: function(res) {
							let statu = res.authSetting;
							if (!statu['scope.userLocation']) {
								uni.showModal({
									title: '是否授权当前位置',
									content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
									success: function(tip) {
										if (tip.confirm) {
											uni.openSetting({
												success: function(data) {
													if (data.authSetting["scope.userLocation"] === true) {
														uni.showToast({
															title: '授权成功',
															icon: 'success',
															duration: 1000
														})
														//授权成功之后，再调用chooseLocation选择地方
														uni.chooseLocation({
															success: function(res) {
																_this.address.region = res.address + res.name;
															},
														})
													} else {
														uni.showToast({
															title: '授权失败',
															icon: 'success',
															duration: 1000
														})
													}
												}
											})
										}
									}
								})
							}
						},
						fail: function(res) {
							uni.showToast({
								title: '调用授权窗口失败',
								icon: 'success',
								duration: 1000
							})
						}
					})
				}
			});
		},
		changeNum(e) {
			//改变数量
			this.number = e.detail;
		},
		chooseCoupon() {
			//选择现金卡
			this.$lnavigateTo('/pages/user/coupon/coupon?type=select');
		},
		// 切换支付方式
		togglePay(type){
			this.payDefault=type;
		},
		toBill() {
			if(!uni.getStorageSync('token')) {
				console.log('未登录');
				uni.navigateTo({
					url: '/pages/user/login/login'
				});
				return;
			}
			
			//下单并跳转到订单
			let data = {
				product_id: this.info.product.id,
				serve: this.info.serve,
				tec_id: this.info.mech.id,
				remark: this.remark,
				money: this.lastPrice,
				// money: 0.01,
				region: this.address.region,
				detail: this.address.detail,
				name: this.address.name,
				mobile: this.address.phone,
				num: this.number,
				type: this.payDefault,
				state: this.payDefault,
				state_cash: this.state_cash,
				cash: this.cash
			}
			
			if(this.address.region == '请选择地区') {
				uni.showToast({title: '请选择地址',icon: 'none'})
				return;
			}
			if(!this.address.detail) {
				uni.showToast({title: '请填写详细地区信息',icon: 'none'})
				return;
			}
			if(!this.address.name) {
				uni.showToast({title: '请输入联系人',icon: 'none'})
				return;
			}
			if(!this.address.phone) {
				uni.showToast({title: '请输入电话',icon: 'none'})
				return;
			}
			if(!isPhone(this.address.phone)) {
				uni.showToast({title: '联系电话格式有误',icon: 'none'})
				return;
			}
			//下单
			order(data).then(res => {
				console.log(res);
				if(res.code === 200) {
					let data = res.data.payRes;
					//支付
					if(this.payDefault === 1) {
						pay(data).then(res => {
							uni.reLaunch({
								url: '/pages/tabBar/switch/switch?active=' + 2
							})
						})
					}
					else {
						uni.reLaunch({
							url: '/pages/tabBar/switch/switch?active=' + 2
						})
					}
				}
				else {
					//下单失败
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/tabBar/switch/switch?active=' + 2
						})
					}, 1200);
				}
			})
		},
		
		
		_getData() {
			this._getAddress();
		},
		_getAddress() {
			//获取地址
			getAddress().then(res => {
				if(!res.data) {
					//无地址
					this.editAddress = true;
				}
				else {
					this.editAddress = false;
					let i = 0
					for( ; i < res.data.length; i++) {
						if(res.data[i].is_true) {
							this.address = res.data[i];
							break;
						}
					}
					if(i == res.data.length) {
						this.address = res.data[0];
					}
				}
			})
		}
	},
	filters: {
		FixTwo(num) {
			return Number(num).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
page {
	background: white;
}
.placeOrder{
	width: 100%;
	&-address{
		width: 100%;
		border-top: 6rpx solid #FAFAFA;
		border-bottom: 6rpx solid #FAFAFA;
		box-sizing: border-box;
		padding:50rpx 30rpx 25rpx 50rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&-left{
			display: flex;
			.img{
				width: 76rpx;
				height: 76rpx;
				margin-right: 25rpx;
			}
			.address{
				width: 80%;
				&-user{
					display: flex;
					font-size: 26rpx;
				}
				&-txt{
					font-size: 30rpx;
				}
				
			}
			
		}
		&-right{
			width: 14rpx;
			height: 27rpx;
		}
	}
	&-service{
		border-bottom: 6rpx solid #FAFAFA;
		width: 100%;
		box-sizing: border-box;
		padding: 0 30rpx;
		&-row{
			display: flex;
			align-items: center;
			line-height: 94rpx;
			.img{
				width: 32rpx;
				height: 32rpx;
				margin-right: 40rpx;
			}
			.content{
				width: calc(100% - 72rpx);
				font-size: 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				&-time{
					color: #E64242;
				}
				&-person{
					display: flex;
					align-items: center;
					&-text{
						font-size: 26rpx;
					}
					&-img{
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						margin-left: 25rpx;
					}
				}
			}
			.content-border{
				position: relative;
				&::before{
					content: '';
					width: 100%;
					height: 1rpx;
					position: absolute;
					left: 0;
					bottom: 0;
					border-bottom: 1rpx solid #F3F3F3;
					transform: scaleY(.5);
				}
			}
		}
		&-project{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			.item{
				display: flex;
				align-items: center;
				&-img{
					width: 99rpx;
					height: 99rpx;
					border-radius: 4rpx;
				}
				&-info{
					padding-left: 20rpx;
					&-name{
						font-weight: bold;
					}
					&-price{
						font-size: 34rpx;
						color: #E64242;
						font-weight: bold;
						position: relative;
						padding-left: 17rpx;
						&::before{
							content: '¥';
							font-size: 26rpx;
							font-weight: bold;
							position: absolute;
							left: 0;
							top: 8rpx;
						}
					}
				}
				
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
			}
		}
	}
	&-note{
		border-bottom: 6rpx solid #FAFAFA;
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx;
		&-title{
			font-size: 30rpx;
			font-weight: 500;
		}
		&-input{
			width: 100%;
			height: 220rpx;
			overflow-y: auto;
			background-color: #EEEEEE;
			border-radius: 10rpx;
			margin-top: 20rpx;
			box-sizing: border-box;
			padding: 20rpx;
		}
		&-inputHolder{
			color: #AAAAAA;
			font-size: 24rpx;
		}
	}
	&-discount{
		width: 100%;
		padding: 0 30rpx;
		margin-bottom: 200rpx;
		&-coupon{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 90rpx;
			.title{
				font-size: 30rpx;
			}
			.chose{
				display: flex;
				align-items: center;
				&-detail{
					font-size: 26rpx;
					color: #E64242;
				}
				&-arrow{
					width: 9rpx;
					height: 17rpx;
					margin-left: 17rpx;
				}
			}
		}
		&-border{
			position: relative;
			&::before{
				content: '';
				width: 100%;
				height: 1rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				border-bottom: 1rpx solid #F3F3F3;
				transform: scaleY(.5);
			}
		}
		&-pay{
			line-height: 115rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left{
				display: flex;
				align-items: center;
				&-icon{
					width: 51rpx;
					height: 51rpx;
				}
				&-txt{
					margin-left: 35rpx;
				}
			}
			.right{
				width: 26rpx;
				height: 26rpx;
			}
		}
	}
	&-oper{
		width: 100%;
		height: 110rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #FFFFFF;
		&-price{
			display: flex;
			align-items: center;
			font-size: 30rpx;
			.name{
				
			}
			.price{
				position: relative;
				font-size: 36rpx;
				color: #E64242;
				padding-left: 25rpx;
				font-weight: bold;
				&::before{
					content: '¥';
					position: absolute;
					font-size: 30rpx;
					color: #E64242;
					bottom: 2rpx;
					left: 0;
				}
				
			}
		}
		&-btn{
			width: 220rpx;
			height: 60rpx;
			background: linear-gradient(131deg, #FBAAA9 0%, #FED3C9 100%);
			border-radius: 16rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			line-height: 50rpx;
			
		}
	}
}
.my-last-img {
	width: 9rpx;
	height: 17rpx;
}
.my-last-input {
	height: 94rpx;
}
</style>
