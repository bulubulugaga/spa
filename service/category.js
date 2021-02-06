//分类
import request from './network.js'

export function getMechanic(data) {
	//技师
	return request({
		url: 'index/technician',
		data
	})
}

export function getCategory() {
	//分类
	return request({
		url: 'index/category'
	})
}

export function getCateServe(data) {
	//分类服务
	return request({
		url: 'index/product',
		data
	})
}

export function getServeDetail(data) {
	//服务详情
	return request({
		url: 'index/getproduct',
		data
	})
}

export function getMechDetail(data) {
	//技师详情
	return request({
		url: 'index/gettechnician',
		data
	})
}

export function changeCollection(data) {
	//修改收藏状态
	return request({
		url: 'member/collect',
		data
	})
}

export function order(data) {
	//下单
	return request({
		url: 'member/order',
		data
	})
}


export function searchServe(data) {
	//搜索服务
	return request({
		url: 'member/member_seek_echnician',
		method: 'POST',
		data
	})
}

export function searchMech(data) {
	//搜索技师
	return request({
		url: 'member/member_seek_product',
		method: 'POST',
		data
	})
}


