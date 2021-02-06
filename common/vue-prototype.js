import Vue from 'vue'
import store from '@/store/index.js'
import { lnavigateTo } from './l-navigateTo.js'

//全局挂载方法
export const vuePrototype = () => {
	//页面跳转判断
	Vue.prototype.$lnavigateTo = lnavigateTo;
	
	//提示框弹窗 alert
	function alert(value){
	     store.commit("setAlert", value);
	}
	Vue.prototype.$alert = alert;
}