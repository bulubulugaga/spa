<template>
	<view class="content w-con mt20">
		<mecha-list :list="mechaList" :isSelect="isSelect"></mecha-list>
	</view>
</template>

<script>
//引入技师列表组件
import mechaList from '@/components/mechaList/mechaList.vue'
//网络数据
import { getServeDetail } from '@/service/category'
import { getGPSLocation, space } from '@/common/getLocation.js'
export default {
	components: {
		mechaList
	},
	data() {
		return {
			id: '',  //服务id
			//技师列表
			mechaList: [],
			isSelect: true  //选择技师下单
		}
	},
	onLoad(options) {
		this.id = options.id;
		this._getData();
	},
	methods: {
		_getData() {
			this._getServeDetail();			
		},
		_getServeDetail() {
			//获取详情
			let data = {
				id: this.id
			}
			getServeDetail(data).then(res => {
				let mechaList = res.data.product;
				mechaList.forEach(item => {
					this.mechaList.push(item.product[0]);
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

<style>
</style>
