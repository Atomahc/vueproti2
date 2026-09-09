import { http } from './request'

export function getSupplyDemandList(params: any) {
  return http.get('/prod-api/portal/supply-demand/list', params)
}

export function getMySupplyDemandList(params: any) {
  return http.get('/prod-api/portal/supply-demand/my-list', params)
}

export function getSupplyDemandDetail(id: number | string) {
  return http.get(`/prod-api/portal/supply-demand/${id}`)
}

export function publishSupplyDemand(data: any) {
  return http.post('/prod-api/portal/supply-demand/publish', data)
}

export function updateMySupplyDemand(id: number | string, data: any) {
  return http.put(`/prod-api/portal/supply-demand/my/${id}`, data)
}

export function deleteMySupplyDemand(id: number | string) {
  return http.delete(`/prod-api/portal/supply-demand/my/${id}`)
}

export function getDictData(types: string) {
  return http.get('/prod-api/sys/dict/data', { types })
}
