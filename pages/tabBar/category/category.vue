<template>
	<view>
		<!-- 状态栏 -->
        <view class="header" :style="{position:headerPosition}">
			<view class="header-top">
				<view class="header-con flex-middle" @click="toChooseAd">
					<image class="adder-img" src="../../../static/images/home/adder.png" mode="widthFix"></image>
					<view class="addr">
						{{ playCity }}
					</view>
					<image class="arrow-img" src="../../../static/images/home/arrow_down.png" mode="widthFix"></image>		
				</view>
				<view class="header-input flex-middle">
					<van-icon class="f30" name="search" />
					<input type="text" v-model="value" disabled placeholder="请输入项目或技师" confirm-type="搜索" @click="search" />
				</view>
			</view>
			<!-- 选项卡 -->
			<van-tabs :active="activeTab" @click="tabChange" color="#FDC6BF" line-width="56" line-height="2">
			  <van-tab title="服务项目" ></van-tab>
			  <van-tab title="服务技师"></van-tab>
			</van-tabs>
			
		</view>
		<!-- 占位 -->
		<view class="place"></view>
		
		
		<view class="category-list" :style="{height: categoryHeight + 'px'}">
			<!-- 左侧分类导航 -->
			<scroll-view v-if="isSearch"  scroll-y="true" class="left" >
                <view class="row" v-for="(category,index) in searveTitle" :key="category.id" :class="[index==showCategoryIndex?'on':'']" @tap="showCategory(category.id, index)">
					<view class="text">
						{{category.name}}
					</view>
				</view>
            </scroll-view>
			
			<!-- 右侧子导航 -->
			<scroll-view scroll-y="true" class="right" :style="'width: ' + rightWidth +';left: ' + rightLeft">
			    <serve-list v-if="activeTab === 0" :list="serveList"></serve-list>
			    <mecha-list v-else :list="mechaList"></mecha-list>
			</scroll-view>
		</view>
	</view>
</template>
<script>
//引入服务列表和技师列表组件
import serveList from '@/components/serveList/serveList.vue'
import mechaList from '@/components/mechaList/mechaList.vue'

//网络api
import { 
	getMechanic,
	getCategory,
	getCateServe,
	searchServe,
	searchMech
} from '@/service/category'

import { getGPSLocation, space } from '@/common/getLocation.js'

	export default {
		components: {
			serveList,
			mechaList
		},
		data() {
			return {
				showCategoryIndex:0,  //左侧分类下标
				headerPosition:"fixed",
				value: '',
				activeTab: 0,
				categoryHeight: 450,  //分类高度
				//服务分类和技师分类
				searveTitle: [],
				//服务列表
				serveList: [],
				//技师列表
				mechaList: [],
				
				isSearch: true,  //是否在搜索
				rightWidth: '76%',  //右侧宽度
				rightLeft: '24%',  //右侧距离
			}
		},
		computed: {
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
			}
		},
		created() {  //不能用onLoad
			this.getCategoryH();
			
			//网络数据
			this._getData();
		},
		methods: {
			//分类切换显示
			showCategory(id, index){
				//修改当前选择分类下标
				this.showCategoryIndex = index;
				
				//重新获取列表
				if(!id) {
					id = '';
				}
				if(this.activeTab === 0) {
					//服务
					this._getCateServe(id);
				}
				else {
					//技师
					this._getMechanic(id);
				}
			},
			toCategory(e){
				uni.setStorageSync('catName',e.name);
				uni.navigateTo({
					url: '../../goods/goods-list/goods-list?cid='+e.id+'&name='+e.name
				});
			},
			getCategoryH() {
				let _this = this;
				//获取分类高度
				uni.getSystemInfo({
				    success: function (res) {
				        _this.categoryHeight = res.windowHeight - 150;
				    },
					fail: (err) => {
						console.log(err);
					}
				});
			},
			search() {
				//搜索
				uni.navigateTo({
					url: '/pages/category/search/search'
				})
			},
			tabChange(event) {
				//选择服务或技师
				
				this.activeTab = event.detail.title == '服务项目' ? 0 : 1;
				this.showCategoryIndex = 0;
				
				switch(event.detail.title) {
					case '服务项目': 
						this._getCategory(); 
						this._getCateServe('');
						break;
					case '服务技师': 
						this.searveTitle = [
							{id: -100, name: '全部'},
							{id: 10, name: '可服务'},
							{id: 20, name: '服务中'},
							{id: 30, name: '不可服务'}
						];
						this._getMechanic(-100);
						break;
				}
			},
			toChooseAd() {
				//选择地区
				this.isSearch = true;
				this.rightWidth = '76%';
				this.rightLeft = '24%';
				this.value = '';
				uni.navigateTo({
					url: '/pages/home/chooseAd/chooseAd'
				})
			},
			
			
			
			//网络数据
			_getData() {
				this._getMechanic(-100);
				this._getCategory();
				this._getCateServe('');
			},
			_getMechanic(status) {
				//技师
				let data;
				if(status == -100) {
					data = {
						city_id: this.city.id
					};
				}
				else {
					data = {
						status,
						city_id: this.city.id
					}
				}
				getMechanic(data).then(res => {
					this.mechaList = res.data;
					getGPSLocation().then(res=> {
						this.mechaList.forEach(item => {
							let a = space(item.latitude,item.longitude,res.latitude,res.longitude);
							this.$set(item, 'dis', a);
						})
					})
				})
			},
			_getCategory() {
				//分类
				getCategory().then(res => {
					this.searveTitle = res.data;
					this.searveTitle.unshift({
						id: '',
						name: '全部'
					})
				})
			},
			_getCateServe(id) {
				//分类下的服务列表
				let data = {
					id,
					city_id: this.city.id
				}
				getCateServe(data).then(res => {
					this.serveList = res.data;
				})
			}
		}
	}
</script>
<style lang="scss">
	.header{
		width: 100%;
		padding: 0 4%;
		height: 150upx;
		position: fixed;
		top: 0;
		z-index: 10;
		background-color: #fff;
		.header-top {
			display: flex;
			align-items: center;
			margin-bottom: 16rpx;
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
			.header-input {
				width:100%;
				flex: 1;
				margin-left: 24rpx;
				background: #F9F9F9;
				border-radius: 100rpx;
				padding: 0 20rpx;
				height: 70rpx;
				input {
					flex: 1;
					margin-left: 20rpx;
				}
			}
		}		
	}
	.place{
		background-color: #ffffff;
		height: 150upx;
	}
	.category-list{
		width: 100%;
		display: flex;
		.left,.right{
			position: absolute;
			top: 150upx;
			bottom: 0upx;
		}
		.left{
			width: 24%;
			left: 0upx;
			background-color: white;
			.row{
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;
				.text{
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #3c3c3c;
				}
				&.on{
					height: 100upx;
					background: linear-gradient(to bottom right, #FBAAA9, #FED3C9);
					color: white;
					.text{
						font-size: 30upx;
						font-weight: 600;
						color: white;
					}
				}
			}
		}
		.right{
			box-sizing: border-box;
			width: 76%;
			left: 24%;
			padding: 20rpx 20rpx 30rpx;
		}
	}

</style>
