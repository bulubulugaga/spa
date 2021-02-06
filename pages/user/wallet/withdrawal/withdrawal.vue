<!-- 提现 -->
<template>
	<view class="content">
		<!-- 标题 -->
		<view class="row title" v-if="miniType == 'user'">
			<view class="flex-middle f32">可提现金额：{{ able | FixTwo }}</view>
			<view class="tip f26">提现说明：仅佣金可提现</view>
		</view>
		<!-- 金额 -->
		<view class="row money">
			<view class="money-title f30">提现金额</view>
			<view class="con flex-middle">
				<view class="f30 mr10">￥</view>
				<view>
					<input class="f48" type="number" v-model="money" />
				</view>
			</view>
			<view class="tip f24" @click="all">全部提现</view>
		</view>
		<!-- 按钮 -->
		<view class="row btn" @click="submit">提现</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				able: 0,  //可提现金额
				money: ''
			}
		},
		computed: {
			miniType() {
				//小程序端类型
				return this.$store.state.userType;
			}
		},
		onLoad(options) {
			this.able = options.money;
		},
		methods: {
			all() {
				//全部提现
				this.money = this.able;
			},
			submit() {
				//提现
				if(!this.money) {
					uni.showToast({
						title: '请输入金额',
						icon: 'none'
					});
					return;
				}
				if(this.money > this.able) {
					uni.showToast({
						title: '您只能提现佣金',
						icon: 'none'
					});
					return;
				}
				let data = {
					money: this.money
				};
				uni.showToast({
					title: '已提现'
				})
			}
		},
		filters: {
			FixTwo(num) {
				return Number(num).toFixed(2);
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
		padding: 30rpx 20rpx;
		.tip {
			margin-top: 32rpx;
			color: #777;
		}
	}
	.money {
		padding: 30rpx 20rpx;
		&-title {
			margin-bottom: 40rpx;
			padding-bottom: 24rpx;
			border-bottom: 1rpx solid #f6f6f6;
		}
		.tip {
			margin-top: 46rpx;
			color: #777;
			margin-left: 30rpx;
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
