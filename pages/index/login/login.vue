<!-- 技师端登录注册页 -->
<template>
	<view class="content">
		<view class="header">
			<!-- <nav-bar title="登录" :isDefaultFun="false" @leftFun="leftFun"></nav-bar> -->
			<nav-bar iconColor="white" bgColor="rgba(255,255,255,0)"></nav-bar>			
			<view class="msg txt-center">
				<image class="circle" :src="logo"></image>
				<view class="tip f28">提示：只有通过审核的账号才能登录技师端</view>
			</view>
		</view>
		<view class="contain w-con bg-white border-ra-30 b-show-list">
			<van-tabs :active="activeTab" @click="tabChange" color="#FDC6BF" line-height="2">
				<van-tab title="注册"></van-tab>
				<van-tab title="登录"></van-tab>
				<van-tab title="忘记密码"></van-tab>
			</van-tabs>
			
			<!-- 登录注册不能放在van-tab里，否则textarea会被不不知名原因覆盖样式 -->
			<!-- 登录 -->
			<view class="login" v-if="activeTab === 1">
				<view class="list-input flex-middle">
					<label for="phone" class="flex-middle"><van-icon name="contact" size="36rpx" /></label>
					<input id="phone" v-model="phone" type="text" placeholder="请输入手机号" />
				</view>
				<view class="list-input flex-middle">
					<label for="password" class="flex-middle"><van-icon name="bag-o" size="36rpx" /></label>
					<input id="password" v-model="password" type="password" placeholder="请输入密码" />
				</view>
				<view class="list-input submit txt-center" @click="login">立即登录</view>
			</view>
			
			<!-- 注册 -->
			<view class="register" v-else-if="activeTab === 0"> 
				<view class="list-input flex-middle">
					<label for="name" class="flex-middle">姓&emsp;名</label>
					<input id="name" v-model="name" type="text" placeholder="请输入姓名" />
				</view>
				<view class="list-input flex-middle">
					<label for="idcardNum" class="flex-middle">身份证</label>
					<input id="idcardNum" v-model="idcardNum" type="text" placeholder="请输入身份证号码" />
				</view>
				<view class="list-input flex-middle">
					<label class="flex-middle">性&emsp;别</label>
					<van-radio-group class="flex-cover" :value="sex" @change="chooseSex">
					  <van-radio name="女" checked-color="#FBAAA9" icon-size="34rpx">女</van-radio>
					  <van-radio name="男" checked-color="#FBAAA9" icon-size="34rpx">男</van-radio>
					</van-radio-group>
				</view>
				<view class="list-input flex-middle">
					<label for="age" class="flex-middle">年&emsp;龄</label>
					<input id="age" v-model="age" type="text" placeholder="请输入年龄" />
				</view>
				<view class="list-input flex-middle">
					<label for="height" class="flex-middle">身&emsp;高</label>
					<input id="height" v-model="height" type="text" placeholder="请输入身高" />
					<label class="label-right flex-middle" for="password">cm</label>
				</view>
				<view class="list-input flex-middle">
					<label for="weight" class="flex-middle">体&emsp;重</label>
					<input id="weight" v-model="weight" type="text" placeholder="请输入体重" />
					<label class="label-right flex-middle" for="password">KG</label>
				</view>
				<view class="list-input flex-middle">
					<label for="area" class="flex-middle">地&emsp;区</label>
					<input @click.native="this.areaShow = true;" id="area" disabled v-model="area" type="text" placeholder="点击选择服务地区" />
				</view>
				<view class="list-input flex-middle">
					<label for="password" class="flex-middle">介&emsp;绍</label>
					<textarea 
						class="text-area"
						auto-height 
						maxlength="200" 
						v-model="intro"
						placeholder="请输入个人介绍(最多200字)" />
				</view>
				<view class="list-input flex-middle">
					<label for="phoneR" class="flex-middle">手机号</label>
					<input id="phoneR" v-model="phoneR" type="text" placeholder="请输入手机号" />
				</view>
				<view class="list-input flex-middle">
					<label for="veriCode" class="flex-middle">验证码</label>
					<input id="veriCode" v-model="veriCode" type="text" placeholder="请输入验证码" />
					<label v-if="codeShow" class="label-right flex-middle"  @click="getCode('r')">点击获取</label>
					<label v-else class="label-right gray flex-middle">{{ codeTip }}</label>
				</view>
				<view class="list-input flex-middle">
					<label for="passwordR" class="flex-middle">登录密码</label>
					<input id="passwordR" v-model="passwordR" type="password" placeholder="请输入密码" />
				</view>
				<view class="list-input flex-middle">
					<label for="surePassword" class="flex-middle">确认密码</label>
					<input id="surePassword" v-model="surePassword" type="password" placeholder="请再次输入密码" />
				</view>
				
				<!-- 图片区 -->
				<view class="user-img">
					<view class="aval">
						<view>上传本人正脸照</view>
						<view class="aval-img"  @tap="changeAvar">
							<image v-if="!avarImg" src="/static/images/up_img.png" mode=""></image>
							<image v-else :src="baseImgURL + avarImg" mode=""></image>
						</view>
						<view v-if="avarImg" class="aval-tip f24 ccc">点击图片重新上传</view>
					</view>
					<view class="idcard">
						<view>上传身份证照（人像面和国徽面）</view>
						<view class="idcard-img">
							<van-uploader multiple="true" max-count="2" accept="image" :file-list="idCardList" @after-read="afterRead($event,r)" 
								@item-click="btnClick($event,r)" preview-size="240rpx" />
						</view>
					</view>
				</view>
				
				<!-- 法律声明 -->
				<view class="law">
					<van-checkbox icon-size="30rpx" checked-color="#FDC6BF" :value="isCheckLaw" @change="changeIsCheckLaw">
						<view class="f28 flex">
							请仔细阅读并同意
							<view class="law-color" @click.stop="toLaw">《法律声明》</view>
						</view>
					</van-checkbox>
				</view>
				<view class="list-input submit txt-center" @click="register">立即注册</view>
			</view>
			
			<!-- 找回密码 -->
			<view class="forget-pass" v-else>
				<view class="list-input flex-middle">
					<label for="phoneR" class="flex-middle">手机号</label>
					<input id="phoneR" v-model="phoneF" type="text" placeholder="请输入手机号" />
				</view>
				<view class="list-input flex-middle">
					<label for="veriCode" class="flex-middle">验证码</label>
					<input id="veriCode" v-model="veriCodeF" type="text" placeholder="请输入验证码" />
					<label v-if="codeShowF" class="label-right flex-middle" @click="getCode('f')">点击获取</label>
					<label v-else class="label-right flex-middle gray" @click="getCode('f')">{{ codeTipF }}</label>
				</view>
				<view class="list-input flex-middle">
					<label for="passwordR" class="flex-middle">登录密码</label>
					<input id="passwordR" v-model="passwordF" type="password" placeholder="请输入密码" />
				</view>
				<view class="list-input flex-middle">
					<label for="surePassword" class="flex-middle">确认密码</label>
					<input id="surePassword" v-model="surePasswordF" type="password" placeholder="请再次输入密码" />
				</view>
				<view class="list-input submit txt-center" @click="forgetPass">修改密码</view>
			</view>
		</view>
		
		<!-- 弹窗 -->
		<alert @sure="sure"></alert>
		
		<!-- 地区选择 -->
		<van-popup :show="areaShow" position="bottom" custom-style="height: 320px;" @close="this.areaShow = false" >
			<van-picker show-toolbar title="选择地区" :columns="areas" @change="onChangeCity" @cancel="this.areaShow = false" @confirm="confirmArea" />
		</van-popup>
	</view>
</template>

<script>
	// 自定义tabBar
	import navBar from '@/components/navBar/navBar.vue'
	// 判断属性
	import { isObjHasNull } from '@/common/utils.js'
	import { isPhone } from '@/common/utils.js'
	import { isIdCard } from '@/common/utils.js'
	//api
	import { getOpenAd, sendGPS } from '@/service/home.js'
	import { register, sendCode, tLogin, tUpPass, getTInfo } from '@/service/user.js'
	//上传图片
	import { uploadFile } from '@/service/uploadFile.js'
	import { baseImgURL } from '@/service/config'
	// gps
	import { getGPSLocation } from '@/common/getLocation.js'
	export default {
		data() {
			return {
				cityAble: [],  //可用城市
				
				logo: '',
				activeTab: 1,  //默认展示登录
				
				//登录信息
				phone: '',
				password: '',
				
				//注册信息
				name: '',
				idcardNum: '',
				sex: '女',
				age: '',
				height: '',
				weight: '',
				area: '',
				city_id: '',
				intro: '',
				phoneR: '',
				veriCode: '',
				passwordR: '',
				surePassword: '',
				avarImg: '', //头像
				idCardList: []  ,//身份证列表
				
				//忘记密码信息
				phoneF: '',
				veriCodeF: '',
				passwordF: '',
				surePasswordF: '',
				
				//可选地区
				areas: [],
				areaShow: false,  //展示地区选择
				
				isCheckLaw: false,  //是否选择法律声明
				
				codeTip: '点击获取',
				baseImgURL: '',
				
				
				codeShow: true,
				codeTip: '',
				codeShowF: true,
				codeTipF: '',
			}
		},
		onLoad() {
			this.logo = this.$store.state.logo;
			this.baseImgURL = baseImgURL;
			
			//初始化地区选择（后面放入网络接口函数中）
			this.getCity();
		},
		components: {
			navBar
		},
		methods: {
			// leftFun(e) {
			// 	console.log(e);
			// }
			tabChange(event) {
				//选择登录或注册
				switch(event.detail.title) {
					case '登录': this.activeTab = 1; break;
					case '注册': this.activeTab = 0; break;
					case '忘记密码': this.activeTab = 2; break;
				}
				// this.activeTab = event.detail.title == '登录' ? 0 : 1;				
			},
			chooseSex(e) {
				//选择性别
				this.sex = e.detail;
			},
			getCity() {
				getOpenAd().then(res => {
					//修改地区格式
					let provices = [];
					let cityAble = [];
					res.data.forEach(item => {
						let provice = item.name.split('/')[0];
						let proviceIndex = provices.indexOf(provice);
						if(proviceIndex === -1) {
							//还没有该省份
							provices.push(provice);
							cityAble.push(
								{
									provice, 
									citys: [{
										id: item.id,
										name: item.name.split('/')[1]
									}]
								}
							);
							// provices
						}
						else {
							//有省份，添加城市到该省份
							cityAble[proviceIndex].citys.push(
								{
									id: item.id,
									name: item.name.split('/')[1]
								}
							);
						}
					})
					this.cityAble = cityAble;
					//修改组件需要格式
					let citys = [];
					cityAble[0].citys.forEach(item => {
						citys.push(item.name);
					})
					this.areas = [
						{
							values: provices,
							className: 'column1',
						}, {
							values: citys,
							className: 'column2',
							defaultIndex: 2,
						}
					]
				})
			},
			onChangeCity(e) {
				//切换市
				//省下标
				let index1 = e.detail.picker.children[0].data.currentIndex;
				
				//切换市
				let citys = [];
				this.cityAble[index1].citys.forEach(item => {
					citys.push(item.name);
				})
				this.$set(this.areas, 1, {
					values: citys,
					className: 'column2',
					defaultIndex: 2,
				})
			},
			confirmArea(e) {
				this.city_id = this.cityAble[e.detail.index[0]].citys[e.detail.index[1]].id;
				this.area = e.detail.value.join('-');
				this.areaShow = false;
			},
			changeAvar() {  
				//上传头像
				let _this = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'],
				    success: function (res) {
						uni.navigateTo({
							url: '../chooseAvar/chooseAvar?url=' + res.tempFilePaths
						})
					}
				});
			},
			afterRead(event, r) {
				//预览身份证
			    const { file } = event.detail;
				
				uploadFile(file).then(res => {
					//上传图片更新预览
					this.idCardList = this.idCardList.concat(res);
				})
			},
			btnClick(e, r) {
				//刪除身份证
				let index = e.detail.currentTarget.dataset.index;
				this.idCardList.splice(index, 1);
			},
			changeIsCheckLaw(e) {
				//切换选择法律
				this.isCheckLaw = e.detail;
			},
			toLaw() {
				//展示法律声明
				uni.navigateTo({
					url: '/pages/user/law/law'
				});
			},			
			
			login() {
				//登录
				let data = {
					phone: this.phone,
					password: this.password
				}
				if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none'
					})
				}
				else if(!isPhone(this.phone)) {
					uni.showToast({
						title: '请正确输入手机号',
						icon: 'none'
					})
				}
				else {
					tLogin(data).then(res => {
						if(res.code == 200) {
							//登录成功
							
							getTInfo().then(res => {
								if(res.code === 200) {
									uni.setStorageSync('userInfo', res.data);
								}
							})
							getGPSLocation().then(res => {
								let data = {
									 latitude: res.latitude,
									 longitude: res.longitude
								}
								sendGPS(data).then(res => {
									
								})
							})
							
							uni.reLaunch({
								url: '/pages/tabBar/switch/switch?active=0'
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
			getCode(type) {
				//获取验证码
				let data = {};
				let _this = this;
				if(type == 'r') {
					data = {phone: this.phoneR};
				}
				else {
					data = {phone: this.phoneF};
				}
				sendCode(data).then(res => {
					if(res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					else {
						//发送成功，改为倒计时
						
						if(type == 'r') {
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
						else {
							//找回密码时点击
							this.codeShowF = false;
							let time = 60;
							let timer = setInterval(() => {
								this.codeTipF = time + 's';
								time--;
								if(time == -1) {
									clearInterval(timer);
									_this.codeShowF = true;
								}
							}, 1000);
						}
						
					}
				})
			},
			register() {
				//注册
				if(this.idCardList.length < 2) {
					uni.showToast({
						title: '请上传身份证人像面和国徽面',
						icon: 'none'
					});
					return;
				}
				let data = {
					name: this.name,
					id_number: this.idcardNum,
					sex_data: this.sex === '女' ? 2 : 1,
					age: this.age,
					stature: this.height,
					weight: this.weight,
					city_id: this.city_id,
					introduce: this.intro,
					phone: this.phoneR,
					code: this.veriCode,
					password: this.passwordR,
					image: this.avarImg,
					id_images: this.idCardList[0].path + ',' + this.idCardList[1].path
				}
				
				if(!this.isCheckLaw) {
					uni.showToast({
						title: '请认真阅读并勾选法律声明',
						icon: 'none'
					})
				}
				else if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none'
					})
				}
				else if(!isIdCard(this.idcardNum)) {
					uni.showToast({
						title: '请正确输入身份证号',
						icon: 'none'
					})
				}
				else if(!isPhone(this.phoneR)) {
					uni.showToast({
						title: '请正确输入手机号',
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
					register(data).then(res => {
						if(res.code == 200) {
							this.$alert('信息已提交至后台，等待管理员审核通过后可登录，如有问题请联系管理员');
							this.activeTab = 1;
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
			forgetPass() {
				//忘记密码
				let data = {
					phone: this.phoneF,
					code: this.veriCodeF,
					password: this.passwordF
				}
				if(isObjHasNull(data)) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none'
					})
				}
				else if(!isPhone(this.phoneF)) {
					uni.showToast({
						title: '请正确输入手机号',
						icon: 'none'
					})
				}
				else if(this.passwordF.length < 6 || this.passwordF.length > 18) {
					uni.showToast({
						title: '密码需要在6-18位',
						icon: 'none'
					})
				}
				else if(this.passwordF !== this.surePasswordF) {
					this.passwordF = '';
					this.surePasswordF = '';
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					})
				}
				else {
					// 格式正确
					tUpPass(data).then(res => {
						if(res.code == 200) {
							this.$alert('修改成功，去登录');
							this.activeTab = 1;
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
			sure() {
				//忘记密码确认按钮，跳转到登录
				switch(this.activeTab){
					case 2: this.activeTab = 1; break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-bottom: 40rpx;
	}
	.header {
		height: 80vw;
		background: linear-gradient(to right bottom, #FBAAA9, #FED3C9);	
		.msg {
			image {
				width: 170rpx;
				height: 170rpx;
			}
			.tip {
				color: #646566;
				margin-top: 30rpx;
			}
		}
	}
	.contain {
		padding: 20rpx 20rpx 100rpx;
		margin-top: -20vw;
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
		
		.register, .forget-pass {
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
			.law {
				padding-left: 9%;
				margin-top: 80rpx;
				&-color {
					text-decoration: underline;
					color: gray;
				}
			}
		}
		.register {
			.submit {
				margin-top: 10rpx;
			}
		}
	}
</style>
