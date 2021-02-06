
<!-- 新闻列表 -->
<template>
	<view>
		
		<van-swipe-cell :right-width="150" :disabled="isDisDelete"  v-for="(item, index) in list" :key="index" async-close @close="onClose($event, item.id)">
		  <van-cell-group>
		    
			<view class="serve flex bg-white border-ra-16 mb20" @click="toDetail(item)">
				<!-- <view>
					<image class="serve-img border-ra-16" :src="item.img"></image>
				</view> -->
				<view class="right">
					<view class="ellipsis f30 mt10">{{item.msg.title}}</view>
					<view class="f26 1a1a1a mt6 flex-middle">
						<view class="flex-middle">
							<image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image>
						</view>
						<view class="flex-middle">
							{{ item.createtime }}
						</view>
					</view>
					<rich-text class="ellipsis-2 f26 1a1a1a" :nodes="item.msg.content"></rich-text>		
				</view>
			</view>			
			
		  </van-cell-group>
		  <view slot="right"  class="delete f28 flex-MC">删除</view>
		</van-swipe-cell>
	</view>
</template>

<script>
	export default {
		props: {
			list: {  //服务列表
				type: Array
			},
			isDisDelete: {  //是否禁用删除
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClose(event, id) {
				let _this = this;
			    const { position, instance } = event.detail;
			    switch (position) {
			      case 'right':
					uni.showModal({
						title: '确认删除吗？',
						success(res) {
							if(res.confirm) {
								_this.$emit('delete', id);
							}
						},
						complete() {
							instance.close();
						}
					})
			        break;
			    }
			},
			toDetail(row) {
				uni.setStorage({
					key:'msg',
					data: row,
					success() {
						uni.navigateTo({
							url: '/pages/user/msgDetail/msgDetail'
						})
					}
				});
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
	.delete {
		background: #EE0A24;
		color: white;
		width: 150rpx;
		height: 100%;
		border-top-right-radius: 16rpx;
		border-bottom-right-radius: 16rpx;
	}
</style>
