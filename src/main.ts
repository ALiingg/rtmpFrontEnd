import { createApp} from 'vue'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import index from '@/components/HomeComponents.vue'
import StreamComponents from '@/components/StreamComponents.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore, useStore } from 'vuex'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from 'axios'

import Cookies from 'js-cookie'
const app = createApp(App)
const store = createStore({
  state() {
    return {
      isLogin: false,
      baseUrl: 'http://localhost:8080',
      showLoginDialog: false,
      loginLoading: false
    }
  },
  mutations: {
    setStateValue(state, { key, value }) {
      state[key] = value;


    },

  },

})
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: index
    },
    {
      path: '/replays',
      name: 'Replays',
      component: StreamComponents
    }
  ]
});

app.use(router);

// main.ts
// 如果您正在使用CDN引入，请删除下面一行。

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store)
app.use(ElementPlus)
app.mount('#app')
