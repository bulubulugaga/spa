import{ 
	SETUSERTYPE,
	SETCITY,
	SETCHOOSECITY,
	SETGPS,
	SETISFIRST
} from '@/store/mutations-type.js'

export default  {
	//方法
	[SETUSERTYPE](state, value) {
		//设置用户类型
		state.userType = value;
	},
  
	[SETCITY](state, value) {
		//设置城市
		state.city = value;
	},
	
	[SETCHOOSECITY](state, value) {
		//设置选择城市
		state.chooseCity = value;
	},
	
	[SETGPS](state, value) {
		//设置城市gps
		state.gps = value;
	},
	
	[SETISFIRST](state, value) {
		//设置第一次进入小程序
		state.isFirst = value;
	}
  
}