<!-- 技师订单组件 -->
<template>
	<view>
		<view class="orderItem" v-for="(item, index) in list" :key="item.id" @click="todetail(item.id)">
			<view class="orderItem-id">{{ item.order_sn }}</view>
			<view class="orderItem-bd">
				<view class="orderItem-bd-project">
					<image class="cover" :src="baseImgURL + item.product_id.image"></image>
					<view class="info">
						<view class="info-name ellipsis">{{ item.product_id.name }}</view>
						<view class="info-time">
							<image class="info-time-clock" src="/static/images/bill/SJ@2x.png"></image>
							{{ item.product_id.sj }}分钟
						</view>
						<view class="info-money">{{item.product_id.price}}</view>
					</view>
				</view>
				<view class="orderItem-bd-person">
					<image :src="item.member_id.headimgurl" class="img"></image>
					<view class="name">
						<view class="name-normal">用户：</view>
						<view class="name-bold">{{ item.member_id.nickname }}</view>
					</view>
				</view>
			</view>
			<view class="orderItem-ft">
				<view class="orderItem-ft-desc">
					<view class="state">
						<text v-if="item.status == 10">待支付</text>
						<text v-if="item.status == 20">已支付</text>
						<text v-if="item.status == 30">进行中</text>
						<text v-if="item.status == 40">待评价</text>
						<text v-if="item.status == 50">已完成</text>
						<text v-if="item.status == 60">已取消</text>
					</view>
					<view class="pay">
						<view class="pay-normal" v-if="item.status == 10">待支付：</view>
						<view class="pay-normal" v-else>已支付：</view>
						<view class="pay-bold">¥ {{ item.money }}</view>
					</view>
				</view>
				<view class="orderItem-ft-oper">
					<view v-if="item.status == 20">开始服务</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
//图片跟地址
import { baseImgURL } from '@/service/config'
export default {
	props: {
		list: {  //订单列表
			type: Array
		}
	},
	data() {
		return {
			
		};
	},
	computed: {
		baseImgURL() {
			return baseImgURL;
		}
	},
	methods: {
		todetail(id) {
			uni.navigateTo({
				url: '/pages/bill/detailT/detailT?id=' + id
			})
		}
	}
};
</script>

<style lang="scss">
.orderItem{
	width: 100%;
	border-radius: 16rpx;
	box-sizing: border-box;
	padding: 10rpx 20rpx 0;
	background-color: #FFFFFF;
	color: #1A1A1A;
	overflow-x: hidden;
	margin-bottom: 20rpx;
	&-id{
		font-size: 28rpx;
		line-height: 60rpx;
	}
	&-bd{
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		padding-bottom: 20rpx;
		&::before{
			content: '';
			position: absolute;
			width: 100%;
			height: 1rpx;
			left: 0;
			bottom: 0;
			border-top: 1rpx solid #E5E5E5;
			transform: scaleY(.5);
		}
		&-project{
			display: flex;
			align-items: center;
			.cover{
				width: 155rpx;
				height: 155rpx;
				border-radius: 12rpx;
				
			}
			.info{
				padding-left: 25rpx;
				&-name{
					width: 270rpx;
					font-size: 30rpx;
					font-weight: 500;
				}
				&-time{
					display: flex;
					align-items: center;
					font-size: 24rpx;
					line-height: 60rpx;
					&-clock{
						width: 26rpx;
						height: 26rpx;
						opacity: .4;
						margin-right: 10rpx;
					}
				}
				&-money{
					font-size: 36rpx;
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
		&-person{
			text-align: center;
			.img{
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				margin-bottom: 20rpx;
			}
			.name{
				display: flex;
				align-items: center;
				width: 210rpx;
				&-normal{
					font-size: 24rpx;
					white-space: nowrap;
				}
				&-bold{
					font-size: 26rpx;
					font-weight: bold;
				}
			}
		}
	}
	&-ft{
		&-desc{
			display: flex;
			justify-content: space-between;
			line-height: 60rpx;
			.state{
				font-size: 26rpx;
				
			}
			.state--ing{
				color: #F4ADAD;
			}
			.pay{
				display: flex;
				align-items: center;
				&-normal{
					font-size: 26rpx;
					font-weight: bold;
				}
				&-bold{
					font-size: 28rpx;
					font-weight: bolder;
				}
			}
		}
		&-oper{
			display: flex;
			flex-direction: row-reverse;
			padding: 10rpx 0 20rpx 0;
			>view{
				width: 130rpx;
				border: 1rpx solid #1A1A1A;
				border-radius: 10rpx;
				font-size: 26rpx;
				text-align: center;
				line-height: 40rpx;
				margin-left: 20rpx;
			}
		}
		
	}
}
</style>
