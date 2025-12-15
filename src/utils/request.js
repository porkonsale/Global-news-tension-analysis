/**
 * Axios Request Encapsulation
 * Unified handling of request interception, response interception, and error handling
 */

import axios from 'axios'
import { Message } from 'element-ui'

// Create axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:8000/api', // API Base Path
  timeout: 30000, // Request timeout (30 seconds)
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// Request Interceptor
service.interceptors.request.use(
  config => {
    // Token can be added here
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // FastAPI Backend Return Format: { success: true/false, data: {}, error: '' }
    if (res.success === false) {
      Message({
        message: res.error || res.detail || 'Request Failed',
        type: 'error',
        duration: 3000
      })
      return Promise.reject(new Error(res.error || res.detail || 'Request Failed'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误:', error)
    
    let message = '网络错误'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        default:
          message = `连接错误 ${error.response.status}`
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时'
    } else if (error.message.includes('Network Error')) {
      message = '网络连接失败'
    }
    
    Message({
      message: message,
      type: 'error',
      duration: 3000
    })
    
    return Promise.reject(error)
  }
)

export default service
