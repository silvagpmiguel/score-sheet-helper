import Vue from "vue"
import App from "./App.vue"
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.min.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueHtml2pdf from 'vue-html2pdf'
import VueRouter from 'vue-router'
import PDFConverter from './components/PDFConverter.vue'
import CSVGenerator from './components/CSVGenerator.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueHtml2pdf)
Vue.use(VueRouter)

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/generateCSV' },
    { path: '/convertToPDF', component: PDFConverter },
    { path: '/generateCSV', component: CSVGenerator}
  ]
})

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
