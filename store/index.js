import Vue from 'vue'
import Vuex from 'vuex'

//引入非模块文件
import mutations from './mutations.js'

//引入模块
import login from './modules/login'  //登录模块
import popup from './modules/popup.js'  //弹窗提示模块

Vue.use(Vuex);

const state = {  
	//小程序基本信息
	name: 'O距离上门',
	logo: '/static/images/index/logo.png',
	userType: 'mech',  //用户类型(用户或技师)
	city: 'a',  //定位信息
	chooseCity: 'a',  //选择城市
	gps: {latitude: 30.566965060763888,longitude: 104.06325846354167},
	mapKey: 'YZ2BZ-UF5HX-OH647-TPPSQ-7FSPH-O4BS6',  //腾讯地图Key值
	isFirst: true  //是否第一次进入主页面
}
	
const store = new Vuex.Store({
  state,
  mutations,
  modules: {
    login,
	popup
  }
})

export default store
