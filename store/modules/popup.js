//弹窗模块
let popup = {
	state: {
		prompt: {  //输入框弹窗信息
			isShow: false,
			btn: '确认',
			placeholder: '请输入'
		},
		alert: {  //提示框弹窗信息
			isShow: false,
			btn: '确认',
			msg: '完美心愿'
		}
	},
	mutations: {
		setPrompt(state, value) {
			state.prompt = {
				isShow: 'isShow' in value ? value.isShow : true,  //防止传值false时被覆盖
				btn: 'btn' in value ? value.btn : state.prompt.btn,
				placeholder: 'placeholder' in value ? value.placeholder : state.prompt.placeholder
			}
		},
		setAlert(state, value) {
			if(typeof(value) == 'string') {  //如果只传了字符串，当作提示信息处理
				state.alert = {
					isShow: true,
					btn: '确认',
					msg: value
				}
			}
			else {
				state.alert = {
					isShow: 'isShow' in value ? value.isShow : true,  //默认调用就弹出提示框
					btn: 'btn' in value ? value.btn : state.alert.btn,
					msg: 'msg' in value ? value.msg : state.alert.msg
				}
			}
		}
	}
}

export default popup