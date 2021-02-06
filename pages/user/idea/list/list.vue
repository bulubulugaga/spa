
<!-- 新闻列表 -->
<template>
	<view class="content">
		<view v-for="(item, index) in list" :key="index" class="serve flex bg-white border-ra-16 mt20" @click="toDetail(item)">
			<view class="right">
				<view class="f26 1a1a1a mt6 flex-middle">
					<view class="flex-middle">
						<image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image>
					</view>
					<view class="flex-middle">
						{{ item.createtime }}
					</view>
				</view>
				<rich-text class="ellipsis-2 f28 1a1a1a" :nodes="item.content"></rich-text>		
				<view class="result f26 gray">
					反馈结果：
					<text v-if="item.status == 10">处理中</text>
					<text v-if="item.status == 20">已处理</text>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import { loadIdeaUList, loadIdeaTList } from '@/service/user.js'
	import { transeTime } from '@/common/utils.js'
	export default {
		data() {
			return {
				list: []
			}
		},
		computed: {
			miniType() {
				return this.$store.state.userType
			}
		},
		methods: {
			toDetail(row) {
				uni.setStorage({
					key:'idea',
					data: row,
					success() {
						uni.navigateTo({
							url: '../detail/detail'
						})
					}
				});
			},
			getList() {
				if(this.miniType === 'user') {
					loadIdeaUList().then(res => {
						this.list = res.data;
						this.list.forEach(item => {
							item.createtime = transeTime(item.createtime * 1000, 'Y-M-D H:M:S');
						})
					})
				}
				else {
					loadIdeaTList().then(res => {
						this.list = res.data;
					})
				}
			}
		},
		onLoad() {
			this.getList();
		}
	}
</script>

<style>
	.content {
		padding-bottom: 20rpx;
	}
	.serve {
		width: 92%;
		margin-left: 4%;
		padding: 26rpx 20rpx;
	}
	.serve-img {
		width: 202rpx;
		height: 202rpx;
		margin-right: 30rpx;
	}
	.right {
		width: 100%;
	}
	.ellipsis-2 {
		width: 100%;
		margin-top: 30rpx;
		text-overflow: ellipsis;
	}
	.time-img {
		width: 26rpx;
		margin-right: 14rpx;
	}
	.result {
		margin-top: 20rpx;
	}
</style>
