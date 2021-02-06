<template>
	<view>
		<!-- 弹窗 -->
		<popup v-show="isShow" @sure="sure" @close="close" :btn="btn"> 
			<template v-slot:popupTip>
				{{ msg }}
			</template>
		</popup>
	</view>
</template>

<script>
	import popup from "@/components/popup/popup.vue"  //弹窗组件
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			//不用computed可能检测不到数据更新
			isShow() {
				return this.$store.state.popup.alert.isShow;
			},
			btn() {
				return this.$store.state.popup.alert.btn;
			},
			msg() {
				return this.$store.state.popup.alert.msg;
			}
		},
		methods: {
			sure() {  //确认按钮
			    let e = {
					type: '确认',
					msg: this.$store.state.popup.alert.msg
				}
				this.$emit('sure', e);
				this.$alert({
					isShow: false
				});
			},
			close() {  //关闭
				let e = {
					type: '取消'
				}
				this.$emit('close', e);  //返回取消函数
				this.$alert({
					isShow: false
				});
			}
		},
		components: {
			popup
		}
	}
</script>

<style>
</style>
