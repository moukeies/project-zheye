import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import router from './router'
import store from './store'
import { useGlobalStore } from './store/global'

import App from './App.vue'
import 'easymde/dist/easymde.min.css'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(store)
app.use(pinia)
const globalStore = useGlobalStore()
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
axios.interceptors.request.use(config => {
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: 'EDD2422220DE9586' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', 'EDD2422220DE9586')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: 'EDD2422220DE9586' }
  }
  return config
})

axios.interceptors.response.use(config => {
  setTimeout(() => {
    // store.commit('setLoading', false)
    globalStore.loading = false
  }, 1000)
  return config
}, e => {
  const { error } = e.response.data
  globalStore.error = { status: true, message: error }
  globalStore.loading = false
  // store.commit('setError', { status: true, message: error })
  // store.commit('setLoading', false)
  return Promise.reject(e.response.data)
})
app.mount('#app')
