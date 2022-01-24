import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询干部工作单位列表
export async function listUnit(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.unit_name) param_deepcopy.unit_name = {$regex: param.unit_name};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/workunits/selectUnitList', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询干部工作单位列表 (表结构)
export async function tableUnits(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.unit_name) param_deepcopy.unit_name = {$regex: param.unit_name};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/workunits', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
// 查询干部工作单位列表 (表结构) 去除模糊查询
export async function tableHandleUnit(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/workunits', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
// 查询干部工作单位列表（排除节点）
export async function listUnitExcludeChild(unitId: any) {
  return await http.fetchGet('/api/workunits/exclude/' + unitId, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询干部工作单位详细
export async function getUnit(unitId: any) {
  return await http.fetchGet(`/api/workunits/${unitId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询干部工作单位下拉树结构
export async function treeselect(params?: any) {
  let formatParams = {};
  if(params) formatParams = http.formatParams(params);
  return await http.fetchPost('/api/workunits/treeselect', formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增干部工作单位
export async function addUnit(params: any) {
  let  cloneParams = JSON.parse(JSON.stringify(params));
  if ( cloneParams.parent  == 0 ) 
  delete cloneParams.parent;
  cloneParams['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/workunits', cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改干部工作单位
export async function updateUnit(params: any) {
  let  cloneParams = JSON.parse(JSON.stringify(params));
  if ( cloneParams.parent  == 0 ) 
  delete cloneParams.parent;
  return await http.fetchPatch(`/api/workunits/${cloneParams._id}`, cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除干部工作单位
export async function delUnit(unitId: any) {
  return await http.fetchDelete(`/api/workunits/${unitId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}