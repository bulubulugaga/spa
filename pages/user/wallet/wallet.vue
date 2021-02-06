<!-- 钱包 -->
<template>
	<view class="content">
		<!-- 钱包余额 -->
		<View class="wallet white border-ra-16 txt-center">
			<view class="f36" v-if="miniType == 'user'">充值余额</view>
			<view class="f36" v-else>服务费</view>			
			<view class="money">￥{{ wallet.pay_money || 0 | FixTwo }}</view>
			<view class="f30">
				累积佣金：￥{{ wallet.in_money || 0 | FixTwo }}&emsp;
				可用佣金：￥{{ wallet.money || 0 | FixTwo }}
			</view>
		</View>
		
		<!-- 操作 -->
		<view class="cell-group">
			<van-cell v-if="miniType == 'user'" icon-style="font-size: 50rpx;margin-right: 16rpx;" title="充值" icon="balance-pay" is-link url="./recharge/recharge" />
			<van-cell icon-style="font-size: 50rpx;margin-right: 16rpx;" title="提现" icon="peer-pay" is-link :url="'./withdrawal/withdrawal?money=' + wallet.money" />
			<van-cell icon-style="font-size: 50rpx;margin-right: 16rpx;" title="明细" icon="after-sale" is-link url="./detail/detail" />
		</view>
	</view>
</template>

<script>
	import { getWallet, getTInfo } from '@/service/user.js'
	export default {
		data() {
			return {
				wallet: {}
			}
		},
		computed: {
			miniType() {
				//小程序端类型
				return this.$store.state.userType;
			}
		},
		methods: {
			_getWallet() {
				if(this.miniType == 'user') {
					getWallet().then(res => {
						this.wallet = res.data;
					})
				}
				else {
					getTInfo().then(res => {
						this.wallet = {
							pay_money: res.data.service_money,
							in_money: res.data.in_money,
							money: res.data.money
						};
					})
				}
			}
		},
		onLoad() {
			this._getWallet();
		},
		filters: {
			FixTwo(num) {
				return Number(num).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: white;
	}
	.wallet {
		width: 92%;
		margin-top: 30rpx;
		margin-left: 4%;
		padding: 50rpx 20rpx 40rpx;
		background: linear-gradient(to right bottom, #fbaaa9, #fed3c9);		
		box-shadow: 0rpx 0rpx 25rpx rgba(0, 0, 0, 0.1);
		.money {
			margin: 30rpx 0 50rpx;
			font-size: 60rpx;
		}
	}
	.cell-group {
		margin-top: 50rpx;
		padding: 0 20rpx;
		border-top: 20rpx solid #f9f9f9;
	}
</style>
