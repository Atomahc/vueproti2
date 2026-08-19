/**
 * 通用请求封装 (基于 fetch)
 */
const BASE_URL = 'http://192.168.2.13:8080'
interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options

  // 处理 URL 拼接
  let fetchUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`

  // 处理 Query 参数
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    const separator = fetchUrl.includes('?') ? '&' : '?'
    fetchUrl += `${separator}${searchParams.toString()}`
  }

  // 统一处理 Header，添加 Token
  const customHeaders = new Headers(headers)
  const token = localStorage.getItem('access_token')
  if (token) {
    customHeaders.set('Authorization', `Bearer ${token}`)
  }

  // 默认配置 Content-Type 为 JSON (如果非 FormData)
  if (!customHeaders.has('Content-Type') && !(restOptions.body instanceof FormData)) {
    customHeaders.set('Content-Type', 'application/json')
  }

  try {
    const response = await fetch(fetchUrl, {
      ...restOptions,
      headers: customHeaders,
    })

    // 全局拦截 401 鉴权失效
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
      throw new Error('鉴权失效，请重新登录')
    }

    if (!response.ok) {
      throw new Error(`请求失败! 状态码: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error('Request Error:', error)
    throw error
  }
}

// 导出常用方法的快捷封装
export const http = {
  get: <T = any>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
    return request<T>(url, { method: 'GET', params, ...options })
  },
  post: <T = any>(url: string, body?: any, options?: RequestOptions) => {
    return request<T>(url, { method: 'POST', body: JSON.stringify(body), ...options })
  },
  put: <T = any>(url: string, body?: any, options?: RequestOptions) => {
    return request<T>(url, { method: 'PUT', body: JSON.stringify(body), ...options })
  },
  delete: <T = any>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
    return request<T>(url, { method: 'DELETE', params, ...options })
  },
}

export default request
