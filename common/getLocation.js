//获取手机是否开启定位
function isPhone() {
	let is = true;
	uni.getSystemInfo({
		success: function (res) {
			if(res.locationEnabled) {
				//手机打开了定位服务
				console.log('手机设备已打开定位');
			}
			else {
				// uni.showToast({
				// 	title: '为确保准确性，请先打开手机定位服务',
				// 	icon: 'none',
				// 	duration: 2200
				// })
				// is = false;
				is = true;
			}
		},
		fail(err) {
			//获取失败，直接调用uniapp接口
			console.log('获取手机是否定位失败：' + err);
		}
	});
	return is;
}

// 获取gps坐标
export function getGPSLocation() {
	return new Promise((resolve, reject) => {
		let gps = {
			latitude: 30,
			longitude: 104
		};
		if(isPhone()) {
			uni.getLocation({
			    type: 'gcj02',
			    success: function (res) {
					resolve(res)
			    },
				fail(err) {
					console.log('uniapp getLocation接口调用失败' + err);
					uni.getSetting({
						success: function(res) {
							let statu = res.authSetting;
							if (!statu['scope.userLocation']) {
								uni.showModal({
									title: '是否授权当前位置',
									content: '小程序申请获取您的地理位置，请确认授权',
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
														//授权成功之后，再调用getLocation获取坐标
														uni.getLocation({
														    type: 'gcj02',
														    success: function (res) {
														        resolve(res);
														    }
														})
													} else {
														uni.showToast({
															title: '授权失败',
															icon: 'success',
															duration: 1000
														})
														resolve(gps);
													}
												}
											})
										}
										else {
											//取消授权,使用默认成都市地址
											uni.showToast({
												title: '授权失败',
												icon: 'success',
												duration: 1000
											})
											resolve(gps);
										}
									},
									fail() {
										//接口调用失败,使用默认成都市地址
										uni.showToast({
											title: '授权失败',
											icon: 'success',
											duration: 1000
										})
										resolve(gps);
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
							resolve(gps);
						}
					})	
				}
			});
		}
	})
}

//gps坐标获取城市信息
//腾讯地图
import map from '@/common/qqmap-wx-jssdk.min.js';
import store from '@/store/index.js'
export function getCity(gps) {
	let qqmapsdk = new map({
		key: store.state.mapKey //腾讯地图生成的key
	});
	return new Promise((resolve, reject) => {
		qqmapsdk.reverseGeocoder({ //腾讯题图逆解析地址
			location: {
				latitude: gps.latitude,
				longitude: gps.longitude
			},
			success(res) {
				resolve(res);
			},
			fail(err) {
				console.log(err);
			}
		})
	})
}


//匹配城市信息
import { getOpenAd } from '@/service/home.js'
export function getCityInfo(data) {
	return new Promise((resolve, reject) => {
		getOpenAd().then(ad => {
			uni.getSetting({
				success: function(res) {
					let statu = res.authSetting;
					if (!statu['scope.userLocation']) {
						//没有获取地址
						console.log('用户未获取开启地区服务');
						resolve(ad.data[0]);
					}
					else {
						let isHas = false;
						for(let i = 0; i < ad.data.length; i++) {
							if(data == ad.data[i].name) {
								isHas = true;
								resolve(ad.data[i]);
								break;
							}
						}
						if(!isHas) {
							if(store.state.userType == 'user') {
								//用户端返回默认第一个值
								resolve(ad.data[0]);
							}
							else {
								resolve('还未开通');
							}
						}
					}
				},
			})
		})
	})
}


export function space(lat1, lng1, lat2, lng2) {
	//计算gps距离
	  var radLat1 = lat1 * Math.PI / 180.0;
	  var radLat2 = lat2 * Math.PI / 180.0;
	  var a = radLat1 - radLat2;
	  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	  s = s * 6378.137;
	  s = Math.round(s * 10000) / 10000;
	  return s  // 单位千米
}