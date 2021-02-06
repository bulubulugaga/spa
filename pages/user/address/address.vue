<!-- 我的地址 -->
<template>
	<view>
		<view class="content">
			<view class="list">
				<view class="row bg-white" v-for="(row,index) in addressList" :key="index" @click="select(row)">
					<view class="center">
						<view class="name-tel">
							<view class="name f32 ellipsis">{{row.name}}</view>
							<view class="tel f26">{{row.phone}}</view>
							<view class="default f26" v-if="row.is_true === 1">
								默认
							</view>
						</view>
						<view class="address f28 mt10">
							{{row.region}} {{row.detail}}
						</view>
					</view>
					<view class="right">
						<view @click.stop="edit(row)">
							<van-icon class="icon" name="edit" />
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="blank"></view>
		<!-- 底部按钮 -->
		<view class="add">
			<view class="btn" @click="add">
				<van-icon class="icon" name="add-o" />新增地址
			</view>
		</view>
	</view>
</template>
<script>
	import { getAddress } from '@/service/user.js'
	export default {
		data() {
			return {
				addressList:[]
			};
		},
		onLoad() {
			this._getData();
		},
		methods:{
			edit(row){
				uni.setStorage({
					key:'address',
					data: row,
					success() {
						uni.navigateTo({
							url:"edit/edit?type=edit"
						})
					}
				});
				
			},
			add(){
				uni.navigateTo({
					url:"./edit/edit?type=add"
				})
			},
			select(row) {
				//选择地址下单
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2];
				if(beforePage.route == "pages/category/placeOrder/placeOrder"){
					beforePage.$vm.address = row;
					uni.navigateBack();
				}
			},
			
			//获取网络数据
			_getData() {
				this._getAddress();
			},
			_getAddress() {
				getAddress().then(res => {
					this.addressList = res.data;
				})
			}
		}
	}
</script>

<style lang="scss">
	view {
		display: flex;
	}
	.blank {
		height: 140upx;
	}
	.add{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #FBAAA9;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 40upx;
				margin-right: 10rpx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.list{
		flex-wrap: wrap;
		width: 100vw;
		.row{
			width: 92%;
			margin: 20rpx auto 0;
			padding: 30upx 2% 30upx 4%;
			.center{
				width: 100%;
				flex-wrap: wrap;
				.name-tel{
					width: 100%;
					align-items: baseline;
					.name {
						max-width: 226rpx;
					}
					.tel{
						margin-left: 30upx;
						color: #777;
					}
					.default{
						background-color: #FBAAA9;
						color: #fff;
						padding: 0 18upx;
						border-radius: 24upx;
						margin-left: 20upx;
					}
				}
				.address{
					width: 100%;
					align-items: baseline;
					color: #777;
				}
			}
			.right{
				flex-shrink: 0;
				align-items: center;
				margin-left: 20upx;
				.icon{
					justify-content: center;
					align-items: center;
					width: 80upx;
					height: 60upx;
					border-left: solid 1upx #aaa;
					font-size: 40upx;
					color: #777;
				}
			}
		}
	}
</style>
