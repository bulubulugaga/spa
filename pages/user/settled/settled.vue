<!-- 商家入驻 -->
<template>
	<view class="content phone">
		<view class="header pr">
			<view class="header-con pa f48 txt-center">
				<view class="big-title FB">全国招商</view>
				<view class="small-title white FB">商家免费入驻</view>
				<van-divider
				  contentPosition="center"
				  customStyle="width: 70%;height:80rpx;margin-left:15%;color: white; border-color: white; font-size: 26rpx;"
				>
				  诚邀(您的邀请码：{{ user.Invitation }})
				</van-divider>
			</view>
		</view>
		<view class="clear"></view>
		<!-- 表单 -->
		<view class="form">
			<view class="list">
				<label for="name" class="flex-middle">姓&emsp;名</label>
				<input id="name" v-model="name" type="text" placeholder="请输入姓名" />
			</view>
			<!-- <view class="list">
				<label for="city" class="flex-middle">城&emsp;市</label>
				<input id="city" v-model="city" type="text" placeholder="请输入城市" />
			</view> -->
			<view class="list">
				<label for="phone" class="flex-middle">手机号</label>
				<input id="phone" v-model="phone" type="text" placeholder="请输入手机号" />
			</view>
			<view class="list">
				<label for="idCard" class="flex-middle">身份证</label>
				<input id="idCard" v-model="idCard" type="text" placeholder="请输入身份证号码" />
			</view>
			<view class="list">
				<label for="experience" class="flex-middle">经&emsp;验</label>
				<input id="experience" v-model="experience" type="text" placeholder="请输入工作年限(选填)" />
			</view>
			<view class="list">
				<label for="team" class="flex-middle">团&emsp;队</label>
				<input id="team" v-model="team" type="text" placeholder="请输入团队大致人数(选填)" />
			</view>
			<view class="list">
				<label for="invitation" class="flex-middle">邀请码</label>
				<input id="invitation" v-model="invitation" type="text" placeholder="请输入邀请码(选填)" />
			</view>
			<view class="list border-non">
				<label for="remarks" class="flex-middle">备&emsp;注（选填）</label>
				<textarea 
					class="remarks"
					maxlength="200" 
					v-model="remarks"
					placeholder="请输入个人备注(最多200字)" />
			</view>
			<!-- 图片区 -->
			<view class="user-img f30">
				<view class="aval">
					<view class="title">上传本人正脸照</view>
					<view class="img">
						<van-uploader multiple="true" max-count="1" accept="image" :file-list="identityList" @after-read="afterRead($event,'identityList')"
							@item-click="btnClick($event,'identityList')" preview-size="240rpx" />
					</view>
				</view>
				<view class="idcard">
					<view class="title">上传身份证照（人像面和国徽面）</view>
					<view class="img">
						<van-uploader multiple="true" max-count="2" accept="image" :file-list="idCardList" @after-read="afterRead($event,'idCardList')" 
							@item-click="btnClick($event,'idCardList')" preview-size="240rpx" />
					</view>
				</view>
				<view class="idcard">
					<view class="title">上传营业执照</view>
					<view class="img">
						<van-uploader multiple="true" max-count="1" accept="image" :file-list="licenseList" @after-read="afterRead($event,'licenseList')" 
							@item-click="btnClick($event,'licenseList')" preview-size="240rpx" />
					</view>
				</view>
			</view>
			
			<view class="list submit" @click="submit">立即入驻</view>
		</view>
	</view>
</template>

<script>
	import { settled } from '@/service/user.js'
	//上传图片
	import { uploadFile } from '@/service/uploadFile.js'
	//判断字符串格式
	import { isPhone, isIdCard } from '@/common/utils.js'
	export default {
		data() {
			return {
				name: '',
				city: '',
				phone: '',
				idCard: '',
				experience: '',
				team: '',
				remarks: '',
				identityList: [],
				idCardList: [],
				licenseList: []
			}
		},
		computed: {
			logo() {
				return this.$store.state.logo;
			},
			miniName() {
				//小程序名字
				return this.$store.state.name;
			},
			user() {
				//个人信息
				return uni.getStorageSync('userInfo');
			}
		},
		methods: {
			afterRead(event, r) {
				//预览
			    const { file } = event.detail;
				uploadFile(file).then(res => {
					//上传图片更新预览
					res.forEach(item => {
						//多图循环
						switch(r) {
							case 'identityList': this.identityList = this.identityList.concat(item); break;
							case 'idCardList': this.idCardList = this.idCardList.concat(item); break;
							case 'licenseList': this.licenseList = this.licenseList.concat(item); break;
						}
					})
				})
			},
			btnClick(e, r) {
				//刪除身份证
				let index = e.detail.currentTarget.dataset.index;
				switch(r) {
					case 'identityList': this.identityList.splice(index, 1); break;
					case 'idCardList': this.idCardList.splice(index, 1); break;
					case 'licenseList': this.licenseList.splice(index, 1); break;
				}
				// this.r.splice(index, 1);
			},
			submit() {
				//提交
				if(!this.name) {
					uni.showToast({title: '请输入姓名', icon: 'none'})
					return;
				}
				// if(!this.city) {
				// 	uni.showToast({title: '请选择城市', icon: 'none'})
				// 	return;
				// }
				if(!this.phone) {
					uni.showToast({title: '请输入手机号', icon: 'none'})
					return;
				}
				if(!this.idCard) {
					uni.showToast({title: '请输入身份证号码', icon: 'none'})
					return;
				}
				if(this.identityList.length == 0) {
					uni.showToast({title: '请上传人脸照片', icon: 'none'})
					return;
				}
				if(this.idCardList.length != 2) {
					uni.showToast({title: '请上传两张身份证照片', icon: 'none'})
					return;
				}
				if(this.licenseList.length == 0) {
					uni.showToast({title: '请上传营业执照', icon: 'none'})
					return;
				}
				if(!isPhone(this.phone)) {
					uni.showToast({title: '手机号格式不正确', icon: 'none'})
					return;
				}
				if(!isIdCard(this.idCard)) {
					uni.showToast({title: '身份证号码格式不正确', icon: 'none'})
					return;
				}
				let data = {
					name: this.name,
					// city: this.city,
					phone: this.phone,
					identity: this.idCard,
					undergo: this.experience,
					team: this.team,
					invitation: this.invitation,
					remark: this.remarks,
					human: this.identityList[0].path,
					idimages: this.idCardList[0].path + ',' + this.idCardList[1].path,
					image: this.licenseList[0].path
				}
				settled(data).then(res => {
					if(res.msg == '提交成功') {
						uni.showToast({
							title: '已提交'
						})
					}
					else {
						uni.showToast({
							title: '提交失败，请稍后再试',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-bottom: 80rpx;
	}
	.clear {
		clear: both;
	}
	.header {
		width: 110vw;
		margin-left: -5vw;
		height: 56vw;
		background: linear-gradient(to top, #FBAAA9, #FED3C9);	
		border-bottom-left-radius: 130rpx;
		border-bottom-right-radius: 130rpx;
		z-index: -1;
		&-con {
			top: 0;
			left: 5vw;
			width: 100vw;
			.big-title {
				font-size: 52rpx;
				padding-top: 80rpx;
				color: #FBAAA9;
				text-shadow: 1rpx 1rpx 1rpx rgba(0, 0, 0, .3);
				letter-spacing: 4rpx;
			}
			.small-title {
				font-size: 58rpx;
				margin-top: 10rpx;
				text-shadow: 1rpx 1rpx 12rpx rgba(0, 0, 0, .4);
				letter-spacing: 4rpx;
			}
		}
	}
	.form {
		width: 92%;
		margin-left: 4%;
		background: white;
		border-radius: 10rpx;
		margin-top: -72rpx;
		padding-top: 40rpx;
		.list {
			display: flex;
			flex-wrap: wrap;
			font-size: 30rpx;
			border-bottom: 1rpx solid #eee;
			width: 90%;
			padding: 24rpx 20rpx;
			margin-left: 5%;
			input {
				flex: 1;
				margin-left: 20rpx;
				font-family:Monospaced Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif!important;
			}
			.remarks {
				width: 100%;
				height: 200rpx;
				border: 1rpx solid #eee;
				margin-top: 10rpx;
				padding: 10rpx;
			}
		}
		.border-non {
			border-bottom: none;
		}
		.user-img {
			margin-top: 40rpx;
			width: 90%;
			padding: 40rpx 20rpx;
			margin-left: 5%;
			border-top: 1rpx solid #eee;
			.title {
				line-height: 60rpx;
			}
		}
		.submit {
			background: #FBAAA9;
			color: white;
			margin-top: 80rpx;
			letter-spacing: 2rpx;
			border-radius: 100rpx;
			justify-content: center;
		}
	}
</style>
