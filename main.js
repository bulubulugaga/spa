import Vue from 'vue'
import App from './App'

import store from './store'

//全局挂载
import * as vuePrototype from './common/vue-prototype.js';
vuePrototype.vuePrototype();

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
