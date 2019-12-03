import Vue from 'vue'
import Axios from 'axios'

Axios.defaults.headers.common.Accept = 'application/json'
Axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  return Promise.reject(error)
})

// Bind Axios to Vue.
Vue.$http = Axios
Object.defineProperty(Vue.prototype, '$http', {
  get () {
    return Axios
  }
})
