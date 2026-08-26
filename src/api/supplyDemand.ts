import { http } from './request'

export function getSupplyDemandList(params: any) {
  return http.get('/api-loca/portal/supply-demand/list', params)
}

export function getMySupplyDemandList(params: any) {
  return http.get('/api-loca/portal/supply-demand/my-list', params)
}

export function getSupplyDemandDetail(id: number | string) {
  return http.get(`/api-loca/portal/supply-demand/${id}`)
}

export function publishSupplyDemand(data: any) {
  return http.post('/api-loca/portal/supply-demand/publish', data)
}

export function updateMySupplyDemand(id: number | string, data: any) {
  return http.put(`/api-loca/portal/supply-demand/my/${id}`, data)
}

export function deleteMySupplyDemand(id: number | string) {
  return http.delete(`/api-loca/portal/supply-demand/my/${id}`)
}

export function getDictData(types: string) {
  return http.get('/api-loca/sys/dict/data', { types })
}
