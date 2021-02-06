<template>
	<view class="list">
		<view class="row">
			<!-- 输入意见 -->
			<textarea class="default" placeholder-class="placeTxt" v-model="content" maxlength="200" placeholder="在此输入内容(不能超过200个字)" />
			<!-- 上传图片 -->
			<van-uploader multiple="true" max-count="8" accept="image" :file-list="images" @after-read="afterRead" @item-click="btnClick" />
		</view>
		<view class="row row-input mt30">
			<input type="number" v-model="phone" placeholder="您的手机号" />
		</view>
		<view class="row btn" @tap="submit">
			提交申请
		</view>
		<view class="tip txt-center gray f24" @click="ideaList">
			反馈记录
		</view>
	</view>
</template>

<script>
	import { loadIdeaU, loadIdeaT } from '@/service/user.js'
	//上传图片
	import { uploadFile } from '@/service/uploadFile.js'
	import { isPhone } from '@/common/utils.js'
	export default {
		data() {
			return {
				content: '',  //评价内容
				phone: '',  //手机
				images: [], //图片
			}
		},
		computed: {
			userType() {
				return this.$store.state.userType;
			}
		},
		methods: {
			afterRead(event) {
				//展示图片列表
			    const { file } = event.detail;
				uploadFile(file).then(res => {
					//上传图片更新预览
					console.log(this.images);
					this.images = this.images.concat(res);
					console.log(this.images);
				})
			    
			},
			btnClick(e) {
				//刪除图片
				let index = e.detail.currentTarget.dataset.index;
				this.images.splice(index, 1);
			},
			submit() {
				//提交意见
				if(this.content == '') {
					uni.showToast({
						title: '请输入反馈内容',
						icon: 'none'
					})
					return;
				}
				if(!isPhone(this.phone)) {
					uni.showToast({
						title: '手机号格式错误',
						icon: 'none'
					})
					return;
				}
				let arr = []; //暂存图片数组
				this.images.forEach(item => {
					arr.push(item.path);
				})
				let images = arr.join(',');
				let data =  {
					content: this.content,
					phone: this.phone,
					images
				}
				if(this.userType == 'user') {
					console.log('用户意见反馈');
					loadIdeaU(data).then(res => {
						if(res.code === 200) {
							uni.showToast({
								title: '已提交'
							})
						}
					})
				}
				else {
					console.log('技师意见反馈');
					loadIdeaT(data).then(res => {
						if(res.code === 200) {
							uni.showToast({
								title: '已提交'
							})
						}
					})
				}
			},
			ideaList() {
				//反馈记录
				uni.navigateTo({
					url: './list/list'
				})
			}
		},
		onLoad() {
			
		}
	}
</script>

<style lang="scss">
	.list{
		width: 94%;
		margin: 30rpx auto;
		.row{
			padding: 4rpx 20rpx 24rpx;
			border-radius: 20rpx;
			background-color: #fff;
			.default, .placeTxt {
				font-size: 30rpx;
				line-height: 36rpx;
			}
			.default {
				border-bottom: 1rpx solid rgb(240, 240, 240);
				padding: 10rpx;
				width: calc(100% - 20rpx);
				min-height: 245rpx;
				margin: 30rpx 0;
			}
			.placeTxt {
				color: #A7A7A7;
			}
			textarea {
				height: 400rpx;
			}
			&-input {
				padding: 20rpx;
			}
		}
		.btn {
			color: white;
			background: #FBAAA9;
			font-size: 32rpx;
			margin-top: 30rpx;
			text-align: center;
			line-height: 80rpx;
			padding: 0;
		}
		.tip {
			line-height: 60rpx;
		}
	}
</style>
