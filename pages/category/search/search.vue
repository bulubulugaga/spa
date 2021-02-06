<template>
	<view>
		<!-- 状态栏 -->
        <view class="header" :style="{position:headerPosition}">
			<view class="header-top">
				<view class="header-input flex-middle">
					<van-icon class="f30" name="search" />
					<input type="text" v-model="value" placeholder="请输入项目或技师" confirm-type="搜索" @confirm="search" />
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
		
					
		<!-- 右侧子导航 -->
		<view class="list-info">
			<serve-list v-if="activeTab === 0" :list="serveList"></serve-list>
			<mecha-list v-else :list="mechaList"></mecha-list>
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
		created() { 
			
		},
		methods: {
			search() {
				//搜索
				let data = {
					text: this.value,
					id: this.city.id
				}
				if(this.activeTab === 0) {
					//搜索服务
					searchServe(data).then(res => {
						this.serveList = res.data;
					})
				}
				else {
					searchMech(data).then(res => {
						this.mechaList = res.data;
					})
				}
			},
			tabChange(event) {
				//选择服务或技师
				
				this.activeTab = event.detail.title == '服务项目' ? 0 : 1;
				this.showCategoryIndex = 0;
				
				this.search();
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
	.list-info {
		width: 92%;
		margin-left: 4%;
		padding: 20rpx 0;
	}

</style>
