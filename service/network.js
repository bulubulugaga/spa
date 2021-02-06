//封装网络请求函数

import {
	baseURL,
	timeout
} from './config.js'

//需要登录的头部
// import store from '@/store/index.js'

function request(options) {
	uni.showLoading({
		title: '数据加载中……'
	})
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseURL + options.url,
			timeout: timeout,
			header: {
				'context-type': 'application/json',
				'token': uni.getStorageSync('token') || ''
			},
			data: options.data,
			method: options.method || 'GET',
			success: res => {
				resolve(res.data)
			},
			fail: reject,
			complete: res => {
				uni.hideLoading();
			}
		})
	})
}

export default request;
 