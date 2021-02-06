<template>
	<view>
		<!-- 顶部导航 -->
		<view class="topTabBar" :style="{position:headerPosition,top:headerTop}">
			<view class="grid" v-for="(grid,tbIndex) in orderType" :key="tbIndex" @tap="showType(tbIndex)">
				<view class="text" :class="[tbIndex==tabbarIndex?'on':'']">{{grid}}</view>
			</view>
		</view>
		<view class="order-list">
			<view class="list">
				<OrderItem v-if="miniType == 'user'" :list="list" @cancelBillC="cancelBillC(arguments)" @updateBillC="updateBill"></OrderItem>
				<OrderItemT v-else :list="list" @cancelBillC="cancelBillC(arguments)" @updateBillC="updateBill"></OrderItemT>
			</view>
		</view>
		
		<!-- 取消订单弹窗 -->
		<popup class="cancel-bill" v-if="isCancel" :v-show="true" @sure="sureCancel" @close="this.isCancel = false" btn="确认">
			<template v-slot:popupTip>
				<textarea type="text" v-model="reason" placeholder="请输入取消订单原因" ></textarea>
			</template>
		</popup>
	</view>
</template>
<script>
	import OrderItem from "@/components/orderItem/orderItem.vue"
	import OrderItemT from "@/components/orderItemT/orderItemT.vue"
	//网络api
	import { getBill, cancelBill, getBillT } from '@/service/bill'
	//弹窗组件
	import popup from "@/components/popup/popup.vue"
	export default {
		components:{
			OrderItem,
			OrderItemT,
			popup
		},
		data() {
			return {
				headerPosition: "fixed",
				headerTop: "0px",
				orderType: ['全部','待支付','已支付','进行中','待评价','已完成','已取消'],
				tabbarIndex: 0,
				
				//订单列表
				list: [],
				
				isCancel: false,  //是否显示输入理由
				reason: '',   //理由
				
				id: '',  //选择订单id
				index: '',  //选择订单下标
			};
		},
		computed: {
			miniType() {
				return this.$store.state.userType
			}
		},
		created() {
			// this.isLogin();
			//网络数据
			this._getData();
		},
		methods: {
			isLogin() {
				//判断是否登录
				if(!this.$store.state.login.isLogin) {
					uni.navigateTo({
						url: '/pages/user/login/login'
					})
				}
			},
			showType(tbIndex){
				this.tabbarIndex = tbIndex;
				this._getBill();
			},
			cancelBillC(e) {
				//修改订单数据
				this.id = e[0];
				this.index = e[1];
				this.isCancel = true;
			},
			sureCancel() {
				//确认取消订单
				if(!this.reason) {
					uni.showToast({
						title: '请输入取消订单理由',
						icon: 'none'
					});
					return;
				}
				let data = {
					id: this.id,
					cancel: this.reason
				}
				cancelBill(data).then(res => {
					if(res.code === 200) {
						uni.showToast({
							title: '已取消'
						})
						this.list[this.index].status = 60;
						this.list.splice(this.index, 1);
						this.isCancel = false;
					}
					else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			updateBill(e) {
				this.list.splice(e, 1);
			},
			
			
			//网络数据
			_getData() {
				this._getBill();
			},
			_getBill() {
				let status = 0;
				switch(this.tabbarIndex) {
					case 0: status = 0; break;
					case 1: status = 10; break;
					case 2: status = 20; break;
					case 3: status = 30; break;
					case 4: status = 40; break;
					case 5: status = 50; break;
					case 6: status = 60; break;
				}
				let data = {
					status
				}
				if(this.miniType == 'user') {
					getBill(data).then(res => {
						this.list = res.data;
					})
				}
				else {
					getBillT(data).then(res => {
						this.list = res.data;
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.topTabBar{
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: white;
	height: 80upx;
	display: flex;
	justify-content: space-around;
	.grid{
		width: 20%;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #444;
		font-size: 28upx;
		.text{
			height: 76upx;
			display: flex;
			align-items: center;
			&.on{
				color: #f06c7a;
				border-bottom: solid 4upx #f06c7a;
			}
		}
		
	}
}
.order-list{
	margin-top: 80upx;
	padding-top: 20upx;
	width: 100%;
	.list{
		width: 92%;
		margin: 0 auto;
		padding-bottom: 20rpx;
	}
}
.cancel-bill{
		textarea {
			background: #f9f9f9;
			margin-left: -20rpx;
			width: 110%;
			margin-top: -36rpx;
			padding: 10rpx 20rpx;
			text-align: left;
		}
	}
</style>
