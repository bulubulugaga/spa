//微信支付
export function pay(data) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			timeStamp: data.timeStamp,
			nonceStr: data.nonceStr,
			package: data.package,
			signType: data.signType,
			paySign: data.paySign,
			success: function (res) {
					resolve(res);
			},
			fail: function (err) {
				uni.showToast({
					title: err,
					icon: 'none'
				})
			}
		});
	})
}