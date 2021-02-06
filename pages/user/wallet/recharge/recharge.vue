<!-- 充值 -->
<template>
	<view class="content">
		<!-- 标题 -->
		<view class="row title flex-cover f30">
			<view class="flex-middle">充值方式</view>
			<view><image src="/static/images/placeOrder/wx@2x.png" mode="widthFix"></image></view>
		</view>
		<!-- 金额 -->
		<view class="row money">
			<view class="money-title f30">充值金额</view>
			<view class="con flex-middle">
				<view class="f30 mr10">￥</view>
				<view>
					<input class="f48" type="number" v-model="money" />
				</view>
			</view>
		</view>
		<!-- 快捷金额 -->
		<view class="box-wrap flex-cover txt-center">
			<view @click="clickBox(item)" class="box" v-for="(item, index) in list" :key="index">{{ item }}</view>
		</view>
		<!-- 按钮 -->
		<view class="row btn" @click="submit">充值</view>
	</view>
</template>

<script>
	//api
	import { recharge, getUserInfo } from '@/service/user.js'
	//支付
	import { pay } from '@/service/pay.js'
	export default {
		data() {
			return {
				list: [100, 500, 1000, 3000],  //快捷充值
				money: ''  //充值金额
			}
		},
		methods: {
			clickBox(item) {
				//选择快捷充值
				this.money = item;
			},
			submit() {
				//充值
				let data = {
					money: this.money
				};
				if(!this.money) {
					uni.showToast({
						title: '请输入充值金额',
						icon: 'none'
					})
					return;
				}
				recharge(data).then(res => {
					pay(res.data.payRes).then(res1 => {
						console.log('充值成功');
						let pages = getCurrentPages();
						let beforePage = pages[pages.length - 2];
						beforePage.onLoad();
						
						//重新获取用户信息
						getUserInfo().then(res => {
							if(res.code === 200) {
								uni.setStorageSync('userInfo', res.data);
							}
						})
						
						uni.showToast({
							title: '已充值'
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.row {
		background: white;
		width: 92%;
		margin: 30rpx 4%;
		border-radius: 16rpx;
	}
	.title {
		padding: 20rpx 20rpx;
		image {
			width: 60rpx;
		}
	}
	.money {
		padding: 30rpx 20rpx 50rpx;
		&-title {
			margin-bottom: 40rpx;
			padding-bottom: 24rpx;
			border-bottom: 1rpx solid #f6f6f6;
		}
	}
	.box-wrap {
		width: 92%;
		margin: 30rpx 4%;
		.box {
			background: white;
			color: gray;
			width: 140rpx;
			padding: 20rpx 0;
			border-radius: 16rpx;;
		}
	}
	.btn {
		color: white;
		background: #FBAAA9;
		font-size: 32rpx;
		margin-top: 80rpx;
		text-align: center;
		line-height: 80rpx;
		padding: 0;
		letter-spacing: 4rpx;
	}
</style>
