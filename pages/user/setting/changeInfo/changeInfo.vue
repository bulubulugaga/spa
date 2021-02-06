<!-- 修改个人信息 -->
<template>
	<view class="content">
		<view class="contain w-con bg-white b-show-list">
			
			<!-- 个人信息 -->
			<view class="register"> 
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
					<label for="password" class="flex-middle">状&emsp;态</label>
					<van-dropdown-menu active-color="#FBAAA9" class="pr" :overlay="false">
					  <van-dropdown-item 
						  popup-style="margin-top:52rpx;max-height:300rpx;width: 200rpx;box-shadow:2rpx 2rpx 100rpx rgba(0,0,0,.2)" 
						  :value="status" 
						  :options="statuses"
						   @change="changeStatus" />
					</van-dropdown-menu>
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
				
				<view class="list-input submit txt-center" @click="submit">立即修改</view>
			</view>
		</view>
		
		<!-- 地区选择 -->
		<van-popup :show="areaShow" position="bottom" custom-style="height: 320px;" @close="this.areaShow = false" >
			<van-picker show-toolbar title="选择地区" :columns="areas" @change="onChangeCity" @cancel="this.areaShow = false" @confirm="confirmArea" />
		</van-popup>
	</view>
</template>

<script>
	// 判断属性
	import { isObjHasNull } from '@/common/utils.js'
	import { isPhone } from '@/common/utils.js'
	import { isIdCard } from '@/common/utils.js'
	//上传图片
	import { uploadFile } from '@/service/uploadFile.js'
	import { baseImgURL } from '@/service/config'
	//api
	import { getOpenAd } from '@/service/home.js'
	import { getTInfo, updateInfo } from '@/service/user.js'
	
	export default {
		data() {
			return {
				baseImgURL: '',
				
				
				//注册信息
				name: '用户名',
				idcardNum: '1234123412',
				sex: '女',
				age: '22',
				height: '165',
				weight: '50',
				area: '四川省-成都市',
				city_id: '',
				intro: '介绍介绍',
				status: 10,
				avarImg: '', //头像
				idCardList: []  ,//身份证列表
				
				//可选地区
				cityAble: [],  //可用城市
				areas: [],
				areaShow: false,  //展示地区选择
				
				//可选状态
				statuses: [
					{ text: '可服务', value: 10 },
				    { text: '服务中', value: 20 },
				    { text: '不可服务', value: 30 }
				]
			}
		},
		onLoad() {
			this.logo = this.$store.state.logo;
			this.baseImgURL = baseImgURL;
			//初始化地区选择（后面放入网络接口函数中）
			this.getCity();
			this._getTInfo();
		},
		methods: {
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
			chooseSex(e) {
				//选择性别
				this.sex = e.detail;
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
			changeStatus(e) {
				//修改状态
				this.status = e.detail;
			},
			changeAvar() {  
				//上传头像
				let _this = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'],
				    success: function (res) {
						uni.navigateTo({
							url: '/pages/index/chooseAvar/chooseAvar?url=' + res.tempFilePaths
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
			
			submit() {
				//提交
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
					status: this.status,
					image: this.avarImg,
					id_images: this.idCardList[0].path + ',' + this.idCardList[1].path
				}
				if(isObjHasNull(data)) {
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
				else if(this.idCardList.length < 2) {
					uni.showToast({
						title: '请上传身份证人像面和国徽面',
						icon: 'none'
					})
				}
				else {
					// 格式正确
					console.log(data);
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
			
			
			_getTInfo() {
				getTInfo().then(res => {
					this.name = res.data.name;
					this.idcardNum = res.data.id_number,
					this.sex = res.data.sex_data == 1 ? '男': '女';
					this.age = res.data.age;
					this.height = res.data.stature;
					this.weight = res.data.weight;
					this.city_id = res.data.city_id;
					this.area = res.data.city_name.replace('/', '-');
					this.intro = res.data.introduce;
					
					// this.status = res.data.status;
					
					this.avarImg = res.data.image;
					let cardImg = res.data.id_images.split(',');
					cardImg.forEach(item => {
						this.idCardList.push({
							path: item
						})
					})
				})
			}
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
