
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// 查询角色列表
export async function listRole(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.role_name) param_deepcopy.role_name = {$regex: param.role_name};
  if(!!param_deepcopy.role_key) param_deepcopy.role_key = {$regex: param.role_key};  
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/admin/role', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
// 根据权限查询角色列表
export async function listRoleByRole(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  let formatParams = http.formatParams(param_deepcopy);
  if(!AuthJwt.hasRoles('super')){
    formatParams.filters['role_key'] = {$ne: 'super'};
  }
  return await http.fetchGet('/api/admin/role', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}


// 查询角色详细
export async function getRole(roleId: any) { 
  return await http.fetchGet(`/api/admin/role/${roleId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增角色
export async function addRole(params: any) {
  params['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/admin/role/addRole', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改角色
export async function updateRole(params: any) {
  params['update_by'] = AuthJwt.info?._id;
  params['update_time'] = new Date();
  return await http.fetchPatch(`/api/admin/role/updateRole/${params._id}`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 角色数据权限
export async function dataScope(params: any) {
  return await http.fetchPut(`/api/admin/role/dataScope`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 角色状态修改
export async function changeRoleStatus(roleId: any, status: any) {
  const data = {
    roleId,
    status
  }
  return await http.fetchPut(`/api/admin/role/changeStatus`, data, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除角色
export async function delRole(roleId: any) {
  return await http.fetchDelete(`/api/admin/role/${roleId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 导出角色
export async function exportRole(params: any) {
  return await http.fetchGet('/api/admin/role/export', null, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}