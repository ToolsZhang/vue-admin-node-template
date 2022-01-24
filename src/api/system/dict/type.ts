import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// 查询字典类型列表
export async function listType(param: any) {
  if(!param) param = {}
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/admin/dictTypes', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询字典类型详细
export async function getType(dictId: any) {
  return await http.fetchGet(`/api/admin/dictTypes/${dictId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增字典类型
export async function addType(params: any) {
  let cloneParams = JSON.parse(JSON.stringify(params));
  cloneParams['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/admin/dictTypes', cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改字典类型
export async function updateType(params: any) {
  if(!params) params = {}
  let cloneParams = JSON.parse(JSON.stringify(params));
  cloneParams['update_by'] = AuthJwt.info?._id;
  cloneParams['update_time'] = new Date();
  return await http.fetchPatch(`/api/admin/dictTypes/${cloneParams._id}`, cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除字典类型
export async function delType(dictId: any) {
  return await http.fetchDelete(`/api/admin/dictTypes/${dictId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 清理参数缓存
export async function clearCache() {
  return await http.fetchDelete(`/api/admin/dictTypes/clearCache`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 导出字典类型
export async function exportType(query: any) {
  return await http.fetchGet('/api/admin/dictTypes/export', null, query, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 获取字典选择框列表
export async function optionselect() {
  return await http.fetchGet('/api/admin/dictTypes/optionselect', null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}