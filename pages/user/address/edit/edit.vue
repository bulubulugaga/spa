<!-- 编辑地址 -->
<template>
	<view>
		<view class="content bg-white">
			<!-- 地址信息 -->
			<view class="row" @click="chooseArea">
				<van-cell icon="location-o" is-link custom-class="bg-none w-vw">
					<view class="input-wrap" slot="title">
						<input type="text" disabled v-model="region" placeholder="选择地区" />
					</view>
				</van-cell>
			</view>
			<view class="row">
				<van-cell icon="location-o" custom-class="bg-none w-vw">
					<view class="input-wrap" slot="title">
						<input type="text" v-model="detail" placeholder="请填写详细地址" />
					</view>
				</van-cell>
			</view>
			<view class="row">
				<van-cell icon="contact" custom-class="bg-none w-vw">
					<view class="input-wrap" slot="title">
						<input type="text" v-model="name" placeholder="请填写联系人" />
					</view>
				</van-cell>
			</view>
			<view class="row">
				<van-cell icon="phone-o" custom-class="bg-none w-vw">
					<view class="input-wrap" slot="title">
						<input type="text" v-model="tel" placeholder="请填写手机号码" />
					</view>
				</van-cell>
			</view>
			<!-- 设置默认 -->
			<view class="row">
				<van-cell title="设置默认地址" custom-class="bg-none w-vw">
					<view slot="value" class="flex input-wrap ml-auto">
						<switch class="ml-auto" color="#FBAAA9" :checked="isDefault" @change="isDefaultChange" />
					</view>
				</van-cell>
			</view>
			<!-- 删除 -->
			<view class="row" v-if="editType=='edit'" @tap="del">
				<view class="del">
					删除地址
				</view>
			</view>
		</view>
		<view class="save" @tap="save">
			<view class="btn">
				保存地址
			</view>
		</view>
	</view>
</template>

<script>
	import { 
		addAddress,
		editAddress,
		deleteAddress
	} from '@/service/user.js'
	
	// 判断属性
	import { isObjHasNull, isPhone } from '@/common/utils.js'
	export default {
		components: {
			
		},
		data() {
			return {
				editType:'edit',
				id:'',
				name:'',
				tel:'',
				detail:'',
				isDefault: false,
				region:''
			};
		},
		methods: {
			chooseArea() {
				//选择地区
				let _this = this;
				uni.chooseLocation({
					success: function(res) {
						_this.region = res.address + res.name;
						
						// _this.ader.la = res.latitude;
						// _this.ader.lo = res.longitude;
					},
					fail: function() {
						//打开地图失败
						uni.getSetting({
							success: function(res) {
								let statu = res.authSetting;
								if (!statu['scope.userLocation']) {
									uni.showModal({
										title: '是否授权当前位置',
										content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
										success: function(tip) {
											if (tip.confirm) {
												uni.openSetting({
													success: function(data) {
														if (data.authSetting["scope.userLocation"] === true) {
															uni.showToast({
																title: '授权成功',
																icon: 'success',
																duration: 1000
															})
															//授权成功之后，再调用chooseLocation选择地方
															uni.chooseLocation({
																success: function(res) {
																	_this.region = res.address + res.name;
																	// _this.ader.la = res.latitude;
																	// _this.ader.lo = res.longitude;
																},
															})
														} else {
															uni.showToast({
																title: '授权失败',
																icon: 'success',
																duration: 1000
															})
														}
													}
												})
											}
										}
									})
								}
							},
							fail: function(res) {
								uni.showToast({
									title: '调用授权窗口失败',
									icon: 'success',
									duration: 1000
								})
							}
						})
					}
				});
			},
			isDefaultChange(e) {
				//修改默认状态
				this.isDefault = e.target.value;
			},
			del(){
				//删除地址
				let _this = this;
				uni.showModal({
					title: '删除提示',
					content: '确认删除这个地址吗',
					success: (res)=>{
						if (res.confirm) {
							let data = {
								id: _this.id
							}
							deleteAddress(data).then(res => {
								if(res.code === 1) {
									uni.showToast({
										title: '已删除'
									})
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										})
									}, 1500)
								}
								else {
									uni.showToast({
										title: '删除失败，请稍后再试',
										icon: 'none'
									})
								}
								
								this.onloadPage();
								
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			save(){
				let data={
					name: this.name,
					phone: this.tel,
					region: this.region,
					detail: this.detail,
					is_true: this.isDefault ? 1 : 0,
				}
				
				//判断格式
				if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none'
					})
				}
				else if(!isPhone(this.tel)) {
					uni.showToast({
						title: '请正确输入手机号',
						icon: 'none'
					})
				}
				else {
					//格式正确
					if(this.editType == 'add') {
						//添加
						addAddress(data).then(res => {
							this.onloadPage();
						});
					}
					else {
						//修改
						data['id'] = this.id;
						editAddress(data).then(res => {
							this.onloadPage();
						});
					}
				}
			},
			onloadPage() {
				let pages = getCurrentPages(); // 当前页面
				let beforePage = pages[pages.length - 2]; // 前一个页面
				beforePage.onLoad();
				uni.navigateBack();
			}
		},
		onLoad(e) {
			//获取传递过来的参数
			
			this.editType = e.type;
			if(e.type=='edit'){
				uni.getStorage({
					key:'address',
					success: (e) => {
						this.id = e.data.id;
						this.name = e.data.name;
						this.tel = e.data.phone;
						this.region = e.data.region;
						this.detail = e.data.detail;
						this.isDefault = e.data.is_true
					}
				})
			}
			
		}
	};
</script>
<style lang="scss">

.save{
		view{
			display: flex;
		}
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.btn{
			box-shadow: 0upx 5upx 10upx rgba(0,0,0,0.4);
			width: 70%;
			height: 80upx;
			border-radius: 80upx;
			background-color: #FBAAA9;
			color: #fff;
			justify-content: center;
			align-items: center;
			.icon{
				height: 80upx;
				color: #fff;
				font-size: 30upx;
				justify-content: center;
				align-items: center;
			}
			font-size: 30upx;
		}
	}
	.content{
		display: flex;
		flex-wrap: wrap;
		view{
			display: flex;
		}
		.row{
			width: 100vw;
			.input-wrap {
				flex: 1;
				margin-left: 10rpx;
				input {
					width: 100%;
				}
			}
			.nominal{
				width: 30%;
				height: 120upx;
				font-weight: 200;
				font-size: 30upx;
				align-items: center;
			}
			.input{
				width: 70%;
				padding: 20upx 0;
				align-items: center;
				font-size: 30upx;
				&.switch{
					justify-content: flex-end;
				}
				.textarea{
					margin: 20upx 0;
					min-height: 120upx;
				}
			}
			.del{
				width: 100%;
				height: 100upx;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				color: #f06c7a;
				background-color: rgba(255,0,0,0.05);
				border-bottom: solid 1upx #eee;
			}
		}
	}
	
</style>
