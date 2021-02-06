<!-- 收藏 -->
<template>
	<view class="content">
		<!-- 选项卡 -->
		<view class="top bg-white flex-middle">
			<van-tabs :active="activeTab" @click="tabChange" color="#FDC6BF" line-width="56" line-height="2">
			  <van-tab title="服务项目" ></van-tab>
			  <van-tab title="服务技师"></van-tab>
			</van-tabs>
		</view>
		<!-- 占位 -->
		<view class="blank"></view>
		<!-- 内容 -->
		<view class="w-con" v-if="activeTab == 0">
			<serve-list :list="serveList"></serve-list>
		</view>
		<view class="w-con" v-else>
			<mecha-list :list="mechaList"></mecha-list>
		</view>
	</view>
</template>

<script>
//引入服务列表和技师列表组件
import serveList from '@/components/serveList/serveList.vue'
import mechaList from '@/components/mechaList/mechaList.vue'
//网络api
import { getCollection } from '@/service/user.js'
import { getGPSLocation, space } from '@/common/getLocation.js'
export default {
	components: {
		serveList,
		mechaList
	},
	data() {
		return {
			activeTab: 0,
			//服务列表
			serveList: [],
			//技师列表
			mechaList: []
		}
	},
	onLoad() {
		this._getCollection();
	},
 	methods: {
		tabChange(event) {
			//选择服务或技师
			this.activeTab = event.detail.title == '服务项目' ? 0 : 1;			
		},
		
		_getCollection() {
			//获取收藏
			//初始化为空，防止刷新叠加
			this.serveList = [];
			this.mechaList = []; //注意不能连接等于
			getCollection({ status: 1 }).then(res => {
				res.data.forEach(item => {
					this.serveList.push(item.product);
				})
			})
			getCollection({ status: 2 }).then(res => {
				res.data.forEach(item => {
					this.mechaList.push(item.technician);
				})
				getGPSLocation().then(res=> {
					this.mechaList.forEach(item => {
						let a = space(item.latitude,item.longitude,res.latitude,res.longitude);
						this.$set(item, 'dis', a);
					})
				})
			})
		}
	}
}
</script>

<style lang="scss">
	.top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 80rpx;
		border-top: 1rpx solid #f9f9f9;
		van-tabs {
			width: 100vw;
		}
	}
	.blank {
		height: 100rpx;
	}
</style>
