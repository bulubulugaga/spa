<template>
	<view>
		<view class="comment" v-for="(item, index) in list" :key="index">
		  <!-- 评价用户 -->
		  <view class="user flex-middle">
			  <view>
				  <image v-if="item.anonymity === 1" class="user-avar circle" :src="logo" mode=""></image>
				  <image v-else class="user-avar circle" :src="item.member_id.headimgurl" mode=""></image>
			  </view>
			  <view class="f26">
				  <view>
					<text v-if="item.anonymity === 1">匿名用户</text>
					<text v-else>{{ item.member_id.nickname }}</text>
				  </view>
				  <view v-if="type == 's'"><van-rate class="mr10" :value="item.status" readonly size="24" color="#FDC6BF" /> {{ item.status }}</view>
				  <view v-else><van-rate class="mr10" :value="item.status_t" readonly size="24" color="#FDC6BF" /> {{ item.status_t }}</view>
			  </view>
			  <view class="ml-auto f26">{{ item.createtime }}</view>
		  </view>
		  <!-- 评价内容 -->
		  <view class="content f28 ellipsis-4 mt20 mb20">
			<text v-if="type == 's'">{{ item.content }}</text>
			<text v-else>{{ item.content1 }}</text>
		  </view>
		  <!-- 评价图片 -->
		  <!-- <view>
			  <van-grid column-num="4" :border="false">
				<van-grid-item use-slot v-for="(img, i) in item.images" :key="i">
				  <image style="width: 100%; height: 140rpx;" :src="img" @click="preImg(item.images)" />
				</van-grid-item>
			  </van-grid>
		  </view> -->
		</view>
	</view>
</template>

<script>
	import vanGrid from '@/wxcomponents/vant/dist/grid/index'
	import vanGridItem from '@/wxcomponents/vant/dist/grid-item/index'
	
	//图片跟地址
	import { baseImgURL } from '@/service/config'
	
	export default {
		data() {
			return {
				baseImgURL
			}
		},
		computed: {
			logo() {
				//匿名用户用logo
				return this.$store.state.logo
			}
		},
		props: {
			list: {
				//评价列表
				type: Array
			},
			type: {
				//评论类型  服务评价或技师评价  必传
				type: String,
				required: true
			}
		},
		components: {
			vanGrid,
			vanGridItem
		},
		created() {
			this.baseImgURL = baseImgURL;
		},
		methods: {
			preImg(images) {
				//预览评论图
				uni.previewImage({
					urls: images
				});
			}
		}
	}
</script>

<style lang="scss">
	.comment {
		width: 90%;
		margin: 0 auto;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f3f3f3;
		.user {
			.user-avar {
				width: 70rpx;
				height: 70rpx;
				margin-right: 8rpx;
			}
		}
	}
</style>
