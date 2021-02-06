<!-- 设置 -->
<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row" @click="toUrl('/pages/user/setting/changeInfo/changeInfo')">
					<view class="title">个人信息</view>
					<view class="right">
						<view class="tis"></view>
						<van-icon name="arrow" />
					</view>
				</view>
				<view class="row" @click="toUrl('/pages/user/setting/changePhone/changePhone')">
					<view class="title">手机号</view>
					<view class="right">
						<view class="tis"></view>
						<van-icon name="arrow" />
					</view>
				</view>
				<view class="row" @click="toUrl('/pages/user/setting/changePass/changePass')">
					<view class="title">修改密码</view>
					<view class="right">
						<view class="tis"></view>
						<van-icon name="arrow" />
					</view>
				</view>
				
				<!-- 清除缓存 -->
				<view class="row" @click="clearStorage">
					<view class="title">清除缓存</view>
					<view class="right">
						<view class="tis"></view>
						<van-icon name="arrow" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			toUrl(url) {
				this.$lnavigateTo(url);
			},
			clearStorage() {
				//清楚缓存
				uni.showModal({
					title: '提示',
					content: '确认清除小程序缓存吗？',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.clearStorage();
							uni.showToast({
								title: '已清除',
								icon: 'success'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.content{
	padding-bottom: 20upx;
	.list{
		margin-top: 2rpx;
		padding-left: 4%;
		padding-right: 4%;
		background-color: #fff;
		margin-bottom: 20upx;
		.row{
			widows: 100%;
			min-height: 90upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: solid 1upx #eee;
			&:last-child{
				border-bottom: none;
			}
			.title{
				font-size: 32upx;
				color: #333;
			}
			.right{
				display: flex;
				align-items: center;
				color: #999;
				.tis{
					font-size: 26upx;
					margin-right: 5upx;
					max-height: 120upx;
					image{
						width: 100upx;
						height: 100upx;
						border-radius: 100%;
						margin: 10upx 0;
					}
				}
				.icon{
					width: 40upx;
					color: #cecece;
				}
			}
			
		}
	}
}

</style>
