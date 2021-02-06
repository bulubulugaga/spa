<!-- 服务列表组件 -->
<template>
	<view>
		<view class="serve flex bg-white border-ra-16 mb20" v-for="(item, index) in list" :key="index" @click="toDetail(item.id)">
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
				<view class="ellipsis f26 1a1a1a">{{item.detail}}</view>
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
			list: {  //服务列表
				type: Array
			}
		},
		created() {
			this.baseImgURL = baseImgURL;
		},
		methods: {
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/category/serveDetail/serveDetail?id=' + id
				})
			}
		}
	}
</script>

<style>
	.serve {
		padding: 26rpx 20rpx;
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
</style>
