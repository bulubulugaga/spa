<template>
	<view class="list">
		<!-- 优惠券列表 -->
		<view class="sub-list valid">
			<view class="tis" v-if="userInfo.cash === 0">没有数据~</view>
			<view class="row" v-for="(row,index) in couponValidList" :key="index" >
				<!-- 删除按钮 -->
				<view class="menu" @tap.stop="deleteCoupon(row.id)">
					<view class="icon shanchu">删除</view>
				</view>
				<!-- content -->
				<view class="carrier" :class="[typeClass=='valid'?theIndex==index?'open':oldIndex==index?'close':'':'']">
					<view class="left">
						<view class="title">
							{{row.name}}
						</view>
						<view class="term">
							{{row.rule}}
						</view>
						<view class="gap-top"></view>
						<view class="gap-bottom"></view>
					</view>
					<view class="right">
						<view class="ticket">
							<view class="num">
								{{userInfo.cash_balance}}
							</view>
							<view class="unit">
								元
							</view>
						</view>
						<view class="criteria">
							满{{row.expense}}使用
						</view>
						<view class="use" @click.stop="toUse">
							去使用
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				couponValidList:[
					{name: '3000元现金卡', expense: 3000, money: 10, rule: '累计消费3000元赠送3000元现金卡，支付抵扣10%，使用完后重新累计'}
				],
				//控制滑动效果
				typeClass:'valid',
				subState:'',
				theIndex:null,
				oldIndex:null,
				isStop:false,
				isSelect: false,  //是否下单时选择优惠券
			}
		},
		computed: {
			userInfo() {
				return uni.getStorageSync('userInfo');
			}
		},
		onLoad(options) {
			if(options.type == 'select') {
				//下单选择
				this.isSelect = true;
				let pages = getCurrentPages();
				let beforePage = pages[pages.length - 2];
				beforePage.$vm.state_cash = 1;
				beforePage.$vm.cash_tip = '3000元现金卡';
			}
			else {
				this.isSelect = false;
			}
		},
		methods: {
			
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			
			touchEnd(index,$event){
				//解除禁止触发状态
				this.isStop = false;
			},
			
			
			deleteCoupon(id) {
				uni.showToast({
					title: '已删除'
				})
			},
			toUse() {
				//点击去使用
				if(this.isSelect) {
					uni.navigateBack()
				}
				else {
					uni.reLaunch({
						url: '/pages/tabBar/switch/switch?active=' + 1
					})
				}
			}
			
		}
	}
</script>
<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
	}
	page{position: relative;background-color: #f5f5f5;}
	.list{
		width: 100%;
		display: block;
		position: relative;
	}
	@keyframes showValid {
		0% {transform: translateX(-100%);}100% {transform: translateX(0);}
	}
	@keyframes showInvalid {
		0% {transform: translateX(0);}100% {transform: translateX(-100%);}
	}
	.sub-list{
		&.invalid{
			position: absolute;
			top: 0;
			left:100%;
			display: none;
		}
		&.showvalid{
			display: flex;
			animation: showValid 0.20s linear both;
		}
		&.showinvalid{
			display: flex;
			animation: showInvalid 0.20s linear both;
		}
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.row{
			width: 92%;
			height: 26vw; 
			margin: 20upx auto 10upx auto;
			border-radius: 8upx;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu{
				.icon{
					color: #fff;
					font-size:30upx;
				}
				position: absolute;
				width: 28%;
				height: 100%;
				right: 0;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}
			.carrier{
				@keyframes showMenu {
					0% {transform: translateX(0);}100% {transform: translateX(-28%);}
				}
				@keyframes closeMenu {
					0% {transform: translateX(-28%);}100% {transform: translateX(0);}
				}
				&.open{
					animation: showMenu 0.25s linear both;
				}
				&.close{
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;
				.left{
					width: 100%;
					.title{
						padding-top: 3vw;
						width: 90%;
						margin: 0 5%;
						font-size: 36upx;
					}
					.term{
						width: 90%;
						margin: 0 5%;
						font-size: 26upx;
						color: #999;
					}
					position: relative;
					.gap-top,.gap-bottom{
						position: absolute;
						width: 20upx;
						height: 20upx;
						right: -10upx;
						border-radius: 100%;
						background-color: #f5f5f5;
					}
					.gap-top{
						top: -10upx;
					}
					.gap-bottom{
						bottom: -10upx;
					}
					.shixiao{
						position: absolute;
						right: 20upx;
						font-size: 150upx;
						z-index: 6;
						color: rgba(153,153,153,0.2)
					}
				}
				.right{
					flex-shrink: 0;
					width: 30%;
					color: #fff;
					background:linear-gradient(to right,#ec625c,#ee827f);
					&.invalid{
						background:linear-gradient(to right,#aaa,#999);
						.use{
							color: #aaa;
						}
					}
					justify-content: center;
					.ticket,.criteria{width: 100%;}
					.ticket{
						padding-top: 1vw;
						justify-content: center;
						align-items: baseline;
						height: 6vw;
						.num{
							font-size: 42upx;
							font-weight: 600;
						}
						.unit{
							font-size: 24upx;
						}
					}
					.criteria{
						justify-content: center;
						
						font-size: 28upx;
					}
					.use{
						width: 50%;
						height: 40upx;
						justify-content: center;
						align-items: center;
						font-size: 24upx;
						background-color: #fff;
						color: #ee827f;
						border-radius: 40upx;
						padding: 0 10upx;
					}
				}
			}
		}
	}
	
</style>
