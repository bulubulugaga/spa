//订单
import request from './network.js'

export function getBill(data) {
	//查看订单
	return request({
		url: 'member/getorder',
		data
	})
}

export function getBillT(data) {
	//技师查看订单
	return request({
		url: 'member/technician_order',
		method: 'POST',
		data
	})
}

export function getBillDetail(data) {
	//查看订单详情
	return request({
		url: 'member/getOrder_details',
		data
	})
}

export function getBillDetailT(data) {
	//查看订单详情
	return request({
		url: 'member/technician_order_details',
		method: 'POST',
		data
	})
}

export function cancelBill(data) {
	//取消订单
	return request({
		url: 'member/cancelOrder',
		data,
		method: 'POST'
	})
}

export function commentBill(data) {
	//评价
	return request({
		url: 'member/createcomment',
		data
	})
}

export function payBill(data) {
	//支付
	return request({
		url: 'member/pay',
		data
	})
}


export function begin(data) {
	//开始服务
	return request({
		url: 'member/technician_status',
		method: 'POST',
		data
	})
}

export function end(data) {
	//结束服务
	return request({
		url: 'member/technician_status_over',
		method: 'POST',
		data
	})
}

export function sTime(data) {
	//倒计时
	return request({
		url: 'member/order_begintime',
		method: 'POST',
		data
	})
}