<!-- 修改个人信息 -->
<template>
	<view class="content">
		<view class="contain w-con bg-white b-show-list">
			
			<!-- 个人信息 -->
			<view class="register"> 
				<view class="list-input flex-middle">
					<label for="phoneR" class="flex-middle">手机号</label>
					<input id="phoneR" v-model="phoneR" type="text" placeholder="请输入手机号" />
				</view>
				<view class="list-input flex-middle">
					<label for="veriCode" class="flex-middle">验证码</label>
					<input id="veriCode" v-model="veriCode" type="text" placeholder="请输入验证码" />
					<label v-if="codeShow" class="label-right flex-middle" @click="getCode()">点击获取</label>
					<label v-else class="label-right flex-middle gray" @click="getCode()">{{ codeTip }}</label>
				</view>
				
				<view class="list-input submit txt-center" @click="submit">立即修改</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	// 判断属性
	import { isObjHasNull } from '@/common/utils.js'
	import { isPhone } from '@/common/utils.js'
	
	import { sendCode, updateInfo } from '@/service/user.js'
	
	export default {
		data() {
			return {
				//注册信息
				phoneR: '',
				veriCode: '',
				
				codeShow: true,
				codeTip: '',
			}
		},
		onLoad() {
			
		},
		methods: {
			getCode(type) {
				//获取验证码
				let data = {
					phone: this.phoneR
				};
				let _this = this;
				sendCode(data).then(res => {
					if(res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					else {
						//发送成功，改为倒计时
						//注册时点击
						this.codeShow = false;
						let time = 60;
						let timer = setInterval(() => {
							this.codeTip = time + 's';
							time--;
							if(time == -1) {
								clearInterval(timer);
								_this.codeShow = true;
							}
						}, 1000);
					}
				})
			},
			submit() {
				//提交
				let data = {
					phone: this.phoneR,
					code: this.veriCode,
				}
				if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none'
					})
				}
				else if(!isPhone(this.phoneR)) {
					uni.showToast({
						title: '请正确输入手机号',
						icon: 'none'
					})
				}
				else {
					// 格式正确
					updateInfo(data).then(res => {
						if(res.code == 200) {
							uni.showToast({
								title: '已修改'
							})
						}
						else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
									
				}
			},
		}
	}
</script>

<style lang="scss">
	.contain {
		padding: 20rpx 20rpx 100rpx;
		margin-top: 2rpx;
		.list-input {
			font-size: 30rpx;
			background: rgba(251,170,169, .2);
			margin-top: 40rpx;
			width: 90%;
			padding: 18rpx 40rpx;
			margin-left: 5%;
			border-radius: 40rpx;
			input, textarea {
				flex: 1;
				margin-left: 10rpx;
			}
		}
		.submit {
			background: #FBAAA9;
			color: white;
			margin-top: 80rpx;
			letter-spacing: 2rpx;
		}
		.forget {
			color: #FBAAA9;
			margin-top: 14rpx;
		}
		
		.register {
			label {
				border-right: 1rpx solid #ccc;
				padding-right: 14rpx;
				margin-right: 6rpx;
			}
			.label-right {
				border-left: 1rpx solid #ccc;
				border-right: none;
				padding-left: 14rpx;
				padding-right: 0;
				margin-left: 6rpx;
			}
			van-radio-group {
				margin-left: 10rpx;
				van-radio {
					margin-right: 40rpx;
				}
			}
			.placeTxt {
				font-size: 30rpx;
				color: #ccc;
			}
			.user-img {
				font-size: 30rpx;
				margin-top: 40rpx;
				width: 90%;
				margin-left: 5%;
				padding-top: 40rpx;
				border-top: 1rpx solid #ccc;
				.aval {
					&-img {
						width: 300rpx;
						height: 300rpx;
						margin-left: 30rpx;
						margin-top: 20rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
					&-tip {
						margin: 8rpx 0 0 80rpx;
					}
				}
				.idcard {
					margin-top: 40rpx;
					&-img {
						padding: 20rpx 30rpx;
					}
				}
			}
		}
	}
</style>
