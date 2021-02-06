//封装方法，用于页面跳转时检测是否登录，未登录则跳转至登录页
// import store from '@/store/index.js'

//解析参数
function param(data) {  
	console.log(data);
    let url = ''  
    for (var k in data) {  
      let value = data[k] !== undefined ? data[k] : ''  
      url += '&' + k + '=' + encodeURIComponent(value)  
    }  
    return url ? url.substring(1) : ''  
} 

//封装页面跳转判断方法
export function lnavigateTo(value) {
	//是否微信登录
	//技师端需要接受消息通知，所以也需要微信登录
	if(!uni.getStorageSync('token')) {
		//第一次登录
		console.log('无token值');
		uni.navigateTo({
			url: '/pages/user/login/login'
		})
		return;
	}
	
	//检测登录状态
	uni.checkSession({
　　　　success: function(res){
　　　　　　console.log("处于登录态, sessionId有效");
			return;
　　　　},
　　　　fail: function(res){
　　　　　　	console.log("需要重新登录, sessionId过期");
			// 重新登录
　　　　　　	uni.navigateTo({
				url: '/pages/user/login/login'
			})
　　　　}
　　})

	if(typeof(value) == 'string') {
		//只传一个参数，用跳转
		uni.navigateTo({
			url: value
		})
	}
	else {
		//解析参数，获取链接地址
		let url = value.url;
		url += (url.indexOf('?') < 0 ? '?' : '&') + param(value.param);
		if(value.type) {
			//传了跳转方式
			//此小程序用不到switchTab
			switch(value.type) {
				case 'reLaunch': 
					uni.reLaunch({
						url
					}); 
					break;
				case 'redirectTo':
					uni.redirectTo({
						url
					}); 
					break;
				default: 
					uni.navigateTo({
						url
					}); 
					break;
			}
		}
		else {
			//没传跳转方式，用navigateTo
			console.log(url);
			uni.navigateTo({
				url
			})
		}
	}
}



// 使用
	// this.$lnavigateTo({
	// 	type: 'reLaunch',
	// 	url: '/pages/tabbar/switch',
	// 	param: {
	// 		active: 1
	// 	}
	// })