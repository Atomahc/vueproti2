/**
 * 通用请求封装 (基于 fetch)
 */

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options
  let fetchUrl = url


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
  
  // 文章列表等公开接口不传 token，防止部分后端由于传递了无关 token 导致异常
  const noTokenUrls = ['/api-cas/api/get-articles']
  const shouldAttachToken = token && !noTokenUrls.some(skipUrl => url.includes(skipUrl))
  
  if (shouldAttachToken) {
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
      triggerSSOLogin()
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

export const triggerSSOLogin = async () => {
  try {
    const res: any = await http.get('/prod-api/member/auth/sso/url?client=portal')
    const ssoUrl = res.url || res.data?.url
    console.log('SSO 登录地址:', ssoUrl)
    if (!ssoUrl) {
      throw new Error('获取 SSO 登录地址失败')
    }
    const urlObj = new URL(ssoUrl)
    const state = urlObj.searchParams.get('state')
    if (!state) {
      throw new Error('SSO state 无效')
    }
    sessionStorage.setItem('sso_state', state)
    window.location.href = ssoUrl
  } catch (err: any) {
    alert(err.message || '网络请求错误')
  }
}

// 导出常用方法的快捷封装
export const http = {
  get: <T = any>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
    return request<T>(url, { method: 'GET', params, ...options })
  },
  post: <T = any>(url: string, body?: any, options?: RequestOptions) => {
    const isSpecialBody = body instanceof FormData || body instanceof URLSearchParams
    return request<T>(url, { method: 'POST', body: isSpecialBody ? body : JSON.stringify(body), ...options })
  },
  put: <T = any>(url: string, body?: any, options?: RequestOptions) => {
    const isSpecialBody = body instanceof FormData || body instanceof URLSearchParams
    return request<T>(url, { method: 'PUT', body: isSpecialBody ? body : JSON.stringify(body), ...options })
  },
  delete: <T = any>(url: string, params?: Record<string, any>, options?: RequestOptions) => {
    return request<T>(url, { method: 'DELETE', params, ...options })
  },
}

export default request
