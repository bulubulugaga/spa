//首页
import request from './network.js'

export function getOpenAd() {
	//获取开通城市
	return request({
		url: 'index/getcity'
	})
}

export function getSwiper(data) {
	//获取首页信息
	return request({
		url: 'index/index',
		data
	})
}

export function getNotice(data) {
	//获取公告
	return request({
		url: 'member/notice',
		data
	})
}

export function sendGPS(data) {
	//获取公告
	return request({
		url: 'member/technician_trapeze',
		method: 'POST',
		data
	})
}
