<!-- 消息列表 -->
<template>
	<view class="content w-con pt20">
		<news-list :list="newsList" @delete="deleteMsg"></news-list>
	</view>
</template>

<script>
	//引入消息列表组件
	import newsList from '@/components/newsList/newsList.vue'	
	//网络数据
	import { getMsg, deleteMsg, getMsgT, delMsgT } from '@/service/user.js'
	//时间转换
	import { transeTime } from '@/common/utils'
	export default {
		components: {
			newsList
		},
		data() {
			return {
				newsList: []  //消息列表
			}
		},
		computed: {
			miniType() {
				return this.$store.state.userType;
			}
		},
		onLoad() {
			this._getData();
		},
		methods: {
			deleteMsg(e) {
				//删除信息
				if(this.miniType == 'user') {
					deleteMsg({ id: e }).then(res => {
						if(res.code == 1) {
							uni.showToast({
								title: '已删除'
							})
							this._getMsg();
						}
						else {
							uni.showToast({
								title: '删除失败,请稍后再试',
								icon: 'none'
							})
						}
					})
				}
				else {
					delMsgT({ id: e }).then(res => {
						if(res.code == 200) {
							uni.showToast({
								title: '已删除'
							})
							this._getMsg();
						}
						else {
							uni.showToast({
								title: '删除失败,请稍后再试',
								icon: 'none'
							})
						}
					})
				}
			},
			
			//获取网络数据
			_getData() {
				this._getMsg();
			},
			_getMsg() {
				if(this.miniType == 'user') {
					getMsg().then(res => {
						this.newsList = res.data;
						this.newsList.forEach(item => {
							let time = transeTime(item.createtime * 1000 , 'Y-M-D H:M:S');
							item.createtime = time;
						})
					})
				}
				else {
					getMsgT().then(res => {
						this.newsList = res.data;
						this.newsList.forEach(item => {
							let time = transeTime(item.createtime * 1000 , 'Y-M-D H:M:S');
							item.createtime = time;
						})
					})
				}
			}
		}
	}
</script>

<style>
</style>
