<!-- 技师列表组件 -->
<template>
	<view>
		<view class="serve bg-white border-ra-16 mb20" v-for="(item, index) in list" :key="index" @click="toDetail(item.id, index)">			
			<!-- 个人介绍 -->
			<view class="mecha-top flex">
				<view class="mecha-top-left">
					<image class="circle" :src="baseImgURL + item.image" mode=""></image>
					<view v-if="item.status == 10" class="mecha-type white f26 txt-center border-ra-30 ">可服务</view>
					<view v-else-if="item.status == 20" class="mecha-type white f26 txt-center border-ra-30 ">服务中</view>
					<view v-else class="mecha-type white f26 txt-center border-ra-30 ">不可服务</view>
				</view>
				<view class="mecha-top-right">
					<view class="flex-middle mt20">
						<view class="f30">{{ item.name }}</view>
						<view v-if="item.sex_data == 2"><image src="/static/images/category/woman.png" mode="widthFix"></image></view>
						<view v-else><image src="/static/images/category/man.png" mode="widthFix"></image></view>
					</view>
					<view class="ellipsis-2 f26 aaa mt20">
						{{item.introduce}}
					</view>
				</view>
			</view>
			<!-- 其他信息 -->
			<view class="mecha-bottom flex-cover flex-middle f24">
				<view>
					<view class="flex-middle">
						<image class="star-img" src="../../static/images/category/star.png" mode="widthFix"></image>
						<view>星级评价</view>
					</view>
					<view class="flex-middle mt10">
						<view class="flex-middle star-remark"><van-rate :value="item.star || 5" readonly size="24" color="#FDC6BF" /></view>
						<view class="flex-middle">{{ item.star || 5 }}</view>
					</view>
				</view>
				<view>
					已接{{ item.order_num }}单
				</view>
				<view class="flex-middle">
					<view class="flex-middle"><image class="distri-img" src="../../static/images/home/adder.png" mode="widthFix"></image></view>
					<view class="flex-middle">{{ item.dis || 0 | fixTwo }}km</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseImgURL } from '@/service/config'
	export default {
		data() {
			return {
				baseImgURL: '',  //图片基地址
			}
		},
		props: {
			list: {  //技师列表
				type: Array
			},
			isSelect: {  //是否选择返回上一页
				type: Boolean,
				default: false
			}
		},
		created() {
			this.baseImgURL = baseImgURL;
		},
		methods: {
			toDetail(id, index) {
				if(this.isSelect) {
					let pages = getCurrentPages(); // 页面栈
					let beforePage = pages[pages.length - 2]; // 前一个页面
					beforePage.$vm.mech = this.list[index];
					uni.navigateBack();
				}
				else {
					//默认跳转到详情
					uni.navigateTo({
						url: '/pages/category/mechDetail/mechDetail?id=' + id
					})
				}
			}
		},
		filters: {
			fixTwo(num) {
				return Number(num).toFixed(2);
			}
		}
	}
</script>

<style>
	.serve {
		padding: 26rpx 20rpx;
	}
	.mecha-top-left image {
		width: 120rpx;
		height: 120rpx;
	}
	.mecha-type {
		margin-left: 10rpx;
		background: linear-gradient(to bottom, #FED3C9, #FBAAA9);
		padding: 4rpx 8rpx;
	}
	.mecha-top-right {
		margin-left: 20rpx;
		padding-bottom: 10rpx;
		border-bottom: 1rpx solid #EDEDED;
	}
	.mecha-top-right image {
		width: 28rpx;
		margin-left: 20rpx;
	}
	
	
	.mecha-bottom {
		margin-top: 26rpx;
	}
	.star-img {
		width: 34rpx;
		margin-right: 10rpx;
	}
	.star-remark {
		margin-right: 10rpx;
	}
	.distri-img {
		width: 18rpx;
	}
	
</style>
