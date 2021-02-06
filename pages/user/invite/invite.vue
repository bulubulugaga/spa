<!-- 邀请有奖 -->
<template>
	<view class="content">
		
		<!-- 背景 -->
		<image class="bg" src="/static/images/user/invite/bg.png" mode="widthFix"></image>
		
		<!-- 邀请按钮 -->
		<button class="btn" open-type="share">分享</button>
		
		<!-- 收益 -->
		<image class="profit-title" src="/static/images/user/invite/title.png" mode="widthFix"></image>
		<view class="profit-wrap">
			<view class="profit">
				
				<!-- 金额和人数 -->
				<!-- <view class="num flex-cover" @click="this.isShow = true"> -->
				<view class="num flex-cover">
					<view class="left txt-center">
						<view class="c-E64242 f36">{{ profit }}元</view>
						<view class="f30 mt30">累计收益</view>
					</view>
					<view class="right txt-center">
						<view class="c-E64242 f36">{{ person }}人</view>
						<view class="f30 mt30">成功邀请</view>
					</view>
				</view>
				
				<!-- 规则 -->
				<view class="rule">
					<view class="title flex-MC f36">
						<image src="/static/images/user/invite/star.png" mode=""></image>
						邀请规则
						<image src="/static/images/user/invite/star.png" mode=""></image>
					</view>
					<view class="contain f28">
						{{ rule }}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 邀请记录 -->
		<van-popup :show="isShow" @close="this.isShow = false"
			custom-style="height: 60%; width: 80%;">
			<view class="invi-title f30 txt-center bg-white">邀请记录</view>			
			<view class="invi-list flex-cover f28 txt-center" v-for="item in record" :key="item">
				<view class="left ellipsis">{{ item.name }}</view>
				<view class="middle">{{ item.money | fixTwo }}</view>
				<view class="right">{{ item.time }}</view>
			</view>
		</van-popup>
		
	</view>
</template>

<script>
	import { 
		getInvitRule, 
		getInvitPerson, 
		getInvitPersonT,
		member_share
	} from '@/service/user.js'
	export default {
		data() {
			return {
				profit: 0,  //累计收益
				person: 0,   //成功邀请
				rule: '',
				record: [
					{image: '/static/images/up_img.png', name: '用户名用户名', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'},
					{image: '/static/images/up_img.png', name: 'aaa', money: 100, time: '2020-09-09 10: 00'}
				],
				isShow: false,  //是否展示订单记录
			}
		},
		computed: {
			userInfo() {
				return uni.getStorageSync('userInfo');
			},
			miniType() {
				return this.$store.state.userType
			}
		},
		onLoad() {
			this._getData();
		},
		onShareAppMessage(res) {
			// let data = {
			// 	id: uni.getStorageSync('userInfo').id
			// }
			// if (res.from === 'button') {
			//       // 来自页面内转发按钮
			//       console.log(res.target);
			// 	  member_share(data).then(res1 => {
			// 	  	console.log(res1)
			// 	  })
			//     }
			
			return {
				// imageUrl: '',
				path: '/pages/index/index?id=' + uni.getStorageSync('token') // 路径，传递参数到指定页面。
			}
		},
		methods: {
			invite() {
				let data = {
					id: getStorageSync('userInfo').id
				}
				member_share(data).then(res => {
					
				})
				uni.showToast({
					title: '已分享'
				})
			},
			
			
			_getData() {
				this._getInvitRule();
				this._getPerson();
			},
			_getInvitRule() {
				getInvitRule().then(res => {
					this.rule = res.data.text;
				})
			},
			_getPerson() {
				if(this.miniType === 'user') {
					getInvitPerson().then(res => {
						this.person = res.data.num;
						this.profit = res.data.in_money;
					})
				}
				else {
					getInvitPersonT().then(res => {
						this.person = res.data.num;
						this.profit = res.data.in_money;
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

<style lang="scss">
	page {
		background: #FFCB1F;
	}
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
	}
	.btn {
		position: absolute;
		top: 93vw;
		left: 32vw;
		width: 36vw;
		height: 11vw;
		opacity: 0;
	}
	.profit-title {
		position: absolute;
		top: 143vw;
		left: 32vw;
		width: 36vw;
		z-index: 2;
	}
	.profit-wrap {
		position: absolute;
		top: calc(143vw + 40rpx);
		padding-bottom: 200rpx;
		.profit {
			width: 92%;
			margin-left: 4%;
			background: #FFF1DE;
			border-radius: 10rpx;
			z-index: 1;
			padding-top: 100rpx;
			padding-bottom: 100rpx;
			.num {
				width: 70%;
				margin-left: 15%;
			}
			.rule {
				margin-top: 80rpx;
				.title {
					color: #FFA005;
					image {
						width: 36rpx;
						height: 36rpx;
						margin: 0 20rpx;
					}
				}
				.contain {
					padding: 0 4%;
					margin-top: 30rpx;
					line-height: 40rpx;
				}
			}
		}
	}
	
	.invi-title {
		line-height: 100rpx;
	}
	.invi-list {
		width: 92%;
		margin-left: 4%;
		border-bottom: 1rpx solid #f9f9f9;
		line-height: 60rpx;
		.left {
			width: 26%;
		}
		.middle {
			width: 26%;
		}
		.right {
			width: 46%;
		}
	}
</style>
