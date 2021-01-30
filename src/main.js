import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueHtml2pdf from 'vue-html2pdf'
import VueRouter from 'vue-router'
import PDFConverter from './components/PDF/PDFConverter.vue'
import Generator from './components/Score/Generator.vue'
import Creator from './components/Score/Creator.vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueHtml2pdf)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/create', component: Creator },
    { path: '/generate', component: Generator },
    { path: '/convert', component: PDFConverter },
    { path: '*', redirect: '/create' },
  ],
})

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
