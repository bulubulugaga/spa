<!-- 切换城市 -->
<template>
	<view class="content">
		<view class="current f30 bg-white">
			当前：{{ currentCity.name.split('/')[1] }}
		</view>
		<view class="position bg-white">
			<view class="title f26 c999">定位</view>
			<view class="flex-cover">
				<view @click="chooseCity(positionCity)" class="contain flex-middle mt20 border-ra-16">
					<view class="flex-middle"><image src="/static/images/home/adder.png" mode="widthFix"></image></view>
					<view class="flex-middle f28">{{ positionCity.name.split('/')[1] }}</view>
				</view>
				<view></view>
			</view>
		</view>
		<view class="chooseAble bg-white">
			<view class="title f26 c999">已开通城市</view>
			<view class="flex-wrap flex-cover">
				<view class="contain f28 mt30 border-ra-16 txt-center ellipsis"
					v-for="(item, index) in ableCity" :key="item.id"
					@click="chooseCity(item)" >
					{{ item.name.split('/')[1] }}
				</view>
				<!-- 用空白框防止中间有空 -->
				<view class="contain blank" v-if="ableCity.length % 3 == 2"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import{ SETCHOOSECITY } from '@/store/mutations-type.js'
	//网络api
	import { getOpenAd } from '@/service/home.js'
	export default {
		data() {
			return {
				ableCity: []  //已开通城市列表
			}
		},
		computed: {
			currentCity() {
				// 从仓库获取当前城市
				return this.$store.state.chooseCity;
			},
			positionCity() {
				// 从仓库获取定位城市
				return this.$store.state.city;
			}
		},
		onLoad() {
			this._getData();
		},
		methods: {
			chooseCity(city) {
				
				//调接口，成功则修改仓库城市信息
				
				let pages = getCurrentPages();
				let beforPage = pages[pages.length - 2];
				let active = beforPage.$vm.active;
				this.$store.commit(SETCHOOSECITY, city);
				uni.reLaunch({
					url: '/' + beforPage.route + '?active=' + active
				})
				
			},
			
			
			//获取网络数据
			_getData() {
				this._getOpenAd();
			},
			_getOpenAd() {
				//获取开通城市
				getOpenAd().then(res => {
					this.ableCity = res.data;
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		.current {
			margin-top: 14rpx;
			padding: 0 4%;
			line-height: 80rpx;
		}
		.position, .chooseAble {
			padding: 30rpx 4%;
			margin-top: 14rpx;
			.contain {
				border: 1rpx solid #bbb;
				padding: 18rpx 30rpx;
				image {
					width: 26rpx;
					margin-right: 20rpx;
				}
			}
		}
		.chooseAble {
			padding-bottom: 60rpx;
			.contain {
				width: 30%;
				padding: 18rpx 0;
			}
			.blank {
				opacity: 0;
			}
		}
	}
</style>
