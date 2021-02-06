<template>
	<view>
		<!-- 顶部导航栏 -->
		<view class="header" v-if="miniType == 'user'">
			<!-- 定位城市 -->
			<view class="header-con flex-middle" @click="toChooseAd">
				<image class="adder-img" src="../../../static/images/home/adder.png" mode="widthFix"></image>
				<view class="addr">
					{{ playCity }}
				</view>
				<image class="arrow-img" src="../../../static/images/home/arrow_down.png" mode="widthFix"></image>		
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		
		<view class="bg-white">
			<!-- 轮播图 -->
			<view class="swiper">
				<view class="swiper-box">
					<swiper circular="true" autoplay="true" @change="swiperChange">
						<swiper-item v-for="swiper in swiperList" :key="swiper.id">
							<image :src="swiper.image" mode="aspectFill"></image>
						</swiper-item>
					</swiper>
					<view class="indicator">
						<view
							class="dots"
							v-for="(swiper, index) in swiperList"
							:class="[currentSwiper >= index ? 'on' : '']"
							:key="index"
						></view>
					</view>
				</view>
			</view>
			<!-- 分类列表 -->
			<view class="category-list">
				<view class="category" v-for="(row, index) in categoryList"
					:key="index"  @click="toHref(row.href)">
					<view class="img"><image :src="row.img"></image></view>
					<view class="text">{{ row.name }}</view>
				</view>
			</view>
		</view>
		
		
		<!-- 公告 -->
		<view class="notice" @click="isNotiShow = true">
			<van-notice-bar :text="notice" background="#ffffff" color="#000">
				<image slot="left-icon" src="/static/images/home/notice_left.png" mode="widthFix" style="width: 34rpx;" />
				<image slot="right-icon" src="/static/images/home/notice_right.png" mode="widthFix" style="width: 8rpx;" />
			</van-notice-bar>
		</view>
		
		
		<!-- 用户端商品列表 技师端消息列表 -->
		<view class="hot w-con">
			<view class="title f36">
				<text v-if="miniType === 'user'">推荐服务</text>
				<text v-else>最新消息</text>
			</view>
			<serve-list v-if="miniType === 'user'" :list="serveList"></serve-list>
			<news-list v-else :list="newsList" :isDisDelete="true"></news-list>
		</view>-
		
		<!-- 公告弹窗 -->
		<notice v-if="isNotiShow" :content="notice" @close="isNotiShow = false"></notice>
	</view>
</template>

<script>
//以组件形式引入公告插件
import vanNoticeBar from '@/wxcomponents/vant/dist/notice-bar/index'
//引入服务列表组件
import serveList from '@/components/serveList/serveList.vue'
//引入消息列表组件
import newsList from '@/components/newsList/newsList.vue'
//引入公告组件
import notice from './notice/notice.vue'
//引入api
import { getSwiper, getNotice } from '@/service/home.js'
import { getMsgT } from '@/service/user.js'
//时间转换
import { transeTime } from '@/common/utils'
export default {
	components: {
		vanNoticeBar,
		serveList,
		newsList,
		notice
	},
	data() {
		return {
			currentSwiper: 0,
			isNotiShow: false,  //是否展示公告弹窗
			
			// 轮播图片
			swiperList: [],
			
			//公告
			notice: '暂无公告',
			
			//推荐服务列表
			serveList: [],
			
			//消息列表
			newsList: []
		
		};
	},
	computed: {
		miniType() {
			//小程序端类型
			return this.$store.state.userType;
		},
		city() {
			return this.$store.state.chooseCity;
		},
		playCity() {
			if(this.$store.state.chooseCity == 'a') {
				return '成都市';
			}
			else {
				return this.$store.state.chooseCity.name.split('/')[1]
			}
		},
		categoryList() {
			//分类菜单
			if(this.$store.state.userType === 'user') {
				return [
					{ id: 1, name: '用户协议', img: '/static/images/user/tools/yhxy@2x.png', href: '/pages/user/agreement/agreement' },
					{ id: 2, name: '邀请有奖', img: '/static/images/home/nav_2.png', href: '/pages/user/invite/invite' },
					{ id: 3, name: '商城入驻', img: '/static/images/home/nav_3.png', href: '/pages/user/settled/settled' },
					{ id: 4, name: '我的收藏', img: '/static/images/home/nav_4.png', href: '/pages/user/collection/collection' }	
				];
			}
			else {
				return [
					{ id: 1, name: '法律声明', img: '/static/images/user/tools/wddz@2x.png', href: '/pages/user/law/law' },
					{ id: 2, name: '邀请有奖', img: '/static/images/user/tools/yqyj@2x.png', href: '/pages/user/invite/invite' },
					{ id: 3, name: '常见问题', img: '/static/images/user/tools/cjwt@2x.png', href: '/pages/user/issue/issue' },
					{ id: 4, name: '意见反馈', img: '/static/images/user/tools/yjfk@2x.png', href: '/pages/user/idea/idea' }	
				];
			}
		}
	},
	created() {
		//获取数据
		this._getData();
	},
	methods: {
		toHref(href) {
			//分类跳转
			this.$lnavigateTo(href);
		},
		//轮播图指示器
		swiperChange(event) {
			this.currentSwiper = event.detail.current;
		},
		
		toChooseAd() {
			//选择地区
			// this.$lnavigateTo({
			// 	type: 'reLaunch',
			// 	url: '/pages/tabBar/switch/switch',
			// 	param: {
			// 		active: 2
			// 	}
			// });
			uni.navigateTo({
				url: '/pages/home/chooseAd/chooseAd'
			})
		},
		
		_getData() {
			this._getSwiper();
			this._getNotice();
		},
		_getSwiper() {
			let data = {
				city_id: this.city.id
			}
			getSwiper(data).then(res => {
				this.swiperList = res.data.banner;
				this.serveList = res.data.product;
			})
			if(this.miniType != 'user') {
				getMsgT().then(res => {
					this.newsList = res.data.slice(0, 4);
					this.newsList.forEach(item => {
						let time = transeTime(item.createtime * 1000 , 'Y-M-D H:M:S');
						item.createtime = time;
					})
				})
			}
		},
		_getNotice() {
			let data = {
				id: this.city.id
			}
			getNotice(data).then(res => {
				if(res.code == 200) {
					this.notice = res.data.text;
				}
				else {
					this.notice = '暂无公告';
				}
			})
		}
	},
	
};
</script>
<style lang="scss">
page{
	position: relative;
}
.header {
	width: 100vw;
	height: 80upx;
	display: flex;
	align-items: center;
	position: fixed;
	top: 0;
	z-index: 10;
	background-color: #fff;
	.header-con {
		margin-left: 50%;
		transform: translateX(-50%);
	}
	.adder-img {
		width: 20rpx;
		vertical-position: middle;
	}
	.addr {
		line-height: 60upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		font-size: 28upx;
		padding: 0 12rpx;
	}
	.arrow-img {
		width: 16rpx;
	}
}
.place {
	background-color: #ffffff;
	height: 80upx;
}
.swiper {
	width: 100%;
	display: flex;
	justify-content: center;
	.swiper-box {
		width: 92%;
		height: 40.7vw;

		overflow: hidden;
		border-radius: 15upx;
		box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
		//兼容ios，微信小程序
		position: relative;
		z-index: 1;
		swiper {
			width: 100%;
			height: 100%;
			swiper-item {
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.indicator {
			position: absolute;
			bottom: 20upx;
			left: 20upx;
			background-color: rgba(255, 255, 255, 0.4);
			width: 150upx;
			height: 5upx;
			border-radius: 3upx;
			overflow: hidden;
			display: flex;
			.dots {
				width: 0upx;
				background-color: rgba(255, 255, 255, 1);
				transition: all 0.3s ease-out;
				&.on {
					width: (100%/3);
				}
			}
		}
	}
}

.category-list {
	width: 92%;
	margin: 0 4%;
	padding: 0 0 30upx 0;
	border-bottom: solid 2upx #f6f6f6;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.category {
		width: 25%;
		margin-top: 64upx;
		display: flex;
		flex-wrap: wrap;
		position: relative;
		.img {
			width: 100%;
			display: flex;
			justify-content: center;
			image {
				width: 80rpx;
				height: 80rpx;
			}
		}
		.text {
			margin-top: 16upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 30upx;
			color: #3c3c3c;
		}
	}
}
.banner {
	width: 92%;
	margin: 40upx 4%;
	image {
		width: 100%;
		height: 20vw;
		border-radius: 10vw;
		box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.3);
	}
}
.hot {
	padding: 30rpx 4%;
	.title {
		border-left: 4rpx solid #A199FD;
		line-height: 36rpx;
		padding-left: 14rpx;
		margin-bottom: 36rpx;
	}
}

</style>
