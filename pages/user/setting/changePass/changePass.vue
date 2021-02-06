<!-- 修改个人信息 -->
<template>
	<view class="content">
		<view class="contain w-con bg-white b-show-list">
			
			<!-- 个人信息 -->
			<view class="register">
				<view class="list-input flex-middle">
					<label for="password" class="flex-middle">原&ensp;密&ensp;码</label>
					<input id="password" v-model="password" type="password" placeholder="请输入密码" />
				</view>
				<view class="list-input flex-middle">
					<label for="passwordR" class="flex-middle">新&ensp;密&ensp;码</label>
					<input id="passwordR" v-model="passwordR" type="password" placeholder="请输入密码" />
				</view>
				<view class="list-input flex-middle">
					<label for="surePassword" class="flex-middle">确认密码</label>
					<input id="surePassword" v-model="surePassword" type="password" placeholder="请再次输入密码" />
				</view>
				
				<view class="list-input submit txt-center" @click="submit">立即修改</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	// 判断属性
	import { isObjHasNull } from '@/common/utils.js'
	import { updateInfo } from '@/service/user.js'
	export default {
		data() {
			return {
				//注册信息
				password: '',
				passwordR: '',
				surePassword: '',
			}
		},
		onLoad() {
			
		},
		methods: {
			submit() {
				//提交
				let data = {
					password: this.password,
					password_t: this.passwordR
				}
				if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none'
					})
				}
				else if(this.passwordR.length < 6 || this.passwordR.length > 18) {
					uni.showToast({
						title: '密码需要在6-18位',
						icon: 'none'
					})
				}
				else if(this.passwordR !== this.surePassword) {
					this.passwordR = '';
					this.surePassword = '';
					uni.showToast({
						title: '两次输入的密码不一致',
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
