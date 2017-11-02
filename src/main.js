// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import moment from 'moment'
import App from './App'
import router from './router'
// import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'

// require('../node_modules/bootstrap/less/bootstrap.less')
// require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
//
// Vue.use(BootstrapVue)
Vue.config.productionTip = false

Vue.filter('date', (value, formatStr = 'MMM D, YYYY - h:mm A') => moment(value).format(formatStr))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})