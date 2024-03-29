// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import moment from 'moment'
import App from './App'
import router from './router'
import vueSlider from 'vue-slider-component'
import VueCookies from 'vue-cookies'
import Restrict from './directives/restrict'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts'
import loadDrillDown from 'highcharts/modules/drilldown'
import * as VueGoogleMaps from 'vue2-google-maps'
import Multiselect from 'vue-multiselect'

loadDrillDown(Highcharts)
require('./assets/css/login.css')
Vue.config.productionTip = false
Vue.component('vueSlider', vueSlider)
Vue.component('multiselect', Multiselect)
Vue.use(VueHighcharts)
Vue.use(VueCookies)
Vue.use(VueHighcharts, { Highcharts })
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAVq0yIOlQ6PB1K39C0xzgZG76qmKFqoOo',
    libraries: 'places', // necessary for places input
    types: ['(cities)'],
    componentRestrictions: {country: 'bd'}
  }
})
Vue.directive('restrict', Restrict)

Vue.filter('date', (value, formatStr = 'MMM D, YYYY - h:mm A') => moment(value).format(formatStr))
Vue.filter('underscoreless', val => val.replace(/[_-]/g, ' '))
Vue.filter('static_mapper', (id, list) => {
  if (list === null) return 'N/A'
  const obj = list.find(x => x.id === id)
  return obj ? obj.name : 'N/A'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
