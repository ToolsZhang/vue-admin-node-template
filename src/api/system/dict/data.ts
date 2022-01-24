import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// 查询字典数据列表
export async function listData(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  let formatParams = http.formatParams(param_deepcopy);
  console.log(formatParams);
  if(formatParams.filters['dict_name']) delete formatParams.filters['dict_name'];
  return await http.fetchGet('/api/admin/dicts', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}


// 查询字典数据详细
export async function getData(dictCode: any) {
  let params = {  dict_code : dictCode };
  let formatParams = http.formatParams(params);
  return await http.fetchGet('/api/admin/dicts', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 根据字典类型查询字典数据信息
export async function getDicts(dictType: any, param: any) {
  let params = { dict_type : dictType };
  if (param) {
    params = JSON.parse(JSON.stringify(param));
    params['dict_type'] = dictType;
  }
  return await http.fetchPost('/api/admin/dicts/getByType', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增字典数据
export async function addData(params: any) {
  let cloneParams = JSON.parse(JSON.stringify(params));
  cloneParams['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/admin/dicts', cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改字典数据
export async function updateData(params: any) {
  let cloneParams = JSON.parse(JSON.stringify(params));
  cloneParams['update_by'] = AuthJwt.info?._id;
  cloneParams['update_time'] = new Date();
  return await http.fetchPatch(`/api/admin/dicts/${cloneParams._id}`, cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除字典数据
export async function delData(dictId: any) {
  return await http.fetchDelete(`/api/admin/dicts/${dictId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 导出字典数据
export async function exportData(query: any) {
  return await http.fetchGet('/api/admin/dicts/export', null, query, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}