//我的
import request from './network.js'

export function getCollection(data) {
	//获取收藏
	return request({
		url: 'member/myCollect',
		data
	})
}

export function getAddress() {
	//获取地址
	return request({
		url: 'member/getaddress'
	})
}

export function addAddress(data) {
	//添加地址
	return request({
		url: 'member/addaddress',
		data
	})
}

export function editAddress(data) {
	//修改地址
	return request({
		url: 'member/editaddress',
		data
	})
}

export function deleteAddress(data) {
	//删除地址
	return request({
		url: 'member/deleteaddress',
		data
	})
}

export function getIssue() {
	//获取常见问题
	return request({
		url: 'index/getTrouble'
	})
}

export function getStatement() {
	//获取平台声明
	return request({
		url: 'index/getState'
	})
}

export function getAboutUs() {
	//获取关于我们
	return request({
		url: 'index/getAboutUs'
	})
}

export function getMsg() {
	//获取消息
	return request({
		url: 'member/getmessage'
	})
}

export function deleteMsg(data) {
	//删除消息
	return request({
		url: 'member/delmessage',
		data
	})
}

export function getLaw() {
	//获取法律声明
	return request({
		url: 'index/getlaw'
	})
}

export function login(data) {
	//用户登录
	return request({
		url: 'Member/wxAuthSecond',
		data
	})
}

export function technician_register(data) {
	//技师登录
	return request({
		url: 'member/technician_register',
		data
	})
}

export function settled(data) {
	//商家入驻
	return request({
		url: 'member/enter',
		data
	})
}

export function getUserInfo() {
	//获取用户信息
	return request({
		url: 'member/member',
		method: 'POST'
	})
}

export function getWallet() {
	//获取钱包信息
	return request({
		url: 'member/member_moneys',
		method: 'POST'
	})
}

export function getWalletDetail(data) {
	//获取钱包明细
	return request({
		url: 'member/member_money',
		method: 'POST',
		data
	})
}

export function loadIdeaU(data) {
	//用户反馈
	return request({
		url: 'member/member_feedback',
		method: 'POST',
		data
	})
}

export function loadIdeaUList(data) {
	//用户反馈记录
	return request({
		url: 'member/member_feedback_record',
		method: 'POST',
		data
	})
}

export function loadIdeaT(data) {
	//技师反馈
	return request({
		url: 'member/technician_feedback',
		method: 'POST',
		data
	})
}

export function loadIdeaTList(data) {
	//技师反馈记录
	return request({
		url: 'member/technician_feedback_record',
		method: 'POST',
		data
	})
}

export function recharge(data) {
	//充值
	return request({
		url: 'member/member_pay',
		method: 'POST',
		data
	})
}

export function member_share(data) {
	//用户分享
	return request({
		url: 'member/member_share',
		method: 'POST',
		data
	})
}

export function technician_share(data) {
	//技师分享
	return request({
		url: 'member/technician_share',
		method: 'POST',
		data
	})
}


export function register(data) {
	//技师注册
	return request({
		url: 'member/technician_enroll',
		method: 'POST',
		data
	})
}

export function sendCode(data) {
	//验证码
	return request({
		url: 'member/technician_enroll_send',
		method: 'POST',
		data
	})
}

export function tLogin(data) {
	//技师登录
	return request({
		url: 'member/technician_enter',
		method: 'POST',
		data
	})
}

export function tUpPass(data) {
	//技师修改密码
	return request({
		url: 'member/technician_password',
		method: 'POST',
		data
	})
}

export function getTInfo(data) {
	//技师获取个人信息
	return request({
		url: 'member/oneself',
		method: 'POST',
		data
	})
}


export function getInvitRule(data) {
	//获取邀请规则
	return request({
		url: 'member/invite',
		method: 'POST',
		data
	})
}

export function getInvitPerson(data) {
	//用户获取邀请人数
	return request({
		url: 'member/member_in_money',
		method: 'POST',
		data
	})
}

export function getInvitPersonT(data) {
	//技师获取邀请人数
	return request({
		url: 'member/technician_in_money',
		method: 'POST',
		data
	})
}

export function updateInfo(data) {
	//技师修改信息
	return request({
		url: 'member/technician_alter',
		method: 'POST',
		data
	})
}


export function getMsgT(data) {
	//获取技师信息
	return request({
		url: 'member/technician_message',
		method: 'POST',
		data
	})
}

export function delMsgT(data) {
	//删除技师信息
	return request({
		url: 'member/technician_message_del ',
		method: 'POST',
		data
	})
}

export function getWalletDeT(data) {
	//获取技师钱包明细
	return request({
		url: 'member/technician_money',
		method: 'POST',
		data
	})
}