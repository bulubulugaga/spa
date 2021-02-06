<!-- 评价 -->
<template>
	<view class="list">
		<view class="row title f30">订单号: {{ order.order_sn }}</view>
		<view class="row check f26 gray">
			<van-checkbox icon-size="30rpx" checked-color="#FDC6BF" :value="isName" @change="changeIsName">匿名</van-checkbox>
		</view>
		
		<!-- 评价服务 -->
		<view class="row">
			<!-- 服务 -->
			<view class="serve flex bg-white border-ra-16">
				<view>
					<image class="serve-img border-ra-16" :src="baseImgURL + serve.image"></image>
				</view>
				<view class="right">
					<view class="ellipsis f30 mt10">{{serve.name}}</view>
					<view class="f26 1a1a1a mt6 flex-middle">
						<view class="flex-middle">
							<image class="time-img" src="/static/images/category/time.png" mode="widthFix"></image>
						</view>
						<view class="flex-middle gray">
							{{serve.sj}}
						</view>
					</view>
				</view>
			</view>
			<!-- 星级评价 -->
			<view class="star-comment f30 flex-middle">
				描述相符
				<van-rate class="ml10 mr10" :value="starS" void-color="#EEEEEE" size="50" gutter="8rpx" color="#FDC6BF" @change="changeStarS()" />
				<text class="gray">{{ decriS }}</text>
			</view>
			<!-- 输入意见 -->
			<textarea class="default" placeholder-class="placeTxt" v-model="contentS" maxlength="200" placeholder="请输入服务评价(不能超过200个字)" />
			<!-- 上传图片 -->
			<!-- <van-uploader multiple="true" max-count="8" accept="image" :file-list="imagesS" @after-read="afterRead($event, 's')" @item-click="btnClick($event, 's')" /> -->
		</view>
		
		<!-- 评价技师 -->
		<view class="row">
			<!-- 技师 -->
			<view class="serve flex bg-white border-ra-16">
				<view>
					<image class="serve-img circle" :src="baseImgURL + mech.image"></image>
				</view>
				<view class="right">
					<view class="ellipsis f30 mt10">{{ mech.name }}</view>
				</view>
			</view>
			<!-- 星级评价 -->
			<view class="star-comment f30 flex-middle">
				描述相符
				<van-rate class="ml10 mr10" :value="starM" void-color="#EEEEEE" size="50" gutter="8rpx" color="#FDC6BF" @change="changeStarM()" />
				<text class="gray">{{ decriM }}</text>
			</view>
			<!-- 输入意见 -->
			<textarea class="default" placeholder-class="placeTxt" v-model="contentM" maxlength="200" placeholder="请输入技师评价(不能超过200个字)" />
			<!-- 上传图片 -->
			<!-- <van-uploader multiple="true" max-count="8" accept="image" :file-list="imagesM" @after-read="afterRead($event, 'm')" @item-click="btnClick($event, 'm')" /> -->
		</view>
		
		<!-- 占位 -->
		<view class="blank"></view>
		<cover-view class="footer flex-MC">
			<cover-view class="btn" @tap="submit">
				提交评价
			</cover-view>
		</cover-view>
		
	</view>
</template>

<script>
	//网络api
	import { baseImgURL } from '@/service/config.js'
	import { getBillDetail, commentBill } from '@/service/bill.js'
	import { getServeDetail, getMechDetail } from '@/service/category.js'
	export default {
		data() {
			return {
				id: '',   //订单id
				baseImgURL: '',
				
				starS: 5,  //星级评价    S:服务 M:技师
				starM: 5,
				decriS: '非常好',  //描述
				decriM: '非常好',
				contentS: '',  //评价内容
				contentM: '', 
				imagesS: [], //图片
				imagesM: [],
				isName: false,  //是否匿名
				
				//先获取订单信息
				order: {},
				serve: {}, //服务信息
				mech: {},  //技师信息
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.baseImgURL = baseImgURL;
			this._getData();
		},
		methods: {
			changeIsName(e) {
				//是否匿名
				this.isName = e.detail;
			},
			getDecri(num) {
				//描述相符的描述
				let txt = '';
				switch(num) {
					case 5: txt = '非常好'; break;
					case 4: txt = '很好'; break;
					case 3: txt = '一般'; break;
					case 2: txt = '很差'; break;
					case 1: txt = '非常差'; break;
				}
				return txt;
			},
			changeStarS(e) {
				//描述相符的描述
				let txt = this.getDecri(e.detail);
				this.starS = e.detail;
				this.decriS = txt;
			},
			changeStarM(e) {
				let txt = this.getDecri(e.detail);
				this.starM = e.detail;
				this.decriM = txt;
			},
			afterRead(event, type) {
				//展示图片列表
			    const { file } = event.detail;
				
				if(type == 's') {
					//服务
					this.imagesS = this.imagesS.concat(file);
				}
				else {
					this.imagesM = this.imagesM.concat(file);
				}
			    
			},
			btnClick(e, type) {
				//刪除图片
				let index = e.detail.currentTarget.dataset.index;
				
				if(type == 's') {
					//服务
					this.imagesS.splice(index, 1);
				}
				else {
					this.imagesM.splice(index, 1);
				}
				
			},
			submit() {
				//提交意见
				let anonymity = this.isName ? 1 : 0;
				let data =  {
					order_id: this.id,
					status: this.starS,
					status_t: this.starM,
					content: this.contentS,
					content1: this.contentM,
					// imagesS: this.imagesS,
					// imagesM: this.imagesM,
					product_id: this.serve.id,
					technician_id: this.mech.id,
					anonymity
				}
				
				if(!this.contentS) {
					uni.showToast({
						title: '评价内容不能为空',
						icon: 'none'
					})
					return;
				}
				if(!this.contentM) {
					uni.showToast({
						title: '评价内容不能为空',
						icon: 'none'
					})
					return;
				}
				commentBill(data).then(res => {
					if(res.code === 1) {
						uni.showToast({
							title: '已评论'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/tabBar/switch/switch?active=' + 2
							})
						}, 1000)
					}
				})
			},
			
			
			//网络请求
			_getData() {
				this._getOrderDetail();
			},
			_getOrderDetail() {
				let data = {
					id: this.id
				}
				getBillDetail(data).then(res => {
					this.order = res.data;
					this._getServeDetail(this.order);
					this._getMechDetail(this.order);
				})
			},
			_getServeDetail(data) {
				//技师信息
				getServeDetail({id: data.product_id}).then(res => {
					this.serve = res.data;
				})
			},
			_getMechDetail(data) {
				//技师信息
				getMechDetail({id: data.tec_id}).then(res => {
					console.log(res.data);
					this.mech = res.data.technician;
				})
			},
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
			margin-top: 20rpx;
			.serve {
				padding: 26rpx 20rpx;
				.serve-img {
					width: 140rpx;
					height: 140rpx;
					margin-right: 30rpx;
				}
				.right {
					width: calc(100% - 200rpx);
				}
				.ellipsis {
					width: 100%;
					margin-top: 16rpx;
				}
				.time-img {
					width: 26rpx;
					margin-right: 14rpx;
				}
			}
			.default, .placeTxt {
				font-size: 30rpx;
				line-height: 36rpx;
			}
			.default {
				border-top: 1rpx solid rgb(240, 240, 240);
				// border-bottom: 1rpx solid rgb(240, 240, 240);
				padding: 20rpx 10rpx;
				width: calc(100% - 20rpx);
				margin-top: 20rpx;
				margin-bottom: 30rpx;
				height: 300rpx;
			}
			.placeTxt {
				color: #A7A7A7;
			}
		}
		.title {
			line-height: 80rpx;
			padding: 0 20rpx;
		}
		.check {
			padding: 20rpx;
		}
	}
	.blank {
		height: 120rpx;
	}
	.footer {
		position: fixed;
		width: 100vw;
		height: 120rpx;
		bottom: 0;
		left: 0;
		background: white;
		border-top: 1rpx solid #eee;
		.btn {
			width: 94%;
			color: white;
			background: #FBAAA9;
			font-size: 32rpx;
			text-align: center;
			line-height: 80rpx;
			padding: 0;
			border-radius: 20rpx;
		}
	}
	
</style>
