import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询包联干部列表
export async function listCadre(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.name) param_deepcopy.name = {$regex: param.name};
  if(!!param_deepcopy.mobile) param_deepcopy.mobile = {$regex: param.mobile};  
  if(!!param_deepcopy.workUnit_list){
    param_deepcopy.workUnits = param_deepcopy.workUnit_list;
    delete param_deepcopy.workUnit_list;
  }
  param_deepcopy['sort'] = '-createdAt';
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/users', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询包联干部详细
export async function getCadre(userId: any) { 

  return await http.fetchGet(`/api/users/` + praseStrEmpty(userId), null, {options: { populate : [{path:'roles'}] } }, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增包联干部
export async function addCadre(params: any) {
  params['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/users', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改包联干部
export async function updateCadre(params: any) {
  params['update_by'] = AuthJwt.info?._id;
  params['update_time'] = new Date();
  return await http.fetchPatch(`/api/users/${params._id}`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除包联干部
export async function delCadre(userId: any) {
  return await http.fetchDelete(`/api/users/${userId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 导出包联干部
export async function exportCadre(params: any) {
  return await http.fetchGet('/api/users/export', null, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 包联干部密码重置
export async function resetUserPwd(userId: any, password: any) {
  const data = {
    userId,
    password
  }
  return await http.fetchPatch(`/api/users/resetPwd`, data, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 包联干部状态修改
export async function changeCadreStatus(userId: any, status: any) {
  return await http.fetchPatch(`/api/users/changeStatus/${userId}`, {status:status}, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询包联干部个人信息
export async function getCadreProfile() {
  return await http.fetchGet(`/api/users/profile`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改包联干部个人信息
export function updateCadreProfile(data: any) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 包联干部密码重置
export function updateCadrePwd(oldPassword: any, newPassword: any) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}
// 根据当前账户查找对应工作单位
export async function getUnitIdByCadre() {
  return await http.fetchGet('/api/users/getUnitId', null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}